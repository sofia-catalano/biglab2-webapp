import { iconUser, iconCheckAll } from "./Icon.js";
import { Form, FormControl, Navbar, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  LogoutButton } from './LoginComponents';

function NavBar(props) {
    return (
        <Navbar collapseOnSelect bg="success" variant="dark" fixed="top" expand="sm">

            <Button className="navbar-toggler" variant="success" onClick={() => props.setShow(prev => !(prev))} >
                <span className="navbar-toggler-icon"></span>
            </Button>

            <Navbar.Brand onClick= {()=> {props.setFilterBy('all');props.setDirty(true);}}>
                <Link to={{ pathname: '/All' }} style={{color: "white", textDecoration: "none"}}>
                    {iconCheckAll}
                    ToDo Manager
                </Link>
            </Navbar.Brand >

            <Form inline className=" mx-auto d-none d-sm-block">
                <FormControl type="text" placeholder="Search" />
            </Form>
            {props.loggedIn ? 
            <>
            <Dropdown alignRight>
                <Dropdown.Toggle variant="success">
                    Ciao, {props.user} {iconUser}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <LogoutButton logout={props.logout}></LogoutButton>
                </Dropdown.Menu>
            </Dropdown>
            </> : ''}
        </Navbar>
    );
}

export default NavBar;