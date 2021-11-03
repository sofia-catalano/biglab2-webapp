import './App.css';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useFormik } from 'formik';
import { iconUserGreen } from "./Icon.js";

function LoginForm(props) {
  const [errorMessage, setErrorMessage] = useState('');

const formik = useFormik({
    initialValues: {
        username: 'utente1@polito.it', //per comodità è stato già settato a delle credenziali valide, settare a ''
        password: 'Password1', // settare a ''
    }, enableReinitialize: true,
    onSubmit: values => {

        if (!values.username || !values.password || values.password.length < 6){
            setErrorMessage('Wrong username and/or password');
        }
        else {
            const credentials = { username: values.username, password: values.password };
            setErrorMessage('');
            props.login(credentials);
        }
    },
});
  
  return (
    <Container className = 'task-form'>
        <div className = 'user-icon text-center'>
            {iconUserGreen}
        </div>
       
       <h2 className= "text-center mb-4 tx-green" >Login</h2>
      <Form onSubmit={formik.handleSubmit}>
        {(errorMessage || props.errmsg) ? <Alert variant="danger">{errorMessage ? errorMessage : props.errmsg }</Alert> : ""}
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Container className='d-flex justify-content-end'>
            <Button variant="success" type="submit">
            Login
            </Button>
        </Container>
      </Form>
    </Container>
  );
}

function LogoutButton(props) {
  return(
      <Button variant="link" className = "float-right" onClick = {props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };