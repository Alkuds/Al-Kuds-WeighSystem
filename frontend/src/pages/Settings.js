import React, { useState } from 'react'

const Settings = () => {

  const [driverName, setDriverName] = useState("")
  const [driverNumber, setDriverNumber] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientAddress, setClientAddress] = useState("")

  const handleClientAdd = async() =>{
    let obj = {
      "name": clientName,
      "address":clientAddress
    }
    const response = await fetch('http://localhost:7000/clients/addClient',
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json'
        }
      }


    )
    const json = await response.json()
    console.log(json)
    if(json["msg"] === "success")
      window.alert("تم الاضافه")
  }

  const handleDriverAdd = async() =>{
    let obj = {
      "name": driverName,
      "mobile":driverNumber
    }
    const response = await fetch('http://localhost:7000/driver/addDriver',
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json'
        }
      }


    )
    const json = await response.json()
    console.log(json)
    if(json["msg"] === "success")
      window.alert("تم الاضافه")
  }

  return (
    <div>
      <div>
        <div className="data-input">
          <input name="name" type="text" value={driverName} onChange={e => setDriverName(e.target.value)} />
          <label htmlFor="name"> اسم السائق </label>
        </div>
        <div className="data-input">
          <input name="number" type="text" value={driverNumber} onChange={e => setDriverNumber(e.target.value)} />
          <label htmlFor="number"> رقم السائق </label>
        </div>
        <button onClick={handleDriverAdd} className="iron-btn"> اضافه سائق جديد</button>

      </div>
      <div>
        <div className="data-input">
          <input name="name" type="text" value={clientName} onChange={e => setClientName(e.target.value)} />
          <label htmlFor="name"> اسم العميل </label>
        </div>
        <div className="data-input">
          <input name="address" type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
          <label htmlFor="address"> عنوان العميل </label>
        </div>
        <button onClick={handleClientAdd} className="iron-btn"> اضافه عميل جديد</button>
      </div>
    </div>
  )
}

export default Settings