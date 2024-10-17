import React, { useEffect, useState } from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import {
  view_dashboard_DeadParty,
  view_dashboard_LowStock,
} from "../../../../../ApiEndPoint/Api";
import { Card, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

function LowStock() {
  const [lowStock, setlowStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.database) {
          const res = await _Get(view_dashboard_LowStock, userData.database);
          setlowStock(res?.alertProducts);
          console.log(res?.alertProducts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Card className="p-1">
        <Link to="/app/rupioo/report/LowStockReports">
          <h4 title="click to go Low Stock Report" className="text-center">
            LOW STOCK
          </h4>
        </Link>
        <Row>
          <Col md="5" lg="5" className="text-bold-600">
            Product Name
          </Col>
          <Col md="4" lg="4" className="text-bold-600">
            Alert
          </Col>
        </Row>
        <div
          className="custom-scrollbar"
          style={{ maxHeight: "230px", overflowY: "scroll" }}>
          {lowStock.map((item) => (
            <Row style={{ height: "50px" }} key={item.id}>
              <Col md="6" lg="6">
                {item?.Product_Title}
              </Col>
              <Col md="3" lg="3">
                {item?.currentStock}
              </Col>
            </Row>
          ))}
        </div>
      </Card>
    </>
  );
}

export default LowStock;
