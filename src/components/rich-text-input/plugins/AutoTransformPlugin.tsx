'use client';

import { useEffect } from 'react';

import { $createLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_SPACE_COMMAND,
  PASTE_COMMAND,
  TextNode,
} from 'lexical';

import { YouTubeNode } from '../nodes';

const isSafeUrl = (url: string) => /^https?:\/\//i.test(url);

export const AutoTransformPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const extractYouTubeId = (input: string): string | null => {
    const urlMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (urlMatch) return urlMatch[1];

    const iframeMatch = input.match(/youtube\.com\/embed\/([^?"]+)/);
    if (iframeMatch) return iframeMatch[1];

    return null;
  };

  useEffect(() => {
    const unregisterSpace = editor.registerCommand(
      KEY_SPACE_COMMAND,
      () => {
        let transformed = false;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchor = selection.anchor.getNode();
          if (!(anchor instanceof TextNode)) return;

          const text = anchor.getTextContent();
          const markdownMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)$/);
          if (markdownMatch) {
            const [full, label, url] = markdownMatch;
            if (!isSafeUrl(url)) return; // reject javascript: etc.
            const before = text.slice(0, text.length - full.length);

            const linkNode = $createLinkNode(url, { target: '_blank', rel: 'noopener noreferrer' });
            linkNode.append($createTextNode(label));

            anchor.setTextContent(before);
            anchor.insertAfter(linkNode);
            linkNode.insertAfter($createTextNode(' '));
            linkNode.selectNext();
            transformed = true;
            return;
          }

          const urlMatch = text.match(/(?:^|\s)(https?:\/\/[^\s)]+)$/);
          if (!urlMatch) return;

          const url = urlMatch[1];
          const urlStartIndex = text.lastIndexOf(url);
          if (urlStartIndex < 0) return;

          const before = text.slice(0, urlStartIndex);
          const linkNode = $createLinkNode(url, { target: '_blank' });
          linkNode.append($createTextNode(url));

          anchor.setTextContent(before);
          anchor.insertAfter(linkNode);
          linkNode.insertAfter($createTextNode(' '));
          linkNode.selectNext();
          transformed = true;
        });

        return transformed;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterPaste = editor.registerCommand(
      PASTE_COMMAND,
      (e: ClipboardEvent) => {
        const text = e.clipboardData?.getData('text/plain') ?? '';
        const videoId = extractYouTubeId(text);
        if (!videoId) return false;

        e.preventDefault();
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchor = selection.anchor.getNode();
          const topLevel = anchor.getKey() === 'root' ? $getRoot() : anchor.getTopLevelElementOrThrow();
          const youtubeNode = new YouTubeNode(videoId);
          const paragraph = $createParagraphNode();

          if (topLevel.getKey() === 'root') {
            topLevel.append(youtubeNode, paragraph);
            paragraph.select();
            return;
          }

          topLevel.insertAfter(youtubeNode);
          youtubeNode.insertAfter(paragraph);
          paragraph.select();
        });

        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregisterSpace();
      unregisterPaste();
    };
  }, [editor]);

  return null;
};
