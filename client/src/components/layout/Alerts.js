import React, { useContext } from 'react';
import AlertsContext from '../../context/alert/AlertsContext';

const Alerts = props => {
    const { alerts } = useContext(AlertsContext);

    return (
        alerts.length > 0
        &&
        alerts.map(alert => {
            return (
                <div key={alert.id} className={`alert alert-${alert.type}`}>
                    <i className='fas fa-info-circle'></i>{alert.msg}
                </div>)
        })
    )
}

export default Alerts;
