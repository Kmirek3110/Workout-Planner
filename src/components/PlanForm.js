import React from "react";
import { useState } from "react";
import APIService from "../APIService";
import { useCookies } from "react-cookie";

/*
    Tworzenie nowych planów treningowych.
*/
function PlanForm(props) {
  const [plan, setPlan] = useState({ plan_name: "", target: "" });
  const [token] = useCookies(["mytoken"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const CreatePlan = (event) => {
    event.preventDefault();
    APIService.PlanCreate(plan, token["mytoken"])
      .then((resp) => props.addNew(resp))
      .catch((error) => console.log(error));
  };

  return (
    <div className="mb-3 plan-form">
      <form className="PlanForm" onSubmit={CreatePlan}>
        <label htmlFor="plan_name" className="form-label">
          Enter new plan name
        </label>
        <input
          type="text"
          className="form-control"
          name="plan_name"
          placeholder="Please enter workout name"
          onChange={handleChange}
        ></input>
        <label className="form-label">Choose plan type</label>
        <br />
        <select name="target" onChange={handleChange}>
          <option value="" selected disabled hidden>
            Choose here
          </option>
          <option value="STR">Strength building</option>
          <option value="WL">Weight Loss</option>
          <option value="EN">Endurance</option>
        </select>
        <br />

        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default PlanForm;
