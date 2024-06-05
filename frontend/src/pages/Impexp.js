
import React, { useEffect, useState } from 'react'
import inventory from '../assets/images/inventory_icon.PNG';
import '../assets/css/impexp.css'
const Impexp = () => {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const getDailyData = async () => {
      const response = await fetch('http://localhost:7000/irons/getIronStorage',
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }


      )
      const ironStorage = await response.json();
      let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
      let dateArr = d.split(',');
      // console.log(dateArr[0] );
      // console.log(ironStorage[0].props[0].date == dateArr[0]);

      let dummyDailyData = [];
      ironStorage.map((iron) => {
        iron.props.map((prop) => {
          if (prop.date == dateArr[0]) {
            let rowitem = {
              name: iron.name,
              weight: prop.weight,
              radius: prop.radius
            }
            dummyDailyData.push(rowitem);
          }

        })
      })
      console.log(dummyDailyData);
      setDailyData([...dummyDailyData]);


    }

    getDailyData();
  }, [])
  return (

    <div style={{ direction: "rtl" }}>
      <div className='header'>
        <img src={inventory} alt="ohoh" />
        <h1>الجرد اليومي</h1>

      </div>
      <table style={{ direction: "rtl" }} className='impexp-table'>
        <thead>
          <tr>
            <th>وزن الحديد</th>
            <th>القطر</th>
            <th>النوع</th>
          </tr>
        </thead>
        <tbody>
          {
            dailyData.map((el) => (
              <>
                <tr>
                  <td>{el.weight}</td>
                  <td>{el.radius}</td>
                  <td>{el.name}</td>
                </tr>

              </>
            ))
          }
        </tbody>
      </table>

    </div>
  )
}

export default Impexp