import { DecoratorNode, DOMConversionMap, DOMExportOutput, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { JSX } from 'react';

type SerializedYouTubeNode = Spread<{ videoId: string }, SerializedLexicalNode>;

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?"]+)/;

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __videoId: string;

  static getType() {
    return 'youtube';
  }

  static clone(node: YouTubeNode) {
    return new YouTubeNode(node.__videoId, node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode) => {
        if (!(domNode instanceof HTMLIFrameElement)) return null;

        const match = (domNode.getAttribute('src') ?? '').match(YOUTUBE_REGEX);
        if (!match) return null;

        return {
          conversion: () => ({ node: new YouTubeNode(match[1]) }),
          priority: 2,
        };
      },
      div: (domNode) => {
        if (!(domNode instanceof HTMLDivElement)) return null;

        const videoId = domNode.dataset.youtubeId;
        if (!videoId) return null;

        return {
          conversion: () => ({ node: new YouTubeNode(videoId) }),
          priority: 1,
        };
      },
    };
  }

  constructor(videoId: string, key?: NodeKey) {
    super(key);
    this.__videoId = videoId;
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }

  static importJSON(data: SerializedYouTubeNode) {
    return new YouTubeNode(data.videoId);
  }

  exportJSON(): SerializedYouTubeNode {
    return { ...super.exportJSON(), type: 'youtube', videoId: this.__videoId };
  }

  exportDOM(): DOMExportOutput {
    const container = document.createElement('div');
    container.setAttribute('data-youtube-id', this.__videoId);
    container.className = 'relative w-full aspect-video my-4 rounded-lg overflow-hidden border border-border';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${this.__videoId}`;
    iframe.className = 'w-full h-full';
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = 'YouTube video';

    container.appendChild(iframe);

    return { element: container };
  }

  decorate() {
    return (
      <div className="relative w-full aspect-video my-4 rounded-lg overflow-hidden border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${this.__videoId}`}
          className="w-full h-full"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    );
  }
}
