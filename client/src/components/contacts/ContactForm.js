import React, { useRef, useState, useContext } from 'react'
import ContactContext from '../../context/contact/ContactContext';

const ContactForm = props => {
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const [type, setType] = useState('personal');

    const { addContact } = useContext(ContactContext);

    const handleChange = (e) => {
        setType(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addContact({
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            type: type
        });

        nameRef.current.value = '';
        phoneRef.current.value = '';
        emailRef.current.value = '';
        setType('personal');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className='text-primary'>Add contact</h2>
            <input type='text' placeholder='Name' name='name' ref={nameRef} required />
            <input type='email' placeholder='Email' email='email' ref={emailRef} />
            <input type='text' placeholder='Phone' phone='phone' ref={phoneRef} />
            <h5>Contact type</h5>
            <input
                type='radio'
                name='type'
                value='personal'
                checked={type === 'personal'}
                onChange={handleChange}
            />
            Personal{' '}
            <input
                type='radio'
                name='type'
                value='professional'
                checked={type === 'professional'}
                onChange={handleChange}
            />
            Professional{' '}
            <div>
                <input type='submit' value='Add contact' className='btn btn-primary btn-block' />
            </div>
        </form>
    )
}

export default ContactForm
