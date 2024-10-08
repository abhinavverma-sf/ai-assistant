import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CustomEventSource} from 'extended-eventsource';
import {Qna} from '../models';

@Injectable()
export class SseService {
  private eventSource: CustomEventSource;

  connectToSse(qna: Qna, sseUrl: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>(observer => {
      this.eventSource = new CustomEventSource(sseUrl, {
        headers: {
          /** add yout headers here */
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          prompt: qna.prompt,
          previousQuestion: qna.previousQuestion,
          previousResponse: qna.previousResponse,
        }),
      });

      this.eventSource.onmessage = event => {
        if (event.data) {
          observer.next(event);
        }
      };

      this.eventSource.onerror = error => {
        observer.error('EventSource failed: ' + JSON.stringify(error));
      };

      return () => {
        this.eventSource.close();
      };
    });
  }

  closeSseConnection(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
