const TicketDetails = ({tickets}) =>{
    return(
        <div>
            {tickets.map((i,idx)=>(
                <div>
                    <div className="ticket-container"> 
                        <span>نوع: &nbsp;{i.ironName}</span>
                        <span>قطر: &nbsp;{i.radius}</span>
                        <span>الوزن المطلوب: &nbsp;{i.neededWeight}</span>
                    </div>
                    <div className="first-weigh">
                    <div className="weigh-data-input">
                        <input name="weight" type="text" value="" readOnly />
                        <input name="weight" type="text"  value=""/>
                        <label htmlFor="weight">ادخل وزنه رقم &nbsp; </label>
                    </div>
                    <div className="weigh-data-input">
                        <input name="date" type="text" value="" readOnly />
                        <label htmlFor="date"> التاريخ </label>
                    </div>
                    <div className="weigh-data-input">
                        <input name="time" type="text" value="" readOnly />
                        <label htmlFor="time"> التوقت </label>
                    </div>

                    <button className="iron-btn"> تحميل الوزن </button>

                    <div className="weigh-data-input">
                        <input name="weight" type="text" value="" readOnly />
                        <label htmlFor="weight"> صافي الوزن </label>
                    </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TicketDetails