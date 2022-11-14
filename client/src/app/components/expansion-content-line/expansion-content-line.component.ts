import { IAcademicsData } from './../../interfaces/academics.interface';
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    Inject
} from '@angular/core';
import Chart from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as SimiliarInstitutinsActions from 'src/app/shared/similiar-institutions/similiar-institutions.actions';
import { AppStore } from 'src/app/app.store';
import { AppState } from 'src/app/app.reducer';
import * as Redux from 'redux';



@Component({
    selector: 'app-expansion-content-line',
    templateUrl: './expansion-content-line.component.html',
    styleUrls: ['./expansion-content-line.component.scss'],
})
export class ExpansionContentLineComponent implements OnInit, OnChanges {
    @Input() headerText: string;
    @Input() openedExpansion: string = null;
    @Input() includeSpecial: boolean = false;
    @Input() lineData: IAcademicsData['subjects'];
    @Input() sections: IAcademicsData['sections'];
    barChartId = uuidv4();
    lineChartId = uuidv4();
    localStorageObject: any;
    constructor(
        @Inject(AppStore) private store: Redux.Store<AppState>,
    ) { }

    ngOnInit() {
         this.localStorageObject =  JSON.parse(localStorage.getItem("state"));
    }

    ngOnChanges(changes: SimpleChanges): void {
//         if (<any>changes['openedExpansion'].currentValue == this.headerText) {
            setTimeout(() => {
                this.initBodyCharts();
                this.initLineChart();
            }, 300);
//         }
    }

    initBodyCharts() {
        Chart.defaults.global.legend.labels.fontColor = '#4F4F4F';

        let bodyChart = new Chart(this.barChartId, {
            type: 'bar',
            data: {
                labels: ['חט"ב', 'חט"ע'],
                datasets: [
                    {
                        data: [this.sections.own.middle, this.includeSpecial ? this.sections.own.special : this.sections.own.high],
                        backgroundColor: '#F6B859',
                        label: 'מוסד נבחר',
                        barPercentage: 0.6,
                        categoryPercentage: 0.6,
                    },
                    {
                        data: [this.sections.selected.middle, this.includeSpecial ? this.sections.selected.special : this.sections.selected.high],
                        backgroundColor: '#52A28C',
                        label: this.textLabel(),
                        barPercentage: 0.6,
                        categoryPercentage: 0.6,
                    },
                    {
                        data: [this.sections.average.middle, this.includeSpecial ? this.sections.average.special : this.sections.average.high],
                        backgroundColor: '#9870A8',
                        label: 'ממוצע כל המוסדות',
                        barPercentage: 0.6,
                        categoryPercentage: 0.6,
                    },
                ],
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
                        boxWidth: 13,
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
                                display: false,
                            },
                        },
                    ],
                },
            },
        });
    }

    textLabel(){
        if (this.localStorageObject.similarInstitutions != null && this.localStorageObject.similarInstitutions.length > 0) {
            return 'מוסדות דומים לפי בחירה'
        }
        else{
            return 'מוסדות דומים'
        }
    }

    initLineChart() {
        let yearList: string[] = [];
        let ownData: number[] = [];
        let selectedData: number[] = [];
        let averageData: number[] = [];

        this.lineData[0].values.own.forEach(item => {
             let year = Object.keys(item)[0];
             yearList.push(year);
             this.includeSpecial ? ownData.push(item[year].special) : ownData.push(item[year].all);
         });
         this.lineData[0].values.selected.forEach(item => {
            let year = Object.keys(item)[0];
            this.includeSpecial ? selectedData.push(item[year].special) : selectedData.push(item[year].all);
        });
        this.lineData[0].values.average.forEach(item => {
            let year = Object.keys(item)[0];
            this.includeSpecial ? averageData.push(item[year].special) : averageData.push(item[year].all);
        });
        console.log(yearList.reverse(), ownData.reverse(), selectedData.reverse(), averageData.reverse());



        let lineChart = new Chart(this.lineChartId, {
            type: 'line',
            data: {
                labels: yearList,
                datasets: [
                    {
                        data: ownData,
                        fill: false,
                        backgroundColor: '#F6B859',
                        borderColor: '#F6B859',
                        borderWidth: 5,
                        label: 'מוסד נבחר',
                    },
                    {
                        data: selectedData,
                        fill: false,
                        backgroundColor: '#52A28C',
                        borderColor: '#52A28C',
                        borderWidth: 5,
                        label: this.textLabel(),
                    },
                    {
                        data: averageData,
                        fill: false,
                        borderColor: '#9870A8',
                        backgroundColor: '#9870A8',
                        borderWidth: 5,
                        label: 'ממוצע כל המוסדות',
                    },
                ],
            },
            options: {
                plugins: {
                    datalabels: { display: false },
                },
                tooltips: {
                    rtl: true,
                    bodyAlign: 'right',
                    callbacks: {
                        label: (item, data) => {
                            return (
                                data.datasets[item.datasetIndex].label + ': ' + item.value + '%'
                            );
                        },
                    },
                },
                legend: {
                    display: false,
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
                            position:'left',
                            ticks: {
                                callback: function (value) {
                                    return value + '%'
                                }
                            }
                        }
                    ]
                },
            },
        });
    }
}
