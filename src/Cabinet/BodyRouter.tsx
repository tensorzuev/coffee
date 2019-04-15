import * as React from 'react';
import { Route } from 'react-router-dom';
import { Machines } from './Machines';
import { Detail } from './Detail/Detail';

export function BodyRouter() {
    return (
        <main aria-live='polite'>
            <Route path='/main/list' component={Machines} />
            <Route path='/main/appeal' render={() => <div>APPEaK</div>} />

            <Route path='/detail/:id' component={Detail} />
        </main>
    )
}