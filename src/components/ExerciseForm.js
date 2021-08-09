

import React, {useState, useEffect} from 'react'
import APIService from '../APIService'
import Select from 'react-select'
import {useCookies} from 'react-cookie';




function ExerciseForm(props) {
    const [all_exercises, SetAllExercises] = useState([])
    const [exercises, setExercises] = useState({exercise_name:"",reps:"",sets:""})
    const [token] = useCookies(['mytoken'])
    const [errors] = useState({reps:"",sets:""})

    const handleChange = e => {

        const {name, value} = e.target;
        setExercises(prevState => ({
            ...prevState,
            [name]:value
        }))

     

        switch(name){
            case "reps":
                errors.reps = 
                    !isNaN(value) && 0 < value && value < 30 ? '' : "Must be a number between 0 and 30"

                if (value === "")
                    errors.reps = "" 
                break

            case "sets":
                errors.sets = 
                    !isNaN(value) && 0 < value && value < 10 ? '' : "Must be a number between 0 and 10"
                if (value === "")
                    errors.sets = "" 
                break
            default:
                break
        }

    }
    
    useEffect(() => {
        fetch('http://127.0.0.1:8000/exercise-list', {
        'method':'GET',
        headers: {
            'Content-Type':'application/json',
            }
            })
        .then(resp => resp.json())
        .then(resp => SetAllExercises(resp))
    }, [])

   
    
    let all_names = all_exercises.map(function(item){
        return {value:item.exercise_name};
    })


    const AddExercise = (e) => {    
            e.preventDefault()  
            APIService.AddExercise(props.workout.id,exercises,token['mytoken'])
            .then(props.addEx(props.workout.id, exercises))    
            .then(props.showAddForm(false))
            .catch(error => console.log(error))
    }
    
    return (
        <form>
                
            <label htmlFor = "exercises" className = "form-label">Exercises</label>
            <Select options={all_names} 
                getOptionLabel={options => options["value"]}
                getOptionValue={(options) => options['value']} 
                name="exercise_name"
                onChange= {(e) => {
                    setExercises(prevState => ({
                        ...prevState,
                        ["exercise_name"]:e.value}))}}/>
            
            <div className ="Row" >
                <input type="text" value={exercises.reps} onChange= {handleChange} name="reps" placeholder = "Number of reps"/>
                {errors.reps.length > 0 && <span className='error'>{errors.reps}</span>}
                <input type="text" value={exercises.sets} onChange= {handleChange} name="sets" placeholder = "Number of sets"/>
                {errors.sets.length > 0 && <span className='error'>{errors.sets}</span>}
            </div>
            <button onClick = {AddExercise} className = "btn btn-success">Update Workout</button>
            <br/>
            
        </form>
    )
                   
}

export default ExerciseForm
