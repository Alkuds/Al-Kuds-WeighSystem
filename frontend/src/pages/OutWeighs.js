import { useEffect, useState } from "react";
import truck from '../assets/images/truck.png';
const OutWeighs = () => {
    // date code:
    //new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'})
    const [ironArr, setIronArr] = useState([1]);
    const [selectedClientName, setSelectedClientName] = useState()
    const [selectedClientAddress, setSelectedClientAddress] = useState()
    const [selectedDriverName, setSelectedDriverName] = useState()
    const [selectedDriverMobile, setSelectedDriverMobile] = useState()
    const [selectedCarNumber, setSelectedCarNumber] = useState()
    const [selectedLorryNumber, setSelectedLorryNumber] = useState()
    const [selectedIron, setSelectedIron] = useState()
    const [selectedRadius, setSelectedRadius] = useState()
    const [carInfo, setCarInfo] = useState([])
    const [clientsInfo, setClientsInfo] = useState([])
    const [ironInfo, setIronInfo] = useState([])
    const [driverInfo, setDriverInfo] = useState([])
    useEffect(() => {
        const getCarInfo = async () => {
            const response = await fetch('http://localhost:7000/car/getCarInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setCarInfo(json)
        }
        const getDriverInfo = async () => {
            const response = await fetch('http://localhost:7000/driver/getDriversInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setDriverInfo(json)
        }
        const getClientsInfo = async () => {
            const response = await fetch('http://localhost:7000/clients/getClientsInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            console.log(json)
            setClientsInfo(json);
        }
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
        getCarInfo()
        getDriverInfo()
        getClientsInfo()
        getIronStorage()
    }, [ironArr, selectedCarNumber, selectedClientAddress, selectedClientName, selectedDriverMobile, selectedDriverName, selectedIron, selectedLorryNumber, selectedRadius])

    const handleAddress = (name) => {
        console.log(clientsInfo)
        for (const i of clientsInfo) {
            console.log(i)
            if (i.name == name) {
                setSelectedClientAddress(i.address);
            }
        }
    }

    const handleDriverNumber = (name) => {
        for (const i of driverInfo) {
            if (i.name == name) {
                setSelectedDriverMobile(i.mobile);
            }
        }
    }

    const handleLorry = (number) => {
        for (const i of carInfo) {
            if (i.number == number) {
                setSelectedLorryNumber(i.lorryNumber);
            }
        }
    }

    return (
        <>
            <div className="client-details">
                <div className="client-data">
                    <h2>
                        بيانات العميل
                    </h2>
                    <div className="client-holder">
                        <div className="data-input">
                            <label htmlFor="address"> العنوان </label>
                            <input name="address" type="text" value={selectedClientAddress} readOnly />
                        </div>
                        <div className="data-input">
                            <label htmlFor="clientname"> اسم العميل </label>
                            <select onChange={e => handleAddress(e.target.value)}>
                                <option> اختر عميل</option>
                                {
                                    clientsInfo.map((i, idx) => (
                                        <option key={idx}> {i.name} </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="driver-data">
                    <h2>
                        بيانات السائق و العربيه
                    </h2>
                    <div className="driver-holder">
                        <div className="driver-data-holder">
                            <div className="data-input">
                                <input name="driverNum" type="text" value={selectedDriverMobile} readOnly />
                                <label htmlFor="driverNum"> رقم تليفون السائق </label>
                            </div>
                            <div className="data-input">
                                <select onChange={e => handleDriverNumber(e.target.value)}>
                                    <option> اختر سائق</option>
                                    {
                                        driverInfo.map((i, idx) => (
                                            <option key={idx}> {i.name} </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="driverName"> اسم السائق </label>
                            </div>
                        </div>
                        <div className="car-data-holder">
                            <div className="data-input">
                                <input name="carNum" type="text" value={selectedLorryNumber} readOnly />
                                <label htmlFor="carNum"> رقم العربيه </label>
                            </div>
                            <div className="data-input">
                                <select onChange={e => handleLorry(e.target.value)}>
                                    <option> اختر عربه</option>
                                    {
                                        carInfo.map((i, idx) => (
                                            <option key={idx}> {i.number} </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="lorryNum"> رقم المقطوره </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className="iron-btn add-btn" onClick={e => { setIronArr([...ironArr, 1]) }}> اضافه وزنه </button>
            <div className="iron-input">
                {
                    ironArr.map((i, key) => (
                        <div key={key} className="section-content">
                            <div className="weigh-data-holder" style={{ "width": "100%" }}>
                                <div className="weigh-data-input">
                                    <select>
                                        <option>8</option>
                                        <option>6</option>
                                        <option>10</option>
                                    </select>
                                    <label htmlFor="clientname"> القطر</label>
                                </div>
                                <div className="weigh-data-input">
                                    <select onChange={e => setSelectedIron(e.target.value)}>
                                        <option> اختر نوع</option>
                                        {
                                            ironInfo.map((i, idx) => (
                                                <option key={idx}> {i.name} </option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="clientname"> نوع الحديد </label>
                                </div>
                            </div>
                            {key == 0 && <div className="second-weigh">
                                <div className="weigh-data-input">
                                    <input name="address" type="text" />
                                    <label htmlFor="weight"> وزنه رقم &nbsp;{key + 2} </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="date" type="text" />
                                    <label htmlFor="date"> التاريخ </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="time" type="text" />
                                    <label htmlFor="time"> التوقت </label>
                                </div>
                                <button className="iron-btn"> تحميل الوزن </button>
                            </div>}
                            <div className="first-weigh">
                                <div className="weigh-data-input">
                                    <input name="address" type="text" />
                                    {key === 0 ?
                                        <label htmlFor="weight"> وزنه رقم &nbsp;{key + 1} </label> : <label htmlFor="weight"> وزنه رقم{key + 2} </label>}
                                </div>
                                <div className="weigh-data-input">
                                    <input name="date" type="text" />
                                    <label htmlFor="date"> التاريخ </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="time" type="text" />
                                    <label htmlFor="time"> التوقت </label>
                                </div>
                                <button className="iron-btn"> تحميل الوزن </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default OutWeighs;