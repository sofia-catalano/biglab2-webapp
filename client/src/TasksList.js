import { iconUserSquare, iconEdit, iconDelete } from './Icon.js';
import { Col, Container, ListGroup, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';


function TasksList(props) {

    const isToday = (deadline) => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const now = dayjs();
        if (deadline) {
            deadline = dayjs(deadline)
            return deadline.format(comparisonTemplate) === now.format(comparisonTemplate);
        }
        else {
            return false
        }
    }

    const isYesterday = (deadline) => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const yesterday = dayjs().subtract(1, 'day');
        return deadline && (deadline.format(comparisonTemplate) === yesterday.format(comparisonTemplate));
    }

    const isTomorrow = (deadline) => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const tomorrow = dayjs().add(1, 'day');
        return deadline && (deadline.format(comparisonTemplate) === tomorrow.format(comparisonTemplate));
    }

    const formatDeadline = (deadline) => {
        if (!deadline || deadline === undefined || deadline === null || deadline === '' || deadline.toString() === 'Invalid Date') {
            return '';
        }
        else {
            deadline = dayjs(deadline);
            if (isToday(deadline)) {
                return deadline.format('[Today at] HH:mm');
            } else if (isTomorrow(deadline)) {
                return deadline.format('[Tomorrow at] HH:mm');
            } else if (isYesterday(deadline)) {
                return deadline.format('[Yesterday at] HH:mm');
            } else {
                return deadline.format('dddd DD MMMM YYYY [at] HH:mm');
            }
        }

    }


    const listItems = props.tasks.map((task, index) => {
        let feedbackColour = ''
        switch (task.status) {
            case 'add':
                feedbackColour = 'bg-green'
                break
            case 'delete':
                feedbackColour = 'bg-red'
                break
            case 'update':
                feedbackColour = 'bg-yellow'
                break
            default:
                feedbackColour = ''
        }
        
        return <ListGroup.Item key={task.id} className={feedbackColour}>
            <Container className="d-flex w-100 justify-content-between">
                <Col xs={4}>
                    <Form.Check type="checkbox" className={(task.important ? "important" : "")} label={task.description} id={"check-t" + index} checked={(task.completed ? true: false)} onChange={()=> props.markTask(task)}/>
                </Col>
                <Col xs={2}>
                    {!task.private ? iconUserSquare : ''}
                </Col>
                <Col xs={4}>
                    <small>{formatDeadline(task.deadline)}</small>
                </Col>
                <Col xs={2}>
                    <Link to={{
                        pathname: (`/${props.filter}/Update`),
                        state: { task: task }
                    }}>{iconEdit}
                    </Link>
                    <span style={{cursor: "pointer"}} onClick={() => props.deleteTask(task)}>{iconDelete}</span>
                </Col>
            </Container>
        </ListGroup.Item>
    }
    );

    return (
        <ListGroup variant='flush'>{listItems}</ListGroup>
    )


}

export default TasksList;
