import { createContext, useReducer } from "react";
import { useEffect } from "react";
export const AwaitForPaymentTicketsContext = createContext();

export const AwaitForPaymentTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        awaitForPaymentTickets: action.payload,
      };
    case "ADD_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let usedArrObj = state.awaitForPaymentTickets
        for(let j of action.payload){
          usedArrObj[`${typeObj[j.type]}`].push(j)
        }
        return {
            awaitForPaymentTickets: usedArrObj
        };
      }
    case "UPDATE_TICKET":
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      let newArr = []
      let usedArrObj = state.awaitForPaymentTickets
      for(let j of action.payload){
        for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
          if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
            usedArrObj[`${typeObj[j.type]}`][i] = j
          }
        }
      }
      return {
          awaitForPaymentTickets: usedArrObj
      };
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        for(let i = 0 ;i<state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`].length;i++){
          if(state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`][i]._id !== action.payload._id){
            newArr.push(state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`][i])
          }
        }
        if(typeObj[action.payload.type] === "in")
        {
          return {
            awaitForPaymentTickets: {"inOrders": newArr, "outOrders":state.awaitForPaymentTickets["outOrders"] },
          };
        }
        else
        {
          return {
            awaitForPaymentTickets: {"outOrders": newArr, "inOrders":state.awaitForPaymentTickets["inOrders"] },
          };
        }
      };
    default:
      return state;
  }
};

export const AwaitForPaymentTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AwaitForPaymentTicketsReducer, {
    awaitForPaymentTickets: {},
  });

  useEffect(() => {
    const getAwaitForPaymentTickets = async () => {
      const response = await fetch("/order/getAwaitForPaymentOrdersGroupedByType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_TICKETS", payload: jsonAns });
      }
    };
    getAwaitForPaymentTickets();
  }, [dispatch]);

  return (
    <AwaitForPaymentTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AwaitForPaymentTicketsContext.Provider>
  );
};
