Juicer Change History
=====================


0.4.0
-----

* Added `register` and `unregister` methods to manage the customed method.

* Resolved `__escapehtml` global pollution.


0.5.0
-----

* Added `#id` support for tpl parameter.

* Support custom the tags by `juicer.set('tag::someTag', 'yourTag')`.

* Fixed `each … range` bug that ranges are incorrect.

0.5.1
-----

* Fixed `#id` support invalid bug because of `var document`.

* Fixed `lexical analyze` bug (`Issue #3`), for example: `{@if a == b}` will throw b is undefined.

0.5.2
-----

* Fixed `lexical analyze` bug (`Issue #4`), for example: `{@if a == true}` will throw `Unexpected token true`.

* Fixed `lexical analyze` bug (`Issue #5`), for example: `{@else if a == b}` will throw a is undefined.

0.5.3
-----

* Added `arguments support` when using helper function (`Pull #6`).

* Added `Object each operation support`.

0.5.4
-----

* Update `whitelist` for lexicalAnalyze.

0.5.5
-----

* Fixed `window` is not defined warning under expressjs.
* Added `expressjs` wrapper, and demo.

0.5.6
-----

* Fixed `Object each operation` bug.
