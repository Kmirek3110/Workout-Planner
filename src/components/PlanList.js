import React from 'react'
import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import PlanForm from './PlanForm';
import APIService from '../APIService';
import FinishedForm from './FinishedForm';


/*
  Wszystkie aktualne plany treningowe 
  danego użytkownika.
*/
function PlanList() {

    let history = useHistory()
    const [token] = useCookies(['mytoken'])
    const [clicked, setClicked] = useState(false)
    const [, setGenerate] = useState(false)
    const [plans, setPlans] = useState([])
    const [chosenPlan,setChosenPlan] = useState("")
    const [showDoneForm, setShowDoneForm] = useState(false)

      const PlanDoneForm = (plan) => {
        setShowDoneForm(!showDoneForm);
        setChosenPlan(plan.id)
    }

    useEffect(() => {
        fetch(`https://training-plan-generator.herokuapp.com/api/plans-list`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Token ${token['mytoken']}`,

      }
    })
    .then(resp => resp.json())
    .then(resp => setPlans(resp))
   
    }, [token])

    const buttonHandler = (option) => {
      if(option === 0){
        setClicked(current => !current)
        setGenerate(false)
      }
      else if (option === 1){
        setGenerate(current => !current)
        setClicked(false)
      }
    }

    const dltPlan = (plan) => {
        const new_plans = plans.filter(myplan => {
          if(myplan.id === plan.id) {
            return false
          }
          return true;
        })
        setPlans(new_plans)
      }

    const DeletePlan = (plan) => {
        APIService.PlanDelete(token['mytoken'],plan.id)
        .then(dltPlan(plan))
        .catch(error => console.log(error))
    }

    const addNewPlan = (plan) => {
        setPlans(plans => [...plans,plan])
        setClicked(current => !current)
    }


    return (
        <div>  
            <br/>
            <br/>
            <div className="row">
        {plans && plans.map(plan => {           
            return(
                <div key={plan.id}>
                
                <button type="button" className="PlanElement" onClick={() => history.push(`/plan/${plan.id}`)}>{plan.plan_name}
                    </ button>
                    <div className="column">
                    <button className = "btn btn-danger plnbtn" onClick={() => DeletePlan(plan)}> Delete Plan</button>
                    <button className = "btn btn-dark plnbtn" onClick  = {() => PlanDoneForm(plan)}> Plan Instance Done</button>
                    {showDoneForm && (chosenPlan === plan.id) && <FinishedForm plan={plan}/> }
                    </div>                 
                </div>
            )
            
        })}
        </div>
     
        {clicked ? <PlanForm addNew = {addNewPlan} /> :<div/>}
        <br/>
      
        <div className ="Row" >

        <button type="button" className="btn btn-success middle" onClick={() => buttonHandler(0)} >
            Create new Training Plan
        </button>

        <button type="button" className="btn btn-secondary right" onClick={() => history.push(`/generate-plan`)}>Generate CUSTOM PLAN</ button>

        </div>
        
        </div>
    )
}

PlanList.propTypes = {

}

export default PlanList

