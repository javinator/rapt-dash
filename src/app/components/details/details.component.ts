import { Component, computed, input } from '@angular/core';
import { Telemetry } from '@models';
import { AgChartsModule } from 'ag-charts-angular';
import { FermentationGraphComponent } from '../fermentation-graph/fermentation-graph.component';
import { RelativeTimePipe } from '@utils';

@Component({
  selector: 'rd-fermentation-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [AgChartsModule, FermentationGraphComponent, RelativeTimePipe],
})
export class DetailsComponent {
  name = input.required<string>();
  telemetry = input.required<Telemetry[]>();

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
