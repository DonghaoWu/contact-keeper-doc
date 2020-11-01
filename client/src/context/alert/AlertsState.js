import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';

import AlertsContext from './AlertsContext';
import AlertsReducer from './AlertsReducer';

import {
    SET_ALERT,
    REMOVE_ALERT
} from '../types';

const AlertState = props => {
    const initialState = [];

    const [state, dispatch] = useReducer(AlertsReducer, initialState);

    // Set alert
    const setAlert = ((msg, type, timeout = 3000) => {
        const id = uuid();
        dispatch({
            type: SET_ALERT,
            payload: {
                msg,
                type,
                id
            }
        });

        setTimeout(() => {
            dispatch(
                {
                    type: REMOVE_ALERT,
                    payload: id
                }
            )
        }, timeout)
    });

    return (
        <AlertsContext.Provider
            value={{
                alerts: state,
                setAlert
            }}>
            {props.children}
        </AlertsContext.Provider>
    )
}

export default AlertState;