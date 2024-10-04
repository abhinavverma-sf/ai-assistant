import {ChunkData, ChunkTypes} from '../types/chunk-response.types';

export interface IStreamedResponse {
  chunk: ChunkData;
  type: ChunkTypes;
}

export interface AnyObject {
  [property: string]: any;
}
