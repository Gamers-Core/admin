import { DecoratorNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { JSX } from 'react';

type SerializedYouTubeNode = Spread<{ videoId: string }, SerializedLexicalNode>;

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __videoId: string;

  static getType() {
    return 'youtube';
  }
  static clone(node: YouTubeNode) {
    return new YouTubeNode(node.__videoId, node.__key);
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
