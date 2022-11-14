import {ActivatedRoute} from '@angular/router';
import {IParticipationData} from '../../interfaces/participation.interface';
import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
    selector: 'app-participation',
    templateUrl: './participation.component.html',
    styleUrls: ['./participation.component.scss'],
})
export class ParticipationComponent implements OnInit {
    
    plansData: IParticipationData;
    conferencesData: IParticipationData;
    chartsData: IParticipationData;
    plansChart: Chart;
    conferencesChart: Chart;
    
    
    constructor (
        private activatedRoute: ActivatedRoute) {
    }
    
    ngOnInit () {
        this.setChartsAndParticipationData();
    }
    
    
    setChartsAndParticipationData () {
        this.activatedRoute.data.subscribe(data => {
            console.log(data);
            
            data["participationData"].forEach((item: IParticipationData) => {
                switch (item.name) {
                    case 'VISITED PARTICIPATION':
                        this.chartsData = item;
                        break;
                    case 'meetings':
                        this.conferencesData = item;
                        break;
                    case 'programs':
                        this.plansData = item;
                        break
                }
            })
            console.log(this.plansData, this.conferencesData, this.chartsData);
            this.initCharts()
        })
    }
    
    
    initCharts () {
        let plansValue: number = 0,
            plansValueRest: number,
            conferencesValue: number = 0,
            conferencesValueRest: number;
        if (this.chartsData) {
            this.chartsData.subjects.forEach(item => {
                if (item.name == 'meetings') {
                    conferencesValue = item.values.own;
                } else if (item.name == 'programs') {
                    plansValue = item.values.own;
                }
            })
        }
        conferencesValueRest = conferencesValue ? 100 - conferencesValue : 100;
        plansValueRest = plansValue ? 100 - plansValue : 100;
        let plansCenterTextPlugin = this.getCenterTextPlugin(plansValue);
        this.plansChart = new Chart('plansChart', {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [plansValueRest, plansValue],
                        backgroundColor: ['#F6B859', '#52A28C'],
                    },
                ],
                labels: ['השתתפות', 'אי השתתפות'].reverse(),
            },
            plugins: [plansCenterTextPlugin],
            
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                    },
                },
                cutoutPercentage: 75,
                legend: {
                    display: true,
                    rtl: true,
                    reverse: true,
                    position: 'bottom',
                    labels: {
                        padding: 30,
                        fontSize: 18,
                        boxWidth: 10
                    },
                },
                tooltips: {
                    rtl: true,
                    callbacks: {
                        label: (element, data) => {
                            return (
                                data.labels[element.index] + ': ' + data.datasets[0].data[element.index] + '%'
                            );
                        },
                    },
                },
            },
        });
        
        let conferenceCenterTextPlugin = this.getCenterTextPlugin(conferencesValue);
        this.conferencesChart = new Chart('conferencesChart', {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [conferencesValueRest, conferencesValue],
                        backgroundColor: ['#F6B859', '#52A28C'],
                    },
                ],
                labels: ['השתתפות', 'אי השתתפות'].reverse(),
            },
            plugins: [conferenceCenterTextPlugin],
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                    },
                },
                cutoutPercentage: 75,
                legend: {
                    display: true,
                    rtl: true,
                    reverse: true,
                    position: 'bottom',
                    labels: {
                        padding: 30,
                        fontSize: 18,
                        boxWidth: 10
                        
                    },
                },
                tooltips: {
                    rtl: true,
                    callbacks: {
                        label: (element, data) => {
                            return (
                                data.labels[element.index] + ': ' + data.datasets[0].data[element.index] + '%'
                            );
                        },
                    },
                },
            },
        });
        console.log('this.conferencesChart', this.conferencesChart);
        console.log('this.plansChart', this.plansData);
    }
    
    getCenterTextPlugin (percentageText: number) {
        return {
            beforeDraw: function (chart) {
                let width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                ctx.restore();
                
                let fontSize =
                    width > 450 ? (width / 130).toFixed(2) : (width / 180).toFixed(2);
                ctx.font = fontSize + 'em sans-serif';
                ctx.textBaseline = 'middle';
                let text = percentageText + '%',
                    textX = Math.round((width - ctx.measureText(text).width) / 2) + 5,
                    textY = height / 2 - 25;
                ctx.fillText(text, textX, textY);
                ctx.save();
            },
        };
    }
}
