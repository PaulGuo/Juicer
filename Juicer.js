window.addEvent('domready',function() {
	var result={
		list:[
			{'name':'Dier','age':23,'sex':'girl'},
			{'name':'PaulGuo','age':22,'sex':'boy'},
			{'name':'BenBen','age':21,'sex':'unknown'}
		]
	}

	var html=$$('ul.list')[0].innerHTML;
	
	//Grammer
	var whole=html;
	var if_blocks=[];
	
	html=html.replace(/{if([\s\S]*?)}([\s\S]*?){\/if}/img,function($a,$1) {
		var block=$a.replace(/[\r\n]*/img,'');
		if_blocks.push(block);
	});
	
	for(var i=0;i<if_blocks.length;i++) {
		var cur=if_blocks[i];
		var cur=cur.split(';');
		var conditions=[],results=[];
		cur.pop();
		for(var j=0;j<cur.length;j++) {
			var segment=cur[j];
			var condition=segment.replace(/{(.*?)if(.*?)}(.*)/img,'$2');
			var result=segment.replace(/{(.*?)if(.*?)}(.*)/img,'$3');
			if(condition==segment) {
				condition=true;
				result=segment.replace(/{else}(.*)/img,'$1');
			}
			conditions.push(condition);
			results.push(condition);
		}
		console.log(conditions);
	}
	
	
	
	
	
	
	
	
	//console.log(html);
	//console.log(if_blocks);
	
	//template engine lite
	//html=html.replace(/\[#(.*?)\]/img,function($a,$1) {return text[$1]});
});