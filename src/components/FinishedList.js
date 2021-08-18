import React, {useState, useEffect} from 'react'
import {useCookies} from 'react-cookie';
import {Line} from 'react-chartjs-2'

function FinishedList() {

    const [finished, setFinished] = useState([])
    const [token] = useCookies(['mytoken'])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/finished-list', {
          'method':'GET',
          headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token['mytoken']}` 
        }
        })
        .then(resp => resp.json())
        .then(resp => setFinished(resp))
    
      }, [token])


    console.log(finished)
    let value = finished.map(function(item){
      return item.progress;
    })
    // const data = {
    //   labels: ['01', '02', '03', '04', '05', '06'],
    //   datasets: [{
    //       label: 'X',
    //       data: value,
    //       backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)'

    //       ],
    //       borderColor: [
    //           'rgba(255, 99, 132, 1)'

    //       ],
    //       borderWidth: 1
    //   }]
    // }
    var finishedplans = new Object();
    
    
    {finished && finished.forEach(function(element){
      if ([element.plan.plan_name, element.plan.target] in finishedplans){   
        finishedplans[[element.plan.plan_name, element.plan.target]].push(element.progress)
        }
      else{        
        finishedplans[[element.plan.plan_name, element.plan.target]] = []
      }
      })
    }
    
    var target_desc = {
      "WL":"Weight loss chart in kg",
      "EN":"Time to run 2km in seconds",
      "STR":"Powerlifiting total chart",
    }
    
    return (
        <div>
          {finished &&  Object.entries(finishedplans).map(progress => {
            return (
              <div key = {progress[0]}>
                <h3>{progress[0].split(',')[0]}</h3>
                <Line data = {{
                    labels: [...Array(progress[1].length).keys()],
                    datasets: [{
                        label: target_desc[progress[0].split(',')[1]],
                        data: progress[1],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'

                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'

                        ],
                        borderWidth: 1
                    }]
                  }}/>
              </div>
            )})
          }
        </div>
    )
}

export default FinishedList
