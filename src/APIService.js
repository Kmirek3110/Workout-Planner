/*
    Zbiór poleceń służacych do komunikacji z serwerem backendowym.
*/

var PORT = process.env.PORT;
export default class APIService {
  static GeneratePlan(body, token) {
    return fetch(`http://127.0.0.1:8000/api/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static FinishPlan(plan_id, body, token) {
    return fetch(`http://127.0.0.1:8000/api/finished-plan/${plan_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static PlanCreate(body, token) {
    return fetch("http://127.0.0.1:8000/api/plan-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static PlanDelete(token, plan_id) {
    return fetch(`http://127.0.0.1:8000/api/plan-delete/${plan_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }).then((resp) => resp.json());
  }

  static PlanDetail(plan_id, token) {
    return fetch(`http://127.0.0.1:8000/api/plan-detail/${plan_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }).then((resp) => resp.json());
  }

  static PlanAddWorkout(plan_id, body, token) {
    return fetch(`http://127.0.0.1:8000/api/plan-add-workout/${plan_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static WorkoutList(token) {
    return fetch(`http://127.0.0.1:8000/api/workout-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }).then((resp) => resp.json());
  }

  static CreateWorkout(body, token) {
    return fetch(`http://127.0.0.1:8000/api/workout-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static UpdateWorkout(workout_id, body, exercises, token) {
    return fetch(`http://127.0.0.1:8000/api/workout-update/${workout_id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static AddExercise(workout_id, body, token) {
    return fetch(
      `http://127.0.0.1:8000/api/workout-add-exercise/${workout_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      }
    ).then((resp) => resp.json());
  }

  static UpdateExercise(workout_id, body, token) {
    return fetch(
      `http://127.0.0.1:8000/api/workout-update-exercise/${workout_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      }
    ).then((resp) => resp.json());
  }

  static DeleteExercise(workout_id, body, token) {
    return fetch(
      `http://127.0.0.1:8000/api/workout-delete-exercise/${workout_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      }
    ).then((resp) => resp.json());
  }

  static DeleteWorkout(workout_id, token) {
    return fetch(`http://127.0.0.1:8000/api/workout-delete/${workout_id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
  }
  static LoginUser(body) {
    return fetch("http://127.0.0.1:8000/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static RegisterUser(body) {
    return fetch("http://127.0.0.1:8000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }
}
