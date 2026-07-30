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

export default { blockquoteToSection };
