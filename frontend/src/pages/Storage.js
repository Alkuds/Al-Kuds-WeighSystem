import React, { useEffect, useState } from 'react'

const Storage = () => {
  const [ironInfo, setIronInfo] = useState([])
  const [selectedIron, setSelectedIron] = useState()
  const [selectedRadius, setSelectedRadius] = useState()
  const [password, setPassword] = useState()
  const [selectedWeight, setSelectedWeight] = useState(0)
  useEffect(() => {
    const getIronStorage = async () => {
      const response = await fetch('http://localhost:7000/irons/getIronStorage',
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }


      )
      const json = await response.json()
      setIronInfo(json);
    }
    getIronStorage();
  }, [selectedRadius, selectedRadius, selectedWeight])

  const handleWeightFill = (radius) => {
    let isFound = false;
    setSelectedRadius(radius)
    for (let i of ironInfo) {
      if (selectedIron === i.name) {
        for (let j of i.props) {
          if (radius == j.radius) {
            setSelectedWeight(j.weight)
            isFound = true;
            break;
          }
        }
      }

      if (isFound)
        break;
    }
  }

  const handleChange = async () => {

    let obj = {
      "name": selectedIron,
      "radius": selectedRadius,
      "weight": selectedWeight
    }
    let pass = {
      "password": password
    }
    const isPasswordMatch = await fetch('http://localhost:7000/irons/checkChangePassword',
      {
        method: "POST",
        body: JSON.stringify(pass),
        headers: {
          'Content-Type': 'application/json'
        }
      }


    )
    const jsonIsMatch = await isPasswordMatch.json()
    if (jsonIsMatch["msg"] === "success") {
      const response = await fetch('http://localhost:7000/irons/changeIronWeight',
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            'Content-Type': 'application/json'
          }
        }


      )
      const json = await response.json()
      setSelectedWeight(json["newWeight"])
      setPassword("")
    }
    else{
      window.alert("الرقم السري خطأ")
    }
  }

  return (
    <div className='ironStorage'>
      <div className='data-input'>
        <select name="type" onChange={e => { setSelectedIron(e.target.value) }}>
          <option>
            اختر نوع
          </option>
          {
            ironInfo.map((i, idx) => (
              <option key={idx} value={i.name}>
                {
                  i.name
                }
              </option>
            ))
          }
        </select>
        <label htmlFor="type"> نوع الحديد </label>
      </div>
      <div className='data-input'>
        <select onChange={e => handleWeightFill(e.target.value)}>
          <option>اختر قطر</option>
          <option>4</option>
          <option>6</option>
          <option>8</option>
          <option>10</option>
          <option>12</option>
          <option>14</option>
          <option>16</option>
          <option>18</option>
          <option>20</option>
          <option>22</option>
          <option>25</option>
        </select>
        <label name="radius" htmlFor="radius"> القطر </label>
      </div>
      <div className="data-input">
        <input name="weight" type="number" value={selectedWeight} onChange={e => setSelectedWeight(e.target.value)} />
        <label htmlFor="weight"> الوزن </label>
      </div>
      <div className="data-input">
        <input name="weight" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <label htmlFor="weight"> الرقم السري </label>
      </div>
      <button onClick={handleChange} className="iron-btn"> تغير الوزن</button>
    </div>
  )
}

export default Storage