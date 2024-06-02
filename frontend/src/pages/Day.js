import React, { useEffect, useState } from 'react'

const InTableRow = ({ kg, ton, name, raduis }) => {
  return (
    <tr>
      <td> {name} </td>
      <td> {raduis} </td>
      <td> {ton} </td>
      <td> {kg} </td>
    </tr>
  )
}

const OutTableRow = ({ kg, ton, name, raduis, field5, money }) => {
  return (
    <tr>
      <td> {money} </td>
      <td> {field5} </td>
      <td> {name} </td>
      <td> {raduis} </td>
      <td> {ton} </td>
      <td> {kg} </td>
    </tr>
  )
}

const Day = () => {
  // let inArrWeightArr = [
  //   {
  //     "weightKg": 356,
  //     "weightTon": 24,
  //     "raduis": 8,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 36,
  //     "weightTon": 4,
  //     "raduis": 10,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 129,
  //     "weightTon": 15,
  //     "raduis": 12,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 987,
  //     "weightTon": 17,
  //     "raduis": 16,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 23,
  //     "weightTon": 24,
  //     "raduis": 8,
  //     "client": "Zeyad"
  //   },
  //   {
  //     "weightKg": 356,
  //     "weightTon": 24,
  //     "raduis": 8,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 36,
  //     "weightTon": 4,
  //     "raduis": 10,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 129,
  //     "weightTon": 15,
  //     "raduis": 12,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 987,
  //     "weightTon": 17,
  //     "raduis": 16,
  //     "client": "MYAF"
  //   },
  //   {
  //     "weightKg": 23,
  //     "weightTon": 24,
  //     "raduis": 8,
  //     "client": "Zeyad"
  //   }
  // ]

  // let outArrWeightArr = [
  //   {
  //     "weightKg": 356,
  //     "weightTon": 24,
  //     "raduis": 8,
  //     "client": "MYAF",
  //     "field5":"+",
  //     "money":155
  //   },
  //   {
  //     "weightKg": 36,
  //     "weightTon": 4,
  //     "raduis": 10,
  //     "client": "MYAF",
  //     "field5":"+",
  //     "money":155
  //   },
  //   {
  //     "weightKg": 129,
  //     "weightTon": 15,
  //     "raduis": 12,
  //     "client": "MYAF",
  //     "field5":"+",
  //     "money":155
  //   }
  // ]

  const [inArrWeightArr, setInArrWeightArr] = useState([])
  const [outArrWeightArr, setOutArrWeightArr] = useState([])

  useEffect(() => {
    const getTicketsInfo = async () => {
      const response = await fetch('http://localhost:7000/ticket/getTickets',
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const json = await response.json()
      if (response.ok) {
        let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
        let dateArr = d.split(',');
        let inArr= [],outArr = []
        console.log(json)
        for(let i of json){
          if(i.date === dateArr[0] && i.type === "out"){
           
            for(let j of i.reciept){
              
              let kgDummy = (j.weight+200)/1000
              let kgStr = kgDummy.toString()
              let kgSplit = kgStr.split(".")
              let obj = {
                name:i.clientName,
                ton:parseInt(j.weight/1000),
                kg: parseInt(kgSplit[1].padEnd(3,'0')),
                raduis: j.radius,
                field5: ".",
                money:1233
              }
              inArr.push(obj)
            }

          }
          setOutArrWeightArr([...inArr])
        }
        for(let i of json){
          if(i.date === dateArr[0] && i.type === "in"){
           
            for(let j of i.reciept){
              
              let kgDummy = (j.weight+200)/1000
              let kgStr = kgDummy.toString()
              let kgSplit = kgStr.split(".")
              let obj = {
                name:i.clientName,
                ton:parseInt(j.weight/1000),
                kg: parseInt(kgSplit[1].padEnd(3,'0')),
                raduis: j.radius,
              }
              outArr.push(obj)
            }

          }
          setInArrWeightArr([...outArr])
        }
        
      }
    }
    getTicketsInfo();
  }, [])

  return (
    <div className='daily-table-holder'>
      <table className='in-table' align='right' >
        <thead>
          <tr>
            <th> نقديه </th>
            <th> +- </th>
            <th> وارد بضاعه </th>
            <th> مللي </th>
            <th> طن </th>
            <th> كيلو </th>
          </tr>
        </thead>
        <tbody>
          {
            outArrWeightArr.map((i, idx) => (
              <OutTableRow key={idx} field5={i.field5} money={i.money} name={i.name} kg={i.kg} ton={i.ton} raduis={i.raduis} />
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td>
              5456645
            </td>
            <th>
              اجمالي صافي الوزن
            </th>
          </tr>
        </tfoot>
      </table>
      <table className='out-table'>
        <thead>
          <tr>
            <th> العميل </th>
            <th> مللي </th>
            <th> طن </th>
            <th> كيلو </th>
          </tr>
        </thead>
        <tbody>
          {
            inArrWeightArr.map((i, idx) => (
              <InTableRow key={idx} name={i.name} kg={i.kg} ton={i.ton} raduis={i.raduis} />
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td>
              5456645
            </td>
            <th>
              اجمالي صافي الوزن
            </th>
          </tr>
        </tfoot>
      </table>

    </div>
  )
}

export default Day