export const themes = [
  {
    id: 'default',
    name: '默认主题',
    description: '内置默认主题。',
    styleSheet: `
h1 {
  font-family: initial;
  font-size: 30px;
  padding: 0.25em;
  background: #2196f3;
  color: #fff;
  font-weight: bold;
  width: fit-content;
  margin: 1em 0;
}

h1:first-child {
  margin-top: 0;
}

h1:last-child {
  margin-bottom: 0;
}

h2 {
  font-family: initial;
  font-size: 27px;
  font-weight: bold;
  padding-left: 0.3em;
  border-left: 0.3em #2196f3 solid;
  margin: 1em 0;
}

h2:first-child {
  margin-top: 0;
}

h2:last-child {
  margin-bottom: 0;
}

h3 {
  font-family: initial;
  font-size: 24px;
  font-weight: bold;
  width: fit-content;
  margin: 1em 0;
  background-size: 100% 1.6em;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: linear-gradient(to bottom, transparent 60%, #2196f3 40%);
}

h3:first-child {
  margin-top: 0;
}

h3:last-child {
  margin-bottom: 0;
}

h4 {
  font-family: initial;
  font-size: 21px;
  font-weight: bold;
  margin: 1em 0;
}

h4:first-child {
  margin-top: 0;
}

h4:last-child {
  margin-bottom: 0;
}

h5 {
  font-family: initial;
  font-size: 18px;
  font-weight: bold;
  margin: 1em 0;
}

h5:first-child {
  margin-top: 0;
}

h5:last-child {
  margin-bottom: 0;
}

h6 {
  font-family: initial;
  font-size: 15px;
  font-weight: bold;
  margin: 1em 0;
}

h6:first-child {
  margin-top: 0;
}

h6:last-child {
  margin-bottom: 0;
}

p {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 1em 0;
}

p:first-child {
  margin-top: 0;
}

p:last-child {
  margin-bottom: 0;
}

a {
  text-decoration: none;
  color: #2196f3;
}

a::before {
  content: #;
}

strong {
  color: #2196f3;
}

li {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 0.5em 0;
}

hr {
  border-color: #2196f3;
}

:not(pre) code {
  line-break: break-word;
  padding: 0.2em 0.4em;
  font-size: 85%;
  border-radius: 0.2em;
  background-color: rgba(33, 150, 243, 0.1);
}

pre {
  border-radius: 8px;
  font-size: 15px;
  margin: 1em 0;
}

pre:first-child {
  margin-top: 0;
}

pre:last-child {
  margin-bottom: 0;
}

blockquote {
  padding: 15px;
  background: rgba(33, 150, 243, 0.1);
  margin: 0;
  border-left: 4px #2196f3 solid;
  margin: 15px 0;
}

blockquote:first-child {
  margin-top: 0;
}

blockquote:last-child {
  margin-bottom: 0;
}

img {
  display: block;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 50%);
  margin: 15px 0;
}

img:first-child {
  margin-top: 0;
}

img:last-child {
  margin-bottom: 0;
}

.gallery img {
  border-radius: 0;
  box-shadow: none;
}
    `,
  },
];

export const baseStyleSheet = `
img {
  max-width: 100%;
}

pre code {
  overflow-x: auto;
}

.gallery-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.gallery {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  font-size: 0;
  border-radius: 8px;
  background: #121212;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.gallery-image-wrapper {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
}

.gallery-image-wrapper:not(:first-child) {
  margin-left: 8px;
}

.gallery-image-wrapper:not(:last-child) {
  margin-right: 8px;
}

.gallery-image {
  width: 100%;
}
`;

export const styleSheetTemplate = `
/* 请在此自定义一级标题的样式 */
h1 {
  
}

/* 请在此自定义二级标题的样式 */

h2 {
  
}

/* 请在此自定义三级标题的样式 */

h3 {
  
}

/* 请在此自定义四级标题的样式 */

h4 {
  
}

/* 请在此自定义五级标题的样式 */

h5 {
  
}

/* 请在此自定义六级标题的样式 */

h6 {
  
}

/* 请在此自定义正文的样式 */

p {
  
}

/* 请在此自定义链接的样式 */

a {
  
}

/* 请在此自定义粗体的样式 */

strong {
  
}

/* 请在此自定义无序列表的样式 */

ul {
  
}

/* 请在此自定义有序列表的样式 */

ol {
  
}

/* 请在此自定义列表项的样式 */

li {
  
}

/* 请在此自定义分割线的样式 */

hr {
  
}

/* 请在此自定义行内代码的样式 */

:not(pre) code {
  
}

/* 请在此自定义代码块的样式 */

pre {
  
}

/* 请在此自定义引用区块的样式 */

blockquote {
  
}

/* 请在此自定义图片的样式 */

img {
  
}

/**
 * 您也可以针对上列元素伟类、伪元素或多种元素的组合自行编写 CSS 样式
 */

/**
 * 下列代码是图片、代码块和画廊组件的基础样式代码，您可以在此基础上添加样式属性进行扩展
 * 但为了保证基本显示效果正常，不建议您修改这部分已有的样式属性代码
 * 如果您确定要修改图片、代码块和画廊的基本样式，直接在此修改即可覆盖内置样式
 * 如果您不需要自定义图片、代码块和画廊的样式，删除下列代码即可，内置样式能够保证基本效果的正常显示
 */

img {
  max-width: 100%;
}

pre code {
  overflow-x: auto;
}

.gallery-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.gallery {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  font-size: 0;
  border-radius: 8px;
  background: #121212;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.gallery-image-wrapper {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
}

.gallery-image-wrapper:not(:first-child) {
  margin-left: 8px;
}

.gallery-image-wrapper:not(:last-child) {
  margin-right: 8px;
}

.gallery-image {
  width: 100%;
}
`;
