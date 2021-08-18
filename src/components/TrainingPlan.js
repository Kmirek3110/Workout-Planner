import React from 'react'
import APIService from '../APIService';
import {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import {useCookies} from 'react-cookie';
import WorkoutList from './WorkoutList';
import WorkoutForm from './WorkoutForm';


function TrainingPlan() {

    

    let {slug} = useParams();
    const [token] = useCookies(['mytoken'])
    const [plan, setPlan] = useState("")
    const [workout, SetWorkouts] = useState("")
    const [clicked, setClicked] = useState(false);


    const buttonHandler = () => {
        setClicked(current => !current)
    }


    useEffect(() => {
        APIService.PlanDetail(slug,token['mytoken'])
        .then(resp => setPlan(resp))
        .then(plan && SetWorkouts(plan[0].workouts))
        .catch(error => console.log(error))
    },[])

    return (
        <div>
            <br/>
            <button type="button" className="btn btn-success wrksize" style = {{height:"60px",width: "300px"}}onClick={buttonHandler} >
                 Create new Workout
            </button>
            
            <br/>
            <br/>

            {plan && <WorkoutList workouts={plan[0].workouts} target={plan[0].target}/>}
            {clicked ? <WorkoutForm plan_id={plan[0].id}/>:<div></div>}

        </div>
    )
}

TrainingPlan.propTypes = {

}

export default TrainingPlan

