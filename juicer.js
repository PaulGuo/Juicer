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
	var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());
	var __hash=function(str) {
		var hash=0;
		if(str.length==0) return hash;
		for(var i=0;i<str.length;i++) {
			var _char=str.charCodeAt(i);
			hash=((hash<<5)-hash)+_char;
			hash=hash&hash;
		}
		return hash;
	};

	var __cache={};
	var __re={
		'_for':/{@for\s+([^}]*)}([\s\S]*){@\/for}/igm,
		'_if':/{@if\s+([^}]*)}([\s\S]*){@\/if}/igm,
		'_unit':/\[#(.*?)(\s+condition=["|'](.*?)["|'])?\]/igm,
		'_forstart':/{@for[^}]*?}/igm,
		'_forend':/{@\/for}/igm,
		'_ifstart':/{@if[^}]*?}/igm,
		'_ifend':/{@\/if}/igm,
		'_function':/^function[^{]*?{([\s\S]*)}$/igm
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

	var __escape=function(html) {
		return String(html)
			.replace(/&(?!\w+;)/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/"/g,'&quot;');
	};

	var __juicer=function(tpl,data,option) {
		var fn=arguments.callee;
		var html=tpl;
		var opt={cache:false};

		if(!option || option.cache!==false) {
			var ukey=tpl+__hash(JSON.stringify(data));
			if(__cache[ukey]) return __cache[ukey];
		}

		var _for=function(str) {
			var ref=__reference(str,__re._for),chain=ref[1],inner=ref[2];
			if(!data[chain]) return '';
			for(var i=0,t=[];i<data[chain].length;i++) {
				var dat=data[chain][i];dat['.']=i;
				t.push(fn(inner,dat,opt));
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
				if($1.match('#') && ($1=$1.substr(1))) return data && data[$1]!==undefined?typeof(data[$1])=='object'?true:__escape(data[$1]):'';
				return data && data[$1]!==undefined?typeof(data[$1])=='object'?true:data[$1]:'';
			}
			return '';
		};
		
		html=__replaceAll(html,__re._forstart,__re._forend,_for);
		html=__replaceAll(html,__re._ifstart,__re._ifend,_if);
		html=html.replace(__re._unit,_unit);

		if(!option || option.cache!==false) {
			__cache[ukey]=html;
		}
		
		return html;
	};
	
	this.juicer=__juicer;
})();
