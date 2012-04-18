/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license,version 2.0
	@version: 0.2.2
*/

(function() {
	var juicer={
		version:'0.2.2'
	};

	this.__cache={};

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
		}
	};

	juicer.settings = {
		forstart:/{@each\s*([\w\.]*?)\s*as\s*(\w*?)(,\w*?)?}/igm,
		forend:/{@\/each}/igm,
		ifstart:/{@if\s*([^}]*?)}/igm,
		ifend:/{@\/if}/igm,
		elsestart:/{@else}/igm,
		interpolate:/\${([\s\S]+?)}/igm,
		noneencode:/\$\${([\s\S]+?)}/igm
	};

	juicer.template=function() {
		var __this=this;
	
		this.__interpolate=function(varname,escape) {
			var __define=varname.split('|'),fn='';
			if(__define.length>1) {
				varname=__define.shift();
				func=__define.shift();
			}
			return '<%= '+
						(escape?'__escapehtml.__escape':'')+
							'('+
								fn+
									'('+
										varname+
									')'+
							')'+
					' %>';
		};
	
		this.__shell=function(tpl) {
			var iterate_count=0;
			tpl=tpl
				//for expression
				.replace(juicer.settings.forstart,function($,varname,alias,key) {
					var alias=alias||'value',key=key && key.substr(1);
					var iterate_var='i'+iterate_count++;
					return '<% for(var '+iterate_var+'=0,l='+varname+'.length;'+iterate_var+'<l;'+iterate_var+'++) {'+
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
					return __this.__interpolate(varname,false);
				})
				//interpolate with escape
				.replace(juicer.settings.interpolate,function($,varname) {
					return __this.__interpolate(varname,true);
				});

			return tpl;
		};

		this.__pure=function(tpl,options) {
			if(options && options.loose===true) {
				buf=this.__looseconvert(tpl);
			} else {
				buf=this.__convert(tpl);
			}

			return buf;
		};

		this.__convert=function(tpl) {
			var buf=[].join('');
			buf+="var data=data||{};";
			buf+="var out='';out+='";
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
			return buf;
		};

		this.__looseconvert=function(tpl) {
			var buf=[].join('');
			buf+="var data=data||{};";
			buf+="var p=[];";
			buf+="with(data) {"+
					"p.push('" +
						tpl
							.replace(/\\/g,"\\\\")
							.replace(/[\r\t\n]/g," ")
							.split("<%").join("\t")
							.replace(/((^|%>)[^\t]*)'/g,"$1\r")
							.replace(/\t=(.*?)%>/g,"',$1,'")
							.split("\t").join("');")
							.split("%>").join("p.push('")
							.split("\r").join("\\'")+
					"');"+
				"};"+
				"return p.join('');";
			return buf;
		};

		this.parse=function(tpl,options) {
			tpl=this.__shell(tpl);
			tpl=this.__pure(tpl,options);

			this.render=new Function('data',tpl);
			return this;
		};
	};

	juicer.compile=function(tpl,options) {
		var engine=__cache[tpl]?__cache[tpl]:new this.template().parse(tpl,options);
		if(!options || options.cache!==false) __cache[tpl]=engine;
		return engine;
	};

	juicer.to_html=function(tpl,data,options) {
		return this.compile(tpl,options).render(data);
	};

	typeof(module)!=='undefined' && module.exports?module.exports=juicer:this.juicer=juicer;
})();