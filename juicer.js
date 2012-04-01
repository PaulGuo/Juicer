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
		console.log(p);
		return _judge(p);
	};

	var replace=function(str,a,b) {
		var s=str.substr(0,str.indexOf(a));
		var e=str.substr(str.indexOf(a)+a.length);
		return s+b+e;
	};

	this.juicer=function(tpl,data) {
		var fn=arguments.callee;
		var re={
			'for':/{@for\s+([^}]*?)}([\s\S]*?){@\/for}/igm,
			'if':/{@if\s+([^}]*?)}([\s\S]*?){@\/if}/igm,
			'unit':/\[#(.*?)(\s+condition=["|'](.*?)["|'])?\]/igm,
			'_for':/{@for\s+([^}]*?)}([\s\S]*){@\/for}/igm,
			'_if':/{@if\s+([^}]*?)}([\s\S]*){@\/if}/igm
		};
		var _for=function($a,$1,$2) {
			if(!data[$1]) return '';
			for(var i=0,t=[];i<data[$1].length;i++) t.push(fn($2,data[$1][i]));
			return t.join('');
		};
		var _if=function($a,$1,$2) {
			if(eval(fn($1,data))) return fn($2,data);
			return '';
		};
		var _unit=function($a,$1,$2,$3) {
			if(!$3 || eval(fn($3,data))) return data[$1]?data[$1]:'';
			return '';
		};

		//tpl=tpl.replace(recursive(tpl,/{@for[^}]*?}/igm,/{@\/for}/igm)?re._for:re.for,_for);
		//tpl=tpl.replace(recursive(tpl,/{@if[^}]*?}/igm,/{@\/if}/igm)?re._if:re.if,_if);
		//tpl=tpl.replace(re.unit,_unit);

		var __f=recursive(tpl,/{@for[^}]*?}/igm,/{@\/for}/igm);
		for(var i=0;i<__f.length;i++) {
			tpl=replace(tpl,__f[i],__f[i].replace(re._for,_for));
		}
		var __i=recursive(tpl,/{@if[^}]*?}/igm,/{@\/if}/igm);
		for(var i=0;i<__i.length;i++) {
			tpl=replace(tpl,__i[i],__i[i].replace(re._if,_if));
		}
		tpl=tpl.replace(re.unit,_unit);

		return tpl;
	};

	this.r=recursive;
	this.p=replace;
})();
