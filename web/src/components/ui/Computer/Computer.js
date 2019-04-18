import React from 'react';
import styles from './Computer.module.scss';
import { Button } from 'reactstrap';

export default function Computer(props) {
    const {data, changeStatus} = props;
    const handleChange = (status) => {
        changeStatus(data.id, status);
    }

    return (
        <div className={styles['computer']}>
            <div className="checkbox">
                <label>
                    <p className={data.status === 1 ? styles['computer__status__online'] : (data.status === 0 ? styles['computer__status__offline'] : styles['computer__status__busy'])}>
                        <b>Name: </b>{data.name} - <b>MAC: </b> {data.mac_address}
                    </p>
                    <p style={{textAlign: "right"}}>
                        <Button onClick={(e) => handleChange(1)} color="success" size="sm">Power on</Button>{' '}
                        <Button onClick={(e) => handleChange(0)} color="warning" size="sm">Shutdown</Button>{' '}
                        <Button onClick={(e) => handleChange(0)} color="danger" size="sm">Delete</Button>
                    </p>
                </label>
            </div>
        </div>
    );
}
