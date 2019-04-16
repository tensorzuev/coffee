import * as React from 'react';
import { Filter } from './Stat/Filter';
import { IFilterStat, DataStorage, IStatList } from '../DataStorage';
import './Stat.less';

const ChartColors = [
    '#007bff',
    '#28a745',
    '#dc3545',
    '#fd7e14',
    '#343a40'
]

interface IStatState {
    filter:IFilterStat,
    data: IStatList,
    libraryReady: boolean
}



export class Stat extends React.Component<any, IStatState> {
    state: IStatState = {
        filter: null,
        data: null,
        libraryReady: false
    }

    chartControl: any;
    chartData: any;
    chartOptions: any;

    debounceTimeout: number;

    constructor(props:any) {
        super(props);

        this.filterChangeCallback = this.filterChangeCallback.bind(this);
        this.resizeHdl = this.resizeHdl.bind(this);
        window.addEventListener('resize', this.resizeHdl);
    }

    resizeHdl() {
        if (this.chartControl) {
            this.rebuidChart();
        }
    }

    componentDidMount() {
        //@ts-ignore
        google.charts.load('current', {packages: ['corechart', 'bar']});
        //@ts-ignore
        google.charts.setOnLoadCallback(()=>{
            this.setState({libraryReady:true});
        });

        DataStorage.getStats(this.props.match.params.id, null).then((stats)=>{
            this.setState({filter:stats.filter,
                data: stats.data
            });
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHdl);
    }

    getStatsWithDebounce() {
        if (this.debounceTimeout) {
            return;
        }

        this.debounceTimeout = setTimeout(()=>{
            this.debounceTimeout = 0;
            DataStorage.getStats(this.props.match.params.id, this.state.filter).then((stats)=>{
                this.setState({
                    data: stats.data
                });
            });
        }, 300);
        
        
    }

    filterChangeCallback(filter:IFilterStat) {
        this.setState({
            filter: filter
        });
        this.getStatsWithDebounce();
    }

    rebuidChart() {
        this.chartControl.clearChart();
        //@ts-ignore
        let data = new google.visualization.DataTable();
        let colors:any = [];

        data.addColumn('string', 'Интервалы');
        this.state.data.series.forEach((el, index) => {
            data.addColumn('number', el.legend);    
            colors.push(ChartColors[index]);            
        })
        
        let rows:any = [];
        this.state.data.xAxis.forEach((title, index) => {
            let row:any[] = [{v: title, f: title}];
            this.state.data.series.forEach((el) => {
                row.push(el.data[index]);               
            });
            rows.push(row);
        })
        data.addRows(rows);

        this.chartOptions = {
            title: 'Статистика по количеству сваренного кофе',
            colors: colors,
            hAxis: {
                title: 'Количество варок за ',
                format: '',
                viewWindow: {
                    min: [0, 0, 0],
                    max: [this.state.data.xAxis.length, this.state.data.maxValue, 0]
                }
            },
            vAxis: {
                title: 'Время варки'
            }
        };

        
        this.chartData = data;
        
        this.chartControl.draw(this.chartData, this.chartOptions);

        //I have to change chart library. Need something with style customization
        let allText = this.chartControl.getContainer().getElementsByTagName('text');
        for (let i=0; i < allText.length; i++) {
            allText[i].setAttribute('font-family', '');
            allText[i].setAttribute('font-size', '');
            allText[i].setAttribute('font-style', '');
            allText[i].setAttribute('font-weight', '');
        }
    }

    componentDidUpdate(prevProps:any, prevState:IStatState) {
        if (this.state.libraryReady && this.state.data ) {
            if (this.state.data === prevState.data && this.chartControl) {
                return;
            }

            if (!this.chartControl) {
                //@ts-ignore
                let chart = new google.visualization.ColumnChart(document.getElementById('stats__chart-bar'));
                this.chartControl = chart;
            } 
            this.rebuidChart();
        }
    }

    render() {
        return (
            <section className='card-body'>
                <h2 className='card-title'>Статистика кофе-машины</h2>
                <Filter filter={this.state.filter} filterChangeCallback={this.filterChangeCallback}/>
                <div id="stats__chart-bar" className="stat__chart"></div>
            </section>
        )
    }
    
};