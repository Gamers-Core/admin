'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';

import { cn } from '@/lib/utils';
import { defaultLocale, Locale } from '@/api';

import { ToolbarPlugin } from './ToolbarPlugin';
import { HTMLRender } from '../HTMLRender';

export interface RichTextInputProps {
  id?: string;
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  locale?: Locale;
}

export const RichTextInput = ({
  id,
  value = '',
  onChange,
  placeholder,
  className,
  locale = defaultLocale,
}: RichTextInputProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ underline: false, link: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'], defaultAlignment: locale === 'ar' ? 'right' : 'left' }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? 'Enter text…' }),
      Youtube.configure({
        nocookie: true,
        allowFullscreen: true,
        addPasteHandler: true,
        ccLanguage: locale,
        HTMLAttributes: {
          style: 'aspect-ratio: 16 / 9; width: 100%; height: auto;',
          class: 'rounded-md border',
        },
      }),
    ],
    content: value,
    editorProps: { attributes: { id: id ?? '', class: 'min-h-40 outline-none text-base leading-relaxed' } },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? '' : editor.getHTML();

      onChange?.(html);
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;

    editor.commands.setContent(value ?? '', { emitUpdate: false });
  }, [value, editor]);

  if (!editor)
    return (
      <div className={cn('w-full rounded-md border border-input bg-background', className)}>
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30 rounded-t-md h-10" />
        <div className="relative px-3 py-2">
          <div className="min-h-40 text-base leading-relaxed">
            {value ? (
              <PlaceholderHTML html={value} />
            ) : (
              <div className="text-muted-foreground">{placeholder ?? 'Enter text...'}</div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        'w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className,
      )}
    >
      <ToolbarPlugin editor={editor} />

      <div className="px-3 py-2 prose prose-sm md:prose-base dark:prose-invert max-w-none prose-li:leading-normal prose-p:mt-0 prose-p:mb-0 prose-ul:mb-0 prose-ul:mt-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const PlaceholderHTML = HTMLRender('RichTextInput Placeholder');
