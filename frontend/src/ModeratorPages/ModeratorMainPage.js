import React, { useEffect, useState } from "react";
import OrderModal from "../components/OrderModal/index";
import { ReactComponent as NewIcon } from "../assets/icons/new.svg";
import { ReactComponent as LoadIcon } from "../assets/icons/load.svg";
import { ReactComponent as PayIcon } from "../assets/icons/pay.svg";
import Seperator from "../components/Seperator";
import { useNavigate } from "react-router-dom";

const ModeratorMainPage = () => {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState("");
  const navigate = useNavigate();
  return (
    <section className="p-8 size-full flex flex-col gap-4">
      <Seperator text="انشاء طلب" />
      {modal && <OrderModal type={type} onClose={() => setModal(false)} />}
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
          onClick={() => {
            setType("خارج");
            setModal(true);
          }}
          className=" text-[14px] md:text-[25px] min-w-[110px] add-btn iron-btn w-[50%] whitespace-nowrap "
        >
          انشاء طلب خارج
        </button>
        <button
          onClick={() => {
            setType("وارد");
            setModal(true);
          }}
          className=" w-[50%] whitespace-nowrap add-btn iron-btn min-w-[110px] text-[14px] md:text-[25px]"
        >
          انشاء طلب وارد
        </button>
      </div>
      <Seperator text="الطلبات" />

      <div className="w-full flex md:flex-row flex-col py-6  gap-8" dir="rtl">
        <button
          onClick={() => navigate(`orders/new`)}
          className="cursor-pointer hover:border-[greenyellow] p-5 flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <NewIcon className="size-14" />
          <h1 className="text-4xl">جديد</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-load`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1  min-h-60"
        >
          <LoadIcon className="size-14" />
          <h1 className="text-4xl">جاري التحميل</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-pay`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <PayIcon className="size-14" />
          <h1 className="text-4xl">جاري الدفع</h1>
        </button>
        <button
          onClick={() => navigate(`orders/done`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <PayIcon className="size-14" />
          <h1 className="text-4xl">تم</h1>
        </button>
      </div>
    </section>
  );
};

export default ModeratorMainPage;
