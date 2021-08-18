import React, {useEffect, useState} from 'react'
import Exercise from './Exercise'

function ExerciseList(props) {
    
    const [exercises,SetExercises] = useState([])

    useEffect(() => {

        var dict = new Object();


        {props.exercises && props.exercises.forEach(function(element){
            if (element.type in dict){   
              dict[element.type].push(element)
              }
            else{
              dict[element.type] = []
            }
            })
        }        
        SetExercises(dict)
    }, [props.exercises])

    console.log(exercises)

    return (
        <div>
             {exercises && Object.entries(exercises).map(group => {
                 
                return (
                    <Exercise  group={group}/>
                )
                
            })}
            
        </div>
    )
}

ExerciseList.propTypes = {

}

export default ExerciseList

