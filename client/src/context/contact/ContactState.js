import React, { useReducer } from 'react';
import axios from 'axios';

import ContactContext from './ContactContext';
import ContactReducer from './ContactReducer';

import {
    GET_CONTACTS,
    CLEAR_CONTACTS,
    ADD_CONTACT,
    CONTACT_ERROR,
    DELETE_CONTACT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    SET_GLOBAL_EDITING,
    CLEAR_FILTER
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        globalEditing: false,
        filtered: null,
        error: null,
        contactsLoading: true
    }

    const [state, dispatch] = useReducer(ContactReducer, initialState);

    // Get contact 
    const getContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');
            dispatch(
                {
                    type: GET_CONTACTS,
                    payload: res.data
                }
            )
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.data.msg
            })
        }
    }

    // Add contact
    const addContact = async (contact) => {
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/contacts', contact, config);
            dispatch(
                {
                    type: ADD_CONTACT,
                    payload: res.data
                }
            )
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.data.msg
            })
        }
    };
    // Update contact
    const updateContact = async (contact) => {
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.put(`/api/contacts/${contact.id}`, contact, config);
            dispatch(
                {
                    type: UPDATE_CONTACT,
                    payload: res.data
                }
            )
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.data.msg
            })
        }
    }

    // Delete contact
    const deleteContact = async (id) => {
        try {
            await axios.delete(`/api/contacts/${id}`);
            dispatch(
                {
                    type: DELETE_CONTACT,
                    payload: id
                }
            )
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.data.msg
            })
        }
    };

    // Set global editing
    const setGlobalEditing = () => {
        dispatch(
            {
                type: SET_GLOBAL_EDITING
            }
        )
    }

    // Filter Contacts
    const filterContacts = text => {
        dispatch({
            type: FILTER_CONTACTS,
            payload: text
        })
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER })
    }

    // Clear contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }


    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                addContact,
                deleteContact,
                current: state.current,
                setGlobalEditing,
                globalEditing: state.globalEditing,
                updateContact,
                filtered: state.filtered,
                filterContacts,
                clearFilter,
                error: state.error,
                getContacts,
                contactsLoading: state.contactsLoading,
                clearContacts
            }}>
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState;