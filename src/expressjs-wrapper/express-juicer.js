var juicer = require('juicer');

exports.compile = function(str, options) {
    return juicer.compile(str, options).render;
};
