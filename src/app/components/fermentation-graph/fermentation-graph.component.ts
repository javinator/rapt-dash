import { Component, computed, input, OnInit } from '@angular/core';
import { Telemetry } from '@models';
import { AgChartsModule } from 'ag-charts-angular';
import {
  AgChartOptions,
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-charts-community';

@Component({
  selector: 'rd-fermentation-table',
  templateUrl: './fermentation-graph.component.html',
  styleUrl: './fermentation-graph.component.scss',
  imports: [AgChartsModule],
})
export class FermentationGraphComponent implements OnInit {
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
        date: new Date(tele.date),
        gravity: tele.gravity ? tele.gravity : 0,
        temperature: tele.temperature,
        rssi: tele.rssi,
      });
    }
    return {
      data: options,
      background: {
        fill: 'transparent',
      },
      axes: {
        x: {
          type: 'time',
          nice: false,
          parentLevel: {
            enabled: false,
          },
          label: {
            format: '%d/%m/%y',
            autoRotate: true,
          },
          interval: {
            step: {
              unit: 'day',
            },
          },
          gridLine: {
            style: [
              {}, //empty object for an unshaded band
              {
                fill: '#999',
                fillOpacity: 0.1,
                strokeWidth: 0,
              },
            ],
          },
        },
        gravityAxis: {
          position: 'left',
          label: {
            format: '#{.3f}',
          },
        },
        temperatureAxis: {
          position: 'right',
          min: Math.round(this.minTemp()) - 2,
          max: Math.round(this.maxTemp()) + 2,
          gridLine: {
            enabled: false,
          },
          label: {
            format: '#{.1f} °C',
          },
        },
        rssiAxis: {
          position: 'right',
          label: {
            enabled: false,
          },
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
          tooltip: {
            renderer: function ({ datum, xKey, yKey, yName }) {
              return {
                heading: datum[xKey].toLocaleString(),
                data: [
                  {
                    label: yName || '',
                    value: datum[yKey].toFixed(4),
                  },
                ],
              };
            },
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
          tooltip: {
            renderer: function ({ datum, xKey, yKey, yName }) {
              return {
                heading: datum[xKey].toLocaleString(),
                data: [
                  {
                    label: yName || '',
                    value: datum[yKey].toFixed(1) + ' °C',
                  },
                ],
              };
            },
          },
        },
        {
          type: 'line',
          xKey: 'date',
          yKey: 'rssi',
          yKeyAxis: 'rssiAxis',
          yName: 'Signal',
          strokeWidth: 0,
          showInLegend: false,
          marker: {
            enabled: false,
          },
          tooltip: {
            renderer: function ({ datum, xKey, yKey, yName }) {
              return {
                heading: datum[xKey].toLocaleString(),
                data: [
                  {
                    label: yName || '',
                    value: datum[yKey].toFixed(0) + ' dB',
                  },
                ],
              };
            },
          },
        },
      ],
    };
  });

  ngOnInit() {
    ModuleRegistry.registerModules([AllCommunityModule]);
  }
}
