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

  chartOptions = computed<AgChartOptions>(() => {
    const options = [];
    for (let tele of this.telemetry()) {
      options.push({
        date: new Date(tele.createdOn),
        gravity: tele.gravity ? tele.gravity / 1000 : 0,
        temperature: tele.temperature,
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
      ],
    };
  });
}
