/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license,version 2.0
	@version: 0.2.1
*/

(function() {
	var juicer={
		version:'0.1.1'
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
		forstart:/{@for\s*([\w\.]*?)\s*as\s*(\w*?)}/igm,
		forend:/{@\/for}/igm,
		ifstart:/{@if\s*([^}]*?)}/igm,
		ifend:/{@\/if}/igm,
		interpolate:/\${([\s\S]+?)}/igm,
		noneencode:/\$\${([\s\S]+?)}/igm
	};
	
	juicer.template=function() {
		this.parse=function(tpl) {
			var buf=[].join('');
			
			tpl=tpl.replace(juicer.settings.forstart,function($,varname,alias) {
					return '<% for(var i=0,l='+varname+'.length;i<l;i++) {var '+alias+'='+varname+'[i]; %>';
				})
				.replace(juicer.settings.forend,'<% } %>')
				.replace(juicer.settings.ifstart,function($,condition) {
					return '<% if('+condition+') { %>';
				})
				.replace(juicer.settings.ifend,'<% } %>')
				.replace(juicer.settings.noneencode,function($,varname) {
					return '<%= '+(varname!=='.'?varname:'i')+' %>';
				})
				.replace(juicer.settings.interpolate,function($,varname) {
					return '<%= __escapehtml.__escape('+(varname!=='.'?varname:'i')+') %>';
				});
			
			buf+="var p=[];";
			buf+="with(data) {"+
					"p.push('" +
						tpl
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
				
			this.render=new Function('data',buf);
			return this;
		};
	};
	
	juicer.compile=function(tpl,options) {
		var engine=__cache[tpl]?__cache[tpl]:new this.template().parse(tpl);
		if(!options || options.cache!==false) __cache[tpl]=engine;
		return engine;
	};
	
	juicer.to_html=function(tpl,data,options) {
		return this.compile(tpl,options).render(data);
	};
	
	typeof(module)!=='undefined' && module.exports?module.exports=juicer:this.juicer=juicer;
})();
