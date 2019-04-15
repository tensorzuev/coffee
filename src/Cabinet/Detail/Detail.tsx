import * as React from 'react';
import { Stat } from './Stat';
import { Route } from 'react-router-dom';
import { DataStorage, IMachineInfo } from '../DataStorage';
import './Detail.less';
import { PageHeader } from '../Elements/PageHeader';
import { Spinner } from '../Elements/Spinner';

interface IDetailInterface {
    info: IMachineInfo,
    showFull: boolean
}


export class Detail extends React.Component<any, IDetailInterface> {
    state:IDetailInterface = {
        info: null,
        showFull: false
    }

    componentDidMount() {
        DataStorage.getInfoById(this.props.match.params.id).then((data) => {
            this.setState({
                info: data
            });
        })
    }

    getInfoButton() {
        return (<button type='button'
                    onClick={()=>{this.setState({showFull: !this.state.showFull})}}
                    aria-controls='machine-information' 
                    aria-expanded={this.state.showFull} 
                    aria-label={(this.state.showFull?'скрыть':'показать') + ' сводную информацию о кофе-машине по адресу ' + this.state.info.address}
                    className='btn btn-outline-info waves-effect btn-sm card-header__button'>{this.state.showFull?'скрыть':'показать'} сводку</button>
        )
    }

    getAdditionalInfo() {
        return (<React.Fragment>
            <article className='card-body' id='machine-information'>
                <p>Машина {this.state.info.status === null ? 'не подключена к сети' : 
                (this.state.info.status ? 'в сети':'в режиме энергосбережения')}. Сегодня сварено {this.state.info.countCup} чашек кофе.</p>
                <p>Здесь будет текст, с описанием того, как машина работала за последний месяц. Назовем этот текст "сводка"</p>
                <p>Преложим скачать отчеты о работе машины:</p>
                <button type='button' className='btn btn-light'>За последний месяц.pdf</button> 
                <button type='button' className='btn btn-light'>За последнюю неделю.pdf</button> 
                <button type='button' className='btn btn-light'>За вчера (дата).pdf</button> 
            </article>
            <hr />
        </React.Fragment>)
    }

    getInfo() {
        if (this.state.info) {
            return (
                <React.Fragment>
                    <PageHeader title={'Кофе-машина: '+this.state.info.address} 
                        additionalContent={this.getInfoButton()} />
                    {this.state.showFull ? this.getAdditionalInfo() : '' }
                </React.Fragment>
            )
        } else {
            return (
                <PageHeader title={<Spinner />} />
            )
        }
    }
    

    render() {
        return (
            <section>
                {this.getInfo()}
                <Route path='/detail/:id/stat' component={Stat} />
            </section>
        )
    }
    
};