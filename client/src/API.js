/**
 * All the API calls
 */

 const BASEURL = '/api';

async function getAllTasks() {
  try {
    const response = await fetch(BASEURL + '/tasks');
    if (!response.ok) {
      throw Error(response.statusText);
    }
    let type = response.headers.get('Content-Type');
    //type = 'application/json; charset=utf-8'. 
    //Per prendere solo application/json, faccio split sullo spazio vuoto (restituisce un array) e prendo il primo elemento [0] 
    if (type.split(' ')[0] !== 'application/json;') {
      throw new TypeError(`Expected JSON, got ${type}`);
    }
    const tasks = await response.json();
    return tasks;
  } catch (err) {
    console.log(err);
  }
}

async function addTask(task) {
  try {
    const response = await fetch(BASEURL + '/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    let type = response.headers.get('Content-Type');
    if (type.split(' ')[0] !== 'application/json;') {
      throw new TypeError(`Expected JSON, got ${type}`);
    }

    const idTask = await response.json();
    const t = { id: idTask, ...task };
    return t;
  } catch (err) {
    console.log('Failed to store data on server: ' + err);
  }
}

async function deleteTask(id) {
  try {
    
    const response = await fetch(BASEURL + '/tasks/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    });
    
    if (!response.ok)
      throw Error(response.statusText)    

  } catch (err) {
    console.log("error delete task " + err)
  }
}

async function updateTask(task) {
  try {
    const response = await fetch(BASEURL + '/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

  } catch (err) {
    console.log('Failed to store data on server: ' + err);
  }
}


async function getFilteredTasks(filter) {
  try {
    const response = await fetch(BASEURL + `/tasks/?filter=${filter}` );
    if (!response.ok) {
      throw Error(response.statusText);
    }
    let type = response.headers.get('Content-Type');
    if (type.split(' ')[0] !== 'application/json;') {
      throw new TypeError(`Expected JSON, got ${type}`);
    }
    const tasks = await response.json();
    return tasks;
  } catch (err) {
    console.log(err);
  }
}


async function markTask(task){
  try{
    const response = await fetch(BASEURL + '/tasks/mark', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
  }catch(err){
    console.log("Error marking task" + err)
  }
}

async function logIn(credentials) {
  let response = await fetch(BASEURL + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user.name;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch(BASEURL + '/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { getAllTasks, addTask, deleteTask, getFilteredTasks, updateTask, markTask, logIn, logOut, getUserInfo };
export default API;