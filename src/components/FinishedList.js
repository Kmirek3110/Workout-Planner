import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Line } from "react-chartjs-2";

/* 
   Komponent służący do generowania wykresów z aktualnych postępów.
  */
function FinishedList() {
  const [finished, setFinished] = useState([]);
  const [token] = useCookies(["mytoken"]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/finished-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["mytoken"]}`,
      },
    })
      .then((resp) => resp.json())
      .catch((error) => console.log(error))
      .then((resp) => setFinished(resp));
  }, [token]);

  var finishedplans = Object();
  if (finished && finished.length > 0 && finished !== "failed") {
      finished.forEach(function (element) {
        if ([element.plan.plan_name, element.plan.target] in finishedplans) {
          finishedplans[[element.plan.plan_name, element.plan.target]].push(
            element.progress
          );
        } else {
          finishedplans[[element.plan.plan_name, element.plan.target]] = [
            element.progress,
          ];
        }
      });
  }

  var target_desc = {
    WL: "Weight loss chart in kg",
    EN: "Number of push-ups",
    STR: "Powerlifiting total chart",
  };

  return (
    <div>
      {finished ? (
        Object.entries(finishedplans).map((progress) => {
          return (
            <div key={progress[0]}>
              <h3>{progress[0].split(",")[0]}</h3>
              <Line
                data={{
                  labels: [...Array(progress[1].length).keys()],
                  datasets: [
                    {
                      label: target_desc[progress[0].split(",")[1]],
                      data: progress[1],
                      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                      borderColor: ["rgba(255, 99, 132, 1)"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          );
        })
      ) : (
        <div>
          <h3>THERE ARE NO FINISHED TRAINING PLANS</h3>
        </div>
      )}
    </div>
  );
}

export default FinishedList;
