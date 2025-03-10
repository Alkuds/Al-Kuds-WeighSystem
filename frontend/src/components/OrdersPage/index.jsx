import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const OrdersPage = () => {
  const { category } = useParams();
  console.log(category);
  useEffect(() => {
    const getOrders = async () => {
      const response = await fetch("/order/getClientOrders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const ordersData = await response.json();
      console.log(ordersData);
    };
    getOrders()
  }, []);
  return <section>OrdersPage</section>;
};

export default OrdersPage;
