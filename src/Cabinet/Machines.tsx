import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { DataStorage, IShortMachineItem } from './DataStorage';
import { BodyRouter } from './BodyRouter';

import './Machines.less';
import { PageHeader } from './Elements/PageHeader';

interface IMachinesListState {
    list: IShortMachineItem[]
}

function GetRow(item: IShortMachineItem) {
    return (<li key={item.id} className='list__row-wrapper'>
        <Link to={`/detail/${item.id}/stat`} className='list__row-wrapper'>
            <div className='list__grid-column'>{item.address}</div>
            <div className='list__grid-column'>{item.status}</div>
            <div className='list__grid-column'>Кнопки</div>
        </Link>
    </li>)
}

export class Machines extends React.Component<any, IMachinesListState> {
    state:IMachinesListState = {
        list: [ ]
    }



    componentDidMount() {
        DataStorage.getMashineList({}).then((data) => {
            this.setState({
                list: data
            });
        });
    }

    

    render () {
        const rows = this.state.list.map((item)=>{
            return GetRow(item);
        });
        return (
            <React.Fragment>
                <PageHeader title='Список ваших кофе-машин' />
                <ul className='list'>
                    {rows}
                </ul>
            </React.Fragment>
        )
    }
}