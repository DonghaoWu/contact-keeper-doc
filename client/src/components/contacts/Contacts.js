import React, { useContext, Fragment, useEffect } from 'react';

import ContactItem from './ContactItem';
import Spinner from '../layout/Spinner';

import ContactContext from '../../context/contact/ContactContext';

const Contacts = () => {
    const { contacts, filtered, getContacts, contactsLoading } = useContext(ContactContext);

    useEffect(() => {
        getContacts();
        // eslint-disable-next-line
    }, [])

    if (contacts !== null && contacts.length === 0 && !contactsLoading) {
        return <h4>Please add a contact.</h4>
    }

    return (
        <Fragment>
            {(contacts !== null && !contactsLoading)
                ?
                <Fragment>
                    {
                        (filtered !== null) ?
                            filtered.map(contact => {
                                return (
                                    <ContactItem key={contact._id} contact={contact} />
                                )

                            })
                            :
                            contacts.map(contact => {
                                return (
                                    <ContactItem key={contact._id} contact={contact} />
                                )
                            })
                    }
                </Fragment>
                :
                <Spinner />
            }
        </Fragment>
    )
}

export default Contacts;