'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState, LexicalEditor, $getRoot } from 'lexical';
import { LinkNode } from '@lexical/link';

import { cn } from '@/lib/utils';
import { defaultLocale, localeDir } from '@/api';

import { AutoTransformPlugin, InitialValuePlugin, ToolbarPlugin } from './plugins';
import { YouTubeNode } from './nodes';

export interface RichTextInputProps {
  id?: string;
  dir?: 'ltr' | 'rtl';
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextInput = ({
  id,
  dir = localeDir[defaultLocale],
  value = '',
  onChange,
  placeholder,
  className,
}: RichTextInputProps) => {
  const isHtmlEffectivelyEmpty = (html: string) => {
    const trimmed = html.trim();
    if (!trimmed) return true;

    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, 'text/html');

    const hasMeaningfulNode = (node: ChildNode): boolean => {
      if (node.nodeType === 3) return Boolean(node.textContent?.trim());
      if (node.nodeType !== 1) return false;

      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (tag === 'br') return false;
      if (tag === 'p') return Array.from(element.childNodes).some(hasMeaningfulNode);

      if (element.textContent && element.textContent.trim()) return true;

      return Array.from(element.childNodes).some(hasMeaningfulNode);
    };

    return !Array.from(doc.body.childNodes).some(hasMeaningfulNode);
  };

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const root = $getRoot();
      const html = $generateHtmlFromNodes(editor);
      const isEmpty = root.getTextContent().trim() === '' && isHtmlEffectivelyEmpty(html);
      const nextValue = isEmpty ? '' : html;
      onChange?.(nextValue);
    });
  };

  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'RichText',
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, YouTubeNode],
        onError: console.error,
        theme: {
          paragraph: 'mb-1 text-base leading-relaxed',
          heading: {
            h1: 'text-3xl font-bold mb-3 mt-4',
            h2: 'text-2xl font-bold mb-2 mt-3',
            h3: 'text-xl font-semibold mb-2 mt-3',
            h4: 'text-lg font-semibold mb-1 mt-2',
          },
          list: {
            ul: 'list-disc list-inside mb-2 space-y-1',
            ol: 'list-decimal list-inside mb-2 space-y-1',
            listitem: 'ml-4',
          },
          link: 'text-primary underline cursor-pointer hover:text-primary/80',
          text: {
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
            strikethrough: 'line-through',
          },
          quote: 'border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-2',
        },
      }}
    >
      <div
        className={cn(
          'w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className,
        )}
      >
        <ToolbarPlugin dir={dir} />
        <div className="relative px-3 py-2">
          <RichTextPlugin
            contentEditable={<ContentEditable id={id} className="min-h-40 outline-none text-base leading-relaxed" />}
            placeholder={
              <div className="pointer-events-none absolute top-2 left-3 text-muted-foreground text-base">
                {placeholder ?? 'Enter text...'}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <TabIndentationPlugin />
      <AutoTransformPlugin />
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
      <InitialValuePlugin value={value} />
    </LexicalComposer>
  );
};
