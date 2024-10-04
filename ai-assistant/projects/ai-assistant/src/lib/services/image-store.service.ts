import {Injectable} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {QuestionImageMap} from '../types/image-maps.types';

@Injectable()
export class ImageStoreService {
  private _imageMap: QuestionImageMap = {};

  constructor() {}

  setMap(map: QuestionImageMap): void {
    this._imageMap = map;
  }

  getMap(): QuestionImageMap {
    return this._imageMap;
  }

  removeMap(): void {
    this._imageMap = {};
  }

  ensureQuestionEntry(questionNum: number): void {
    if (!(questionNum in this._imageMap)) {
      this._imageMap[questionNum] = {};
    }
  }

  updateImage(
    questionNum: number,
    imageNum: number,
    fileKey: string,
    safeUrl: SafeUrl,
  ): void {
    this.ensureQuestionEntry(questionNum);
    this._imageMap[questionNum][imageNum] = {fileKey, safeUrl};
  }

  getImagesOfQuestion(
    questionNum: number,
  ): {imageNum: number; fileKey: string; safeUrl: SafeUrl}[] {
    const imageDetails = this._imageMap[questionNum] ?? {};

    return Object.keys(imageDetails).map(key => {
      const parsedKey = parseInt(key);
      const {fileKey, safeUrl} = imageDetails[parsedKey];

      return {
        imageNum: parsedKey,
        fileKey,
        safeUrl,
      };
    });
  }
}
