import * as React from 'react';
import { IMenuItem, DataStorage } from './DataStorage';
import { Header } from './Header';

interface IMenuLoaderState {
    menu: IMenuItem[]
}

export class MenuLoader extends React.Component<any, IMenuLoaderState> {


    getIdFromProps(props:any) {
        return props.match && props.match.params && props.match.params.section || 'main';
    }

    loadMenu() {
        return DataStorage.getMenu(this.getIdFromProps(this.props)).then((menuData) => {
            this.setState({
                menu: menuData
            });
        });
    }

    componentDidMount() {
        this.loadMenu();
    }

    componentDidUpdate(prevProps:any) {
        if (this.getIdFromProps(this.props) !== this.getIdFromProps(prevProps))
            this.loadMenu();
    }

    state:IMenuLoaderState = {
        menu: [ {title: '', path: '', key: '1'} ]
    }

    render() {
        return (<Header items={this.state.menu} />);
    }
}