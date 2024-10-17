import React, { useEffect, useState } from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import { view_dashboard_DeadParty } from "../../../../../ApiEndPoint/Api";
import { Card, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

function DeadParty() {
  const [dead, setDead] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.database) {
          const res = await _Get(view_dashboard_DeadParty, userData.database);
          setDead(res?.Parties ? res?.Parties : []);
          console.log(res?.Parties);
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
        <Link to="/app/softNumen/report/DeadParty">
          <h4
            title="click to go on Dead Party Report Page"
            className="text-center">
            DEAD PARTY
          </h4>
        </Link>
        <Row>
          <Col md="5" lg="5" className="text-bold-600">
            Party Name
          </Col>
          <Col md="4" lg="4" className="text-bold-600">
            Sales Person Name
          </Col>
          <Col md="3" lg="3" className="text-bold-600">
            Inactive
          </Col>
        </Row>
        <div
          className="custom-scrollbar"
          style={{ maxHeight: "230px", overflowY: "scroll" }}>
          {dead.map((item) => (
            <Row style={{ height: "50px" }} key={item.id}>
              <Col md="6" lg="6">
                {item?.id?.CompanyName}
              </Col>
              <Col md="3" lg="3">
                {item?.id?.created_by?.firstName}
              </Col>
              <Col md="3" lg="3">
                {item?.id?.status}
              </Col>
            </Row>
          ))}
        </div>
      </Card>
    </>
  );
}

export default DeadParty;
