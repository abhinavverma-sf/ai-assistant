import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AnyObject} from '../interfaces/streamed-response.interface';

@Injectable()
export class DeepChatCommsService {
  private readonly _eventSubject = new Subject<{
    event: string;
    additionalParams: AnyObject;
  }>();

  private readonly _scrollEventSubject = new Subject<boolean>();
  private readonly _scrollVideoPosition = new Subject<number>();

  trigger(event: string, additionalParams = {}) {
    this._eventSubject.next({event, additionalParams});
  }

  receiveTrigger(): Observable<AnyObject> {
    return this._eventSubject.asObservable();
  }

  setProgrammaticScroll() {
    this._scrollEventSubject.next(true);
  }

  onProgrammaticScroll(): Observable<boolean> {
    return this._scrollEventSubject.asObservable();
  }

  triggerVideoScrollPosition(scrollPosition: number) {
    this._scrollVideoPosition.next(scrollPosition);
  }

  onVideoScrollPosition(): Observable<number> {
    return this._scrollVideoPosition.asObservable();
  }
}
