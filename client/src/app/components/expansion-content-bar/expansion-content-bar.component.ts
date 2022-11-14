import { IEducationalData } from './../../interfaces/educational-data.interface';
import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-expansion-content-bar',
    templateUrl: './expansion-content-bar.component.html',
    styleUrls: ['./expansion-content-bar.component.scss'],
})
export class ExpansionContentBarComponent implements OnInit, OnChanges {
    bodyChartId = uuidv4();
    @Input() headerText: string;
    @Input() openedExpansion: string = null;
    @Input() includeSpecial: boolean = false;
    bodyChart: Chart;
    @Input() sayings: IEducationalData["subjects"];
    @Input() sections: IEducationalData["sections"]
    localStorageObject: any;


    constructor() { }


    ngOnInit() {
        this.localStorageObject =  JSON.parse(localStorage.getItem("state"));
     }


    ngOnChanges(changes: SimpleChanges): void {

        if (<any>changes['openedExpansion'].currentValue == this.headerText) {
            setTimeout(() => {
                this.initBodyCharts();
                this.initSayingsCharts();
            }, 300);
        }
    }

    textLabel(){
        if (this.localStorageObject.similarInstitutions != null && this.localStorageObject.similarInstitutions.length > 0) {
            return 'מוסדות דומים לפי בחירה'
        }
        else{
            return 'מוסדות דומים'
        }
    }



    initBodyCharts() {
        Chart.defaults.global.legend.labels.fontColor = '#4F4F4F';
        let datasets = [
            {
                data: [this.sections.own.middle, this.sections.own.high],
                backgroundColor: '#F6B859',
                label: 'מוסד נבחר',
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
            {
                data: [this.sections.selected.middle, this.sections.selected.high],
                backgroundColor: '#52A28C',
                label: this.textLabel(),
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
            {
                data: [this.sections.average.middle, this.sections.average.high],
                backgroundColor: '#9870A8',
                label: 'ממוצע כל המוסדות',
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
        ];
        console.log();


        this.bodyChart = new Chart(this.bodyChartId, {
            type: 'bar',
            data: {
                labels: ['חט"ב', 'חט"ע'],
                datasets: datasets
            },
            options: {
                tooltips: {
                    rtl: true,
                    callbacks: {
                        label: (item, data) => {
                            return (
                                data.datasets[item.datasetIndex].label + ': ' + item.value + '%'
                            );
                        },
                    },
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    reverse: true,

                    labels: {
                        fontSize: 14,
                        boxWidth: 13
                    },
                },
                layout: {
                    padding: {
                        top: 20,
                    },
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        padding: { left: 15 },
                        align: -30,
                        formatter: (value) => {
                            return value + '%';
                        },
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                min: 0,
                                // max: 100,
                                display: false,
                            },
                        },
                    ],
                },
            },
        });
    }

    initSayingsCharts() {
        console.log('initSayingsCharts')
        this.sayings.forEach((item) => {
            let chart: Chart = new Chart(item.id.toString(), {
                type: 'horizontalBar',
                data: {
                    datasets: [
                        {
                            data: [Math.round(item.values.own)],
                            backgroundColor: '#F6B859',
                            label: 'מוסד נבחר',
                            barPercentage: 0.7,
                        },
                        {
                            data: [Math.round(item.values.selected)],
                            backgroundColor: '#52A28C',
                            label: this.textLabel(),
                            barPercentage: 0.7,
                        },
                        {
                            data: [Math.round(item.values.average)],
                            backgroundColor: '#9870A8',
                            label: 'ממוצע כל המוסדות',
                            barPercentage: 0.7,
                        },
                    ],
                },
                options: {
                    tooltips: {
                        mode: 'nearest',
                        rtl: true,
                        callbacks: {
                            title: function () {
                                return null;
                            },

                            label: (item, data) => {
                                return (
                                    data.datasets[item.datasetIndex].label +
                                    ': ' +
                                    item.value +
                                    '%'
                                );
                            },
                        },
                    },
                    legend: {
                        display: false,
                    },
                    layout: {
                        padding: {
                            right: 40,
                        },
                    },
                    plugins: {
                        datalabels: {
                            textAlign: 'right',
                            anchor: 'end',
                            //   padding: { left: 20 },
                            align: 3,
                            formatter: (value) => {
                                return value + '%';
                            },
                        },
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    min: 0,
                                    max: 100,
                                    display: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                    },
                },
            });
        });
    }
}
