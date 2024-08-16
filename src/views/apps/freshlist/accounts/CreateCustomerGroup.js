import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";

import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import { _PostSave, _Get, _Put } from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route, useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";
import {
  Create_CustomerGroup,
  PurchaseProductList_Product,
  Update_CustomerGroup_by_id,
  View_CustomerGroup,
  View_CustomerGroup_by_id,
} from "../../../../ApiEndPoint/Api";

let GrandTotal = [];
let SelectedITems = [];
let maxDiscount = 0;
const CreateCustomerGroup = (args) => {
  const [UserInfo, setUserInfo] = useState({});
  const [selectedData, setData] = useState({});
  const [ProductData, setProductData] = useState([]);
  const [Type, setType] = useState("");
  let Param = useParams();
  let History = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    _Get(View_CustomerGroup, user?.database)
      .then((res) => {
        if (res?.CustomerGroup) {
          let myActive = res?.CustomerGroup?.filter(
            (ele) => ele?.status == "Active"
          );

          let max = myActive.reduce(
            (prevMax, obj) => (obj.discount > prevMax ? obj.discount : prevMax),
            -Infinity
          );
          maxDiscount = max > 0 ? max : 0;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(PurchaseProductList_Product, user?.database)
      .then((res) => {
        res?.Product?.forEach((ele) => {
          let Mrp = ele?.Product_MRP;
          let gst = (100 + ele?.GSTRate) / 100;
          let Dis = (100 + maxDiscount) / 100;
          if (!!ele?.SalesRate) {
            ele["SalesRate"] = ele?.SalesRate;
          } else {
            ele["SalesRate"] = Number((Mrp / (gst * Dis)).toFixed(2));
          }
          ele["maxDiscount"] = maxDiscount;
          let cost = ele?.landedCost ? ele?.landedCost : ele?.Purchase_Rate;
          if (cost > ele?.SalesRate) {
            ele["lossStatus"] = true;
          } else {
            ele["lossStatus"] = false;
          }
        });
        setProductData(res?.Product?.reverse());
        //  this.setState({ rowData: res?.Product?.reverse() });
      })
      .catch((err) => {});

    if (Param?.id == 0) {
      setType("Create");
    } else {
      setType("Edit");

      _Get(View_CustomerGroup_by_id, Param?.id)
        .then((res) => {
          //   console.log(res?.CustomerGroup);

          let val = res?.CustomerGroup;
          setData({
            discountPercentage: val?.discount,
            Grade: val?.grade,
            GroupName: val?.groupName,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(ProductData);
    console.log(maxDiscount);
    debugger;
    let payload = {
      id: selectedData?.GroupName,
      groupName: selectedData?.GroupName,
      grade: selectedData?.Grade,
      discount: Number(selectedData?.discountPercentage),
      created_by: UserInfo?._id,
      database: UserInfo?.database,
    };
    if (Param?.id == 0) {
      await _PostSave(Create_CustomerGroup, payload)
        .then((res) => {
          History.goBack();
          swal("Group Created Successfully");
          setData({});
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await _Put(Update_CustomerGroup_by_id, Param?.id, payload)
        .then((res) => {
          History.goBack();

          swal("Group Updated Successfully");
          setData({});
        })
        .catch((err) => {
          console.log(err);
          swal("Something Went Wrong");
        });
    }
  };
  const onChange = (e) => {
    let { name, value } = e.target;

    if (name == "discountPercentage") {
      if (value.length < 3) {
        setData({
          ...selectedData,
          [name]: value,
        });
      } else {
        setData({
          ...selectedData,
          [name]: value?.slice(0, 2),
        });
        swal("Error", "Cannot Enter Discount More than two digit");
      }
    } else {
      setData({
        ...selectedData,
        [name]: value,
      });
    }
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h1 className="">{Type && Type} Customer Group</h1>
              </div>
            </Col>
            <Col>
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="primary"
                      onClick={() => history.goBack()}>
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Group Name</Label>
                    <Input
                      required
                      type="text"
                      name="GroupName"
                      placeholder="Enter Group Name"
                      value={selectedData?.GroupName}
                      // onChange={onChange}
                      onChange={(e) => {
                        const input = e.target.value;
                        const filteredValue = input.replace(/\s/g, "");
                        setData({
                          ...selectedData,
                          ["id"]: filteredValue,
                          ["GroupName"]: filteredValue,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Grade</Label>
                    <Input
                      required
                      type="text"
                      name="Grade"
                      placeholder="Enter Grade"
                      value={selectedData?.Grade}
                      onChange={onChange}
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Discount(%)</Label>
                    <Input
                      required
                      placeholder="Enter Discount Percentage"
                      type="number"
                      min={0}
                      max={50}
                      name="discountPercentage"
                      value={selectedData?.discountPercentage}
                      onChange={onChange}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex justify-content-center">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-2">
                      Submit
                    </Button.Ripple>
                  </div>
                </Col>
              </Row>
              {/* <Row className="mt-2">
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div className="form-label-group" onChange={onChange}>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row> */}

              {/* <Row>
                <Col>
                  <div className="d-flex justify-content-center">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-2">
                      Submit
                    </Button.Ripple>
                  </div>
                </Col>
              </Row> */}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateCustomerGroup;
