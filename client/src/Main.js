import TasksList from './TasksList.js';
function Main(props){
    return(
        <>
            {props.loading ? <h3>Please wait, loading your tasks... </h3> :
            <>
            <h1>{props.filter}</h1>
            <TasksList filter={props.filter} tasks={props.tasks} setTasks={props.setTasks} deleteTask={props.deleteTask} markTask={props.markTask}/>
            </>}
        </>
    );
}

export default Main;