import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './LoginPage.css';
import Background from '../images/bg.jpg';
import { useAppContext } from '../services/context.js';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import transparentLogo from '../images/transparentLogo.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();

    //Invoke submission for the sign-in form, return errors
    //Bypassing the forced password change as it's not required but can't be turned off (Bug on AWS since 2020).
    let handleLogin = async function (event) {
        event.preventDefault();
        try {
            await Auth.signIn(username, password)
            .then(user => {
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    userHasAuthenticated(true);
                    Auth.completeNewPassword(
                        user,
                        password
                    )
                    history.push('/home')
                }
                else {
                    userHasAuthenticated(true);
                    history.push('/home')
                }
            }); 
        }
        catch (e) {
            alert(e.message);
        }
    }

    //disabled={!validateForm()} <--- re-enable later add this to the button below.
    //   function validateForm() {
    //     return username.length > 0 && password.length > 0;
    //   }

    return (
        <>
        <div className='Login' slot='sign-in' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            backgroundImage: `url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            border:"20px solid rgb(96, 143, 221)"
        }}>
            <Form onSubmit={handleLogin}>
                <label style={{ fontSize: 30, textAlign: 'center', fontWeight:'bold'}}>
                    Newstead Image Library
                </label>
                <Form.Group size='lg' controlId='username'>
                    <Form.Label style={{ fontSize: 30, textAlign: 'left',fontWeight:'bold' }}>
                        Username
                    </Form.Label>
                    <Form.Control
                    autoFocus
                    type='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size='lg' controlId='password'>
                    <Form.Label style={{ fontSize: 30, textAlign: 'left',fontWeight:'bold' }}>
                        Password
                    </Form.Label>
                    <Form.Control
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button block size='lg' type='submit' style={{fontSize: 20}}>
                    Login
                </Button>
                <img class="loginlogo" src={transparentLogo}>
                </img> 
            </Form>
        </div>
      </>
    );
}
