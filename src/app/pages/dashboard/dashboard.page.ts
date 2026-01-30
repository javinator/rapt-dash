import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AlertComponent,
  FermentationGraphComponent,
  SpinnerComponent,
} from '@components';
import { Hydrometer, Message, Telemetry } from '@models';
import { RaptApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RelativeTimePipe } from '@utils';
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  imports: [
    SpinnerComponent,
    MatIconModule,
    FermentationGraphComponent,
    RelativeTimePipe,
  ],
})
export class DashboardPage implements OnInit {
  private readonly apiService = inject(RaptApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = signal(true);
  noResults = signal(false);
  hydrometer = signal<Hydrometer | undefined>(undefined);
  telemetry = signal<Telemetry[]>([]);
  og = computed(() => {
    return Math.max(...this.telemetry().map((tele) => tele.gravity ?? 1));
  });
  fg = computed(() => {
    return Math.min(...this.telemetry().map((tele) => tele.gravity ?? 1));
  });

  ngOnInit() {
    ModuleRegistry.registerModules([AllCommunityModule]);
    this.initializeData();
  }

  initializeData() {
    if (!this.apiService.isTokenValid()) {
      this.snackBar.openFromComponent(AlertComponent, {
        data: { type: 'info', text: 'Login Token expired!' } as Message,
      });
      void this.router.navigate(['/']);
      return;
    }
    firstValueFrom(this.apiService.getHydrometers()).then((hydrometers) => {
      if (hydrometers.length > 0) {
        console.debug('Hydrometers loaded!');
        this.hydrometer.set(hydrometers[0]);
        this.apiService
          .getTelemetry(
            hydrometers[0].id,
            hydrometers[0].activeProfileSession.id,
          )
          .subscribe((tele) => {
            console.debug('Telemetry loaded!');
            this.telemetry.set(tele);
            this.noResults.set(false);
            this.loading.set(false);
          });
      } else {
        this.noResults.set(true);
        this.loading.set(false);
      }
    });
  }

  reloadData() {
    this.loading.set(true);
    this.initializeData();
  }

  openHistory() {
    void this.router.navigate(['/history'], {
      queryParams: { hydrometerId: this.hydrometer()?.id },
    });
  }

  logout() {
    this.apiService.invalidateToken();
    void this.router.navigate(['/']);
  }
}
