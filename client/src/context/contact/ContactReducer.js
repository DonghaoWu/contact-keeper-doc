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

const ContactReducer = (state, action) => {
    switch (action.type) {
        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                contactsLoading: false
            }
        case ADD_CONTACT:
            return {
                ...state,
                contacts: [action.payload, ...state.contacts],
                contactsLoading: false
            }
        case DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact._id !== action.payload),
                contactsLoading: false
            }
        case SET_GLOBAL_EDITING:
            return {
                ...state,
                globalEditing: !state.globalEditing
            }
        case UPDATE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.map(contact => {
                    if (contact._id === action.payload._id) {
                        contact = action.payload;
                    }
                    return contact;
                }),
                contactsLoading: false
            }
        case FILTER_CONTACTS:
            return {
                ...state,
                filtered: state.contacts.filter(contact => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return contact.name.match(regex) || contact.email.match(regex);
                })
            }
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            };
        case CONTACT_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case CLEAR_CONTACTS:
            return {
                ...state,
                contacts: null,
                globalEditing: false,
                filtered: null,
                error: null,
                contactsLoading: true
            }
        default:
            return state
    }
};

export default ContactReducer;