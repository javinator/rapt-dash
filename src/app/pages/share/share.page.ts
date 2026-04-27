import { Component, inject, OnInit, signal } from '@angular/core';
import { DetailsComponent, SpinnerComponent } from '@components';
import { ApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { SharedSession } from '../../models/shared-session.model';

@Component({
  selector: 'dashboard',
  templateUrl: './share.page.html',
  styleUrl: './share.page.scss',
  imports: [SpinnerComponent, MatIconModule, DetailsComponent],
  standalone: true,
})
export class SharePage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  loading = signal(true);
  session = signal<SharedSession | undefined>(undefined);

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    const share = this.router.url.split('/').at(-1) || '';
    firstValueFrom(this.apiService.getSharedSession(share))
      .then((session) => {
        this.session.set(session);
        setTimeout(() => this.loading.set(false), 200);
      })
      .finally(() => setTimeout(() => this.loading.set(false), 500));
  }
}
