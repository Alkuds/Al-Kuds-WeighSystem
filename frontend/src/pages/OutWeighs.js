import { useEffect, useState } from "react";
import truck from '../assets/images/truck.png';
const OutWeighs = () => {
    // date code:
    //new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'})
    const [ironArr, setIronArr] = useState([1]);
    const [ironWeightArr, setIronWeightArr] = useState([0, 0])
    const [ironTime, setIronTime] = useState([0, 0])
    const [ironDate, setIronDate] = useState([0, 0])
    const [ironTypeArr, setIronTypeArr] = useState([0])
    const [ironRadiusArr, setIronRadiusArr] = useState([0])
    const [selectedClientName, setSelectedClientName] = useState(null)
    const [selectedClientAddress, setSelectedClientAddress] = useState(null)
    const [selectedDriverName, setSelectedDriverName] = useState(null)
    const [selectedDriverMobile, setSelectedDriverMobile] = useState(null)
    const [selectedCarNumber, setSelectedCarNumber] = useState(null)
    const [selectedLorryNumber, setSelectedLorryNumber] = useState(null)
    const [selectedIron, setSelectedIron] = useState(null)
    const [selectedRadius, setSelectedRadius] = useState(null)
    const [carInfo, setCarInfo] = useState([])
    const [clientsInfo, setClientsInfo] = useState([])
    const [ironInfo, setIronInfo] = useState([])
    const [isLoading, setIsLoading] = useState(false);
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

        // const unloadCallBack = (e) => {
        //     e.preventDefault();
        //     e.returnValue = "هل تري تحميل الصفحه من جديد؟"
        //     return "";
        // }
        // window.addEventListener("beforeunload", unloadCallBack)
        // return () => window.removeEventListener("beforeunload", unloadCallBack)
    }, [ironRadiusArr, ironTypeArr,ironWeightArr, ironArr, selectedCarNumber, selectedClientAddress, selectedClientName, selectedDriverMobile, selectedDriverName, selectedIron, selectedLorryNumber, selectedRadius])

    const handleAddress = (name) => {
        console.log(clientsInfo)
        setSelectedClientName(name);
        for (const i of clientsInfo) {
            console.log(i)
            if (i.name == name) {
                setSelectedClientAddress(i.address);
                break;
            }
        }
    }

    const handleDriverNumber = (name) => {
        setSelectedDriverName(name);
        for (const i of driverInfo) {
            if (i.name == name) {
                setSelectedDriverMobile(i.mobile);
                break;
            }
        }
    }

    const handleLorry = (number) => {
        setSelectedCarNumber(number)
        for (const i of carInfo) {
            if (i.number == number) {
                setSelectedLorryNumber(i.lorryNumber);
                break;
            }
        }
    }

    const handleScaleWeight = async (idx) => {
        setIsLoading(true);
        const response = await fetch('http://localhost:7000/irons/getScaleWeight',
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const json = await response.json()
        if (response.ok) {
            console.log(json.weight, idx)
            let dummyArr = ironWeightArr
            dummyArr[idx - 1] = json.weight
            setIronWeightArr(dummyArr);
            let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
            let dateArr = d.split(',');
            let dateDummyArr = ironDate, timeDummyArr = ironTime
            dateDummyArr[idx - 1] = dateArr[0]
            timeDummyArr[idx - 1] = dateArr[1]
            setIronDate(dateDummyArr)
            setIronTime(timeDummyArr)
            setIsLoading(false)
        }
    }

    const handleIronAdd = () => {
        setIronArr([...ironArr, 1])
        setIronWeightArr([...ironWeightArr, 0]);
        setIronRadiusArr([...ironRadiusArr, 0])
        setIronTypeArr([...ironTypeArr, 0])
    }

    const handleRaduisChange = (idx, radius) => {
        setSelectedRadius(radius)
        let dummyArr = ironRadiusArr
        dummyArr[idx] = radius
        setIronRadiusArr(dummyArr);
    }

    const handleIronTypeChange = (idx, type) => {
        setSelectedIron(type)
        let dummyArr = ironTypeArr
        dummyArr[idx] = type
        setIronTypeArr(dummyArr);
    }

    const handleRemoveAdditionalWeigh = () => {
        console.log(ironWeightArr.length,ironWeightArr)
        let tempIronArr = ironArr;
        tempIronArr.pop()
        setIronArr([...tempIronArr])
        let tempIronRadiusArr = ironRadiusArr;
        tempIronRadiusArr.pop()
        setIronRadiusArr([...tempIronRadiusArr])
        let tempIronTypeArr = ironTypeArr;
        tempIronTypeArr.pop()
        setIronTypeArr([...tempIronTypeArr])
        let tempIronWeightArr = ironWeightArr;
        tempIronWeightArr.pop()
        setIronWeightArr([...tempIronWeightArr])
    }

    const handlePrint = () => {
        console.log(ironWeightArr.length, ironWeightArr)
        console.log(ironRadiusArr)
        console.log(ironTypeArr)
        // if (selectedCarNumber == null || selectedClientAddress == null || selectedClientName == null
        //     || selectedDriverMobile == null || selectedDriverName == null || selectedIron == null || selectedLorryNumber == null
        //     || selectedRadius == null
        // ) {
        //     window.alert("برجاء ادخال البيانات كامله")
        //     console.log("heeree")
        //     return
        // }
        // for (let i of ironWeightArr) {
        //     if (i === 0) {
        //         window.alert("برجاء ادخال البيانات كامله")
        //         console.log("heeree 1")
        //         return
        //     }
        // }
        // for (let i in ironRadiusArr) {
        //     if (ironRadiusArr[i] === 0 || ironTypeArr[i] === 0) {
        //         window.alert("برجاء ادخال البيانات كامله")
        //         console.log("heeree 3")
        //         return
        //     }
        // }

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
            <button className="iron-btn add-btn" onClick={handleIronAdd}> اضافه وزنه </button>
            <div className="iron-input">
                {
                    isLoading ? <div className="loadingDiv" > ...تحميل الوزن </div> : ironArr.map((i, key) => (
                        <div key={key} className="section-content">
                            <div className="weigh-data-holder" style={{ "width": "100%" }}>
                                <div className="weigh-data-input">
                                    <select value={ironRadiusArr[key]} onChange={e => handleRaduisChange(key, e.target.value)} >
                                        <option>اختر قطر</option>
                                        <option>8</option>
                                        <option>6</option>
                                        <option>10</option>
                                    </select>
                                    <label htmlFor="clientname"> القطر</label>
                                </div>

                                <div className="weigh-data-input">
                                    <select value={ironTypeArr[key]} onChange={e => handleIronTypeChange(key, e.target.value)} >
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
                            {key == 0 &&
                                <div className="second-weigh">
                                    <div className="weigh-data-input">
                                        <input name="weight" type="text" value={ironWeightArr[1]} readOnly />
                                        <label htmlFor="weight"> وزنه رقم &nbsp;{key + 2} </label>
                                    </div>
                                    <div className="weigh-data-input">
                                        <input name="date" type="text" value={ironDate[1]} readOnly />
                                        <label htmlFor="date"> التاريخ </label>
                                    </div>
                                    <div className="weigh-data-input">
                                        <input name="time" type="text" value={ironTime[1]} readOnly />
                                        <label htmlFor="time"> التوقت </label>
                                    </div>
                                    <button onClick={e => handleScaleWeight(key + 2)} className="iron-btn"> تحميل الوزن </button>
                                </div>
                            }
                            <div className="first-weigh">
                                <div className="weigh-data-input">
                                    <input name="weight" type="text" value={key === 0 ? ironWeightArr[key] : ironWeightArr[key + 1]} readOnly />
                                    {key === 0 ?
                                        <label htmlFor="weight"> وزنه رقم &nbsp;{key + 1} </label> : <label htmlFor="weight"> وزنه رقم{key + 2} </label>}
                                </div>
                                <div className="weigh-data-input">
                                    <input name="date" type="text" value={key === 0 ? ironDate[key] : ironDate[key + 1]} readOnly />
                                    <label htmlFor="date"> التاريخ </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="time" type="text" value={key === 0 ? ironTime[key] : ironTime[key + 1]} readOnly />
                                    <label htmlFor="time"> التوقت </label>
                                </div>

                                <button onClick={e => { key === 0 ? handleScaleWeight(key + 1) : handleScaleWeight(key + 2) }} className="iron-btn"> تحميل الوزن </button>
                            </div>
                            {key !== 0 && <div style={{ 'width': '100%' }}>
                                <button onClick={handleRemoveAdditionalWeigh} className="iron-btn remove"> ازاله </button>
                            </div>}
                        </div>
                    ))
                }
                <button onClick={handlePrint} className="iron-btn"> طباعه</button>
            </div>
        </>
    )
}

export default OutWeighs;