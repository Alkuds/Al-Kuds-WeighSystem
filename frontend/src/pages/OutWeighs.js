import { useEffect, useState } from "react";
import truck from '../assets/images/truck.png';
const OutWeighs = () => {
    // date code:
    //new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'})
    const [ironArr, setIronArr] = useState([1]);
    useEffect(() => {

    }, [ironArr])
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
                            <input name="address" type="text" />
                        </div>
                        <div className="data-input">
                            <label htmlFor="clientname"> اسم العميل </label>
                            <select>
                                <option>Ahmed</option>
                                <option>Mostafa</option>
                                <option>Mahmoud</option>
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
                                <input name="driverNum" type="text" />
                                <label htmlFor="driverNum"> رقم تليفون السائق </label>
                            </div>
                            <div className="data-input">
                                <input name="driverName" type="text" />
                                <label htmlFor="driverName"> اسم السائق </label>
                            </div>
                        </div>
                        <div className="car-data-holder">
                            <div className="data-input">
                                <input name="carNum" type="text" />
                                <label htmlFor="carNum"> رقم العربيه </label>
                            </div>
                            <div className="data-input">
                                <select>
                                    <option>Ma2tora 1</option>
                                    <option>Ma2tora 2</option>
                                    <option>Ma2tora 3</option>
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
                        <div className="section-content">
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
                                    <select>
                                        <option>Hadeed1</option>
                                        <option>Hadeed2</option>
                                        <option>Hadeed3</option>
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