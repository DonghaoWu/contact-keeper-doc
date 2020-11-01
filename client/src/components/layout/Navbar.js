import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/AuthContext';
import ContactContext from '../../context/contact/ContactContext';

const Navbar = ({ title, icon }) => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const { clearContacts } = useContext(ContactContext);

    const handleLogout = () => {
        logout();
        clearContacts();
    }
    
    const authLinks = (
        <Fragment>
            <ul>
                {user && <li>Hello, {user.name}</li>}
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <button onClick={handleLogout} style={logoutStyle}>
                        <i className='fas fa-sign-out-alt'></i>{" "}<span className='hide-sm'>Logout</span>
                    </button>
                </li>
            </ul>
        </Fragment>
    )

    const guestLinks = (
        <Fragment>
            <ul>
                <li>
                    <Link to='/register'>Register</Link>
                </li>
                <li>
                    <Link to='/login'>Login</Link>
                </li>
            </ul>
        </Fragment>
    )

    return (
        <nav className='navbar bg-primary'>
            <h1>
                <Link to='/'><i className={icon} />
                    {title}
                </Link>
            </h1>
            {
                isAuthenticated ?
                    authLinks
                    :
                    guestLinks
            }
        </nav>
    )
}

const logoutStyle = {
    color: "white",
    backgroundColor: "#003699",
    fontSize: "1rem",
    padding: "0 0.45rem",
    border: "none",
    cursor: "pointer",
    margin: "0,0.25rem"
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
}

Navbar.defaultProps = {
    title: 'Contact keeper',
    icon: 'fas fa-id-card-alt'
}

export default Navbar
