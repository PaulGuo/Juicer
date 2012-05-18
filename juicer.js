/*
	@author: guokai
	@email/gtalk: badkaikai@gmail.com
	@blog/website: http://benben.cc
	@license: apache license, version 2.0
	@version: 0.4.0-dev
*/

(function() {
	var juicer = function() {
		var args = [].slice.call(arguments);
		args.push(juicer.options);
		
		if(arguments.length == 1) {
			return juicer.compile.apply(juicer, args);
		}
		
		if(arguments.length >= 2) {
			return juicer.to_html.apply(juicer, args);
		}
	};

	var __escapehtml = {
		escapehash: {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2f;'
		},
		escapereplace: function(k) {
			return this.escapehash[k];
		},
		escaping: function(str) {
			return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm, this.escapereplace);
		},
		detection: function(data) {
			return typeof(data) === 'undefined' ? '' : data;
		}
	};
	
	var __throw = function(error) {
		if(console) {
			if(console.warn) {
				console.warn(error);
			}

			if(console.log) {
				console.log(error);
			}

			return;
		}
		
		throw(error);
	};

	juicer.__cache = {};
	juicer.version = '0.4.0-dev';

	juicer.settings = {
		forstart:      /{@each\s*([\w\.]*?)\s*as\s*(\w*?)\s*(,\s*\w*?)?}/igm,
		forend:        /{@\/each}/igm,
		ifstart:       /{@if\s*([^}]*?)}/igm,
		ifend:         /{@\/if}/igm,
		elsestart:     /{@else}/igm,
		elseifstart:   /{@else if\s*([^}]*?)}/igm,
		interpolate:   /\${([\s\S]+?)}/igm,
		noneencode:    /\$\${([\s\S]+?)}/igm,
		inlinecomment: /{#[^}]*?}/igm,
		rangestart:    /{@each\s*(\w*?)\s*in\s*range\((\d+?),(\d+?)\)}/igm
	};

	juicer.options = {
		cache: true,
		strip: true,
		errorhandling: true,
		__escapehtml: __escapehtml,
		__throw: __throw
	};

	juicer.set = function(conf, value) {
		if(arguments.length === 2) {
			this.options[conf] = value;
			return;
		}
		
		if(conf === Object(conf)) {
			for(var i in conf) {
				if(conf.hasOwnProperty(i)) {
					this.options[i] = conf[i];
				}
			}
		}
	};

	juicer.template = function() {
		var that = this;

		this.__interpolate = function(_name, _escape, options) {
			var _define = _name.split('|'), _fn = '';

			if(_define.length > 1) {
				_name = _define.shift();
				_fn = '_method.' + _define.shift();
			}

			return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '') + '(' +
							(!options || options.detection !== false ? '_method.__escapehtml.detection' : '') + '(' +
									_fn + '(' +
											_name +
										')' +
								')' +
						')' +
				' %>';
		};

		this.__removeShell = function(tpl, options) {
			var _counter = 0;
			
			tpl = tpl
				//for expression
				.replace(juicer.settings.forstart, function($, _name, alias, key) {
					var alias = alias || 'value', key = key && key.substr(1);
					var _iterate = 'i' + _counter++;
					return '<% for(var ' + _iterate + '=0, l' + _iterate + '=' + _name + '.length;' + _iterate + '<l' + _iterate + ';' + _iterate + '++) {' +
								'var ' + alias + '=' + _name + '[' + _iterate + '];' +
								(key ? ('var ' + key + '=' + _iterate + ';') : '') +
						' %>';
				})
				.replace(juicer.settings.forend, '<% } %>')

				//if expression
				.replace(juicer.settings.ifstart, function($, condition) {
					return '<% if(' + condition + ') { %>';
				})
				.replace(juicer.settings.ifend, '<% } %>')

				//else expression
				.replace(juicer.settings.elsestart, function($) {
					return '<% } else { %>';
				})

				//else if expression
				.replace(juicer.settings.elseifstart, function($, condition) {
					return '<% } else if(' + condition + ') { %>';
				})

				//interpolate without escape
				.replace(juicer.settings.noneencode, function($, _name) {
					return that.__interpolate(_name, false, options);
				})

				//interpolate with escape
				.replace(juicer.settings.interpolate, function($, _name) {
					return that.__interpolate(_name, true, options);
				})

				//clean up comments
				.replace(juicer.settings.inlinecomment, '')

				//range expression
				.replace(juicer.settings.rangestart, function($, _name, start, end) {
					var _iterate = 'j' + _counter++;
					return '<% for(var ' + _iterate + '=0;' + _iterate + '<' + (end - start) + ';' + _iterate + '++) {' +
								'var ' + _name + '=' + _iterate + ';' +
						' %>';
				});

			//exception handling
			if(!options || options.errorhandling !== false) {
				tpl += '<% try { %>' + tpl;
				tpl += '<% } catch(e) {__throw("Juicer Render Exception: "+e.message);} %>';
			}

			return tpl;
		};

		this.__toNative = function(tpl, options) {
			return this.__convert(tpl, !options || options.strip);
		};

		this.__lexicalAnalyze = function(tpl) {
			var buffer = [];
			var prefix = '';
			var indexOf = function(array, item) {
				if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
					return array.indexOf(item);
				}
				
				for(var i=0; i < array.length; i++) {
					if(array[i] === item) return i;
				}
				
				return -1;
			};
			var variableAnalyze = function($, statement) {
				statement = statement.match(/\w+/igm)[0];
				
				if(indexOf(buffer, statement) === -1) {
					buffer.push(statement); //fuck ie
				}
			};

			tpl.replace(juicer.settings.forstart, variableAnalyze).
				replace(juicer.settings.interpolate, variableAnalyze).
				replace(juicer.settings.ifstart, variableAnalyze);

			for(var i = 0;i < buffer.length; i++) {
				prefix += 'var ' + buffer[i] + '=_.' + buffer[i] + ';';
			}
			return '<% ' + prefix + ' %>';
		};
		
		this.__convert=function(tpl, strip) {
			var buffer = [].join('');
			buffer += "var _ = _ || {};";
			buffer += "var out = '';out += '";

			if(strip !== false) {
				buffer += tpl
					.replace(/\\/g, "\\\\")
					.replace(/[\r\t\n]/g, " ")
					.replace(/'(?=[^%]*%>)/g, "\t")
					.split("'").join("\\'")
					.split("\t").join("'")
					.replace(/<%=(.+?)%>/g, "';out+=$1;out+='")
					.split("<%").join("';")
					.split("%>").join("out+='")+
					"';return out;";

				return buffer;
			}

			buffer += tpl
					.replace(/\\/g, "\\\\")
					.replace(/[\r]/g, "\\r")
					.replace(/[\t]/g, "\\t")
					.replace(/[\n]/g, "\\n")
					.replace(/'(?=[^%]*%>)/g, "\t")
					.split("'").join("\\'")
					.split("\t").join("'")
					.replace(/<%=(.+?)%>/g, "';out+=$1;out+='")
					.split("<%").join("';")
					.split("%>").join("out+='")+
					"';return out.replace(/[\\r\\n]\\t+[\\r\\n]/g, '\\r\\n');";
					
			return buffer;
		};

		this.parse = function(tpl, options) {
			if(!options || options.loose !== false) tpl = this.__lexicalAnalyze(tpl) + tpl;
			
			tpl = this.__removeShell(tpl, options);
			tpl = this.__toNative(tpl, options);
			tpl = '"use strict";' + tpl; //use strict mode

			this.render = new Function('_, _method', tpl);
			return this;
		};
	};

	juicer.compile = function(tpl, options) {
		try {
			var engine = this.__cache[tpl] ? this.__cache[tpl] : new this.template().parse(tpl, options);
			
			if(!options || options.cache !== false) {
				this.__cache[tpl] = engine;
			}
			
			return engine;
		} catch(e) {
			__throw('Juicer Compile Exception: ' + e.message);
			
			return {
				render: function() {} //noop
			};
		}
	};

	juicer.to_html = function(tpl, data, options) {
		return this.compile(tpl,options).render(data, options);
	};

	typeof(module) !== 'undefined' && module.exports ? module.exports = juicer : this.juicer = juicer;
})();
