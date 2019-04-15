import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { IMenuItem } from './DataStorage';
import './Header.less';

interface IHeaderState {
    menuShow: boolean
}

function simpleActive(match:any, location:any) {
    return match && match.url === location.pathname;
}

function retTrue() {
    return true;
}

function GenerateLink(item: IMenuItem) {
    const link = location.pathname;
    if (!item.title) {
        return (
            <li key={item.key} className='nav-item'>
                <div className='spinner-grow' role='status'>
                    <span className='sr-only'>Пункты меню еще загружаются...</span>
                </div>
            </li>
        );
    } 
    const current = link.endsWith(item.path);

    return (
        <li key={item.key} className={'nav-item' + (current? ' active':'')}>
            <NavLink to={item.path} 
                className='nav-link'>{item.title} {current ? <span className="sr-only">(current)</span> : ''}</NavLink>
        </li>
    );
}


export class Header extends React.Component<{items:IMenuItem[]}, IHeaderState> {
    state: IHeaderState = {
        menuShow: false
    }

    constructor(props:{items:IMenuItem[]}) {
        super(props);
        this.changeShowStatus = this.changeShowStatus.bind(this);
    }

    changeShowStatus() {
        this.setState({
            menuShow: !this.state.menuShow
        });
    }

    render() {
        const menu = this.props.items.map((element)=>{
            return GenerateLink(element);
        });
        return (
            <header className='main-menu'>
                <nav className="navbar navbar-light navbar-1 white" onClick={this.changeShowStatus}>
                    <a className="navbar-brand" href="#">Меню</a>
                    <button className="navbar-toggler" 
                        type="button"
                        aria-controls="main-menu-content" 
                        aria-expanded="true" 
                        aria-label="Развернуть меню сайта">
                        <div className={"animated-icon1" + (this.state.menuShow ? ' open':'')}><span></span><span></span><span></span></div>
                    </button>

                    <div className={'collapse navbar-collapse collapse' + (this.state.menuShow ? ' show':'')} id="main-menu-content">
                        <ul className="navbar-nav mr-auto">        
                            {menu}
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}