import APIService from "../APIService";
import React, { useState, useEffect } from "react";
import ExerciseForm from "./ExerciseForm";
import { useCookies } from "react-cookie";

/*
    Komponent w którym listujemy wszystkie ćwiczenia
    należące do danej jednostki treningowej.
*/
function WorkoutList(props) {
  const [exercise, SetExercise] = useState({
    exercise_name: "",
    reps: "",
    sets: "",
  });
  const [token] = useCookies(["mytoken"]);
  const [chosenWorkout, setchosenWorkout] = useState("");
  const [exerciseEdit] = useState({ workout: "", exercise: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errors] = useState({ reps: "", sets: "" });
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    setWorkouts(props.workouts);
  }, [props.workouts]);

  const ExrAddForm = (workout) => {
    setShowAddForm(!showAddForm);
    setchosenWorkout(workout.title);
  };

  const ExrEditForm = (workout, exercise) => {
    setShowEditForm(!showEditForm);
    exerciseEdit.workout = workout.title;
    exerciseEdit.exercise = exercise.exercise_name;
  };

  const deleteBtn = (workout) => {
    APIService.DeleteWorkout(workout.id)
      .then(window.location.reload())
      .catch((error) => console.log(error));
  };

  const addNewEx = (workout, exercise) => {
    var tmp_workouts = [];
    workouts.forEach((myworkout) => {
      if (myworkout.id === workout) {
        const wtmp = myworkout;
        wtmp.exercises.push(exercise);
        tmp_workouts.push(wtmp);
      } else {
        tmp_workouts.push(myworkout);
      }
    });
    setWorkouts(tmp_workouts);
  };

  const UpdEx = (workout, exercise) => {
    var tmp_workouts = [];
    workouts.forEach((myworkout) => {
      if (myworkout.id === workout.id) {
        const wtmp = myworkout;
        const index = wtmp.exercises.findIndex(
          (ex) => ex.exercise_name === exercise.exercise_name
        );
        wtmp.exercises[index] = exercise;
        tmp_workouts.push(wtmp);
      } else {
        tmp_workouts.push(myworkout);
      }
    });
    setWorkouts(tmp_workouts);
  };

  const dltEx = (exercise) => {
    var tmp_workouts = [];
    workouts.forEach((workout) => {
      const wtmp = workout;
      wtmp.exercises = workout.exercises.filter((exer) => {
        if (exer.exercise_name === exercise.exercise_name) {
          return false;
        }
        return true;
      });

      tmp_workouts.push(wtmp);
    });
    setWorkouts(tmp_workouts);
  };

  const deleteExcr = (workout, exercise) => {
    APIService.DeleteExercise(workout.id, exercise, token["mytoken"])
      .then(dltEx(exercise))
      .catch((error) => console.log(error));
  };

  const UpdateExercise = (event, workout, name) => {
    event.preventDefault();
    exercise.exercise_name = name;
    if (errors.reps.length === 0 && errors.reps.length === 0) {
      APIService.UpdateExercise(workout.id, exercise, token["mytoken"])
        .then(UpdEx(workout, exercise))
        .then(setShowEditForm(false))
        .catch((error) => console.log(error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    SetExercise((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    switch (name) {
      case "reps":
        errors.reps =
          !isNaN(value) && 0 < value && value < 30
            ? ""
            : "Must be a number between 0 and 30";

        if (value === "") errors.reps = "";
        break;

      case "sets":
        errors.sets =
          !isNaN(value) && 0 < value && value < 10
            ? ""
            : "Must be a number between 0 and 10";
        if (value === "") errors.sets = "";
        break;
      default:
        break;
    }
  };

  return (
    <div className="WorkoutList">
      {workouts &&
        workouts.map((workout) => {
          return (
            <div className="WorkoutElement" key={workout.id}>
              <h3>{workout.title}</h3>
              <div className="horizontal_line" />
              {workout.exercises.map((exercise) => {
                return (
                  <div key={exercise.exercise_name}>
                    <div className="title 2">{exercise.exercise_name}</div>
                    <div className="row">
                      <div className="exr-desc">
                        <div className="wrk-base Col">
                          <h2>Reps:{exercise.reps}</h2>
                          <h2>Sets:{exercise.sets}</h2>
                        </div>

                        <button
                          className="btn btn-primary wrkbutton"
                          onClick={() => ExrEditForm(workout, exercise)}
                        >
                          {" "}
                          Edit Exercise
                        </button>

                        <button
                          className="btn btn-danger wrkbutton"
                          onClick={() => deleteExcr(workout, exercise)}
                        >
                          {" "}
                          Delete exercise
                        </button>
                        <div className="horizontal_dotted_line" />
                      </div>

                      {showEditForm &&
                        exercise.exercise_name === exerciseEdit.exercise &&
                        workout.title === exerciseEdit.workout && (
                          <form
                            onSubmit={(e) =>
                              UpdateExercise(e, workout, exercise.exercise_name)
                            }
                          >
                            <div className="Row">
                              <label>
                                Reps:
                                <input
                                  type="text"
                                  name="reps"
                                  onChange={handleChange}
                                />
                              </label>
                              {errors.reps.length > 0 && (
                                <span className="error">{errors.reps}</span>
                              )}
                              <label>
                                Sets:
                                <input
                                  type="text"
                                  name="sets"
                                  onChange={handleChange}
                                />
                              </label>
                              {errors.sets.length > 0 && (
                                <span className="error">{errors.sets}</span>
                              )}
                              <input type="submit" value="Change" />
                            </div>
                          </form>
                        )}
                    </div>
                  </div>
                );
              })}
              {showAddForm && workout.title === chosenWorkout && (
                <ExerciseForm
                  addEx={addNewEx}
                  workout={workout}
                  showAddForm={setShowAddForm}
                />
              )}

              <div className="row">
                <div className="col-md-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => ExrAddForm(workout)}
                  >
                    Add new exercise
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteBtn(workout)}
                  >
                    {" "}
                    Delete workout
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default WorkoutList;
