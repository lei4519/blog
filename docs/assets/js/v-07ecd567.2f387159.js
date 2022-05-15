"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[726],{8246:(n,s,a)=>{a.r(s),a.d(s,{default:()=>d});var t=a(6252);const p=(0,t.uE)('<h1 id="给原生小程序安排上composition-api" tabindex="-1"><a class="header-anchor" href="#给原生小程序安排上composition-api" aria-hidden="true">#</a> 给原生小程序安排上Composition API</h1><blockquote><p>通过对逻辑层的封装，让原生小程序使用Vue3的Composotion API</p></blockquote><h2 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例" aria-hidden="true">#</a> 使用示例</h2><p>index.wxml</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span><span class="token punctuation">&gt;</span></span>{{count}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">bindtap</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>add<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>数字 +1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>index.js</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>Epage<span class="token punctuation">,</span> ref<span class="token punctuation">,</span> onShowHooks<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;enhance-weapp&#39;</span>\n\n<span class="token keyword">function</span> <span class="token function">useCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    count<span class="token punctuation">.</span>value<span class="token operator">++</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">onShowHooks</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;我是useCount&#39;</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    count<span class="token punctuation">,</span>\n    add\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n\n<span class="token function">Epage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">onShowHooks</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;我是setup&#39;</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">return</span> <span class="token function">useCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="原理简述" tabindex="-1"><a class="header-anchor" href="#原理简述" aria-hidden="true">#</a> 原理简述</h2><p>流程图先走一波</p><p><img src="https://github.com/lei4519/picture-bed/raw/main/images/1609148257431-image.png" alt="image"></p><ol><li>Epage函数会对传入的<code>options</code>对象属性进行遍历，对所有的生命周期方法进行装饰，将生命周期改造成数组结构，并提供相关的hooks方式以调用注册。</li><li>在onLoad/created中检查并执行<code>setup</code>函数，拿到其返回值<code>setupData</code>。</li><li>创建<code>options.data</code>对象副本（如果有的话），使用<code>reactive</code>将其响应式后保存到<code>this.data$</code>属性上。</li><li>遍历<code>setupData</code>，将其值直接赋值给<code>this.data$</code>，响应式解包赋值给<code>this.data</code>。</li><li>调用<code>this.setData(this.data)</code>，同步数据至渲染层。</li><li>保存<code>this.data</code>副本至<code>this.__oldData__</code>。</li><li>使用<code>watch</code>监听<code>this.data$</code>，响应式触发后diff <code>this.data$</code>与<code>this.__oldData__</code>。</li><li>调用<code>this.setData(diffData)</code>，同步数据至渲染层。</li><li>优化部分：当页面onHide时会取消响应式监听，onShow时会重新监听并diff一次数据。</li></ol>',11),e=(0,t.Uk)("以上是核心的实现思路，除此之外还有全局"),o=(0,t._)("code",null,"mixins",-1),c=(0,t.Uk)("、生命周期阻塞执行、全局生命周期控制等逻辑，具体可以去"),l={href:"https://github.com/lei4519/enhance-weapp",target:"_blank",rel:"noopener noreferrer"},u=(0,t.Uk)("enhance-weapp"),i=(0,t.Uk)("，看下介绍和源码。"),r=(0,t._)("p",null,"如果本篇内容对你有帮助，欢迎点赞star👍。",-1),k={},d=(0,a(3744).Z)(k,[["render",function(n,s){const a=(0,t.up)("OutboundLink");return(0,t.wg)(),(0,t.iD)(t.HY,null,[p,(0,t._)("p",null,[e,o,c,(0,t._)("a",l,[u,(0,t.Wm)(a)]),i]),r],64)}]])},3744:(n,s)=>{s.Z=(n,s)=>{const a=n.__vccOpts||n;for(const[n,t]of s)a[n]=t;return a}},637:(n,s,a)=>{a.r(s),a.d(s,{data:()=>t});const t={key:"v-07ecd567",path:"/technology/MiniProgram/framework.html",title:"给原生小程序安排上Composition API",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"使用示例",slug:"使用示例",children:[]},{level:2,title:"原理简述",slug:"原理简述",children:[]}],filePathRelative:"technology/MiniProgram/framework.md",git:{updatedTime:165261634e4}}}}]);