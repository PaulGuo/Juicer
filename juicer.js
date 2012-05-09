/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license,version 2.0
	@version: 0.3.0-dev
*/

(function() {
	var juicer=function() {
		var args=[].slice.call(arguments);
		args.push(juicer.options);
		if(arguments.length==1) return juicer.compile.apply(juicer,args);
		if(arguments.length>=2) return juicer.to_html.apply(juicer,args);
	};

	this.__escapehtml={
		__escapehash:{
			'<':'&lt;',
			'>':'&gt;',
			'"':'&quot;',
			'&':'&amp;'
		},
		__escapereplace:function(k) {
			return __escapehtml.__escapehash[k];
		},
		__escape:function(str) {
			return typeof(str)!=='string'?str:str.replace(/[&<>"]/igm,__escapehtml.__escapereplace);
		},
		__detection:function(data) {
			return typeof(data)==='undefined'?'':data;
		}
	};

	juicer.__cache={};
	juicer.version='0.3.0-dev';

	juicer.settings = {
		forstart:/{@each\s*([\w\.]*?)\s*as\s*(\w*?)(,\w*?)?}/igm,
		forend:/{@\/each}/igm,
		ifstart:/{@if\s*([^}]*?)}/igm,
		ifend:/{@\/if}/igm,
		elsestart:/{@else}/igm,
		interpolate:/\${([\s\S]+?)}/igm,
		noneencode:/\$\${([\s\S]+?)}/igm,
		inlinecomment:/{#[^}]*?}/igm,
		rangestart:/{@each\s*(\w*?)\s*in\s*range\((\d+?),(\d+?)\)}/igm
	};

	juicer.options={
		cache:true,
		strip:true,
		errorhandling:true
	};

	juicer.set=function(conf,value) {
		this.options[conf]=value;
	};

	juicer.template=function() {
		var __this=this;

		this.__interpolate=function(varname,escape,options) {
			var __define=varname.split('|'),fn='';
			if(__define.length>1) {
				varname=__define.shift();
				fn=__define.shift();
			}
			return '<%= '+
						(escape?'__escapehtml.__escape':'')+
							'('+
								(!options || options.detection!==false?'__escapehtml.__detection':'')+
									'('+
										fn+
											'('+
												varname+
											')'+
									')'+
							')'+
					' %>';
		};

		this.__shell=function(tpl,options) {
			var iterate_count=0;
			tpl=tpl
				//for expression
				.replace(juicer.settings.forstart,function($,varname,alias,key) {
					var alias=alias||'value',key=key && key.substr(1);
					var iterate_var='i'+iterate_count++;
					return '<% for(var '+iterate_var+'=0,l'+iterate_var+'='+varname+'.length;'+iterate_var+'<l'+iterate_var+';'+iterate_var+'++) {'+
								'var '+alias+'='+varname+'['+iterate_var+'];'+
								(key?('var '+key+'='+iterate_var+';'):'')+
							' %>';
				})
				.replace(juicer.settings.forend,'<% } %>')
				//if expression
				.replace(juicer.settings.ifstart,function($,condition) {
					return '<% if('+condition+') { %>';
				})
				.replace(juicer.settings.ifend,'<% } %>')
				//else expression
				.replace(juicer.settings.elsestart,function($) {
					return '<% } else { %>';
				})
				//interpolate without escape
				.replace(juicer.settings.noneencode,function($,varname) {
					return __this.__interpolate(varname,false,options);
				})
				//interpolate with escape
				.replace(juicer.settings.interpolate,function($,varname) {
					return __this.__interpolate(varname,true,options);
				})
				//clean up comments
				.replace(juicer.settings.inlinecomment,'')
				//range expression
				.replace(juicer.settings.rangestart,function($,varname,start,end) {
					var iterate_var='j'+iterate_count++;
					return '<% for(var '+iterate_var+'=0;'+iterate_var+'<'+(end-start)+';'+iterate_var+'++) {'+
								'var '+varname+'='+iterate_var+';'+
							' %>';
				});

			//exception handling
			if(!options || options.errorhandling!==false) {
				tpl='<% try { %>'+tpl+'<% } catch(e) {console && console.warn("Juicer Render Exception: "+e.message);} %>';
			}

			return tpl;
		};

		this.__pure=function(tpl,options) {
			return this.__convert(tpl,!options || options.strip);;
		};

		this.__lexical=function(tpl) {
			var buf=[];
			var pre='';
			var indexOf=function(arr,value) {
				for(var i=0;i<arr.length;i++) {
					if(arr[i]==value) return i;
				}
				return -1;
			};
			var memo=function($,variable) {
				variable=variable.match(/\w+/igm)[0];
				(buf.indexOf?buf.indexOf(variable):indexOf(buf,variable))===-1 && buf.push(variable);//fuck ie
			};

			tpl.replace(juicer.settings.forstart,memo).
				replace(juicer.settings.interpolate,memo).
				replace(juicer.settings.ifstart,memo);

			for(var i=0;i<buf.length;i++) {
				pre+='var '+buf[i]+'=data.'+buf[i]+';';
			}
			return '<% '+pre+' %>';
		};

		this.__convert=function(tpl,strip) {
			var buf=[].join('');
			buf+="var data=data||{};";
			buf+="var out='';out+='";
			if(strip!==false) {
				buf+=tpl
						.replace(/\\/g,"\\\\")
						.replace(/[\r\t\n]/g," ")
						.replace(/'(?=[^%]*%>)/g,"\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/<%=(.+?)%>/g,"';out+=$1;out+='")
						.split("<%").join("';")
						.split("%>").join("out+='")+
						"';return out;";
			} else {
				buf+=tpl
						.replace(/\\/g,"\\\\")
						.replace(/[\r]/g,"\\r")
						.replace(/[\t]/g,"\\t")
						.replace(/[\n]/g,"\\n")
						.replace(/'(?=[^%]*%>)/g,"\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/<%=(.+?)%>/g,"';out+=$1;out+='")
						.split("<%").join("';")
						.split("%>").join("out+='")+
						"';return out.replace(/[\\r\\n]\\t+[\\r\\n]/g,'\\r\\n');";
			}
			return buf;
		};

		this.parse=function(tpl,options) {
			if(!options || options.loose!==false) tpl=this.__lexical(tpl)+tpl;
			tpl=this.__shell(tpl,options);
			tpl=this.__pure(tpl,options);
			tpl='"use strict";'+tpl; //use strict mode

			this.render=new Function('data',tpl);
			return this;
		};
	};

	juicer.compile=function(tpl,options) {
		try {
			var engine=this.__cache[tpl]?this.__cache[tpl]:new this.template().parse(tpl,options);
			if(!options || options.cache!==false) this.__cache[tpl]=engine;
			return engine;
		} catch(e) {
			console && console.warn('Juicer Compile Exception: '+e.message);
			return {render:function() {}};
		}
	};

	juicer.to_html=function(tpl,data,options) {
		return this.compile(tpl,options).render(data);
	};

	typeof(module)!=='undefined' && module.exports?module.exports=juicer:this.juicer=juicer;
})();
