import { Component, computed, input } from '@angular/core';
import { Telemetry } from '@models';
import { AgChartsModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'rd-fermentation-table',
  templateUrl: './fermentation-graph.component.html',
  styleUrl: './fermentation-graph.component.scss',
  imports: [AgChartsModule],
})
export class FermentationGraphComponent {
  telemetry = input.required<Telemetry[]>();
  maxTemp = computed(() => {
    return Math.max(...this.telemetry().map((tele) => tele.temperature ?? 0));
  });
  minTemp = computed(() => {
    return Math.min(...this.telemetry().map((tele) => tele.temperature ?? 30));
  });

  chartOptions = computed<AgChartOptions>(() => {
    const options = [];
    for (let tele of this.telemetry()) {
      options.push({
        date: new Date(tele.createdOn),
        gravity: tele.gravity ? tele.gravity / 1000 : 0,
        temperature: tele.temperature,
        rssi: tele.rssi,
      });
    }
    console.log(options);
    return {
      data: options,
      background: {
        fill: 'transparent',
      },
      axes: {
        x: {
          type: 'unit-time',
          unit: 'hour',
          interval: {
            step: 'day',
          },
        },
        gravityAxis: {
          position: 'left',
        },
        temperatureAxis: {
          position: 'right',
          min: Math.round(this.minTemp()) - 2,
          max: Math.round(this.maxTemp()) + 2,
          gridLine: {
            enabled: false,
          },
        },
      },
      series: [
        {
          type: 'line',
          xKey: 'date',
          yKey: 'gravity',
          yKeyAxis: 'gravityAxis',
          yName: 'Gravity',
          stroke: '#03B',
          marker: {
            fill: '#03B',
          },
        },
        {
          type: 'line',
          xKey: 'date',
          yKey: 'temperature',
          yKeyAxis: 'temperatureAxis',
          yName: 'Temperature',
          stroke: '#F52',
          marker: {
            fill: '#F52',
          },
        },
        {
          type: 'line',
          xKey: 'date',
          yKey: 'rssi',
          yKeyAxis: 'temperatureAxis',
          yName: 'Signal',
          strokeWidth: 0,
          showInMiniChart: true,
          showInLegend: false,
          marker: {
            enabled: false,
          },
        },
      ],
    };
  });
}
