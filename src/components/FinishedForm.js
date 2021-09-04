import React from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import APIService from "../APIService";

/* 
    Formularz który pyta nas o aktualny postępy.
*/
function FinishedForm(props) {
  const [token] = useCookies(["mytoken"]);
  const [progress] = useState({ progress: "" });

  const FinishPlan = () => {
    APIService.FinishPlan(props.plan.id, progress, token["mytoken"]).catch(
      (error) => console.log(error)
    );
  };

  return (
    <form onSubmit={FinishPlan}>
      {props.plan.target === "STR" && (
        <label>
          <h3> Enter current powerlifting total</h3>
        </label>
      )}
      {props.plan.target === "EN" && (
        <label>
          <h3> Enter number of push-ups you can perform</h3>
        </label>
      )}
      {props.plan.target === "WL" && (
        <label>
          {" "}
          <h3>Enter current weight</h3>
        </label>
      )}
      <br />
      <input
        type="text"
        onChange={(e) => {
          progress.progress = e.target.value;
        }}
        placeholder="Enter value"
      />
      <button className="btn btn-primary" type="submit">
        Plan instance update
      </button>
    </form>
  );
}

export default FinishedForm;
