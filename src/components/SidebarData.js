import React from 'react'
import HomeIcon from '@material-ui/icons/Home';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import DirectionsRunOutlinedIcon from '@material-ui/icons/DirectionsRunOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export const SidebarData =[
    // {
    //     title:"Home",
    //     icon:<HomeIcon />,
    //     link:"/"
    // },
    {
        title:"Training Plans",
        icon:<FitnessCenterIcon />,
        link:"/plans"
    },
    {
        title:"Exercises",
        icon:<DirectionsRunOutlinedIcon />,
        link:"/exercises"
    },
    {
        title:"Logout",
        icon:<ExitToAppIcon />,
        link:"/logout"
    }
]