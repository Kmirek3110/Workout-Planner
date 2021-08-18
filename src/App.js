import React from 'react'
import {useState, useEffect} from 'react'
import ExerciseList from './components/ExerciseList'
import PlanList from './components/PlanList'
import {useCookies} from 'react-cookie';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import {CookiesProvider} from 'react-cookie'
import TrainingPlan from './components/TrainingPlan'
import LogOut from './components/LogOut'
import './App.css';
import { Layout } from './components/Layout'
import {NavigationBar } from './components/Navbar'
import FinishedList from './components/FinishedList';
import GenerateForm from './components/GenerateForm';
// import {ScrollRestoration,RestoredScroll} from 'react-scroll-restoration'



function App() {

  const [exercises, setExercises] = useState([])
  const [token] = useCookies(['mytoken'])


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/exercise-list', {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      
      }
    })
    .then(resp => resp.json())
    .then(resp => setExercises(resp))

  }, [token])
  

  return (

    <CookiesProvider>
    <BrowserRouter>
        <NavigationBar/>
        {/* <Sidebar/> */}
       
        <Layout> 
      
        <Switch>
          <Route exact path = "/">
            <Login/>
          </Route>
        </Switch>
       

     
        {/* <Switch>
           <Route exact path = "/home">
              <div className = "col">
                <h3>Homepage  </h3>
             </div>    
              </Route>
          </Switch> */}

          <Switch>
           <Route exact path = "/plans" >
              <div className = "col">
                <PlanList />
             </div>    
              </Route>
          </Switch>


          <Switch>
            <Route path = "/plan/:slug">
              <TrainingPlan/>      
            </Route>
          </Switch>
         
         
          <Switch>
            <Route exact path = "/exercises">
              <ExerciseList exercises={exercises}/> 
          </Route>
          </Switch>

        <Switch>
          <Route exact path = "/finished">
            <FinishedList/>
          </Route>
        </Switch>

        <Switch>
          <Route exact path = "/generate-plan">
            <GenerateForm exercises={exercises} />
          </Route>
        </Switch>

        <Switch>
          <Route exact path = "/login">
            <Login/>
          </Route>
        </Switch>

        <Switch>
          <Route exact path = "/logout">
            <LogOut/>
          </Route>
        </Switch>
        </Layout>
        <br/>      
        {/* <button onClick = {handleLogout} className = "btn btn-primary">Logout</button> */}
        <br/>
      </BrowserRouter>
      </CookiesProvider>
      
  ) 
}


export default App;
