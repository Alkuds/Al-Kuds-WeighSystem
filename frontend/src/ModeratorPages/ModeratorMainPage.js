import React, { useState } from "react";
import OutWeighs from "../pages/OutWeighs";
import InWeights from "../pages/InWeights";
import OrderModal from "../components/OrderModal/index";
const ModeratorMainPage = () => {
  const [modal, setModal] = useState(false);
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
          className=" text-[14px] md:text-[25px] min-w-[110px] add-btn iron-btn w-[50%] whitespace-nowrap "
        >
          انشاء طلب خارج
        </button>
        <button
          onClick={() => setModal(true)}
          className=" w-[50%] whitespace-nowrap add-btn iron-btn min-w-[110px] text-[14px] md:text-[25px]"
        >
          انشاء طلب وارد
        </button>
      </div>
      {modal && (
        // <div className="modal">
        //   <span
        //     className="displayHidden"
        //     onClick={()=>{setModal(false)}}
        //     style={{ fontSize: "30px", cursor: "pointer" }}
        //   >
        //     &times;
        //   </span>
        //   <h1>hello</h1>
        // </div>
        <OrderModal onClose={() => setModal(false)} />
      )}
    </section>
  );
};

export default ModeratorMainPage;
