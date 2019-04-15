import * as React from 'react';
import './PageHeader.less';

interface IPageHeaderProps {
    title: any,
    additionalContent?: any
}


export function PageHeader(props:IPageHeaderProps) {
    return (
        <div className='site__header card-header btn-dark' aria-live='polite'>
            <h1>{props.title}</h1> 
            {props.additionalContent ? props.additionalContent : ''}
        </div>
    )
}