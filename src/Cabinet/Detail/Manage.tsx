import * as React from 'React';
import { BasicPage } from '../Elements/BasicPage';
import { Panel } from './Manage/Panel';

import './Manage.less';

export function Manage() {
    return (
        <BasicPage title='Управляйте кофе-машиной' content={
            <div className='manager-panel'>
                <Panel />
            </div>
        } />
    )
}

