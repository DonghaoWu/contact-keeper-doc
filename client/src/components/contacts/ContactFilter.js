import React, { useContext, useRef } from 'react';
import ContactContext from '../../context/contact/ContactContext';

const ContactFilter = props => {
    const { filterContacts, clearFilter } = useContext(ContactContext);
    const text = useRef();

    const handleChange = () => {
        if (text.current.value !== '') {
            filterContacts(text.current.value);
        }
        else {
            clearFilter();
        }
    }

    return (
        <form>
            <input ref={text} type='text' placeholder='Filter contacts...' onChange={handleChange} />
        </form>
    )
}

export default ContactFilter;