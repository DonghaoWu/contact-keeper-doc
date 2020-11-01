import React, { useState, useContext, useEffect } from 'react';
import AlertsContext from '../../context/alert/AlertsContext';
import AuthContext from '../../context/auth/AuthContext';

const Register = props => {
    const { setAlert } = useContext(AlertsContext);
    const { register, error, clearErrors, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/')
        }
        if (error) {
            setAlert(error, 'danger');
            clearErrors();
        }
        // eslint-disable-next-line
    }, [error, isAuthenticated])

    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    })

    const { name, email, password, passwordConfirm } = credentials;

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            return setAlert('Please enter all fields', 'danger');
        }
        else if (password !== passwordConfirm) {
            return setAlert('Passwords do not match.', 'danger')
        }
        else {
            register({
                name,
                email,
                password
            });
        }
    }

    return (
        <div className='form-container'>
            <h1>Account{' '}<span className='text-primary'>Register</span></h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>Name:</label>
                    <input type='text' name='name' value={name} onChange={handleChange} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email Address:</label>
                    <input type='email' name='email' value={email} onChange={handleChange} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input type='password' name='password' value={password} onChange={handleChange} required minLength='6' />
                </div>
                <div className='form-group'>
                    <label htmlFor='passwordConfirm'>Confirm Password:</label>
                    <input type='password' name='passwordConfirm' value={passwordConfirm} onChange={handleChange} required minLength='6' />
                </div>
                <input type='submit' value="Register" className='btn btn-primary btn-block' />
            </form>
        </div>
    )
}

export default Register
