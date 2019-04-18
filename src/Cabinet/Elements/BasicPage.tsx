import * as React from 'react';

interface IBasicPageProps {
    title: any,
    content: any
}

export function BasicPage(props: IBasicPageProps) {
    return (
        <section className='card-body'>
            <h2 className='card-title'>{props.title}</h2>
            {props.content}
        </section>
    )
}