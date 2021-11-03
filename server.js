"use strict";

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const dao = require('./dao');
const e = require('express');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

const path = require('path');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function(username, password, done) {
      userDao.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Incorrect username and/or password.' });
          
        return done(null, user);
      })
    }
  ));
  
  // serialize and de-serialize the user (user object <-> session)
  // we serialize the user id and we store it in the session: the session is very small in this way
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // starting from the data in the session, we extract the current (logged-in) user
  passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });


/* Init express */
const app = express();
const port = process.env.PORT || 3001;

/* Set-up the middlewares */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("./client/build"));

const dayjs=require('dayjs');

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'not authenticated'});
  }
  
  // set up the session
  app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence for the webapp biglab, not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false 
  }));
  
  // then, init passport
  app.use(passport.initialize());
  app.use(passport.session());

/* Espressione regolare funzionante anche per gli anni bisestili */
const RegExMatchDataBisestile = new RegExp(['(^\s*$)|', // Sringa vuota
    /* Anni bisestili */
    '(',
    /* Data e ora */
    '(((^2[01][02468][048]|^2[01][13579][26])-', // Anno 2000 - 2100
    '((([0][13578]|[1][02])-([0][1-9]|[1-2][0-9]|[3][01])|', // Mesi di 31 giorni
    '([0][469]|[1][1])-([0][1-9]|[1-2][0-9]|[3][0]))|', // Mesi di 30 giorni
    '([0][2])-([0][1-9]|[1-2][0-9]))))', // Mese di febbraio 29 giorni
    ' ', // Separatore tra data e ora
    '(([01][0-9]|[2][0-3]):[0-5][0-9]$)|', // Ora e minuti
    /* Solo data */
    '(((^2[01][02468][048]|^2[01][13579][26])-', // Anno 2000 - 2100
    '((([0][13578]|[1][02])-([0][1-9]$|[1-2][0-9]$|[3][01]$)|', // Mesi di 31 giorni
    '([0][469]|[1][1])-([0][1-9]$|[1-2][0-9]$|[3][0]$))|', // Mesi di 30 giorni
    '([0][2])-([0][1-9]$|[1-2][0-9]$))))', // Mese di febbraio 29 giorni  
    ')|',
    /* Anni non bisestili */
    '(',
    /* Data e ora */ 
    //'(((^2[01][0-9][13579])-',
    '((((^2[01][0-9][13579])|(^2[01][13579][048]|^2[01][02468][26]))-', // Anno 2000 - 2100
    '((([0][13578]|[1][02])-([0][1-9]|[1-2][0-9]|[3][01])|', // Mesi di 31 giorni
    '([0][469]|[1][1])-([0][1-9]|[1-2][0-9]|[3][0]))|', // Mesi di 30 giorni
    '([0][2])-([0][1-9]|[1][0-9]|2[0-8]))))', // Mese di febbraio 28 giorni
    ' ', // Separatore tra data e ora
    '(([01][0-9]|[2][0-3]):[0-5][0-9]$)|', // Ora e minuti
    /* Solo data */
    //'(((^2[01][0-9][13579])-',
    '((((^2[01][0-9][13579])|(^2[01][13579][048]|^2[01][02468][26]))-', // Anno 2000 - 2100
    '((([0][13578]|[1][02])-([0][1-9]$|[1-2][0-9]$|[3][01]$)|', // Mesi di 31 giorni
    '([0][469]|[1][1])-([0][1-9]$|[1-2][0-9]$|[3][0]$))|', // Mesi di 30 giorni
    '([0][2])-([0][1-9]$|[1][0-9]$|2[0-8]$))))', // Mese di febbraio 28 giorni
    ')'    
].join(''));


/*** APIs ***/

/* Gets all tasks on DB 1 

casi gestiti : 

GET /api/tasks?filter=important
req.query.filter->important
o
GET /api/tasks*/

