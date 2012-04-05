(function() {
	var recursive=function(str,o,c) {
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

	var replace=function(str,a,b) {
		var s=str.substr(0,str.indexOf(a));
		var e=str.substr(str.indexOf(a)+a.length);
		return s+b+e;
	};

	var reference=function(str,re) {
		var ret;
		str.replace(re,function() {
			ret=arguments;
			return ret[0];
		});
		return ret;
	};
	
	var evalString=new Function('exp',
		"return exp;"
	);

	this.juicer=function(tpl,data) {
		var fn=arguments.callee;
		var re={
			'_for':/{@for\s+([^}]*)}([\s\S]*){@\/for}/igm,
			'_if':/{@if\s+([^}]*)}([\s\S]*){@\/if}/igm,
			'_unit':/\[#(.*?)(\s+condition=["|'](.*?)["|'])?\]/igm,
		};
		var _for=function(str) {
			var ref=reference(str,re._for),chain=ref[1],inner=ref[2];
			if(!data[chain]) return '';
			for(var i=0,t=[];i<data[chain].length;i++) t.push(fn(inner,data[chain][i]));
			return t.join('');
		};
		var _if=function(str) {
			var ref=reference(str,re._if),condition=ref[1],inner=ref[2];
			if(evalString(fn(condition,data))) return fn(inner,data);
			return '';
		};
		var _unit=function($a,$1,$2,$3) {
			if(!$3 || evalString(fn($3,data))) return data[$1]?typeof(data[$1])=='object'?true:data[$1]:'';
			return '';
		};

		for(var i=0,__f=recursive(tpl,/{@for[^}]*?}/igm,/{@\/for}/igm);i<__f.length;i++) {
			tpl=replace(tpl,__f[i],_for(__f[i]));
		}

		for(var i=0,__i=recursive(tpl,/{@if[^}]*?}/igm,/{@\/if}/igm);i<__i.length;i++) {
			tpl=replace(tpl,__i[i],_if(__i[i]));
		}

		tpl=tpl.replace(re._unit,_unit);

		return tpl;
	};
})();
