import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './LoginPage.css';
import Background from '../images/bg.jpg';
import { useAppContext } from '../services/context.js';
import { Auth } from 'aws-amplify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { userHasAuthenticated } = useAppContext();

  //Invoke submission for the sign-in form, return errors
  let handleSubmit = async function (event) {
    event.preventDefault();
    try {
        await Auth.signIn(username, password);
        userHasAuthenticated(true);
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
    <div className='Login' slot='sign-in' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    }}>
        <Form onSubmit={handleSubmit}>
            <label style={{ fontSize: 30, textAlign: 'center' }}>
                Newstead Image Library
            </label>
            <Form.Group size='lg' controlId='username'>
                <Form.Label style={{ fontSize: 30, textAlign: 'left' }}>
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
                <Form.Label style={{ fontSize: 30, textAlign: 'left' }}>
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
        </Form>
    </div>
  );
}
