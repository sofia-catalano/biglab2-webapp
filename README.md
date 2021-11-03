# BigLab 2 - Class: 2021 AW1 A-L

## Team name: TEAM_NAME

Team members:
* s290750 Guglielmi Nicola
* s290364 Catalano Sofia
* s290148 Dongiovanni Alessio
* s292516 Davide Leone 

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

### Design API ###


########################################## 1

URL: /api/tasks or /api/tasks?filter=<nomefiltro>
Method: GET
Description: Gets all tasks on DB or, if any filter is active, the filtered list
Request body: None
Response body: An array of objects, each one describing a task.
[{
    "id": 1,
    "description": "Task Name",
    "important": 0,
    "private": 1,
    "deadline": "2010-05-20 15:10",
    "completed": 0,
    "user": 1
},
{
    "id": 2,
    "description": "New Task",
    "important": 1,
    "private": 1,
    "deadline": "2011-07-02 08:00",
    "completed": 1,
    "user": 1
}
]
Response: 200 Ok (Success)
	      500 Internal Server Error (Any errors on db)

##########################################	2 

URL: /api/tasks:id
Method: GET
Description: Gets taks on DB filtered by id
Request body: None
Response body: An array of objects, each describing all tasks.
{
    "id": 1,
    "description": "Task Name",
    "important": 0,
    "private": 1,
    "deadline": "2011-07-02 08:00",
    "completed": 0,
    "user": 1
}
Response: 200 Ok (Success) 
		  400 Bad Request (User data not accettable)
		  500 Internal Server Error (Errors on db)
	

########################################## 3

URL: /api/tasks
Method: POST 
Description: Create a new taks on DB, return ID created by DB
Request body: An object with task to add
{
    "description": "Task Name",
    "important": 0,
    "private": 1,
    "deadline": "2010-05-20 15:10",
    "completed": 0,
    "user": 1
}
Response body: An object with id 
{
    "id": 2
}
Response: 201 Created (Success)
		  400 Bad Request (User data not accettable)
		  500 Internal Server Error (Errors on db)

############################################# 4		

URL: /api/task
Method: PUT 
Description: Modify task by ID, return object modified (ID will not be modified)
Request body: An object with task to modify
{
    "id": 5,
    "description": "Task Name",
    "important": 0,
    "private": 1,
    "deadline": "2010-05-20 15:10",
    "completed": 0,
    "user": 1
}
Response body: {
    "id": 15
}
Response: 200 Ok (Success)
		  400 Bad Request (User data not accettable)
		  500 Internal Server Error (Errors on db)

########################################## 5
URL: /api/mark
Method: PUT
Description: Mark task by ID as completed or uncompleted
Request body: An object with task to modify
{
    "id": 3,
    "completed": 0,
}
Response body: None
Response: 200 Ok (Success)
		  400 Bad Request (User data not accettable)
		  500 Internal Server Error (Errors on db)

########################################## 6

URL: /api/task:ID
Method: DELETE
Description: Delete task by ID
Request body: None
Response body: None
Response: 200 Ok (Success) 
          400 Bad Request (User data not accettable)
          410 Gone (If deleted)
		  500 Internal Server Error (Errors on db)

## Credenziali
    username: utente1@polito.it
    password: Password1

    username: utente2@polito.it
    password: Password2


