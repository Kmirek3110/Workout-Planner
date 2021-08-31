/*
    Zbiór poleceń służacych do komunikacji z backendem.
*/

export default class APIService{
    
    static GeneratePlan(body, token){
        // event.preventDefault()
        return fetch(`https://training-plan-generator.herokuapp.com/api/generate-plan`,{
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            },
            body:JSON.stringify(body)
            
        }).then(resp => resp.json())
    }

    static FinishPlan(plan_id, body, token){
        // event.preventDefault()
        return fetch(`https://training-plan-generator.herokuapp.com/api/finished-plan/${plan_id}`,{
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            },
            body:JSON.stringify(body)
            
        }).then(resp => resp.json())
    }

    static PlanCreate(body, token){
        // event.preventDefault()
        return fetch(`https://training-plan-generator.herokuapp.com/api/plan-create`,{
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            },
            body:JSON.stringify(body)
        }).then(resp => resp.json())
    }

    static PlanDelete(token, plan_id){
        return fetch(`https://training-plan-generator.herokuapp.com/api/plan-delete/${plan_id}`,{
            'method':'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            },
        }).then(resp => resp.json())
    }

    static PlanDetail(plan_id, token){
        return fetch(`https://training-plan-generator.herokuapp.com/api/plan-detail/${plan_id}`,{
            'method':'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            }
        }).then(resp => resp.json())
    }

    static PlanAddWorkout(plan_id, body, token){
        console.log("Asdasd",body)
        return fetch(`https://training-plan-generator.herokuapp.com/api/plan-add-workout/${plan_id}`, {
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            }, 
            body:JSON.stringify(body)

        }).then(resp => resp.json())

    }


    static WorkoutList(token){
        console.log("Kreacja", token)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-list`, {
            'method':'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            }
        }).then(resp => resp.json())
    }
    
    static CreateWorkout(body, token){
        console.log("Kreacja", token)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-create`, {
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            }, 
            body:JSON.stringify(body)

        }).then(resp => resp.json())
    }

    static UpdateWorkout(workout_id, body, exercises, token){
        console.log("Updatowanie",workout_id, body)
        console.log("Przy updatowaniu exercises",exercises)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-update/${workout_id}/`, {
            'method':'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` ,
            }, 
            body:JSON.stringify(body)
           

        }).then(resp => resp.json())
    }

    static AddExercise(workout_id, body, token){
        console.log("Przy dodawaniu exercises",body)
        
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-add-exercise/${workout_id}`, {
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`,
            }, 
            body:JSON.stringify(body)
           

        }).then(resp => resp.json())
    }

    static UpdateExercise(workout_id, body, token){
        console.log("Przy udpotowaniu exercises",body)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-update-exercise/${workout_id}`, {
            'method':'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`,
            }, 
            body:JSON.stringify(body)
           

        }).then(resp => resp.json())
    }

    static DeleteExercise(workout_id, body, token){
        console.log("Przy usuwaniu exercises",body)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-delete-exercise/${workout_id}`, {
            'method':'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`,
            }, 
            body:JSON.stringify(body)
           

        }).then(resp => resp.json())
    }

    static DeleteWorkout(workout_id, token){
        console.log("Usuwanie",workout_id)
        return fetch(`https://training-plan-generator.herokuapp.com/api/workout-delete/${workout_id}/`, {
            'method':'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}` 
            }
        })
    }
    static LoginUser(body) {

        return fetch(`https://training-plan-generator.herokuapp.com/auth/`, {
          'method':'POST',
          headers: {
              'Content-Type':'application/json'
            }, 
            body:JSON.stringify(body)
  
        }).then(resp => resp.json())
  
      }
  
  
      static RegisterUser(body) {
  
        return fetch(`https://training-plan-generator.herokuapp.com/api/users`, {
          'method':'POST',
          headers: {
              'Content-Type':'application/json',
              
            }, 
            body:JSON.stringify(body)
  
        }).then(resp => resp.json())
  
      }
}