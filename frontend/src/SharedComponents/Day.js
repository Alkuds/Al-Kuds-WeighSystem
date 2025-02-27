import React, { useEffect, useState } from "react";
import { useClientContext } from "../hooks/useClientContext";

const InTableRow = ({ w, name, raduis, ironName }) => {
  return (
    <tr>
      <td style={{ minWidth: "90px" }}> {name} </td>
      <th style={{ minWidth: "90px" }}> {ironName} </th>
      <td> {raduis} </td>
      <td> {w} </td>
    </tr>
  );
};

const OutTableRow = ({ name, raduis, w, ironName }) => {
  return (
    <tr>
      <td style={{ minWidth: "90px" }}> {name} </td>
      <th style={{ minWidth: "90px" }}> {ironName} </th>
      <td> {raduis} </td>
      <td> {w} </td>
    </tr>
  );
};

const Day = () => {
  const [inArrWeightArr, setInArrWeightArr] = useState([]);
  const [outArrWeightArr, setOutArrWeightArr] = useState([]);
  const [totalOut, setTotalOut] = useState(0);
  const [totalIn, setTotalIn] = useState(0);
  const { client } = useClientContext();
  useEffect(() => {
    const getTicketsInfo = async () => {
      const response = await fetch("/order/getTicketsForDay", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      let tOut = 0,
        tIn = 0;
      if (response.ok) {
        let d = new Date().toLocaleString();
        let dateArr = d.split(",");
        let inArr = [],
          outArr = [];
        for (let i of json) {
          let orderDate = i.date.split(",")[0];
          if (
            orderDate === dateArr[0] &&
            i.type === "in" &&
            (i.state === "finished" || i.state == "Alkuds-Storage")
          ) {
            console.log(i);
            for (let j = 0; j < i.ticket.length; j++) {
              let kgDummy = i.ticket[j].netWeight / 1000;
              let kgStr = kgDummy.toString();
              let kgSplit;
              let kgValue;
              tIn += parseInt(i.ticket[j].netWeight);
              if (kgStr.indexOf(".") !== -1) {
                kgSplit = kgStr.split(".");
                console.log(kgStr);
                kgValue = parseInt(kgSplit[1].padEnd(3, "0"));
              } else kgValue = 0;
              let obj = {
                name: client[i.clientId].name,
                w: i.ticket[j].netWeight,
                raduis: i.ticket[j].radius,
                ironName: i.ticket[j].ironName,
                field5: " ",
                money: " ",
              };
              inArr.push(obj);
            }
          }
          setOutArrWeightArr([...inArr]);
          setTotalIn(tIn);
        }
        for (let i of json) {
          let orderDate = i.date.split(",")[0];
          if (
            orderDate === dateArr[0] &&
            i.type === "out" &&
            (i.state === "finished" || i.state === "Alkuds-Storage")
          ) {
            for (let j = 0; j < i.ticket.length; j++) {
              let kgDummy = i.ticket[j].netWeight / 1000;
              let kgStr = kgDummy.toString();
              let kgSplit = kgStr.split(".");
              let kgValue;
              tOut += Math.abs(parseInt(i.ticket[j].netWeight));
              if (kgStr.indexOf(".") !== -1) {
                kgValue = parseInt(kgSplit[1].padEnd(3, "0"));
              } else {
                kgValue = 0;
              }
              let obj = {
                name: client[i.clientId].name,
                ironName: i.ticket[j].ironName,
                w: i.ticket[j].netWeight,
                raduis: i.ticket[j].radius,
              };
              outArr.push(obj);
            }
          }
          setInArrWeightArr([...outArr]);
          setTotalOut(tOut);
        }
      }
    };
    getTicketsInfo();
  }, []);

  if (!client) {
    return <div>Loading...</div>; // Prevents rendering until data is available
  }

  const MMDDYYYYDate = () => {
    let d = new Date().toLocaleString();
    let dateArr = d.split(",");
    d = dateArr[0];
    let e = d.split("/");
    return e[1] + "/" + e[0] + "/" + e[2];
  };
  console.log(MMDDYYYYDate());
  return (
    <>
      <p style={{ margin: "0", textAlign: "center" }}>
        {" "}
        {MMDDYYYYDate()} / {new Date().toLocaleTimeString()}
      </p>
      <div className="daily-table-holder">
        <table className="in-table" align="right">
          <thead>
            <tr>
              <th> مورد بضاعه </th>
              <th> نوع </th>
              <th> م </th>
              <th> وزن</th>
            </tr>
          </thead>
          <tbody>
            {outArrWeightArr.map((i, idx) => (
              <OutTableRow
                key={idx}
                ironName={i.ironName}
                name={i.name}
                w={i.w}
                raduis={i.raduis}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>{totalIn}</td>
              <th>اجمالي الوزن</th>
            </tr>
          </tfoot>
        </table>
        <table className="in-table right-table">
          <thead>
            <tr>
              <th> العميل </th>
              <th> نوع </th>
              <th> م </th>
              <th> وزن</th>
            </tr>
          </thead>
          <tbody>
            {inArrWeightArr.map((i, idx) => (
              <InTableRow
                key={idx}
                name={i.name}
                ironName={i.ironName}
                w={i.w}
                raduis={i.raduis}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>{totalOut}</td>
              <th>اجمالي الوزن</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <button className="iron-btn" onClick={(e) => window.print()}>
        {" "}
        طباعه
      </button>
    </>
  );
};

export default Day;
