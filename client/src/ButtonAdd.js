import Button from 'react-bootstrap/Button';
import {iconPlus} from './Icon.js';

function ButtonAdd(){
    return(
      <Button type="button" variant="success" size="sm" className="fixed-right-bottom" >
        {iconPlus}
      </Button>
    );
}

export default ButtonAdd;