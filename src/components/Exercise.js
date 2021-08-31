import React from 'react';
import styled from 'styled-components';
import './Exercise.css';
import Legs from './pictures/Legs.jpg'
import Back from './pictures/Back.jpg'
import Chest from './pictures/Chest.jpg'
import Abs from './pictures/Abs.jpg'
import Shoulder from './pictures/Shoulder.jpg'
import Biceps from './pictures/Biceps.jpg'
import Triceps from './pictures/Triceps.jpg'



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
    var pictures = {
      "L": Legs,
      "B": Back,
      "C": Chest,
      "S": Shoulder,
      "T":Triceps,
      "Bi":Biceps,
      "A":Abs
    };
 
    return (
        <div className ="muslcegroup">
            <h3>{muscle[props.group[0]]}</h3>
            {props.group && props.group[1].map(exercise => {
              return(
                <div key={exercise.exercise_name}>
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
