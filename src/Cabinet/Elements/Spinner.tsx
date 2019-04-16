import * as React from 'react';
import './Spinner.less';

export function Spinner() {
    return (<div className='spinner'>
                <div className='spinner-grow' role='status'>
                    <span className='sr-only'>Информация о машине в процессе получения...</span>
                </div>
            </div>)
}