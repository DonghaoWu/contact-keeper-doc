import React, { useState, useContext, useEffect } from 'react';
import AlertsContext from '../../context/alert/AlertsContext';
import AuthContext from '../../context/auth/AuthContext';

const Login = props => {
    const { setAlert } = useContext(AlertsContext);
    const { login, error, clearErrors, isAuthenticated } = useContext(AuthContext);

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
        email: '',
        password: '',
    })

    const { email, password } = credentials;

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') {
            return setAlert('Please enter all fields.', 'danger');
        }
        else {
            login({
                email,
                password
            })
        }
    }

    return (
        <div className='form-container'>
            <h1>Account{' '}<span className='text-primary'>Login</span></h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>Email Address:</label>
                    <input type='email' name='email' value={email} onChange={handleChange} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input type='password' name='password' value={password} onChange={handleChange} required />
                </div>
                <input type='submit' value="Login" className='btn btn-primary btn-block' />
            </form>
        </div>
    )
}

export default Login;
