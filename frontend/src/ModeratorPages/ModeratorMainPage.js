import React, { useState } from "react";
import OutWeighs from "../pages/OutWeighs";
import InWeights from "../pages/InWeights";
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
          style={{ fontSize: "25px" }}
          className="displayHidden !text-[14px] md:text-[25px] min-w-[110px] add-btn iron-btn w-[50%] whitespace-nowrap "
        >
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
      {modal && (
        <div className="modal">
          <h1>hello</h1>
        </div>
      )}
    </section>
  );
};

export default ModeratorMainPage;
