import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '@models';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private message = new Subject<Message | undefined>();

  success(text: string) {
    this.message.next({ type: 'success', text });
  }

  error(text: string) {
    this.message.next({ type: 'error', text });
  }

  info(text: string) {
    this.message.next({ type: 'info', text });
  }

  getMessage(): Observable<Message | undefined> {
    return this.message.asObservable();
  }
}
