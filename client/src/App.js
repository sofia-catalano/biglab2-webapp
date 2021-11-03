import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import API from './API.js';
import NavBar from './NavBar.js';
import Sidebar from './Sidebar';
import Main from './Main';
import TaskForm from './TaskForm';
import Footer from './Footer.js';
import NotFound from './NotFound.js';
import dayjs from 'dayjs';
import { Container, Row, Col} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import { LoginForm} from './LoginComponents';

function App() {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("all");
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await API.getUserInfo();
        setUser(user.name);
        setLoggedIn(true);
      } catch(err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await API.getAllTasks();
      setTasks(tasks);
      setDirty(false);
      setLoading(false);
    };
    if (dirty && filterBy === "all" && loggedIn) {
      getTasks();
    }

    const getFilteredTasks = async () => {
      const tasks = await API.getFilteredTasks(filterBy);
      setTasks(tasks);
      setDirty(false);
      setLoading(false);
    };
    if (dirty && filterBy !== "all" && loggedIn) {
      getFilteredTasks();
    }
  }, [dirty, filterBy, loggedIn]);

  const addTask = async (task) => {
    task.status = 'add'
    setTasks(oldTasks => [...oldTasks, task]);

    await API.addTask(task);
    setDirty(true);
  }


  const updateTask = async (task) => {
    setTasks(oldTasks => {
      return oldTasks.map(et => {
        if (et.id === task.id)
          return { id: task.id, description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline).format('YYYY-MM-DD HH:MM'), completed: task.completed, status: 'update' };
        else
          return et;
      });
    });

    await API.updateTask(task);
    setDirty(true);
  }

  const deleteTask = async (task) => {
    setTasks(oldTasks => {
      return oldTasks.map(t => {
        if (t.id === task.id)
          return { id: task.id, description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline).format('YYYY-MM-DD HH:MM'), completed: task.completed, status: 'delete' };
        else
          return t;
      });
    });

    await API.deleteTask(task.id)
    setDirty(true);
  }

  const markTask = async (task) => {
    setTasks((oldTasks) => {
      return oldTasks.map(t => {
        if (t.id === task.id) {
          const taskCompleted = (t.completed ? 0: 1);
          return { id: task.id, description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline).format('YYYY-MM-DD HH:MM'), completed: taskCompleted, status: 'update'};
        } else
          return t;
      })
    });
    const taskCompleted = (task.completed ? 0 : 1);
    const request = {id: task.id, completed: taskCompleted};
    await API.markTask(request)
    setDirty(true);
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setDirty(true);
      setLoading(true);
      setMessage({msg: `Welcome, ${user}!`, type: 'success'});
    } catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setUser('');
    setTasks([]);
    setDirty(false);
    setLoading(false);
    setFilterBy("all");
    setLoggedIn(false);
    setMessage('');
  }

  return (
    <Router>
      <NavBar setShow={setShow} loggedIn={loggedIn} logout={doLogOut} user={user} setFilterBy={setFilterBy} setDirty={setDirty}/>
      <Container fluid>
        <Row className="weig-100">
          <Switch>
            <Route exact path="/login" render={() => 
              <>{loggedIn? <Redirect to="/All" /> : <LoginForm login={doLogIn} errmsg={message.msg?message.msg:''} />} </>
            } />
            <Route exact path={`/:filtername/Update`} render={({ match }) =>
            <>{loggedIn?<>
              <Sidebar show={show} setFilterBy={setFilterBy} setDirty={setDirty} />
              <Col sm={8} className='below-nav'>
                <Main filter={`${match.params.filtername}`} tasks={tasks} setTasks={setTasks} deleteTask={deleteTask} markTask={markTask} />
                <TaskForm title='Updating old task...' tasks={tasks} setTasks={setTasks}
                  prevPath={`/${match.params.filtername}`} addOrUpdate={updateTask} />
              </Col></>:<Redirect to="/login" />}</>
            } />

            <Route exact path={`/:filtername/Add`} render={({ match }) =>
            <>{loggedIn ? <>
              <Sidebar show={show} setFilterBy={setFilterBy} setDirty={setDirty} />
              <Col sm={8} className='below-nav'>
                <Main filter={`${match.params.filtername}`} tasks={tasks} setTasks={setTasks} deleteTask={deleteTask} markTask={markTask} />
                <Task Form title='Creating new task...' tasks={tasks} setTasks={setTasks}
                  prevPath={`/${match.params.filtername}`} addOrUpdate={addTask} />
              </Col></>:<Redirect to="/login" />}</>
            } />

            <Route exact path='/' render={({ match }) =>
              <>{loggedIn ? <Redirect to='/All' /> : <Redirect to="/login" />}</>
            } />

            <Route exact path={['/All', '/Important', '/Today', '/Next 7 Days', '/Private']} render={({ match }) =>
              <>{loggedIn ? 
              <>
              <Sidebar show={show} setFilterBy={setFilterBy} setDirty={setDirty} />
              <Col sm={8} className='below-nav'>
                <Main filter={match.url.substr(1)} tasks={tasks} setTasks={setTasks} loading={loading} deleteTask={deleteTask} markTask={markTask} />
                <Footer prevPath={match.url.substr(1)} />
              </Col></>
              : <Redirect to="/login" />}</>
              
            } />

            <Route path='/' render={() =>
              <Col className='below-nav'>
                <NotFound />
              </Col>
            } />
          </Switch>

        </Row>
      </Container>
    </Router >
  );
}

export default App;