# CSS世界中的技巧总结

宽度默认自适应性
block元素的宽度默认具有自适应性，即在不设置的情况下具有box-sizing: border-box的特性
position后，设置相对方向的值，也可以达到自适应效果
box-sizing的设计初衷应该是给替换元素用来自适应父容器宽度使用的，
利用宽度默认特性，实现box-sizing: border-box
给需要自适应的元素套一层父元素，给父元素定宽，子元素宽度不设置。此时子元素就默认具有box-sizing: border-box的特性了
margin 相关
如果元素没有定宽，那么可以通过负margin增加尺寸
margin实现两端对齐
三个元素两端对齐，中间留白20px。给子元素正常设置左右margin10px，父元素左右margin-10px即可
margin实现等高布局
给子元素添加padding-bottom：9999px，使子元素的高度无限增高，但是父元素的高度也会被撑高。再使用margin-bottom：-9999px，使父元素的高度回归正常。然后其中一个元素的高度变化就会导致父元素的高度改变，两者的背景色就都展现了
如果项目不需要兼容ie6、7推荐使用table布局实现等高布局
border相关
border-color和color
默认border的颜色就是字体的颜色，所以如果想要边框和字体一起改变，那就直接设置字体颜色即可。默认就不要设置边框颜色。
border扩大点击区域
使用透明边框扩大点击区域，也可以使用padding，但是如果使用的精灵图定位，改变padding会导致定位不准
border绘制三角形
使用边框的宽度，配合透明颜色
width: 0;
margin: 20px;
border: 10px solid;
border-color: transparent transparent transparent skyblue;
max/min-height/width 超越 !important
max/min 属性会覆盖元素的高度和宽度，这个覆盖比!important的权重还要高
使用line-height和vertical-align实现多行文字垂直居中和图片垂直居中
使用line-height控制幽灵空白元素高度，使用vertical-align对齐。如果幽灵空白元素太小，vertical-align则不起作用

父级元素行高和高度一样，子元素设置inline-block，vertical-align: middle; 再将自己的line-height重写为正常高度即可

使用vertical-align实现水平垂直居中弹框
<div class="container">
  <div class="dialog"></div>
</div>
<style>
.container {
    position: fixed;
    top: 0;right: 0;left: 0;bottom: 0;
    background-color: rgba(0, 0, 0, .4);
    font-size: 0;
    white-space: nowrap;
    overflow: auto;
    &:after {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
    .dialog {
        display: inline-block;
        vertical-align: middle;
        text-align-last: left;
        font-size: 14px;
        white-space: noraml;
    }
}
</style>
使用letter-spacing消除换行空白字符
父元素letter-spacing设为-1em，子元素重置为0即可。letter-spacing负值不会导致inline-block元素重叠。
text-align： justify
ie无法使中文两端对齐，可以使用ie私有属性：text-justify:inter-ideograph
justify想要生效需要两点：1.要有分隔符。 2.要超过一行，非最后一行才会两端对齐，可以使用伪元素来实现最后一行