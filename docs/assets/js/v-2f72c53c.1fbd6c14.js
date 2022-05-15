"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[233],{8225:(n,s,a)=>{a.r(s),a.d(s,{default:()=>u});var e=a(6252);const p=(0,e.uE)('<h1 id="玩转-ts-实现-dva-的完整类型推导" tabindex="-1"><a class="header-anchor" href="#玩转-ts-实现-dva-的完整类型推导" aria-hidden="true">#</a> 玩转 TS - 实现 dva 的完整类型推导</h1><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>在 TypeScript 4.1 来临之前，对于像 <code>dva</code>、 <code>vuex</code> 这种需要在触发时写入命名空间的函数，我们无奈的只能使用 <code>any</code> 对其进行类型定义。</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">&#39;users/getUser&#39;</span><span class="token punctuation">,</span>\n  payload<span class="token operator">:</span> <span class="token string">&#39;...&#39;</span><span class="token punctuation">,</span> <span class="token comment">// any</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>这使得项目中本应良好的 <code>TS</code> 类型推导出现了断层，社区中也有相关的解决方案，但都是通过更加复杂类型、函数封装进而实现的，与官方写法大相径庭。</p>',5),t=(0,e.Uk)("好在，TypeScript 4.1 带来了 "),o={href:"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html",target:"_blank",rel:"noopener noreferrer"},c=(0,e.Uk)("Template Literal Types"),l=(0,e.Uk)(" 特性，是我们可以对类型进行字符串拼接操作，从而使得此类函数的类型推导称为现实。"),r=(0,e.uE)('<p>本文将带你一一讲解具体的推导过程，希望看完之后会有收获。</p><p>同时，本文的最终实现已经发布了 <code>npm</code> 包：<code>dva-type</code>，可以在项目中直接安装使用。</p><h2 id="dva-基本使用" tabindex="-1"><a class="header-anchor" href="#dva-基本使用" aria-hidden="true">#</a> dva 基本使用</h2><p>写代码之前先让我们回顾一下 dva 的基本使用，也好让我们知道自己最终要实现什么。</p><h3 id="model-定义" tabindex="-1"><a class="header-anchor" href="#model-定义" aria-hidden="true">#</a> Model 定义</h3><p><code>dva</code> 中通过定义 <code>model</code> 来声明各模块的状态，其中 <code>reducers</code> 就是 <code>redux</code> 的 <code>reducers</code> ，<code>effects</code> 就是用来执行异步操作的地方，在 <code>effect</code> 中最终也会通过 <code>reducers</code> 将状态更新到 <code>state</code> 中。</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code>cosnt model <span class="token operator">=</span> <span class="token punctuation">{</span>\n  state<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  effects<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">getList</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  reducers<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">merge</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><p>使用方法同 <code>redux</code></p><ul><li>使用 <code>connect</code> 高阶函数或者 <code>useSelector</code> 来获取 <code>state</code></li><li>使用 <code>connect</code> 或者 <code>useDispatch</code> 拿到 <code>dispatch</code> 函数</li></ul><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token function">connect</span><span class="token punctuation">(</span>state <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>\n  userInfo<span class="token operator">:</span> state<span class="token punctuation">.</span>users<span class="token punctuation">.</span>info<span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 类型断层</span>\n<span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">&#39;users/getUser&#39;</span><span class="token punctuation">,</span>\n  payload<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>类型断层主要在于 <code>dispatch</code> 时的 <code>action</code> 类型无法推导，<code>state</code> 的类型提示则没有问题，而 <code>action</code> 之所以会失效主要在于参数 <code>type</code> 需要拼接命名空间。</p><p>所以我们要解决的其实就是拼接命名空间之后的类型提示和推导，而这在 Template Literal Types 特性出现之后，就使得解决方案变得异常简单与自然。</p><h2 id="dva-type" tabindex="-1"><a class="header-anchor" href="#dva-type" aria-hidden="true">#</a> dva-type</h2><p>开始 <code>dva-type</code> 的源码解析之前，先看一下它是如何使用的</p><h3 id="dva-type-使用" tabindex="-1"><a class="header-anchor" href="#dva-type-使用" aria-hidden="true">#</a> dva-type 使用</h3><ol><li><p>定义单个 <code>Model</code> 类型（注意 <code>Model</code>、<code>Effect</code> 不是从 <code>dva</code> 中导入的）</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Effect<span class="token punctuation">,</span> Model <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;dva-type&#39;</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">ListModel</span> <span class="token keyword">extends</span> <span class="token class-name">Model</span> <span class="token punctuation">{</span>\n  state<span class="token operator">:</span> <span class="token punctuation">{</span>\n    list<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  effects<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 定义effect 传入 payload 类型</span>\n    getList<span class="token operator">:</span> Effect<span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">&gt;</span>\n\n    <span class="token comment">// 不需要 payload 的 effect</span>\n    getInfo<span class="token operator">:</span> Effect\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div></li><li><p>定义项目中所有 <code>Model</code> 的集合（<strong>使用 <code>type</code> 而不是 <code>interface</code></strong>）</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// 使用 type 定义 models，将项目中的所有 model 进行收集</span>\n<span class="token keyword">type</span> <span class="token class-name">Models</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  list<span class="token operator">:</span> ListModel\n  info<span class="token operator">:</span> InfoModel\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></li><li><p>将 <code>Models</code> 传入 <code>ResolverModels</code> 获取 <code>state</code> 和 <code>actions</code> 的类型</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ResolverModels <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;dva-type&#39;</span>\n\n<span class="token keyword">type</span> <span class="token class-name">State</span> <span class="token operator">=</span> ResolverModels<span class="token operator">&lt;</span>Models<span class="token operator">&gt;</span><span class="token punctuation">[</span><span class="token string">&#39;state&#39;</span><span class="token punctuation">]</span>\n<span class="token keyword">type</span> <span class="token class-name">Actions</span> <span class="token operator">=</span> ResolverModels<span class="token operator">&lt;</span>Models<span class="token operator">&gt;</span><span class="token punctuation">[</span><span class="token string">&#39;actions&#39;</span><span class="token punctuation">]</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div></li><li><p>使用</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// hooks</span>\n<span class="token generic-function"><span class="token function">useSelector</span><span class="token generic class-name"><span class="token operator">&lt;</span>State<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> dispatch <span class="token operator">=</span> useDispatch<span class="token operator">&lt;</span><span class="token punctuation">(</span>action<span class="token operator">:</span> Actions<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">any</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// class</span>\n<span class="token class-name"><span class="token keyword">const</span></span> <span class="token function-variable function">mapStateToProps</span> <span class="token operator">=</span> <span class="token punctuation">(</span>state<span class="token operator">:</span> State<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token keyword">interface</span> <span class="token class-name">Props</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">dispatch</span><span class="token operator">:</span> <span class="token punctuation">(</span>action<span class="token operator">:</span> Actions<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">any</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></li></ol><h3 id="dva-type-源码解析" tabindex="-1"><a class="header-anchor" href="#dva-type-源码解析" aria-hidden="true">#</a> dva-type 源码解析</h3><p>从上面的使用中可以看到，一切的秘密都在 <code>ResolverModels</code> 这个类型中，下面我们就看看其实现</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">ResolverModels<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> Model<span class="token operator">&gt;&gt;</span></span> <span class="token punctuation">{</span>\n  state<span class="token operator">:</span> ResolverState<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span> <span class="token operator">&amp;</span> Loading<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span>\n  actions<span class="token operator">:</span> ResolverReducers<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span> <span class="token operator">|</span> ResolverEffects<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="提取-state" tabindex="-1"><a class="header-anchor" href="#提取-state" aria-hidden="true">#</a> 提取 State</h4><p><code>state</code> 的解析很简单，使用 <code>keyof</code> 遍历 <code>models</code> 的 <code>state</code> 定义即可。</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">ResolverState<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> Model<span class="token operator">&gt;&gt;</span></span> <span class="token operator">=</span> UnionToIntersection<span class="token operator">&lt;</span>\n  <span class="token punctuation">{</span>\n    <span class="token punctuation">[</span>k <span class="token keyword">in</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;state&#39;</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这是基本操作，让我们大致过一下这个过程发生了什么</p><ol><li><code>T</code> 是我们传入的 <code>Models</code> 类型定义</li><li><code>[k in keyof T]</code> 相当于遍历了 <code>T</code> 的键：<code>list</code>、<code>info</code></li><li><code>T[k][&#39;state&#39;]</code> 相当于：<code>T[&#39;list&#39;][&#39;state’]</code>、<code>T[&#39;info&#39;][&#39;state’]</code></li></ol><p>这样就把 <code>state</code> 的类型给推导出来了，但是推导出来的类型是联合类型，我们还需要将其转换为交叉类型才能正确进行类型提示。</p><h5 id="联合类型转换交叉类型" tabindex="-1"><a class="header-anchor" href="#联合类型转换交叉类型" aria-hidden="true">#</a> 联合类型转换交叉类型</h5><p>而将联合转换为交叉类型则是网上找到的黑魔法：</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">UnionToIntersection<span class="token operator">&lt;</span><span class="token constant">U</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span>\n  <span class="token punctuation">(</span><span class="token constant">U</span> <span class="token keyword">extends</span> <span class="token class-name"><span class="token builtin">any</span></span> <span class="token operator">?</span> <span class="token punctuation">(</span>k<span class="token operator">:</span> <span class="token constant">U</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span> <span class="token operator">:</span> <span class="token builtin">never</span><span class="token punctuation">)</span>\n    <span class="token keyword">extends</span> <span class="token punctuation">(</span>k<span class="token operator">:</span> <span class="token keyword">infer</span> <span class="token constant">I</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>\n    <span class="token operator">?</span> <span class="token constant">I</span>\n    <span class="token operator">:</span> <span class="token builtin">never</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>具体的深层原理我也没有搞懂，但是可以看一下具体做了那些事情：</p><ol><li><code>U extends any ? (k: U) =&gt; void : never</code><ul><li><code>extends any</code> 这个条件永远是 <code>true</code> ，所以这里就是把传入的类型 <code>U</code> 变为了 函数类型：<code>(k: U) =&gt; void</code></li></ul></li><li><code>extends (k: infer I) =&gt; void</code><ul><li>第一步我们把类型变为了 <code>(k: U) =&gt; void</code> ，所以这里的 <code>extends</code> 的判断结果肯定也是 <code>true</code> 。</li><li>注意 <code>infer I</code> ，这将类型 <code>U</code> 重新做了推断，就是这一步使联合类型变为了交叉类型。</li></ul></li><li><code>? I : never</code><ul><li>很明显，根据第一个和第二步，这里的三元表达式永远都会返回 <code>I</code> 。</li><li>至此，联合类型被转换为了交叉类型。</li></ul></li></ol><h4 id="提取-actions" tabindex="-1"><a class="header-anchor" href="#提取-actions" aria-hidden="true">#</a> 提取 Actions</h4><p><code>dva</code> 提供的 <code>Effect</code> 类型不能传入 <code>payload</code> 的类型定义，所以这里我们需要封装一个 <code>Effect</code> 出来：</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">Effect<span class="token operator">&lt;</span><span class="token constant">P</span> <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> <span class="token punctuation">(</span>\n  action<span class="token operator">:</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span> payload<span class="token operator">?</span><span class="token operator">:</span> <span class="token constant">P</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  effect<span class="token operator">:</span> EffectsCommandMap\n<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h5 id="解析-effects-类型" tabindex="-1"><a class="header-anchor" href="#解析-effects-类型" aria-hidden="true">#</a> 解析 <code>effects</code> 类型</h5><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">ResolverEffects<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> Model<span class="token operator">&gt;&gt;</span></span> <span class="token operator">=</span> ValueType<span class="token operator">&lt;</span>\n  <span class="token punctuation">{</span>\n    <span class="token punctuation">[</span>t <span class="token keyword">in</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token punctuation">]</span><span class="token operator">:</span> ValueType<span class="token operator">&lt;</span>\n      <span class="token punctuation">{</span>\n        <span class="token punctuation">[</span>k <span class="token keyword">in</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token punctuation">[</span>t<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;effects&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">[</span>t<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;effects&#39;</span><span class="token punctuation">]</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token keyword">extends</span> <span class="token punctuation">(</span>\n          action<span class="token operator">:</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span> payload<span class="token operator">?</span><span class="token operator">:</span> <span class="token keyword">infer</span> <span class="token constant">A</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          effect<span class="token operator">:</span> EffectsCommandMap\n        <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>\n          <span class="token operator">?</span> <span class="token constant">A</span> <span class="token keyword">extends</span> <span class="token class-name"><span class="token keyword">undefined</span></span>\n            <span class="token operator">?</span> <span class="token punctuation">{</span>\n                type<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>t<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>k<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n                <span class="token punctuation">[</span>k<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">any</span>\n              <span class="token punctuation">}</span>\n            <span class="token operator">:</span> <span class="token punctuation">{</span>\n                type<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>t<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>k<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n                payload<span class="token operator">:</span> <span class="token constant">A</span>\n                <span class="token punctuation">[</span>k<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">any</span>\n              <span class="token punctuation">}</span>\n          <span class="token operator">:</span> <span class="token builtin">never</span>\n      <span class="token punctuation">}</span>\n    <span class="token operator">&gt;</span>\n  <span class="token punctuation">}</span>\n<span class="token operator">&gt;</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>代码一大坨，按流程走一遍：</p><ol><li><p><code>T</code> 依然是传入的 <code>Models</code> 类型</p></li><li><p><code>[t in keyof T]</code> 同 <code>state</code> ，不再赘述。</p></li><li><p><code>[k in keyof T[t][&#39;effects&#39;]]</code>，这一步就是将每个 <code>model</code> 中定义的 <code>effect</code> 进行了遍历，相当于：<code>Models[&#39;list&#39;][&#39;effects&#39;][&#39;getList’]</code>、<code>Models[&#39;info&#39;][&#39;effects&#39;][&#39;getInfo’]</code></p></li><li><p><code>T[t][&#39;effects&#39;][k] extends (action: { type: any; payload?: infer A },effect: EffectsCommandMap) =&gt; void</code></p><ul><li><p><code>extends</code> 后面的函数类型与我们定义的 <code>Effect</code> 类型一致</p></li><li><p>注意 <code>extends ... payload?: infer A …</code>， 这里将 <code>payload</code> 的类型提取了出来</p></li></ul></li><li><p><code>A extends undefined</code> ，这一步是为了判断 <code>effect</code> 是否需要传入 <code>payload</code>，如果不需要则不需要在类型中体现</p></li><li><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>t<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>k<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  payload<span class="token operator">:</span> <span class="token constant">A</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ol><li><code>payload: A</code> 这个就是将推导出来的类型又赋值回去了</li><li>type: ${t}/${k}，其中 <code>t</code> 表示了命名空间，<code>k</code> 表示了 <code>effect</code> 的名称：<code>type: &#39;list/getList&#39;</code></li></ol></li><li><p>至此，类型已经推导出来了，但是格式却不是我们想要的：</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token punctuation">{</span>\n  list<span class="token operator">:</span> <span class="token punctuation">{</span>\n    getList<span class="token operator">:</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">&#39;list/getList&#39;</span><span class="token punctuation">,</span>\n      payload<span class="token operator">:</span> <span class="token builtin">number</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div></li><li><p>我们只想要最里面的 <code>{type: .. payload ..}</code> 部分，所以这里要做的就是将 <code>value</code> 的类型提取出来，做法也非常简单：<code>T[keyof T]</code>，遍历并访问类型的键就可以将值类型全部取出。</p></li><li><p>将其简单封装，就是最外层的 <code>ValueType</code> 的作用了。</p></li></ol><p><code>effects</code> 的类型提取出来了，<code>reducers</code> 也是同样的做法，就不赘述了。</p><h4 id="dva-loading-类型" tabindex="-1"><a class="header-anchor" href="#dva-loading-类型" aria-hidden="true">#</a> dva-loading 类型</h4><p><code>dva-loading</code> 中可以根据<code>effects</code> 提供 <code>loading</code> 变量，我们解析了 <code>effects</code> 之后，<code>loading</code> 的变量提示也是顺其自然了</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Loading<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> Model<span class="token operator">&gt;&gt;</span></span> <span class="token punctuation">{</span>\n  loading<span class="token operator">:</span> <span class="token punctuation">{</span>\n    global<span class="token operator">:</span> <span class="token builtin">boolean</span>\n    models<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token punctuation">[</span>k <span class="token keyword">in</span> <span class="token keyword">keyof</span> <span class="token constant">T</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">boolean</span>\n    <span class="token punctuation">}</span>\n    effects<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token punctuation">[</span>k <span class="token keyword">in</span> ResolverEffects<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span><span class="token punctuation">[</span><span class="token string">&#39;type&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">boolean</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="end" tabindex="-1"><a class="header-anchor" href="#end" aria-hidden="true">#</a> End</h2><p>OK，感谢看到这里，希望看完之后对你有所提升，</p>',44),i={},u=(0,a(3744).Z)(i,[["render",function(n,s){const a=(0,e.up)("OutboundLink");return(0,e.wg)(),(0,e.iD)(e.HY,null,[p,(0,e._)("p",null,[t,(0,e._)("a",o,[c,(0,e.Wm)(a)]),l]),r],64)}]])},3744:(n,s)=>{s.Z=(n,s)=>{const a=n.__vccOpts||n;for(const[n,e]of s)a[n]=e;return a}},1379:(n,s,a)=>{a.r(s),a.d(s,{data:()=>e});const e={key:"v-2f72c53c",path:"/technology/Web/dva-type.html",title:"玩转 TS - 实现 dva 的完整类型推导",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"前言",slug:"前言",children:[]},{level:2,title:"dva 基本使用",slug:"dva-基本使用",children:[{level:3,title:"Model 定义",slug:"model-定义",children:[]},{level:3,title:"基本使用",slug:"基本使用",children:[]}]},{level:2,title:"dva-type",slug:"dva-type",children:[{level:3,title:"dva-type 使用",slug:"dva-type-使用",children:[]},{level:3,title:"dva-type 源码解析",slug:"dva-type-源码解析",children:[]}]},{level:2,title:"End",slug:"end",children:[]}],filePathRelative:"technology/Web/dva-type.md",git:{updatedTime:1623137599e3}}}}]);