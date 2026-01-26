import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AlertService } from '@services';
import { Subscription } from 'rxjs';
import { Message } from '@models';

@Component({
  selector: 'rd-alert',
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class AlertComponent implements OnInit, OnDestroy {
  private readonly alertService = inject(AlertService);
  private subscription?: Subscription;

  message = signal<Message | undefined>(undefined);

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe((message?: Message) => {
      this.message.set(message);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
