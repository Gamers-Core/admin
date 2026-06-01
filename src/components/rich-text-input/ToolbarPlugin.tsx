'use client';

import { Editor } from '@tiptap/react';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  UndoIcon,
  RedoIcon,
  TextIndentMoreIcon,
  TextIndentLessIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyCenterIcon,
} from '@hugeicons/core-free-icons';

import {
  Button,
  ButtonProps,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@/components';
import { cn } from '@/lib/utils';

interface Props {
  editor: Editor | null;
}

export const ToolbarPlugin = ({ editor }: Props) => {
  if (!editor) return <div className="h-10 border-b border-border bg-muted/30 rounded-t-md" />;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30 backdrop-blur-lg rounded-t-md">
      <ToolbarButton
        icon={UndoIcon}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        isDisabled={!editor.can().undo()}
      />
      <ToolbarButton
        icon={RedoIcon}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        isDisabled={!editor.can().redo()}
      />

      <Separator orientation="vertical" className="h-5 my-auto mx-0.5" />

      <Select value={getBlockType(editor)} onValueChange={(value) => applyBlockType(editor, value)}>
        <SelectTrigger
          onMouseDown={(e) => e.preventDefault()}
          className="h-7 text-xs rounded-md border border-input bg-background px-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring min-w-24"
        >
          <SelectValue placeholder="Normal" />
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            {BLOCK_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value} className="text-sm">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-5 my-auto mx-0.5" />

      <ToolbarButton
        icon={TextBoldIcon}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      />
      <ToolbarButton
        icon={TextItalicIcon}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      />
      <ToolbarButton
        icon={TextUnderlineIcon}
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
      />
      <ToolbarButton
        icon={TextStrikethroughIcon}
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      />

      <Separator orientation="vertical" className="h-5 my-auto mx-0.5" />

      <ToolbarButton
        icon={TextAlignLeftIcon}
        label="Align Left"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
      />
      <ToolbarButton
        icon={TextAlignCenterIcon}
        label="Align Center"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
      />
      <ToolbarButton
        icon={TextAlignRightIcon}
        label="Align Right"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
      />
      <ToolbarButton
        icon={TextAlignJustifyCenterIcon}
        label="Justify"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
      />

      <Separator orientation="vertical" className="h-5 my-auto mx-0.5" />

      <ToolbarButton
        icon={TextIndentMoreIcon}
        label="Indent"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        isDisabled={!editor.can().sinkListItem('listItem')}
      />
      <ToolbarButton
        icon={TextIndentLessIcon}
        label="Outdent"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        isDisabled={!editor.can().liftListItem('listItem')}
      />
    </div>
  );
};

interface ToolbarButtonProps extends Omit<ButtonProps, 'icon' | 'onClick'> {
  icon: IconSvgElement;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ToolbarButton = ({ icon, label, isActive, isDisabled, onClick, ...props }: ToolbarButtonProps) => (
  <Button
    {...props}
    variant="ghost"
    title={label}
    aria-label={label}
    isDisabled={isDisabled}
    onMouseDown={(e: React.MouseEvent) => {
      e.preventDefault();
      if (isDisabled) return;

      onClick?.();
    }}
    icon={<HugeiconsIcon icon={icon} className="size-4" />}
    className={cn('size-7 transition-colors', { 'bg-accent text-accent-foreground': isActive })}
  />
);

const getBlockType = (editor: Editor): string => {
  if (editor.isActive('heading', { level: 1 })) return 'h1';
  if (editor.isActive('heading', { level: 2 })) return 'h2';
  if (editor.isActive('heading', { level: 3 })) return 'h3';
  if (editor.isActive('heading', { level: 4 })) return 'h4';
  if (editor.isActive('blockquote')) return 'quote';
  if (editor.isActive('bulletList')) return 'bullet';
  if (editor.isActive('orderedList')) return 'number';
  return 'paragraph';
};

const applyBlockType = (editor: Editor, value: string) => {
  const chain = editor.chain().focus();
  switch (value) {
    case 'h1':
      return chain.toggleHeading({ level: 1 }).run();
    case 'h2':
      return chain.toggleHeading({ level: 2 }).run();
    case 'h3':
      return chain.toggleHeading({ level: 3 }).run();
    case 'h4':
      return chain.toggleHeading({ level: 4 }).run();
    case 'quote':
      return chain.toggleBlockquote().run();
    case 'bullet':
      return chain.toggleBulletList().run();
    case 'number':
      return chain.toggleOrderedList().run();
    default:
      return chain.setParagraph().run();
  }
};

const BLOCK_OPTIONS = [
  { label: 'Normal', value: 'paragraph' },
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'Quote', value: 'quote' },
  { label: '• Bullet', value: 'bullet' },
  { label: '1. Number', value: 'number' },
];
