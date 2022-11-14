import { IEducationalData } from './../../interfaces/educational-data.interface';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Chart } from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ThemePalette} from '@angular/material/core';



@Component({
  selector: 'app-custom-expansion',
  templateUrl: './custom-expansion.component.html',
  styleUrls: ['./custom-expansion.component.scss'],
})
export class CustomExpansionComponent implements OnInit, AfterViewInit {
  @Input() details: IEducationalData;
  @Input() openMode: boolean = false;
  @Input() includeSpecial: boolean = false;
  @Output() openTuggle: EventEmitter<string> = new EventEmitter<string>();
  headerChartId = uuidv4();
  color: ThemePalette ="accent";
  averageRest: Number;
  ownRest: Number;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initHeaderChart();
  }

  initHeaderChart() {
      let average = this.details.value.average
      this.averageRest = this.details.value.average ? 100 - average : 100;
      if(this.includeSpecial){
        average = this.details.value.special_average
        this.averageRest = this.details.value.special_average ? 100 - average : 100;
      }
      let own = this.details.value.own;
      this.ownRest = this.details.value.own ? 100 - own : 100;
      if(this.includeSpecial){
        own = this.details.value.special_own
        this.ownRest = this.details.value.special_own ? 100 - own : 100;
      }

    let data: any = {
      datasets: [
        {
          data: [average, this.averageRest],
          // type: "stackedBar100",
          backgroundColor: ['#9870A8', '#EAD8F1'],
          label: ['כל המוסדות', ''],
        },
        {
          data: [own, this.ownRest],
          backgroundColor: ['#F6B859', '#FEF2DE'],
          label: ['מוסד נבחר', ''],
        },
      ],
    };

    let myDoughnutChart = new Chart(this.headerChartId, {
      type: 'horizontalBar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
            // display: false,
            color: "#red",
            align: "center"
          },
        },
        tooltips: {
          rtl: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let dataset = data.datasets[tooltipItem.datasetIndex];
              let index = tooltipItem.index;
              return dataset.label[index] + ' ' + dataset.data[index] + '%';
            },
          },
        },
      },
    });
  }

  onOpenExpansion() {
    this.openTuggle.emit(this.details.name);
  }
}
