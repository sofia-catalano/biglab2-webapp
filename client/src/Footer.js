import ButtonAdd from './ButtonAdd.js';
import { Link } from 'react-router-dom';

function Footer(props) {
    return (
        <Link to={`/${props.prevPath}/Add`}>
            <ButtonAdd/>
        </Link>
    );
}

export default Footer;