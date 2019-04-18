import React from 'react';
import Filter from './Filter';

export default function Footer(props) {
    const {filter, changeFilter} = props;

    return (
        <footer className="clearfix">
            <div className="pull-right">
                <Filter {...{filter, changeFilter}}/>
            </div>
        </footer>
    );
}
