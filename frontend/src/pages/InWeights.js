import { useEffect, useState } from "react";
import truck from '../assets/images/truck.png';
// import Swal from 'sweetalert2'
const OutWeighs = () => {
    // date code:
    //new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'})
    const [ironArr, setIronArr] = useState([1]);
    const [ironWeightArr, setIronWeightArr] = useState([0])
    const [ironTime, setIronTime] = useState([0])
    const [ironDate, setIronDate] = useState([0])
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
    const [driverName, setDriverName] = useState();
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
    }, [ironRadiusArr, ironTypeArr, ironWeightArr, ironArr, selectedCarNumber, selectedClientAddress, selectedClientName, selectedDriverMobile, selectedDriverName, selectedIron, selectedLorryNumber, selectedRadius])

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
                setDriverName(i.name);
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
            if (idx == 0) {
                let dummyArr = ironWeightArr
                dummyArr[idx] = json.weight

                setIronWeightArr(dummyArr);
            } else {
                let dummyArr = ironWeightArr
                dummyArr[idx] = json.weight

                setIronWeightArr(dummyArr);
            }
            let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
            let dateArr = d.split(',');
            let dateDummyArr = ironDate, timeDummyArr = ironTime
            dateDummyArr[idx] = dateArr[0]
            timeDummyArr[idx] = dateArr[1]
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
        console.log(ironWeightArr.length, ironWeightArr)
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
        console.log(ironRadiusArr)
        console.log(ironTypeArr)

        if (selectedCarNumber == null || selectedClientAddress == null || selectedClientName == null
            || selectedDriverMobile == null || selectedDriverName == null || selectedIron == null || selectedLorryNumber == null
            || selectedRadius == null
        ) {
            window.alert("برجاء ادخال البيانات كامله")
            console.log("heeree")
            return
        }
        for (let i of ironWeightArr) {
            if (i === 0) {
                window.alert("برجاء ادخال البيانات كامله")
                console.log("heeree 1")
                return
            }
        }
        for (let i in ironRadiusArr) {
            if (i > 0 && (ironRadiusArr[i] === 0 || ironTypeArr[i] === 0)) {
                window.alert("برجاء ادخال البيانات كامله")
                console.log("heeree 3")
                return
            }
        }
        handleProduceTicket();


    }
    const handleProduceTicket = async () => {
        let type = "in"
        let clientName = selectedClientName;
        let clientAddress = selectedClientAddress;
        let driverName = selectedDriverName;
        let carNumber = selectedCarNumber;
        let lorryNumber = selectedLorryNumber;
        let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
        let dateArr = d.split(',');
        let date = dateArr[0];
        let weightBefore = ironWeightArr[0];
        let reciept = [];
        console.log(ironWeightArr);
        for (let i = 1; i < ironArr.length; i++) {
            console.log("looooping");
            let ironName = ironTypeArr[i];
            let radius = ironRadiusArr[i];
            let weightAfter = ironWeightArr[i];
            let weight = weightAfter;
            // for (let j = i - 1; j >= 0; j--) {
            //     weight -= ironWeightArr[j];
            // }
            weight = ironWeightArr[i] - ironWeightArr[i-1];
            let singleReciept = { ironName, radius, weightAfter, weight };
            reciept.push(singleReciept);

        }
        let ticket = { type, clientName, clientAddress, driverName, carNumber, lorryNumber, date, weightBefore, reciept }
        const response = await fetch("http://localhost:7000/ticket/addTicket", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket),

        })
        if (response.ok) {
            // Swal.fire({
            //     title: "Done ",
            //     text: "printed succefully",
            //     icon: "success",
            //     confirmButtonText: "OK",
            // })
        }
    }


    return (
        <>
            <div className="client-details">
                <div className="operate-type">

                    <h1 >داخل</h1>
                </div>
                <div className="client-data">
                    <h2 style={{ textAlign: "center" }}>
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
                    ironArr.map((i, key) => (
                        <div className="section-content">
                            {key !== 0 && <div className="weigh-data-holder" style={{ "width": "100%" }}>
                                <div className="weigh-data-input">
                                    <select value={ironRadiusArr[key]} onChange={e => handleRaduisChange(key, e.target.value)} >
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
                            }
                            <div className="first-weigh">
                                <div className="weigh-data-input">
                                    <input name="weight" type="text" value={ironWeightArr[key]} readOnly />

                                    <label htmlFor="weight"> وزنه رقم &nbsp;{key + 1} </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="date" type="text" value={ironDate[key]} readOnly />
                                    <label htmlFor="date"> التاريخ </label>
                                </div>
                                <div className="weigh-data-input">
                                    <input name="time" type="text" value={ironTime[key]} readOnly />
                                    <label htmlFor="time"> التوقت </label>
                                </div>

                                <button onClick={e => { handleScaleWeight(key) }} className="iron-btn"> تحميل الوزن </button>
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