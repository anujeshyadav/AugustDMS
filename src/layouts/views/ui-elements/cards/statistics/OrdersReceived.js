import React, { useEffect, useState } from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import axiosConfig from "../../../../axiosConfig";
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Edit } from "react-feather";
import { ordersReceived, ordersReceivedSeries } from "./StatisticsData";
// import { Card, CardBody, Row, Col } from "reactstrap";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import {
  LowStock_Calculation,
  stock_calculate,
  view_dashboard_stock,
} from "../../../../../ApiEndPoint/Api";

// class OrdersReceived extends React.Component {
//   render() {
//     return (
//       <StatisticsCard
//         icon={<Package className="warning" size={22} />}
//         iconBg="warning"
//         stat="97.5K"
//         statTitle="Transaction"
//         options={ordersReceived}
//         series={ordersReceivedSeries}
//         type="area"
//       />
//     );
//   }
// }
// export default OrdersReceived

// import React from 'react'

function OrdersReceived({
  // iconBg,
  // stat,
  heading,
  productName,
  alert,
  grade,
  partyName,
  SalesPersonName,
  Inactive,
  statTitle,
  statTitle1,
  statTitle2,
  statTitle3,
  statTitle4,
  statTitle5,
}) {
  const [stock, setStock] = useState({});
  const [modalEdit, setmodalEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.database) {
          const res = await _Get(view_dashboard_stock, userData.database);
          setStock(res.WarehouseStock);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      <StatisticsCard
        // stock={stock}
        heading={heading}
        statTitle={statTitle}
        statTitle1={`Opening Stock : ${stock.OpeningStock?stock.OpeningStock:0}`}
        statTitle2={`Closing Stock : ${stock.ClosingStock?stock.ClosingStock:0}`}
        statTitle3={`Dead Stock : ${stock.DeadStock?stock.DeadStock:0}`}
        statTitle4={`Damage Stock : ${stock.DamageStock?stock.DamageStock:0}`}
        statTitle5={`Warehouse Stock : ${stock.WarehouseStock?stock.WarehouseStock:0}`}
        productName={productName}
        alert={alert}
        grade={grade}
        partyName={partyName}
        SalesPersonName={SalesPersonName}
        Inactive={Inactive}
      />
    </div>
  );
}

export default OrdersReceived;
