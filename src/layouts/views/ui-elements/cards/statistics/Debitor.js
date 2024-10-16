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
  view_dashboard_Debitor
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

function Debitor({
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
  const [debit, setDebit] = useState({});
  const [modalEdit, setmodalEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.database) {
          const res = await _Get(view_dashboard_Debitor, userData.database);
          setDebit(res.Debtor);
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
        statTitle1={`Total Outstanding : ${debit?.totalOutstanding? debit?.totalOutstanding : 0}`}
        statTitle2={`Total Receipt : ${debit?.totalReceipt?debit?.totalReceipt:0}`}
        statTitle3={`Total Due : ${debit?.totalDue?debit?.totalDue:0}`}
        statTitle4={`Currrent Outstanding : ${debit?.currentOutstanding?debit?.currentOutstanding:0}`}
        statTitle5={`Currrent Receipt : ${debit?.currentReceipt?debit?.currentReceipt:0}`}
        statTitle6={`Currrent Due : ${debit?.outstanding?debit?.outstanding:0}`}
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

export default Debitor;
