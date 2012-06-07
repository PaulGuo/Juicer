test('slash and quote should be escaped', function() {
    var result = juicer('${hi}\\"', {hi: 'world'});
    ok(result === 'world\\"', 'Passed!');
});

test('should ignore undefined variable', function() {
    var result = juicer('${hi}', {});
    ok(result === '', 'Passed!');
});

test('should ignore undefined variable', function() {
    var result = juicer('${hi}', {});
    ok(result === '', 'Passed!');
});

test('enable cache', function() {
    var result = juicer('${hiCache}');
    ok(result === juicer('${hiCache}'), 'Passed!');
});

test('disable cache', function() {
    juicer.set('cache', false);
    var result = juicer('${hiDisableCache}');
    ok(result !== juicer('${hiDisableCache}'), 'Passed!');
});

test('variable escape', function() {
    var result = juicer('${hiEscape}', {hiEscape: '<span>'});
    ok(result === '&lt;span&gt;', 'Passed!');
});

test('variable no-escape', function() {
    var result = juicer('$${hiNoEscape}', {hiNoEscape: '<span>'});
    ok(result === '<span>', 'Passed!');
});

test('strip', function() {
    var result = juicer('${hiStrip}\r\n', {hiStrip: 'hello world'});
    ok(result === 'hello world  ', 'Passed!');
});

test('no-strip', function() {
    juicer.set('strip', false);
    var result = juicer('${hiNoStrip}\r\n', {hiNoStrip: 'hello world'});
    ok(result === 'hello world\r\n', 'Passed!');
});

test('id support and if statement', function() {
    var result = juicer('#juicer-tmpl', {benben: 'cc', hello: 'hello world'});
    ok(result === 'hello world', 'Passed!');
});
