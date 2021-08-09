import React, {useState, useEffect} from 'react'
import {useCookies} from 'react-cookie';
import {Line} from 'react-chartjs-2'

function FinishedList() {

    const [finished, setFinished] = useState([])
    const [token] = useCookies(['mytoken'])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/finished-list', {
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
    const data = {
      labels: ['01', '02', '03', '04', '05', '06'],
      datasets: [{
          label: 'X',
          data: value,
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)'

          ],
          borderColor: [
              'rgba(255, 99, 132, 1)'

          ],
          borderWidth: 1
      }]
    }
    var dict = new Object();
    
    
    {finished && finished.forEach(function(element){
      if (element.plan.plan_name in dict){   
        dict[element.plan.plan_name].push(element.progress)
        }
      else{
        dict[element.plan.plan_name] = []
      }
      })
    }

    

    console.log(finished)

    console.log(Object.entries(dict), "DICT")
    
    return (
        <div>
          {finished &&  Object.entries(dict).map(progress => {
            return (
              <div>
                <h3>{progress[0]}</h3>
                <Line data = {{
                    labels: ['01', '02', '03', '04', '05', '06'],
                    datasets: [{
                        label: 'X',
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
