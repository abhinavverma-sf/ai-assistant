import {Injectable} from '@angular/core';
// import {environment} from '@rao/env/environment';
import {Observable} from 'rxjs';
const {EventSource} = require('extended-eventsource');
// import {UserSessionStoreService} from '@rao/core/store';
import {Qna} from '../models';

@Injectable()
export class SseService {
  private eventSource: EventSource;

  // constructor(private readonly userSessionStore: UserSessionStoreService) {}

  connectToSse(qna: Qna): Observable<MessageEvent> {
    return new Observable<MessageEvent>(observer => {
      this.eventSource = new EventSource(
        // `${environment.projectMgtApiUrl}/qna`,
        {
          headers: {
            // 'X-Auth-Token': `Bearer ${this.userSessionStore.getAccessToken()}`,
            Authorization: `Bearer ${window['keycloakService']._instance.token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            prompt: qna.prompt,
            previousQuestion: qna.previousQuestion,
            previousResponse: qna.previousResponse,
          }),
        },
      );

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
