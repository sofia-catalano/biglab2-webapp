"use strict";

const sqlite = require('sqlite3');

/* Open the database */
const db = new sqlite.Database('tasks.db', (err) => {
    if (err)
        throw err;
});

/* Get all tasks*/
exports.listTasks = (user) => {
    return new Promise((resolve, reject) => {
        console.log('utente '+ user)
        const sql = 'SELECT * FROM tasks WHERE user = ?'
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map(t => ({
                id: t.id,
                description: t.description,
                important: t.important,
                private: t.private,
                deadline: t.deadline,
                completed: t.completed
            }));
            resolve(tasks);
        })
    });
}

/* Get the task identified by {id} */
exports.getTask = (id,user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE id=? AND user = ?';
        db.get(sql, [id,user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Task not found.' });
            } else {
                const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed, user: row.user };
                resolve(task);
            }
        });
    });
};

/* Add a new task */
exports.createTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

/* update an existing task */
exports.updateTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=?, user=? WHERE id=? AND user = ?' ;
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user, task.id, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });
};

/* Mark an existing task */
exports.markTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE tasks SET completed=? WHERE id=? AND user = ?`;
        db.run(sql, [task.completed, task.id,task.user],
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(null);  
            });
    });
};

/* Delete an existing task */
exports.deleteTask = (id,user) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id=? AND user = ?';
        db.run(sql, [id,user], function (err) {
            if (err) {
                reject(err);
                return;
            } else
                resolve(this.changes);
        });
    });
}

/* list task filtered */
 exports.filteredTask = (filter,userId) => {
    return new Promise((resolve, reject) => {
        let sql;
        switch (filter) {
            case 'important':
                sql = 'SELECT * FROM tasks where important=1 AND user = ?';                
                break;
            case 'private':
                sql = 'SELECT * FROM tasks where private=1 AND user = ?';
                break;
            case 'today':
                sql = 'SELECT * FROM tasks where (deadline=date("now") OR (deadline>date("now") AND deadline<date("now", "+1 days"))) AND user = ?';
                break;
            case 'next7days':
                sql = 'SELECT * FROM tasks where deadline>date("now") AND deadline<date("now", "+7 days") AND user = ?';
                break;
            case 'completed':
                sql = 'SELECT * FROM tasks where completed=1 AND user = ?';
                break;
            default:
                break;
        }
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map(t => ({
                id: t.id,
                description: t.description,
                important: t.important,
                private: t.private,
                deadline: t.deadline,
                completed: t.completed
            }));
            resolve(tasks);
        })
    })
} 
