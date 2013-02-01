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

0.5.7
-----

* Compatible for `avoid re-declare native function` for node.js.

0.5.8
-----

* Fixed `varialble outer each statement environment` bug (`Issue #8`), for example: `{@each array as item}${item}{@/each}${item}`.

0.5.9
-----

* avoid re-declare registered function, if not do this, template `{@if registered_func(name)}` could be throw undefined.

0.6.0
-----

* fixed bug for Firefox 14.0.1 (`issue #9`, https://bugzilla.mozilla.org/show_bug.cgi?id=785822).
* added adapter for expressjs-3.x.

0.6.1
-----

* avoid re-analyze method statement variable.

0.6.2
-----

* fixed bug that variable support in `each .. range` expression (`issue #16`).
* added sub-template support using `{@include sub, data}`.

0.6.3
-----

* update testcase of sub-template support.
* added command line support for node.js, using for precompile the template files, `npm install -g juicer`.

0.6.4
-----

* fixed bug that `if(console)` detection will throw error under some browser (like ie6).

0.6.5
-----

* added `other helper types support`, not only the function type, but also can be object type, etc. fixed `variableAnalyze` for `object[variable]` statement.
