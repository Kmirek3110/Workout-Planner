import React from 'react'
import {useCookies} from 'react-cookie';
import {useState} from 'react'
import APIService from '../APIService';

function FinishedForm(props) {
    const [token] = useCookies(['mytoken'])
    const [progress] = useState({progress:""})

    const FinishPlan = () => {
        APIService.FinishPlan(props.plan.id, progress, token['mytoken'])   
        .catch(error => console.log(error)) 
    }

    return (
        <form onSubmit={FinishPlan}> 
        {(props.plan.target === "STR") &&  <label> Enter current powerlifting total</label>}
        {(props.plan.target === "EN") &&  <label> Enter current time in seconds for 2km run</label>} 
        {(props.plan.target === "WL") &&  <label> Enter current weight</label>}    
        {/* <label htmlFor = "Progress" >{props.target}</label> */}
        <input type="text" onChange= {(e)=> {progress.progress = e.target.value}} placeholder = "Enter progress value"/>
        <button type="submit">Plan instance update</button>
    </form>
    )
}

export default FinishedForm
