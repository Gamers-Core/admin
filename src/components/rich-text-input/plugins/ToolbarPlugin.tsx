'use client';

import { useEffect, useState } from 'react';
import {
  RedoIcon,
  TextAlignCenterIcon,
  TextAlignJustifyCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextIndentLessIcon,
  TextIndentMoreIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  UndoIcon,
} from '@hugeicons/core-free-icons';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

import { Button } from '@/components';
import { cn } from '@/lib/utils';

type FormatBlockType = HeadingTagType | 'paragraph' | 'quote' | 'bullet' | 'number';

type ToolbarState = {
  canUndo: boolean;
  canRedo: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  blockType: string;
};

interface ToolbarPluginProps {
  dir: 'ltr' | 'rtl';
}

export const ToolbarPlugin = ({ dir }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>(() => ({
    canUndo: false,
    canRedo: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    blockType: 'paragraph',
  }));

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const isBold = selection.hasFormat('bold');
        const isItalic = selection.hasFormat('italic');
        const isUnderline = selection.hasFormat('underline');
        const isStrikethrough = selection.hasFormat('strikethrough');

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        let blockType = element.getType();
        if ($isHeadingNode(element)) blockType = element.getTag();
        else if ($isListNode(element)) blockType = element.getListType();

        setToolbarState((prev) => ({ ...prev, isBold, isItalic, isUnderline, isStrikethrough, blockType }));
      });
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (v) => {
        setToolbarState((prev) => ({ ...prev, canUndo: v }));

        return false;
      },
      1,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (v) => {
        setToolbarState((prev) => ({ ...prev, canRedo: v }));

        return false;
      },
      1,
    );
  }, [editor]);

  useEffect(() => {
    editor.update(() => $getRoot().setDirection(dir));
  }, [dir, editor]);

  const formatBlock = (tag: FormatBlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      switch (tag) {
        case 'paragraph':
          $setBlocksType(selection, () => $createParagraphNode());
          break;

        case 'quote':
          $setBlocksType(selection, () => $createQuoteNode());
          break;

        case 'bullet':
          editor.dispatchCommand(
            toolbarState.blockType === 'bullet' ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
            undefined,
          );
          break;

        case 'number':
          editor.dispatchCommand(
            toolbarState.blockType === 'number' ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
            undefined,
          );
          break;

        default:
          $setBlocksType(selection, () => $createHeadingNode(tag));
          break;
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30 rounded-t-md">
      <ToolbarButton
        icon={UndoIcon}
        label="Undo"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        isDisabled={!toolbarState.canUndo}
      />
      <ToolbarButton
        icon={RedoIcon}
        label="Redo"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        isDisabled={!toolbarState.canRedo}
      />
      <ToolbarSeparator />

      <select
        value={toolbarState.blockType}
        onChange={(e) => {
          setToolbarState((prev) => ({ ...prev, blockType: e.target.value }));
          formatBlock(e.target.value as FormatBlockType);
        }}
        className="h-7 text-xs rounded-md border border-input bg-background px-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {headingOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ToolbarSeparator />

      <ToolbarButton
        icon={TextBoldIcon}
        label="Bold"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        isActive={toolbarState.isBold}
      />
      <ToolbarButton
        icon={TextItalicIcon}
        label="Italic"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        isActive={toolbarState.isItalic}
      />
      <ToolbarButton
        icon={TextUnderlineIcon}
        label="Underline"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        isActive={toolbarState.isUnderline}
      />
      <ToolbarButton
        icon={TextStrikethroughIcon}
        label="Strikethrough"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        isActive={toolbarState.isStrikethrough}
      />
      <ToolbarSeparator />

      <ToolbarButton
        icon={TextAlignLeftIcon}
        label="Align Left"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
      />
      <ToolbarButton
        icon={TextAlignCenterIcon}
        label="Align Center"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
      />
      <ToolbarButton
        icon={TextAlignRightIcon}
        label="Align Right"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
      />
      <ToolbarButton
        icon={TextAlignJustifyCenterIcon}
        label="Justify"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
      />
      <ToolbarSeparator />

      <ToolbarButton
        icon={TextIndentMoreIcon}
        label="Indent"
        onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
      />
      <ToolbarButton
        icon={TextIndentLessIcon}
        label="Outdent"
        onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
      />
    </div>
  );
};

interface ToolbarButtonProps {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

const ToolbarButton = ({ icon, label, isActive, ...props }: ToolbarButtonProps) => (
  <Button
    {...props}
    variant="ghost"
    title={label}
    aria-label={label}
    icon={<HugeiconsIcon icon={icon} className="size-4" />}
    className={cn('size-7 transition-colors', { 'bg-accent text-accent-foreground': isActive })}
  />
);

const ToolbarSeparator = () => <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;

interface SelectOption {
  label: string;
  value: string;
}

const headingOptions: SelectOption[] = [
  { label: 'Normal', value: 'paragraph' },
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'Quote', value: 'quote' },
  { label: '• Bullet', value: 'bullet' },
  { label: '1. Number', value: 'number' },
];
