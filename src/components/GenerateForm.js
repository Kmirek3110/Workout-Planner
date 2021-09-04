import React from "react";
import APIService from "../APIService";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useHistory } from "react-router-dom";

/*
Formularz do generowania planów treningowych.
*/
function GenerateForm(props) {
  const [planinfo] = useState({
    number: "",
    target: "",
    time: "",
    exercises: [],
  });
  const [error, setError] = useState(false);
  const [token] = useCookies(["mytoken"]);
  let history = useHistory();

  let all_names =
    props.exercises &&
    props.exercises.map(function (item) {
      return { exercise_name: item.exercise_name };
    });

  const handleSumbit = (e) => {
    e.preventDefault();
    if (error === false)
      APIService.GeneratePlan(planinfo, token["mytoken"]).then((resp) =>
        history.push(`/plan/${resp.id}`)
      );
  };
  console.log(error);

  return (
    <form onSubmit={handleSumbit}>
      <label className="form-label">Number of workouts in plan</label>
      <Select
        name="number"
        options={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]}
        getOptionLabel={(options) => options["value"]}
        getOptionValue={(options) => options["value"]}
        required
        type="number_of_workouts"
        onChange={(e) => {
          planinfo["number"] = e.value;
        }}
      />
      <label className="form-label">Plan Target</label>

      <Select
        name="target"
        options={[
          { label: "Strength building", value: "STR" },
          { label: "Weight Loss", value: "WL" },
          { label: "Endurance", value: "EN" },
        ]}
        getOptionLabel={(options) => options["label"]}
        getOptionValue={(options) => options["value"]}
        required
        type="target"
        onChange={(e) => {
          planinfo["target"] = e.value;
        }}
      />
      <label className="form-label">Time per workout</label>
      <br />
      <input
        name="time"
        placeholder="Enter Time"
        required
        onChange={(e) => {
          planinfo["time"] = e.target.value;
          
            !Number(e.target.value) || 0 > e.target.value || e.target.value > 90
              ? setError(true)
              : setError(false);
          
          
            e.target.value === "" ? setError(false) : <div />;
          
        }}
      />
      {error && (
        <div>
          <br />{" "}
          <span className="error">
            Must be a numeric value between 0 and 90
          </span>
        </div>
      )}
      <br />

      <label className="form-label">Mandatory exercises</label>
      <Select
        options={all_names}
        isMulti
        className="basic-multi-select"
        getOptionLabel={(options) => options["exercise_name"]}
        getOptionValue={(options) => options["exercise_name"]}
        name="exercises"
        onChange={(e) => {
          planinfo["exercises"] = e;
        }}
      />
      <input type="submit" value="Submit" />
      {error && <h3>Invalid form</h3>}
    </form>
  );
}

export default GenerateForm;
