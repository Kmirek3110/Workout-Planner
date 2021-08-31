import React from 'react'
import {useState} from 'react'
import APIService from '../APIService'
import {useCookies} from 'react-cookie';

/*
    Obsługa tworzenia nowej jednostki treningowej.
*/
function WorkoutForm(props) {


    const [title, SetWorkouttitle] = useState('')
    const [token] = useCookies(['mytoken'])


    const CreateWorkout = () => {
        APIService.PlanAddWorkout(props.plan_id, {"title":title}, token['mytoken'])
        // .then(props.addNew(props))
        .then(window.location.reload())
        .catch(error => console.log(error))
    }
    
    return (
        <div>
            <div className = "Row">
                <div className = "mb-3">
                {/* <label htmlFor = "Workout" className = "form-label">Workouts</label> */}

                    <form className ="WorkoutCreation" onSubmit={CreateWorkout}>
                        <label >Create new Workout</label>
                        <input type="text" className = "form-control" id="title" placeholder = "Please enter workout name"
                         onChange = {e => SetWorkouttitle(e.target.value)}></input>
                        <button type="submit">Add</button>
                    </form>
                  
                </div>
            
            </div>
        </div>
    )
}

export default WorkoutForm
