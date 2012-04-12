/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license,version 2.0
	
	@usage: http://paulguo.github.com/Juicer
	@version: 0.1.1
	@build: 110626120407
*/

(function() {
	var __cache={};
	var __re={
		'_for':/{@for\s+([^}]*)}([\s\S]*){@\/for}/igm,
		'_if':/{@if\s+([^}]*)}([\s\S]*){@\/if}/igm,
		'_unit':/\[#(.*?)(\s+condition=["|'](.*?)["|'])?\]/igm,
		'_forstart':/{@for[^}]*?}/igm,
		'_forend':/{@\/for}/igm,
		'_ifstart':/{@if[^}]*?}/igm,
		'_ifend':/{@\/if}/igm
	};

	var __recursive=function(str,o,c) {
		var p=[],s=str,o=str.match(o)||[],c=str.match(c)||[];
		
		var _build=function(str,o,i) {
			var s=str.substr(0,str.indexOf(o[i]));
			var e=str.substr(str.indexOf(o[i])+o[i].length);
			return s+_noop(o[i].length)+e;
		};
		
		var _noop=function(l) {
			var s=[];
			for(var i=0;i<l;i++) s.push('-');
			return s.join('');
		};
		
		var _judge=function(arr) {
			for(var i=0,c=0,p=0,t=[];i<arr.length;i++) {
				if(!c) p=i;
				if(arr[i]=='o') c++;
				if(arr[i]=='c') c--;
				if(!c && arr[i]) t.push(s.substr(p,i+1-p));
			}
			return t;
		};
		
		for(var i=0;i<o.length;i++) {
			p[str.indexOf(o[i])]='o';
			str=_build(str,o,i);
		}
		
		for(var i=0;i<c.length;i++) {
			p[str.indexOf(c[i])+c[i].length-1]='c';
			str=_build(str,c,i);
		}
		
		return _judge(p);
	};

	var __replace=function(str,a,b) {
		var s=str.substr(0,str.indexOf(a));
		var e=str.substr(str.indexOf(a)+a.length);
		return s+b+e;
	};
	
	var __replaceAll=function(str,start,end,cb) {
		for(var i=0,__f=__recursive(str,start,end);i<__f.length;i++) {
			str=__replace(str,__f[i],cb(__f[i]));
		}
		return str;
	};

	var __reference=function(str,re) {
		var ret;
		str.replace(re,function() {
			ret=arguments;
			return ret[0];
		});
		return ret;
	};
	
	var __evalString=new Function('exp',
		'return exp;'
	);
	
	var __compile=function(tpl,option) {
		
	};
	
	var __render=function(data) {
		
	};

	var __juicer=function(tpl,data,option) {
		var fn=arguments.callee;
		var html=tpl;
		var opt={cache:false};

		var _for=function(str) {
			var ref=__reference(str,__re._for),chain=ref[1],inner=ref[2];
			if(!data[chain]) return '';
			for(var i=0,t=[];i<data[chain].length;i++) {
				t.push(fn(inner,data[chain][i],opt));
			}
			return t.join('');
		};
		
		var _if=function(str) {
			var ref=__reference(str,__re._if),condition=ref[1],inner=ref[2];
			if(__evalString(fn(condition,data,opt))) {
				return fn(inner,data,opt);
			}
			return '';
		};
		
		var _unit=function($a,$1,$2,$3) {
			if(!$3 || __evalString(fn($3,data,opt))) {
				return data && data[$1]?typeof(data[$1])=='object'?true:data[$1]:'';
			}
			return '';
		};
		
		if(__cache[tpl]) return __cache[tpl];
		
		html=__replaceAll(html,__re._forstart,__re._forend,_for);
		html=__replaceAll(html,__re._ifstart,__re._ifend,_if);
		html=html.replace(__re._unit,_unit);

		if(!option || option.cache!==false) {
			__cache[tpl]=html;
		}
		
		return html;
	};
	
	__juicer.compile=__compile;
	this.juicer=__juicer;
})();
