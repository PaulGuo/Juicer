window.addEvent('domready',function() {
	var result={
		list:[
			{'name':'Dier','age':23,'sex':'girl'},
			{'name':'PaulGuo','age':22,'sex':'boy'},
			{'name':'BenBen','age':21,'sex':'unknown'}
		]
	}

	var html=$$('ul.list')[0].innerHTML;
	console.log(html);

	//var html=_this.options.html||'<li><span>'+text.plName+'</span>'+'<span>'+text.content+'</span></li>';
	//template engine lite
	html=html.replace(/\[#(.*?)\]/img,function($a,$1) {return text[$1]});
});