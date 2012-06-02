<h2>Juicer 中文文档</h2>

<p><strong>当前最新版本: 0.4.0-dev</strong></p>

<p>Juicer 是一个高效、轻量的前端 (Javascript) 模板引擎，使用 Juicer 可以是你的代码实现数据和视图模型的分离(MVC)。
除此之外，它还可以在 Node.js 环境中运行。</p>

<p>你可以在遵守 MIT Licence 的前提下随意使用并分发它。Juicer 代码完全开源并托管在 
<a href="https://github.com/PaulGuo/Juicer">Github</a> 上，如果你在使用的过程中发现
什么 Bug 抑或是一些好的建议都欢迎在 <a href="https://github.com/PaulGuo/Juicer/issues">Github Issue</a>
上提交。</p>

<a name="!about"></a>
<h4>名字的由来</h4>

<p>倘若我们把数据比作新鲜可口的水果，把模板看做是水，Juicer 就是把水果和水榨出我们需要的HTML代码片段的榨汁机。</p>

<h4>Juicer 的引入</h4>

<pre><code>&lt;script type="text/javascript" src="juicer-min.js"&gt;&lt;/script&gt;
</code></pre>

<h2>* 使用方法</h2>

<p>&gt; 编译模板并根据所给的数据立即渲染出结果.</p>

<pre><code>juicer(tpl, data);
</code></pre>

<p>&gt; 仅编译模版暂不渲染，它会返回一个可重用的编译后的函数.</p>

<pre><code>var compiled_tpl = juicer(tpl);
</code></pre>

<p>&gt; 根据给定的数据，对之前编译好的模板进行数据渲染.</p>

<pre><code>var compiled_tpl = juicer(tpl);
var html = compiled_tpl.render(data);
</code></pre>

<p>&gt; 注册/注销自定义函数，在下边 ${变量} 中会有实例.</p>

<pre><code>juicer.register('function_name', function);
juicer.unregister('function_name');
</code></pre>

<h4>默认参数配置</h4>

<pre><code>{
    cache:          true [false],
    strip:          true [false],
    errorhandling:  true [false],
    detection:      true [false]
}
</code></pre>

<p>默认配置是 Juicer 推荐的使用方式，如果你使用过程中的确需要更改这些参数，可以这么做：</p>

<h5>逐条参数更改：</h5>

<pre><code>juicer.set('strip',false);
juicer.set('cache',false);
</code></pre>

<h5>批量参数更改：</h5>

