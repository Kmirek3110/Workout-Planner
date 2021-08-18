import React from 'react'
import { SidebarData } from './SidebarData'
import {Link} from 'react-router-dom'
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="Sidebar">   
        <ul>
            {SidebarData.map((val,key) => {
                return (
                    <li key={key}>
                       
                        <Link to={val.link}>
                        <div>{val.icon}</div>
                        <div>
                            {val.title}
                        </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
           
        </div>
    )
}

export default Sidebar
