import React from 'react';


   /*
   Komponent odpowiedzialny za pogrupowanie
   ćwiczeń według głównych mięśni. 
  */
function Exercise(props) {
    var muscle = {
      "L": "Legs",
      "B": "Back",
      "C": "Chest",
      "S": "Shoulder",
      "T":"Triceps",
      "Bi":"Biceps",
      "A":"ABS & Core"
    };
 
    return (
        <div className ="muslcegroup">
            <h3>{muscle[props.group[0]]}</h3>
            {props.group && props.group[1].map(exercise => {
              return(
                <div key={exercise.id}>
                <div className="exercise">{exercise.exercise_name}</div>
                <div className="hide">{exercise.description}</div>
                </div>
              )
            })}
          {/* <img src={pictures[props.group[0]]} /> */}
        </div >
    )
}

export default Exercise
