
import React, {useState} from 'react'
import {useCookies} from 'react-cookie';
import APIService from '../APIService';
import ExerciseForm from './ExerciseForm';

/*
    Element odpowiedzialny za wygląd oraz strukturę
    jednostki trenignowej.
*/
function Workout(props) {

    const [exercise, SetExercise] = useState({exercise_name:"", reps:"", sets:""})
    const [token] = useCookies(['mytoken'])
    const [ , setWorkoutAdd] =  useState("")
    const [exerciseEdit] = useState({workout:"",exercise:""})
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false);
    // var scrollposition;

    const ExrAddForm = (workout) => {
        setShowAddForm(!showAddForm);
        setWorkoutAdd(workout.title)
    }


    const ExrEditForm = (workout, exercise) => {
        setShowEditForm(!showEditForm);
        exerciseEdit.workout = workout.title
        exerciseEdit.exercise = exercise.exercise_name
        
    }

    const UpdateExercise = (workout, name) => {
        exercise.exercise_name = name
        APIService.UpdateExercise(workout.id, exercise, token['mytoken'])
        .then(window.location.reload())
        .catch(error => console.log(error))
      }
    
   
    const deleteBtn = (workout) => {
        APIService.DeleteWorkout(workout.id)
        .then(props.deleteWorkout(workout))
        .catch(error => console.log(error))
    }


    const deleteExcr = (workout, exercise) =>{
        
        console.log("TEST", exercise)
        APIService.DeleteExercise(workout.id, exercise, token['mytoken'])
        .then(window.location.reload())
        .catch(error => console.log(error))
    }

    const handleChange = e => {
        const {name, value} = e.target;
        SetExercise(prevState => ({
            ...prevState,
            [name]:value
        }))
    }




    return (
        <div className="WorkoutElement" key = {props.workout.id}>
                        <h3>{props.workout.title}</h3>
                        {props.workout.exercises && props.workout.exercises.map(exercise =>{
                            return (
                                
                                <div key = {exercise.exercise_name}>
                                    <div className = "row">
                                        <div className = "col">
                                            <h2>{exercise.exercise_name}</h2>
                                            <h2>Reps:{exercise.reps}</h2>
                                            <h2>Sets:{exercise.sets}</h2>
                                        </div>
                                     
                                    {/* <div className = "col-md-1"> */}
                                        <button className = "btn btn-primary test" onClick  = {() => ExrEditForm(props.workout, exercise)}> Edit Exercise</button>
                                    {/* </div> */}
                                    {/* <div className = "col-md-2"> */}
                                        <button className = "btn btn-danger test" onClick  = {() => deleteExcr(props.workout,exercise)}> Delete exercise</button>
                                    {/* </div> */}
                                    {showEditForm &&
                                     (exercise.exercise_name === exerciseEdit.exercise) && 
                                    <form onSubmit={() => UpdateExercise(props.workout, exercise.exercise_name)}>
                                        <label>
                                        Reps:
                                        <input type="text"  name="reps"  onChange={handleChange}/>
                                        </label>
                                        <label>
                                        Sets:
                                        <input type="text"  name="sets" onChange={handleChange}/>
                                        </label>
                                        <input type="submit" value="Change" />
                                       
                                  </form>
                                    } 
                                    </div>
                                </div>)


                        }) 
                        }
                        {showAddForm &&
                            <ExerciseForm workout={props.workout}/>
                        }
                    
                        <div className = "row">
                            <div className = "col-md-2">
                                <button className = "btn btn-secondary" onClick = {() => ExrAddForm(props.workout)} > 
                                                                        Add new exercise</button>
                            </div>
                            <div className = "col-md-2">
                                <button className = "btn btn-danger" onClick  = {() => deleteBtn(props.workout)}> Delete workout</button>
                            </div>

                        </div>

                        </div>
    )
}


export default Workout

