/**
 * 微信公众号的 blockquote 元素存在长度限制（超过约 300 字后内容会被截断或无法保存），
 * 因此在复制富文本之前，需要把已经内联好样式的 blockquote 元素替换为 section 元素，
 * 保留其全部属性（含 style 内联样式），仅替换标签名。
 *
 * 注意：该转换只能在【内联样式完成之后】执行，否则 juice 无法再通过 blockquote 选择器命中元素。
 */

// 匹配 blockquote 开始标签，属性值中可能出现 '>'，因此需要跳过引号包裹的内容
const OPEN_TAG_REGEX = /<blockquote((?:\s(?:"[^"]*"|'[^']*'|[^>"'])*)?)\/?>/gi;
// 匹配 blockquote 结束标签
const CLOSE_TAG_REGEX = /<\/blockquote\s*>/gi;

/**
 * 将 HTML 字符串中的 blockquote 元素替换为同属性的 section 元素
 * @param html 已完成样式内联的 HTML 字符串
 * @returns 替换后的 HTML 字符串
 */
export const blockquoteToSection = (html: string): string => {
  if (!html) {
    return html;
  }
  return html
    .replace(OPEN_TAG_REGEX, (match, attributes) => `<section${attributes || ''}>`)
    .replace(CLOSE_TAG_REGEX, '</section>');
};

/*
 * 微信公众号代码块的排版处理。
 *
 * 公众号的富文本编辑器在保存草稿时会折叠代码块里的换行符，而且并不保证采纳
 * white-space（只靠 CSS 时代码块仍会被折行），所以这里不依赖任何 CSS 属性：
 *   1. 换行符 → <br/> 标签（元素是不会被折叠的）
 *   2. 空格 → &nbsp;（不换行空格在任何 white-space 取值下都能保住缩进，且不产生折行点）
 *   3. code 设为 display: -webkit-box，并把代码包成唯一的块级子元素：
 *      作为 flex item，它的自动最小尺寸等于内容宽度，不会被压缩折行，
 *      父级的 overflow-x 才能真正横向滚动。
 *
 * 这套处理与博客后端导出到公众号的实现保持一致
 * （见 potatofield-backend 的 app/utils/html/code_block_to_wechat.js）。
 * 同 blockquoteToSection 一样，只能在【内联样式完成之后】执行。
 */

// 匹配整个 pre 元素（pre 不允许嵌套，非贪婪匹配到最近的闭合标签即可）
const PRE_BLOCK_REGEX = /<pre((?:\s(?:"[^"]*"|'[^']*'|[^>"'])*)?)\/?>([\s\S]*?)<\/pre\s*>/gi;
// pre 内的 code 元素
const CODE_BLOCK_REGEX = /(<code(?:\s(?:"[^"]*"|'[^']*'|[^>"'])*)?>)([\s\S]*?)(<\/code\s*>)/i;
// 把一段 HTML 切分成标签与文本节点，属性值里可能出现 '>'，因此要跳过引号包裹的内容
const TOKEN_REGEX = /<(?:[^>"']|"[^"]*"|'[^']*')*>|[^<]+/g;
// 代码块末尾通常带一个换行，转换后会残留多余的空行
const TRAILING_BR_BEFORE_CODE_REGEX = /(?:<br\s*\/?>[\s\r\n]*)+(<\/code>[\s\r\n]*)$/i;
const TRAILING_BR_REGEX = /(?:<br\s*\/?>[\s\r\n]*)+$/i;

// 追加到 pre / code 上的样式：放在已有声明之后，因此可以覆盖主题里的同名属性
const PRE_STYLE = 'overflow-x: auto; white-space: nowrap';
const CODE_STYLE =
  'display: -webkit-box; overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; text-indent: 0; word-break: keep-all';

/** 转换单行：制表符统一为 4 个空格，再把所有空格换成 &nbsp; */
const convertLine = (line: string): string => line.replace(/\t/g, '    ').replace(/ /g, '&nbsp;');

/** 在标签上追加内联样式声明，已有 style 属性时追加到末尾（后写者优先） */
const appendStyle = (tag: string, declarations: string): string => {
  if (/style="[^"]*"/.test(tag)) {
    // 去掉原有声明末尾的分号，避免出现 ;;
    return tag.replace(
      /style="([^"]*)"/,
      (_match, value) => `style="${value.replace(/;\s*$/, '')};${declarations}"`,
    );
  }
  return tag.replace(/>$/, ` style="${declarations}">`);
};

const removeTrailingBreaks = (html: string): string =>
  html.replace(TRAILING_BR_BEFORE_CODE_REGEX, '$1').replace(TRAILING_BR_REGEX, '');

/**
 * 把代码整体包进唯一一个块级 span。
 * code 是 display: -webkit-box 的 flex 容器，必须只有一项；否则高亮产生的
 * 多个 span 与 <br> 会作为并列的 flex item 被部分 WebKit 横向排列，行序就乱了。
 */
const wrapSingleBlockChild = (inner: string): string => {
  if (!CODE_BLOCK_REGEX.test(inner)) {
    return `<span style="display:block">${inner}</span>`;
  }
  return inner.replace(
    CODE_BLOCK_REGEX,
    (_match, openTag: string, content: string, closeTag: string) =>
      `${appendStyle(openTag, CODE_STYLE)}<span style="display:block">${content}</span>${closeTag}`,
  );
};

/**
 * 将 HTML 中的代码块转换为微信公众号可正确渲染的形式
 * @param html 已完成样式内联的 HTML 字符串
 * @returns 转换后的 HTML 字符串
 */
export const codeBlockToWechat = (html: string): string => {
  if (!html) {
    return html;
  }
  return html.replace(PRE_BLOCK_REGEX, (_match, attributes: string, inner: string) => {
    const convertedInner = removeTrailingBreaks(
      inner.replace(TOKEN_REGEX, (token: string) => {
        if (token.startsWith('<')) {
          return token;
        }
        return token
          .split(/\r\n|\n|\r/)
          .map((line, index) => {
            const convertedLine = convertLine(line);
            return index === 0 ? convertedLine : `<br/>${convertedLine}`;
          })
          .join('');
      }),
    );
    return `${appendStyle(`<pre${attributes || ''}>`, PRE_STYLE)}${wrapSingleBlockChild(
      convertedInner,
    )}</pre>`;
  });
};

export default { blockquoteToSection, codeBlockToWechat };
