import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ProfileSession, Telemetry } from '@models';
import { AgChartsModule } from 'ag-charts-angular';
import { FermentationGraphComponent } from '../fermentation-graph/fermentation-graph.component';
import { DateUtil, RelativeTimePipe } from '@utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'rd-fermentation-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    AgChartsModule,
    FermentationGraphComponent,
    RelativeTimePipe,
    DatePipe,
  ],
})
export class DetailsComponent implements OnInit, OnDestroy {
  session = input.required<ProfileSession>();
  telemetry = input.required<Telemetry[]>();

  isActive = computed(() => DateUtil.isActive(this.session().end));

  readonly now = signal(Date.now());
  private intervalId!: number;

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.now.set(Date.now());
    }, 60000); // update every minute
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  isLargeScreen() {
    return (
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) > 1200
    );
  }

  lastTelemetry = computed(() =>
    this.telemetry().reduce((p, n) => (p.date > n.date ? p : n)),
  );
  og = computed(() => {
    return Math.max(...this.telemetry().map((tele) => tele.gravity ?? 1));
  });
  fg = computed(() => {
    return Math.min(...this.telemetry().map((tele) => tele.gravity ?? 1));
  });
}
