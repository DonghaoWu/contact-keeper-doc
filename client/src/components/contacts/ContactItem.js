import React, { useContext, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/ContactContext';

const ContactItem = ({ contact }) => {
    const { deleteContact, updateContact, setGlobalEditing, globalEditing } = useContext(ContactContext);
    const { name, _id, email, phone, type } = contact;

    const [editingContact, setEditingContact] = useState({
        formName: name,
        formId: _id,
        formEmail: email,
        formPhone: phone,
        formType: type
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = () => {
        deleteContact(_id);
    }

    const handleEdit = () => {
        setGlobalEditing();
        setIsEditing(!isEditing);
    }

    const handleChange = (e) => {
        setEditingContact({ ...editingContact, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateContact({
            id: editingContact.formId,
            name: editingContact.formName,
            email: editingContact.formEmail,
            phone: editingContact.formPhone,
            type: editingContact.formType
        })
        setIsEditing(!isEditing);
        setGlobalEditing();
    }

    return (
        <div className='card bg-light'>
            {
                isEditing ?
                    <form onSubmit={handleSubmit}>
                        <label>Name:</label>
                        <input type='text' placeholder='Name' name='formName' value={editingContact.formName} onChange={handleChange} />
                        <label>Email:</label>
                        <input type='email' placeholder='Email' name='formEmail' value={editingContact.formEmail} onChange={handleChange} />
                        <label>Phone:</label>
                        <input type='text' placeholder='Phone' name='formPhone' value={editingContact.formPhone} onChange={handleChange} />
                        <h5>Contact type</h5>
                        <input
                            type='radio'
                            name='formType'
                            value='personal'
                            checked={editingContact.formType === 'personal'}
                            onChange={handleChange}
                        />
                        Personal{' '}
                        <input
                            type='radio'
                            name='formType'
                            value='professional'
                            checked={editingContact.formType === 'professional'}
                            onChange={handleChange}
                        />
                        Professional{' '}
                        {
                            (isEditing === true && globalEditing === true) &&
                            <p>
                                <input type='submit' className='btn btn-dark btn-sm' value='Submit' />
                            </p>
                        }
                    </form>
                    :
                    <Fragment>
                        <h3 className='text-primary text-left'>
                            {name}{' '}
                            <span
                                style={{ float: 'right' }}
                                className={'badge ' + (type === 'professional' ? 'badge-success' : 'badge-primary')}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                        </h3>
                        <ul className='list'>
                            {
                                email &&
                                (<li>
                                    <i className='fas fa-envelope-open'></i>{email}
                                </li>)
                            }
                            {
                                phone &&
                                (<li>
                                    <i className='fas fa-phone' />{phone}
                                </li>)
                            }
                        </ul>
                    </Fragment>
            }
            {
                (isEditing === false && globalEditing === false) ?
                    <p>
                        <button className='btn btn-dark btn-sm' onClick={handleEdit}>Edit</button>
                        <button className='btn btn-danger btn-sm' onClick={handleDelete}>Delete</button>
                    </p>
                    :
                    <p />
            }
        </div>
    )
}

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired,
}

export default ContactItem
