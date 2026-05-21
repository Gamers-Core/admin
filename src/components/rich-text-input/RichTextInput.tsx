'use client';

import { useState, useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $createParagraphNode, $getRoot, EditorState, LexicalEditor } from 'lexical';
import { LinkNode } from '@lexical/link';

import { cn } from '@/lib/utils';
import { defaultLocale, localeDir } from '@/api';

import { AutoTransformPlugin, ToolbarPlugin } from './plugins';
import { cleanHtml, isHtmlEmpty, isEmptyParagraph } from './helpers';
import { YouTubeNode } from './nodes';
import { HTMLRender } from '../HTMLRender';

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
  const [isMounted, setIsMounted] = useState(false);
  const isInitializingRef = useRef(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    if (isInitializingRef.current) {
      isInitializingRef.current = false;
      return;
    }

    editorState.read(() => {
      const html = cleanHtml($generateHtmlFromNodes(editor));
      onChange?.(isHtmlEmpty(html) ? '' : html);
    });
  };

  const normalizedValue = cleanHtml(value);

  if (!isMounted)
    return (
      <div className={cn('w-full rounded-md border border-input bg-background', className)}>
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30 rounded-t-md h-10" />
        <div className="relative px-3 py-2">
          <div className="min-h-40 text-base leading-relaxed">
            {normalizedValue ? (
              <Placeholder html={normalizedValue} />
            ) : (
              <div className="text-muted-foreground">{placeholder ?? 'Enter text...'}</div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'RichText',
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, YouTubeNode],
        onError: console.error,
        editable: true,
        editorState: (editor) => {
          const root = $getRoot();
          root.clear();

          if (!normalizedValue) return root.append($createParagraphNode());

          const parser = new DOMParser();
          const dom = parser.parseFromString(normalizedValue, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom).filter((node) => !isEmptyParagraph(node));

          if (nodes.length === 0) return root.append($createParagraphNode());

          nodes.forEach((node) => root.append(node));
        },
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
            contentEditable={
              <ContentEditable id={id} className="min-h-40 outline-none text-base leading-relaxed" autoFocus={false} />
            }
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
    </LexicalComposer>
  );
};

const Placeholder = HTMLRender('RichTextInput Placeholder');
