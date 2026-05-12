'use client';

import { useEffect } from 'react';

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot, $insertNodes } from 'lexical';

interface InitialValuePluginProps {
  value: string;
}

export const InitialValuePlugin = ({ value }: InitialValuePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const currentHtml = editor.getEditorState().read(() => $generateHtmlFromNodes(editor));
    if (currentHtml === value) return;
    editor.update(() => {
      const root = $getRoot();
      if (!value) {
        root.clear();
        root.append($createParagraphNode());
        return;
      }

      const parser = new DOMParser();
      const dom = parser.parseFromString(value, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      root.select();
      if (nodes.length === 0) {
        root.append($createParagraphNode());
        return;
      }

      $insertNodes(nodes);
    });
  }, [editor, value]);

  return null;
};
