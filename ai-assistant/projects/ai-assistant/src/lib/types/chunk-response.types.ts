import {IRelatedTopic} from '../interfaces/related-topic.interface';

export type ChunkData = string | IRelatedTopic[];
export type ChunkTypes =
  | 'start'
  | 'end'
  | 'related_topic'
  | 'feature'
  | 'NA'
  | 'image'
  | 'video'
  | 'qna';
