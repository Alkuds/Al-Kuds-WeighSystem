import React from 'react'

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
  let inArrWeightArr = [
    {
      "weightKg": 356,
      "weightTon": 24,
      "raduis": 8,
      "client": "MYAF"
    },
    {
      "weightKg": 36,
      "weightTon": 4,
      "raduis": 10,
      "client": "MYAF"
    },
    {
      "weightKg": 129,
      "weightTon": 15,
      "raduis": 12,
      "client": "MYAF"
    },
    {
      "weightKg": 987,
      "weightTon": 17,
      "raduis": 16,
      "client": "MYAF"
    },
    {
      "weightKg": 23,
      "weightTon": 24,
      "raduis": 8,
      "client": "Zeyad"
    },
    {
      "weightKg": 356,
      "weightTon": 24,
      "raduis": 8,
      "client": "MYAF"
    },
    {
      "weightKg": 36,
      "weightTon": 4,
      "raduis": 10,
      "client": "MYAF"
    },
    {
      "weightKg": 129,
      "weightTon": 15,
      "raduis": 12,
      "client": "MYAF"
    },
    {
      "weightKg": 987,
      "weightTon": 17,
      "raduis": 16,
      "client": "MYAF"
    },
    {
      "weightKg": 23,
      "weightTon": 24,
      "raduis": 8,
      "client": "Zeyad"
    }
  ]

  let outArrWeightArr = [
    {
      "weightKg": 356,
      "weightTon": 24,
      "raduis": 8,
      "client": "MYAF",
      "field5":"+",
      "money":155
    },
    {
      "weightKg": 36,
      "weightTon": 4,
      "raduis": 10,
      "client": "MYAF",
      "field5":"+",
      "money":155
    },
    {
      "weightKg": 129,
      "weightTon": 15,
      "raduis": 12,
      "client": "MYAF",
      "field5":"+",
      "money":155
    }
  ]


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
              <OutTableRow key={idx} field5={i.field5} money={i.money}  name={i.client} kg={i.weightKg} ton={i.weightTon} raduis={i.raduis} />
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
              <InTableRow key={idx} name={i.client} kg={i.weightKg} ton={i.weightTon} raduis={i.raduis} />
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