<pre><code>juicer.set({
    'strip': false,
    'cache': false
};
</code></pre>

<p>Juicer 默认会对编译后的模板进行缓存，从而避免同一模板多次数据渲染时候重复编译所耗的时间，
如无特殊需要，强烈不建议关闭默认参数中的 cache，这么做将会令 Juicer 缓存失效从而降低性能.</p>

<a name="!syntax"></a>
<h2>* 语法</h2>

<h4>a. ${变量}</h4>

<p>使用 ${} 输出变量值，支持自定义函数（通过自定义函数你可以实现很多有趣的功能，类似 ${data|links} 就可以
通过事先定义的自定义函数 links 直接对 data 拼装出&lt;a href=".." alt=".." /&gt; ）.</p>

<pre><code>${name}
${name|function}
</code></pre>

<p>让我们通过一个例子演示一下自定义函数的奇妙用法吧.</p>

<pre><code>var json = {
    links: [
        {href: 'http://juicer.name', alt: 'Juicer'},
        {href: 'http://benben.cc', alt: 'Benben'},
        {href: 'http://ued.taobao.com', alt: 'Taobao UED'}
    ]
};

var tpl = [
    '{@each links as item}',
        '${item|links} &lt;br /&gt;',
    '{@/each}'
].join('');

var links = function(data) {
	return '&lt;a href="' + data.href + '" alt="' + data.alt + '" /&gt;';
};

juicer.register('links', links); //注册自定义函数
juicer(tpl, json);
</code></pre>

<p>上述代码执行后我们会发现结果是这样的：</p>

<pre><code>&amp;lt;a href=&amp;quot;http://juicer.name&amp;quot; alt=&amp;quot;Juicer&amp;quot; &lt;br /&gt;
&amp;lt;a href=&amp;quot;http://benben.cc&amp;quot; alt=&amp;quot;Benben&amp;quot; &lt;br /&gt;
&amp;lt;a href=&amp;quot;http://ued.taobao.com&amp;quot; alt=&amp;quot;Taobao UED&amp;quot; &lt;br /&gt;
</code></pre>

<p>可以看得出，结果被转义了，如果我们上边使用 $${item|links} 就会得到我们预期的结果，这就是下边即将提到的避免转义。</p>

<strong>转义/避免转义</strong>

<p>出于安全角度的考虑，${变量} 在输出之前会对其内容进行转义，如果你不想输出结果被转义，可以使用 $${变量} 来避免这种情况。
例如：</p>

<pre><code>var json = {
    value: '&lt;strong&gt;juicer&lt;/strong&gt;'
};

var escape_tpl='${value}';
var unescape_tpl='$${value}';

juicer(escape_tpl, json); //输出 '&amp;lt;strong&amp;gt;juicer&amp;lt;/strong&amp;gt;'
juicer(unescape_tpl, json); //输出 '&lt;strong&gt;juicer&lt;/strong&gt;'
</code></pre>

<h4>b. 循环遍历 {@each} ... {@/each}</h4>

<p>如果你需要对数组进行循环遍历的操作，就可以像这样使用 `each` .</p>

<pre><code>{@each list as item}
	${item.prop}
{@/each}
</code></pre>

<p>如果遍历过程中想取得当前的索引值，也很方便.</p>

<pre><code>{@each list as item, index}
	${item.prop}
	${index} //当前索引
{@/each}
</code></pre>

<h4>c. 判断 {@if} ... {@else if} ... {@else} ... {@/if}</h4>

<p>我们也会经常碰到对数据进行逻辑判断的时候.</p>

<pre><code>{@each list as item,index}
    {@if index===3}
        the index is 3, the value is ${item.prop}
    {@else if index === 4}
        the index is 4, the value is ${item.prop}
    {@else}
        the index is not 3, the value is ${item.prop}
    {@/if}
{@/each}
</code></pre>

<h4>d. 注释 {# 注释内容}</h4>

<p>为了后续代码的可维护性和可读性，我们可以在模板中增加注释.</p>

<pre><code>{# 这里是注释内容}</code></pre>

<a name="!node.js"></a>
<h2>* 在 Node.js 环境中运行</h2>

<pre><code>在命令行中执行:
npm install juicer

在代码中这么引入:
var juicer = require('juicer');
var html = juicer(tpl, data);
</code></pre>

<a name="!demo"></a>
<h2>* 一个完整的例子</h2>

<pre><code>HTML 代码:

&lt;script id="tpl" type="text/template"&gt;
    &lt;ul&gt;
        {@each list as it,index}
            &lt;li&gt;${it.name} (index: ${index})&lt;/li&gt;
        {@/each}
        {@each blah as it}
            &lt;li&gt;
                num: ${it.num} &lt;br /&gt;
                {@if it.num==3}
                    {@each it.inner as it2}
                        ${it2.time} &lt;br /&gt;
                    {@/each}
                {@/if}
            &lt;/li&gt;
        {@/each}
    &lt;/ul&gt;
&lt;/script&gt;

Javascript 代码:

var data = {
    list: [
        {name:' guokai', show: true},
        {name:' benben', show: false},
        {name:' dierbaby', show: true}
    ],
    blah: [
        {num: 1},
        {num: 2},
        {num: 3, inner:[
            {'time': '15:00'},
            {'time': '16:00'},
            {'time': '17:00'},
            {'time': '18:00'}
        ]},
        {num: 4}
    ]
};

var tpl = document.getElementById('tpl').innerHTML;
var html = juicer(tpl, data);
</code></pre>
