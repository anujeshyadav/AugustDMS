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
  view_dashboard_Creditor,
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

function Creditor({
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
  const [credit, setCredit] = useState({});
  const [modalEdit, setmodalEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.database) {
          const res = await _Get(view_dashboard_Creditor, userData.database);
          setCredit(res.Creditor);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData()
  }, []);
  return (
    <div>
      <StatisticsCard
        // stock={stock}
        heading={heading}
        statTitle={statTitle}
        statTitle1={`Total Purchase : ${credit?.totalPurchase?credit?.totalPurchase:0}`}
        statTitle2={`Total Paid : ${credit?.totalPaid?credit?.totalPaid:0}`}
        statTitle3={`Currrent Purchase : ${credit?.currentPurchase?credit?.currentPurchase:0}`}
        statTitle4={`Currrent Paid : ${credit?.currentPaid?credit?.currentPaid:0}`}
        statTitle5={`Outstanding : ${credit?.outstanding?credit?.outstanding:0}`}
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
export default Creditor;
