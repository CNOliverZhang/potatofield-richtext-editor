import QrCode from '@/assets/images/example-markdown/qr-code.png';
import Gallery1 from '@/assets/images/example-markdown/gallery-1.webp';
import Gallery2 from '@/assets/images/example-markdown/gallery-2.webp';
import Gallery3 from '@/assets/images/example-markdown/gallery-3.webp';
import Gallery4 from '@/assets/images/example-markdown/gallery-4.webp';

export default `
# 洋芋田富文本编辑器

洋芋田富文本编辑器是一款支持多种编辑模式且可以自定义样式的富文本编辑器，对技术型和非技术型内容创作者都提供友好而强大的编辑和自定义功能，且针对自媒体平台（如微信公众号等）的内容编辑和样式排版有针对性优化。

## 主要特性

1. 支持多种编辑模式，有一定信息技术基础的用户可以使用 markdown 模式编辑，普通用户可以使用所见即所得模式编辑。
2. 支持直接输入 HTML 代码以产生更具有个性化的富文本内容和效果。
3. 提供丰富的预设样式可供选择，并支持用户使用 CSS 自定义富文本的显示效果和导出样式。
4. 除支持富文本编辑的基础功能外，还添加了能提升易用性以及针对自媒体平台的扩展功能和组件。

## Markdown 语法支持

洋芋田富文本编辑器支持 Common Mark 规范的语法。

### 各级标题和正文

支持一到六级标题和正文。

> # 一级标题
> ## 二级标题
> ### 三级标题
> #### 四级标题
> ##### 五级标题
> ###### 六级标题
> 正文

### 分割线

支持添加分割线。

---

### 加粗

支持将文本**加粗**。

### 斜体

支持使用*斜体*。

### 粗斜体

粗体和斜体支持叠加使用，表现为***粗斜体***。

### 图片

支持插入图片。

![二维码](${QrCode})

### 超链接

支持加入[超链接](https://www.potatofield.cn)。

> 请注意，超链接在第三方自媒体平台支持可能受限。详情请参阅第三方自媒体平台的文档或说明。

### 行内代码

支持在行内插入代码内容，例如 \`Hello world\`。

### 代码块

支持插入代码块。

\`\`\`javascript
console.log('Hello world!');
\`\`\`

### 引用区块

> 支持引用区块，表现为独立的一块内容；区块内支持嵌套任意其他内容。
>
> ### 例如可以插入标题
>
> 也可以插入图片：
>
> ![二维码](${QrCode})

### 有序列表

1. 支持插入有序列表。
2. 也支持有序列表的嵌套：
    1. 这是嵌套列表第一项；
    2. 这是嵌套列表第二项。
3. 还支持与无序列表的嵌套：
    - 这是嵌套列表第一项；
    - 这是嵌套列表第二项。

### 无序列表

- 支持插入无序列表。
- 也支持无序列表的嵌套：
    - 这是嵌套列表第一项；
    - 这是嵌套列表第二项。
- 还支持与有序列表的嵌套：
    1. 这是嵌套列表第一项；
    2. 这是嵌套列表第二项。

## 扩展能力和组件支持

作为一款对自媒体平台内容编辑的应用场景特别优化且目标用户包含非技术型创作者的富文本编辑器，洋芋田富文本编辑器除基本的编辑能力外，还提供了一些能够提升易用性或特别适配自媒体平台的扩展能力和组件。

### 图片上传功能

与一般的 markdown 编辑器不同，支持配置第三方图床服务，可以便捷地完成图片上传和插入功能。

### 便捷复制

支持将带有样式的富文本一键复制，可以便捷地粘贴到自媒体平台的编辑器中，并保持排版和样式的一致性。

### 画廊组件

支持插入“画廊”组件，展示多张图片时在自媒体平台有较好的视觉效果和体验。

<div class="gallery-wrapper">
  <div class="gallery">
    <div class="gallery-image-wrapper">
      <img class="gallery-image" src=${Gallery1} />
    </div>
    <div class="gallery-image-wrapper">
      <img class="gallery-image" src=${Gallery2} />
    </div>
    <div class="gallery-image-wrapper">
      <img class="gallery-image" src=${Gallery3} />
    </div>
    <div class="gallery-image-wrapper">
      <img class="gallery-image" src=${Gallery4} />
    </div>
  </div>
</div>
`;
