import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProfileSession, Telemetry } from '@models';
import { AgChartsModule } from 'ag-charts-angular';
import { FermentationGraphComponent } from '../fermentation-graph/fermentation-graph.component';
import { DateUtil, RelativeTimePipe } from '@utils';
import { DatePipe } from '@angular/common';
import { SharedSession } from '../../models/shared-session.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'rd-fermentation-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    AgChartsModule,
    FermentationGraphComponent,
    RelativeTimePipe,
    DatePipe,
    MatIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class DetailsComponent implements OnInit, OnDestroy {
  session = input.required<ProfileSession | SharedSession>();
  telemetry = input.required<Telemetry[]>();

  isActive = computed(() => DateUtil.isActive(this.session().end));

  gravityTrend = computed(() => {
    const telemetry = this.telemetry();
    if (
      telemetry.length < 5 ||
      telemetry.some((t) => t.gravity === undefined)
    ) {
      return;
    }

    const last = telemetry[telemetry.length - 1];
    const last_s = telemetry[telemetry.length - 2];
    const gravity = (last.gravity! + last_s.gravity!) / 2;
    const cutoff = new Date(last.date.getTime() - 24 * 60 * 60 * 1000);
    const last24h = telemetry.filter(
      (t) => t.date >= cutoff && t.date < last.date,
    );

    if (last24h.length < 2) {
      return;
    }

    const compare = Math.max(...last24h.map((t) => t.gravity ?? 0), 0);

    return Math.round((gravity - 1) * 10000 - (compare - 1) * 10000) / 10;
  });

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
        document.body.clientWidth) > 1000
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

  trendIcon = computed(() => {
    if (!this.gravityTrend()) {
      return 'keyboard_double_arrow_right';
    } else if (this.gravityTrend()! > 0.4) {
      return 'keyboard_double_arrow_up';
    } else if (this.gravityTrend()! < -0.4) {
      return 'keyboard_double_arrow_down';
    } else {
      return 'keyboard_double_arrow_right';
    }
  });
}
