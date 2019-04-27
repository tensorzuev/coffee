import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { IMenuItem, DataStorage } from './DataStorage';
import { BodyRouter } from './BodyRouter';

import './bootstrap-fix.less';
import './Page.less';
import { MenuLoader } from './MenuLoader';

interface IPageState {
    menu: IMenuItem[]
}



export class Page extends React.Component<any, IPageState> {
    

    render () {
        return (
            <Router>
                <Route path='/:section' component={MenuLoader}/>
                <BodyRouter />
                <footer className='card-footer site__footer'>
                    Если у вас остались вопросы, вы можете их задать, позвонив нам <a href='tel:123-456'>123-456</a>
                </footer>
            </Router>
        )
    }
}