import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import kuds from "../assets/images/kuds.png";
import useLogout from "../hooks/useLogout";

export default function OwnerLayout() {
  const checkNav = (e) => {
    const user = window.confirm("هل تريد الذهاب من هذه الصفحه؟");
    if (!user) {
      e.preventDefault();
    }
  };
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="background ">
      <div className="container  max-w-[1900px] flex-col-reverse max-w-none md:max-[] md:flex-row gap-4 w-full md:p-7 p-0">
        <div className="main-content min-h-[90vh]  md:min-h-[82vh] w-full rounded-none md:rounded-[50px]">
          <Outlet />
        </div>

        <div className="nav w-full md:w-[15%] flex-row md:flex-col space-y-12 pr-0">
          <div className="flex justify-end hidden md:flex">
            <img src={kuds} className="size-14 md:size-auto mr-0" />
          </div>
          <div className="nav-container  w-full gap-4 flex md:flex-col flex-row-reverse   justify-center  py-4 overflow-y-auto">
            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="items-center gap-4 flex md:flex-col flex-row-reverse  overflow-y-auto md:overflow-hidden px-6"
            >
              <NavLink className="text-center" to={"/up"}>
                {" "}
                الرئيسيه{" "}
              </NavLink>
              <NavLink className="text-center" to={"moneyvault"}>
                الخزنه
              </NavLink>
              <NavLink className="text-center" to={"impexp"}>
                جرد
              </NavLink>
              <NavLink className="text-center" to={"day"}>
                يوميه
              </NavLink>

              <NavLink className="text-center" to={"clientbill"}>
                كشف الحسابات
              </NavLink>
              <NavLink className="text-center" to={"customersbalance"}>
                رصيد العملاء
              </NavLink>
              <NavLink className="text-center" to={"profitreports"}>
                التقارير
              </NavLink>
              <button onClick={handleLogout} className="iron-btn logout">
                {" "}
                تسجيل خروج{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
