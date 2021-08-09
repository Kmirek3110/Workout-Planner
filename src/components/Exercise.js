import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  .div {
    background-color: #333;
  }
  .h3{
    background-color: #333;
  }
  a, .navbar-brand, .navbar-nav .nav-link {
    color: #bbb;
    &:hover {
      color: lightblue;
    }
  }
`;

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
        <Styles className ="muslcegroup">
            <h3>{muscle[props.group[0]]}</h3>
            {props.group && props.group[1].map(exercise => {
              return(
                <div>{exercise.exercise_name}</div>
              )
            })}
        </Styles >
    )
}

export default Exercise