app.get('/api/tasks',isLoggedIn, (req, res) => {
    let filter = req.query.filter;
    let filters = ['important', 'private', 'completed', 'today', 'next7days'];
    if(filter != undefined && filters.includes(filter) ){
        dao.filteredTask(filter,req.user.id)
            .then((task) => res.status(200).json(task))
            .catch(() => res.status(500).end());
    }
    else if(filter != undefined && !filters.includes(filter)){
        return res.status(400).end();
    }
    else{
        dao.listTasks(req.user.id)
        .then((tasks) => res.status(200).json(tasks))
        .catch(() => res.status(500).end());
    }
});


/* Gets task on DB filtered by ID 2 */
app.get('/api/tasks/:id',isLoggedIn, [check('id').isInt({ min: 1 })],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            dao.getTask(req.params.id,req.user.id)
                .then((task) => res.status(200).json(task))
                .catch(() => res.status(500).end())
        }
    }
);

function futureDate(date){
    if(date === "") return true;
    if(date.length === 10){
        if(dayjs().format('YYYY-MM-DD') <= date) return true;
        else return false;
    }
        if((dayjs().format('YYYY-MM-DD') < date.substr(0, 10)) ||
            ( dayjs().format('YYYY-MM-DD') == date.substr(0, 10) &&
                dayjs().format('HH:MM') < date.substr(11, 5) ))
                    return true;          
        else return false;
}

/* Create a new taks on DB, return ID created by DB 3 */
app.post('/api/tasks',isLoggedIn, [check('description').isLength({ min: 0, max: 40 }),
check('private').isInt({ min: 0, max: 1 }),
check('important').isInt({ min: 0, max: 1 }),
check('deadline').matches(RegExMatchDataBisestile),
check('deadline').custom((value,{req})=>{return futureDate(req.body.deadline)})
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let data = "";
        if (req.body.deadline == "")
            data = null;
        else
            data = req.body.deadline;

        const task = {
            description: req.body.description,
            private: req.body.private,
            important: req.body.important,
            deadline: data,
            completed: req.body.completed,
            user: req.user.id
        };
        dao.createTask(task)
            .then((lastId) => res.status(201).json(lastId))
            .catch(() => res.status(500).end())

    }
);

/* Modify task by ID, return ID (ID will not be modified) 5 */
app.put('/api/tasks',isLoggedIn, [check('id').isInt({ min: 1 }),
check('description').isLength({ min: 0, max: 40 }),
check('private').isInt({ min: 0, max: 1 }),
check('important').isInt({ min: 0, max: 1 }),
check('deadline').matches(RegExMatchDataBisestile),
check('deadline').custom((value,{req})=>{ return futureDate(req.body.deadline)})
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    let data = "";
    if (req.body.deadline == "")
        data = null;
    else
        data = req.body.deadline;
    
        const task = {
            id: req.body.id,
            description: req.body.description,
            important: req.body.important,
            private: req.body.private,
            deadline: data,
            completed: req.body.completed,
            user: req.user.id
        };

    dao.updateTask(task)
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    }
);

/* Mark task by ID as completed or uncompleted 6 */
app.put('/api/tasks/mark',isLoggedIn, [check('id').isInt({ min: 1 }),
check('completed').isInt({ min: 0, max: 1 })], (req, res) => {
    const task = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        dao.markTask({...task,user: req.user.id})
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    }
});

/* Delete task by ID 7 */
app.delete('/api/tasks/:id',isLoggedIn, [check('id').isInt({ min: 1 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        dao.deleteTask(req.params.id,req.user.id)
            .then((r) => {
                if (r === 0) {
                    return res.status(410).end();
                } else
                    return res.status(200).end();
            })
            .catch(() => res.status(500).end())
    }
});

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // DELETE /sessions/current 
  // logout
  app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
  });
  
  // GET /sessions/current
  // check whether the user is logged in or not
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });

  app.get('*', (req, res) => {
    res.redirect('index.html');
    });

/*** End APIs ***/

// Activate the server
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});