import { $isLineBreakNode, $isParagraphNode, LexicalNode } from 'lexical';

export const isEmptyParagraph = (node: LexicalNode) =>
  $isParagraphNode(node) &&
  node.getTextContent().trim() === '' &&
  node.getChildren().every((child) => $isLineBreakNode(child));

export const cleanHtml = (html: string) =>
  html
    // Unwrap YouTube embeds from <p> tags
    .replace(/<p([^>]*)>\s*(<div[^>]*data-youtube-id[^>]*>[\s\S]*?<\/div>)\s*([\s\S]*?)<\/p>/gi, '$2<p$1>$3</p>')
    // Remove trailing empty paragraphs
    .replace(/(?:<p\b[^>]*>\s*(?:<br\s*\/?>)?\s*<\/p>\s*)+$/gi, '')
    // Remove empty paragraphs after block elements
    .replace(/(<\/(?:div|iframe|ul|ol|blockquote|h[1-6])>)\s*<p\b[^>]*>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, '$1')
    .replace(/&nbsp;/gi, ' ')
    .trim();

export const isHtmlEmpty = (cleanedHtml: string) => {
  if (/(?:iframe|img|data-youtube-id)/i.test(cleanedHtml)) return false;

  return cleanedHtml.replace(/<[^>]+>/g, '').trim() === '';
};
