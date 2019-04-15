import * as React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Machines } from './Machines';
import { Detail } from './Detail/Detail';

export function BodyRouter() {
    return (
        <main aria-live='polite'>
            <Route exact path='/' render={ () => 
                        <div>
                            Разводящая страница в разработке.
                            <br />
                            Перейдите к <NavLink to='/main/list'>списку</NavLink> или сразу к <NavLink to='/detail/0/stat'>информации о кофе-машине</NavLink>
                        </div>} />
            <Route path='/main/list' component={Machines} />
            <Route path='/main/appeal' render={() => <div>APPEaK</div>} />

            <Route path='/detail/:id' component={Detail} />
        </main>
    )
}