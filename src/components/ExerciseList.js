import React, {useEffect, useState} from 'react'
import Exercise from './Exercise'


/*
  Komponent przekazuję listę ćwiczeń do
  Exercise gdzie będą one sortowane.
*/
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
    return (
        <div>
             {exercises && Object.entries(exercises).map(group => {
                  return (
                    <div key={group[0]}>
                      <Exercise  group={group}/>
                      </div>
                  )
               
            })}
            
        </div>
    )
}

ExerciseList.propTypes = {

}

export default ExerciseList

