import {TestBed} from '@angular/core/testing';

import {QuestionImageMap} from '../types/image-maps.types';
import {ImageStoreService} from './image-store.service';
import {Integers} from '../enums/numbers.enum';

describe('ImageStoreService', () => {
  let service: ImageStoreService;
  const questionNum = Integers.One;
  const safeUrl = 'http://example.com/image1.png';
  const fileKey = 'fileKey1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageStoreService],
    });
    service = TestBed.inject(ImageStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get the map correctly', () => {
    const testMap: QuestionImageMap = {
      [Integers.One]: {
        [Integers.One]: {
          fileKey,
          safeUrl,
        },
      },
    };

    service.setMap(testMap);
    expect(service.getMap()).toEqual(testMap);
  });

  it('should remove the map', () => {
    const testMap: QuestionImageMap = {
      [Integers.One]: {
        [Integers.One]: {
          fileKey,
          safeUrl,
        },
      },
    };

    service.setMap(testMap);
    service.removeMap();
    expect(service.getMap()).toEqual({});
  });

  it('should ensure a question entry exists', () => {
    service.ensureQuestionEntry(questionNum);
    expect(service.getMap()).toEqual({
      [questionNum]: {},
    });
  });

  it('should update an image correctly', () => {
    const imageNum = Integers.One;

    service.updateImage(questionNum, imageNum, fileKey, safeUrl);

    const images = service.getImagesOfQuestion(questionNum);
    expect(images).toEqual([{imageNum, fileKey, safeUrl}]);
  });

  it('should get images of a question correctly', () => {
    const imageDetails = {
      1: {fileKey, safeUrl},
    };

    service.setMap({
      [questionNum]: imageDetails,
    });

    const images = service.getImagesOfQuestion(questionNum);
    expect(images).toEqual([
      {
        imageNum: Integers.One,
        fileKey,
        safeUrl,
      },
    ]);
  });
});
