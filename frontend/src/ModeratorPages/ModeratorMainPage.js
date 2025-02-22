import React, { useEffect, useState } from "react";
import OutWeighs from "../SharedComponents/OutWeighs";
import InWeights from "../SharedComponents/InWeights";
import { useSocketContext } from "../hooks/useSocket";
const ModeratorMainPage = () => {
  const { socket } = useSocketContext();
  const [modal, setModal] = useState([]);
  const [data,setData] = useState("hello")
  useEffect(()=>{
    socket.on("receive_message", (info) => {
        console.log("here")
        console.log(info)
        setData(info.message)
    });
  },[socket])

  return (
    <section className="size-full ">
      <div 
        className="displayHidden space-x-4"
        style={{
          margin: "0 auto",
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setModal(true)}
          style={{ fontSize: "25px" }}
          className="displayHidden !text-[14px] md:text-[25px] min-w-[110px] add-btn iron-btn w-[50%] whitespace-nowrap "
        >
          <p> {data} </p>
          انشاء طلب خارج
        </button>
        <button
          onClick={() => setModal(true)}
          style={{ fontSize: "25px" }}
          className="displayHidden w-[50%] whitespace-nowrap add-btn iron-btn min-w-[110px] !text-[14px] md:text-[25px]"
        >
          انشاء طلب وارد
        </button>
      </div>
     
    </section>
  );
};

export default ModeratorMainPage;
