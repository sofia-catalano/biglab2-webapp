import { NavLink } from 'react-router-dom';

const filters = ['All', 'Important', 'Today', 'Next 7 Days', 'Private'];

function Sidebar(props){
    let show = props.show ? "show" : " ";

    const filterTask = (filter) => {
        if (filter === "Next 7 Days") 
            props.setFilterBy("next7days");
        else{
            props.setFilterBy(filter.toLowerCase());
        }
        props.setDirty(true);
        }

    return(
        <aside className= {"collapse col-12 col-sm-4 d-sm-block bg-light below-nav list-group list-group-flush " + show}  id="left-sidebar">
                {
                    filters.map(
                        (filter) => 
                            <NavLink to={`/${filter}`} activeClassName='active'className='list-group-item list-group-item-action ' key={filter} 
                            onClick= {()=> filterTask(filter)}>
                            {filter}
                            </NavLink>
                    )
                }
        </aside>
    );
}
export default Sidebar;
