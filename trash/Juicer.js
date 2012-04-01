/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license,version 2.0
	
	@usage: http://paulguo.github.com/Juicer
	@version: 0.1.0
	@build: 110627120329
*/

~function() {
	var __segments__={};
		__segments__['for']=/\{@for\s+(.*?)\}([\s\S]*?)\{@\/for\}/img;
		__segments__['if']=/\{@if\s+(.*?)\}([\s\S]*?)\{@\/if\}/img;
		__segments__['unit']=/\[#([^\s]*?)(\s*condition=["|'](.*?)["|'])?\]/img;
		__segments__['rfor']=/\{@for\s+(.*?)\}([\s\S]*)\{@\/for\}/img;
		__segments__['rif']=/\{@if\s+(.*?)\}([\s\S]*)\{@\/if\}/img;

	var __recursive=function(str,regx) {
		return str.match(regx) && str.match(regx).join('')==str?false:true;
	};

	var __juicer=function(str,data) {
		var fn=arguments.callee;
		
		var __for=function($a,$1,$2) {
			var t=[];
			if(!data[$1]) return $a;
			for(var i=0;i<data[$1].length;i++) t.push(fn($2,data[$1][i]));
			return t.join('');
		};

		var __if=function($a,$1,$2) {
			return eval(fn($1,data))?fn($2,data):'';
		};

		var __unit=function($a,$1,$2,$3) {
			if(!$2 || eval(fn($3,data))) return data[$1]!=undefined?typeof(data[$1])=='object'?true:data[$1]:'';
			return '';
		};
		str=str.replace(__segments__['for'],__for);
		str=str.replace(__segments__['if'],__if);
		str=str.replace(__segments__['unit'],__unit);
		return str;
	};
	
	//juicer - bind the method
	__juicer.recursive=__recursive;
	this.Juicer=__juicer;
	this.fn=function(str,s,e) {
		var p=[],s=str.match(s),e=str.match(e);
		var build=function(str,s,i) {
			var start=str.substr(0,str.search(s[i]));
			var end=str.substring(str.search(s[i])+s[i].length);
			return start+end;
		};
		for(var i=0;i<s.length;i++) {
			p[str.search(s[i])]='o|'+s[i].length;
			str=build(str,s,i);
		}
		for(var i=0;i<e.length;i++) {
			p[str.search(e[i])]='c|'+e[i].length;
			str=build(str,e,i);
		}
		for(var i=0;i<p.length;i++) {
			var c=0;
			if(p[i] && p[i].match('o')) c++;
			if(p[i] && p[i].match('c')) c--;
		}
		return p;
	};
	
	this.test=function() {
		//var t=['o','c','o','c','o','o','c','o','c','c','o','c'];
		var t=['o','o','c','o','c','c'];
		var c=0,p=[];
		for(var i=0;i<t.length;i++) {
			if(t[i]=='o') c++;
			if(t[i]=='c') c--;
			if(c==0) p.push('oc');
		}
		console.log(p.join('').match('co'));
	};
	this.test();
}();


/*
	fn(str,'{@for.*?}(?<open|{@for.*?}>)(?<-open|{@/for}>){@/for}');
	fn(str,/{@for.*?}/igm,/{@\/for}/igm);
*/
