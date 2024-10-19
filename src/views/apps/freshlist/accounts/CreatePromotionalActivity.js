import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  Badge,
  Table,
  CustomInput,
} from "reactstrap";

import "react-phone-input-2/lib/style.css";

import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  _Delete,
  _Get,
  _Post,
  _PostSave,
  _Put,
  ProductListView,
  SavePromotionsActivity,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";

import { Route } from "react-router-dom";
import swal from "sweetalert";
import { Copy, Edit, Trash2 } from "react-feather";
import {
  ActivityList,
  Delete_Activity,
  Update_Activity,
} from "../../../../ApiEndPoint/Api";
import { handleSidebar } from "../../../../redux/actions/calendar";

let GrandTotal = [];
let SelectedITems = [];
const CreatePromotionalActivity = (args) => {
  let History = useHistory();
  const [formData, setFormData] = useState({});
  // const [targetEndDate, settargetEndDate] = useState("");
  const [DiscountType, setDiscountType] = useState("");
  const [startdate, setStartDate] = useState("");
  const [FreeNumberofProduct, setFreeNumberofProduct] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [FreeSelectedProduct, setFreeSelectedProduct] = useState(false);
  const [AddAnotherProduct, setAddAnotherProduct] = useState(false);
  const [NumberofProduct, setNumberofProduct] = useState("");
  const [error, setError] = useState("");
  const [Status, setStatus] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [ActivityLists, setActivityList] = useState([]);
  const [mainProduct, setMainProduct] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [TotalAmount, setTotalAmount] = useState("");
  const [Discountpercent, setDiscountpercentage] = useState("");
  const [Discount, setDiscount] = useState("");
  const [UserInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [audit, setAudit] = useState(false);

  const audittoggle = () => {
    setAudit(!audit);
    // setModal(!modal);
  };

  const handleHistory = () => {
    audittoggle();
  };
  const [product, setProduct] = useState([
    {
      productId: "",
      targetQty: null,
      discountAmount: null,
      discountPercentage: null,
      freeProductQty: "", //
      freeProduct: "",
    },
  ]);

  const handleProductChangeProduct = (e, index) => {
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = +value;
    setProduct(list);
  };

  const handleRemoveSelected = (selectedList, selectedItem, index) => {
    SelectedITems.splice(index, 1);
    let myarr = product?.map((ele, i) => {
      console.log(ele?.qty * selectedItem[i]?.Product_MRP);
      let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
      GrandTotal[index] = indextotal;
      return indextotal;
    });

    let amt = myarr.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);
  };
  const handleSelection = (selectedList, selectedItem, index, type) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] };
      if (type == "productId") {
        updatedProduct.productId = selectedItem?._id;
      } else {
        updatedProduct.freeProduct = selectedItem?._id;
      }
      updatedProductList[index] = updatedProduct;
      return updatedProductList;
    });
  };
  const handleInputChange = (e, type, i) => {
    const { name, value, checked } = e.target;
    if (type == "checkbox") {
      if (checked) {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      if (type == "number") {
        if (/^\d{0,10}$/.test(value)) {
          setFormData({
            ...formData,
            [name]: value,
          });
          setError("");
        } else {
          setError(
            "Please enter a valid number with a maximum length of 10 digits"
          );
        }
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  useEffect(() => {
    console.log(formData);
    console.log(product);
  }, [formData, product]);

  const HandleActivityList = async () => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    _Get(ActivityList, userdata?.database)
      .then((res) => {
        setActivityList(res?.Activity);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    HandleActivityList();
    ProductListView(userdata?._id, userdata?.database)
      .then((res) => {
        console.log(res?.Product);
        setProductList(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        productId: "",
        targetQty: null,
        discountAmount: null,
        discountPercentage: null,
        freeProductQty: "", //
        freeProduct: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);

    setProduct(newFormValues);
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    let userinfor = JSON.parse(localStorage.getItem("userData"));
    let Data = {
      ActivityName: formData?.ActivityName,
      FromDate: formData?.FromDate,
      ToDate: formData?.ToDate,
      status: formData?.status,
      database: userinfor?.database,
    };
    if (!!formData?.editActivity && formData?.editActivity) {
      await _Put(Update_Activity, formData?.id, Data)
        .then((res) => {
          HandleActivityList();
          swal("success", "Updated Successfully");
        })
        .catch((err) => {
          swal("Error", "Something went wrong");
        });
    } else {
    }

    // let promo = [
    //   {
    //     promoCode: Promocode,
    //     promoAmount: Discount,
    //     startDate: startdate,
    //     endDate: Enddate,
    //     status: Status,
    //   },
    // ];
    // let mypromot = {
    //   promoCodeWise: promo,
    //   created_by: pageparmission?._id,
    //   status: Status,
    // };
    // await _PostSave()
    // await SavePromotionsActivity(mypromot)
    //   .then((res) => {
    //     // console.log(res);
    //     History.goBack();
    //     swal("success", "Promotion Code Submitted Successfully");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     swal("Error", "Something went wrong");
    //   });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    debugger;

    if (DiscountType == "Percentage Wise") {
      let percentage = [
        {
          totalAmount: +TotalAmount,
          percentageDiscount: +Discountpercent,
          activityId: formData?.selectedActivity?._id,
          status: Status,
          database: pageparmission?.database,
        },
      ];
      let payload = {
        database: pageparmission?.database,
        percentageWise: percentage,
        created_by: pageparmission?._id,

        status: Status,
      };
      await SavePromotionsActivity(payload)
        .then((res) => {
          console.log(res);
          History.goBack();

          swal("success", "Promotion Submitted Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    } else if (DiscountType == "Amount Wise") {
      let amount = [
        {
          totalAmount: +TotalAmount,
          percentageAmount: +Discount,
          activityId: formData?.selectedActivity?._id,
          database: pageparmission?.database,

          status: Status,
        },
      ];
      let payload = {
        amountWise: amount,
        status: Status,
        database: pageparmission?.database,

        created_by: pageparmission?._id,
      };
      await SavePromotionsActivity(payload)
        .then((res) => {
          console.log(res);
          History.goBack();

          swal("success", "Submitted Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    } else {
      let myproduct = product?.map((ele, i) => {
        return {
          productId: ele?.productId,
          targetQty: ele?.targetQty,
          discountAmount: ele?.discountAmount,
          discountPercentage: ele?.discountPercentage,
          freeProductQty: ele?.freeProductQty,
          freeProduct: ele?.freeProduct,
          database: pageparmission?.database,
        };
      });
      let productWise = [
        {
          activityId: formData?.selectedActivity?._id,
          freeOtherProducts: myproduct,
          database: pageparmission?.database,
        },
      ];
      let payload = {
        productWise: productWise,
        created_by: pageparmission?._id,
        database: pageparmission?.database,

        status: Status,
      };

      await SavePromotionsActivity(payload)
        .then((res) => {
          console.log(res);
          History.goBack();

          swal("success", "Submitted Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    }

    
   

    
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    setMainProduct(selectedItem);
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
  };
  const HandleDeleteActivity = async (data) => {
    await _Delete(Delete_Activity, data?._id)
      .then((res) => {
        let selected = ActivityLists?.filter((item) => item?._id !== data?._id);
        setActivityList(selected);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="ml-2 mr-2">
            <Col className="mt-2" xs="12" lg="9">
              <div>
                <h1
                  className=""
                  style={{ fontWeight: "500", fontSize: "27px" }}>
                  Create Promotional Activity
                </h1>
              </div>
            </Col>

            <Col lg="2" md="2" xs="7" sm="12" className="mt-2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right"
                      color="info"
                      onClick={toggle}>
                      {" "}
                      + Activity
                    </Button>
                  )}
                />
              </div>
            </Col>
            <Col lg="1" xs="5" className="mt-2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="danger"
                      onClick={() => history.goBack()}>
                      {" "}
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>
          <Row>
            {/* <Col></Col> */}
            <Col className="mt-2" lg="3" md="3" sm="12">
              <div className="mx-1">
                <Label>
                  Select Activity <span style={{ color: "red" }}>*</span>
                </Label>
                <CustomInput
                  required
                  name="ActivityName"
                  onChange={(e) => {
                    let value = e.target.value;
                    let selected = ActivityLists?.filter(
                      (item) => item?._id == value
                    );
                    setFormData({
                      ...formData,
                      [e.target.name]: value,
                      selectedActivity: selected[0],
                    });
                  }}
                  type="select">
                  <option>------------Select Activity-----------------</option>
                  {ActivityLists?.length &&
                    ActivityLists?.map((ele, i) => {
                      return (
                        <option value={ele?._id}>
                          {ele?.ActivityName}(Code:{ele?.Code})(from:
                          {ele?.FromDate?.split("T")[0]} -To:
                          {ele?.ToDate?.split("T")[0]} )
                        </option>
                      );
                    })}
                </CustomInput>
              </div>
            </Col>
            <Col>
              <span>
                {!!formData?.selectedActivity && (
                  <>
                    <div>
                      {" "}
                      Promo-Code:{formData?.selectedActivity?.Code}{" "}
                      <span
                        onClick={() => {
                          setFormData({
                            ...formData,
                            clipboardCopy: true,
                          });
                          navigator.clipboard.writeText(
                            formData?.selectedActivity?.Code
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        title="click to Copy">
                        <Copy
                          className="mx-1"
                          color={
                            !!formData?.clipboardCopy && formData?.clipboardCopy
                              ? "green"
                              : "blue"
                          }
                          size={20}
                        />
                      </span>
                    </div>
                    <div>
                      Name:
                      {formData?.selectedActivity?.ActivityName}
                    </div>
                    <div>
                      From Date:
                      {formData?.selectedActivity?.FromDate?.split("T")[0]}
                    </div>
                    <div>
                      To Date:
                      {formData?.selectedActivity?.ToDate?.split("T")[0]}
                    </div>
                  </>
                )}
              </span>
            </Col>
          </Row>

          <Form className="p-1" onSubmit={submitHandler}>
            <Row>
              <Col lg="7" md="8" sm="10" xs="12" className="mb-2 mt-1">
                <div className="form-label-group">
                  <input
                    style={{ marginRight: "10px" }}
                    type="radio"
                    name="Product Quantity"
                    value={DiscountType}
                    onChange={(e) => {
                      setDiscountType("Percentage Wise");
                      setFreeSelectedProduct(false);
                      setAddAnotherProduct(false);
                    }}
                  />
                  <span style={{ marginRight: "99px" }}>Percentage Wise</span>

                  <input
                    style={{ marginRight: "10px" }}
                    type="radio"
                    name="Product Quantity"
                    value={DiscountType}
                    onChange={(e) => {
                      setDiscountType("Amount Wise");
                      setFreeSelectedProduct(false);
                      setAddAnotherProduct(false);
                    }}
                  />
                  <span style={{ marginRight: "124px" }}>Amount Wise</span>
                  <input
                    style={{ marginRight: "10px" }}
                    type="radio"
                    name="Product Quantity"
                    placeholder="Product Quantity"
                    value={DiscountType}
                    onChange={(e) => setDiscountType("Product Wise")}
                  />
                  <span style={{ marginRight: "60px" }}>Product Wise</span>
                </div>
              </Col>
            </Row>
            <Row>
              {DiscountType && DiscountType == "Percentage Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Total Amount</Label>
                      <Input
                        required
                        type="number"
                        name="Totalamount"
                        placeholder="Total amount"
                        value={TotalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount in Percentage</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        min={0}
                        max={99}
                        name="DiscountinPercentage"
                        placeholder="Discount in Percentage %"
                        value={Discountpercent}
                        onChange={(e) => {
                          setDiscountpercentage(e.target.value);
                        }}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  {/* <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col> */}
                </>
              ) : null}
            </Row>
            <Row>
              {DiscountType && DiscountType == "Amount Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Total Amount</Label>
                      <Input
                        required
                        type="number"
                        name="Totalamount"
                        placeholder="Total amount"
                        value={TotalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount Amount</Label>
                      <Input
                        required
                        type="number"
                        name="DiscountinPercentage"
                        placeholder="Discount Amount"
                        value={Discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  {/* <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col> */}
                </>
              ) : null}
            </Row>
            {/* <Row className="p-1"> */}
            {/* {DiscountType && DiscountType == "Product Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Choose Product *</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={ProductList} // Options to display in the dropdown
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={onSelect1} // Function will trigger on select event
                        onRemove={onRemove1} // Function will trigger on remove event
                        displayValue="Product_Title" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Product Quantity</Label>
                      <Input
                        required
                        type="number"
                        name="TotalAmount"
                        placeholder="Product Total Amount"
                        value={NumberofProduct}
                        onChange={(e) => setNumberofProduct(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount Amount</Label>
                      <Input
                        type="number"
                        name="DiscountAmount"
                        placeholder="Discount Amount"
                        value={Discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label> or Discount %</Label>
                      <Input
                        type="number"
                        name="DiscountAmount"
                        placeholder="Discount Percentage %"
                        value={Discountpercent}
                        onChange={(e) => setDiscountpercentage(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>

                  <div className="p-1">
                    <Row>
                      <Col lg="12" md="12" sm="12" className="">
                        <div className="form-label-group">
                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="ProductQuantity1"
                            placeholder="Product Quantity"
                            onChange={(e) => {
                              setFreeSelectedProduct(true);
                              setAddAnotherProduct(false);
                            }}
                          />
                          <span style={{ marginRight: "60px" }}>
                            or Free selected Product Quantity
                          </span>

                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="ProductQuantity1"
                            placeholder="Product Quantity"
                            // value={targetStartDate}
                            onChange={(e) => {
                              setFreeSelectedProduct(false);

                              setAddAnotherProduct(true);
                            }}
                          />
                          <span style={{ marginRight: "60px" }}>
                            Want to Add Another Product
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              ) : null} */}
            {/* </Row> */}

            <div>
              {DiscountType && DiscountType == "Product Wise" && (
                <>
                  {product &&
                    product?.map((product, index) => (
                      <Row className="" key={index}>
                        <Col className="mb-1" lg="3" md="3" sm="12">
                          <div className="">
                            <Label>Product Name</Label>
                            <Multiselect
                              required
                              selectionLimit={1}
                              isObject="false"
                              options={ProductList}
                              onSelect={(selectedList, selectedItem) =>
                                handleSelection(
                                  selectedList,
                                  selectedItem,
                                  index,
                                  "productId"
                                )
                              }
                              onRemove={(selectedList, selectedItem) => {
                                handleRemoveSelected(
                                  selectedList,
                                  selectedItem,
                                  index
                                );
                              }}
                              displayValue="Product_Title" // Property name to display in the dropdown options
                            />
                          </div>
                        </Col>
                        <Col className="mb-1" lg="1" md="1" sm="12">
                          <div className="">
                            <Label>Target</Label>
                            <Input
                              type="number"
                              name="targetQty"
                              min={0}
                              placeholder="target Qty"
                              value={product?.targetQty}
                              onChange={(e) =>
                                handleProductChangeProduct(e, index)
                              }
                            />
                          </div>
                        </Col>
                        <Col className="mb-1" lg="1" md="1" sm="12">
                          <div className="">
                            <Label>Amount</Label>
                            <Input
                              min={0}
                              type="number"
                              name="discountAmount"
                              placeholder="Discount Amount"
                              value={product?.discountAmount}
                              onChange={(e) =>
                                handleProductChangeProduct(e, index)
                              }
                            />
                          </div>
                        </Col>
                        <Col className="mb-1" lg="1" md="1" sm="12">
                          <div className="">
                            <Label>Percentage</Label>
                            <Input
                              min={0}
                              max={100}
                              type="number"
                              name="discountPercentage"
                              placeholder="Discount Percentage"
                              value={product?.discountPercentage}
                              onChange={(e) =>
                                handleProductChangeProduct(e, index)
                              }
                            />
                          </div>
                        </Col>
                        <Col className="mb-1" lg="1" md="1" sm="12">
                          <div className="">
                            <Label>Piece</Label>
                            <Input
                              min={0}
                              type="number"
                              name="freeProductQty"
                              placeholder="free Product Qty"
                              value={product?.freeProductQty}
                              onChange={(e) =>
                                handleProductChangeProduct(e, index)
                              }
                            />
                          </div>
                        </Col>
                        {product?.freeProductQty > 0 &&
                        <Col className="mb-1" lg="3" md="3" sm="12">
                          <div className="">
                            <Label>Free Piece Product Name <span style={{color:"red"}}>*</span></Label>
                            <Multiselect
                              required
                              selectionLimit={1}
                              isObject="false"
                              options={ProductList}
                              onSelect={(selectedList, selectedItem) =>
                                handleSelection(
                                  selectedList,
                                  selectedItem,
                                  index,
                                  "freeProduct"
                                )
                              }
                              onRemove={(selectedList, selectedItem) => {
                                handleRemoveSelected(
                                  selectedList,
                                  selectedItem,
                                  index
                                );
                              }}
                              displayValue="Product_Title" // Property name to display in the dropdown options
                            />
                          </div>
                        </Col>
                        }

                        <Col className="" lg="1" md="1" sm="12">
                          {index ? (
                            <Button
                              type="button"
                              color="danger"
                              className="button remove mt-2 "
                              onClick={() => removeMoreProduct(index)}>
                              X
                            </Button>
                          ) : null}
                        </Col>
                      </Row>
                    ))}
                </>
              )}
            </div>
            {DiscountType && DiscountType == "Product Wise" && (
              <Row>
                <Col>
                  <div className="float-right">
                    <div className="btnStyle">
                      <Button
                        className="ml-1 mb-1"
                        color="primary"
                        type="button"
                        onClick={() => addMoreProduct()}>
                        + Add
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            {/* {FreeSelectedProduct && (
              <>
                <Col className="mb-1" lg="4" md="4" sm="12">
                  <div className="">
                    <Label>Free Selected Product Quantity</Label>
                    <Input
                      required
                      type="number"
                      placeholder="Number of Quantity"
                      value={FreeNumberofProduct}
                      onChange={(e) => setFreeNumberofProduct(e.target.value)}
                    />
                  </div>
                </Col>
              </>
            )} */}

            <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
              <Label className="mb-0">Status</Label>
              <div
                className="form-label-group mt-1"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}>
                <input
                  checked={Status == "Active"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Active"
                />
                <span style={{ marginRight: "20px" }}>Active</span>

                <input
                  checked={Status == "Deactive"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Deactive"
                />
                <span style={{ marginRight: "3px" }}>Deactive</span>
              </div>
            </Col>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Submit
                  </Button.Ripple>
                </div>
              </Col>
            </Row>
          </Form>
          <Modal size="lg" isOpen={modal} toggle={toggle} {...args}>
            <ModalHeader toggle={toggle}>Add Activity here</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                  <Label className="mb-0">Choose Activity Action</Label>
                  <div
                    className="form-label-group mt-1"
                    name="type"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        type: e.target.value,
                        editActivity: false,
                        ActivityName: "",
                        FromDate: "",
                        ToDate: "",
                      });
                    }}
                    value={formData?.type}>
                    <input
                      checked={formData?.type == "Add"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="type"
                      value="Add"
                    />
                    <span style={{ marginRight: "20px" }}>Add New</span>

                    <input
                      checked={formData?.type == "List"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="type"
                      value="List"
                    />
                    <span style={{ marginRight: "3px" }}>List</span>
                  </div>
                </Col>
              </Row>
              {formData?.type == "Add" && (
                <Form onSubmit={handleSubmitActivity}>
                  <div className="d-flex justify-content-center">
                    <h3>{!!formData?.editActivity && <>Edit Activity</>}</h3>
                  </div>
                  <Row>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <Label>Activity Name</Label>
                      <Input
                        required
                        type="text"
                        name="ActivityName"
                        placeholder="Enter Activity Name"
                        onChange={handleInputChange}
                        value={formData?.ActivityName}
                        // onChange={(e) => {
                        //   setActivityName(e.target.value.toUpperCase());
                        // }}
                      />
                    </Col>
                    {/* <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Promo code</Label>
                    <Input
                      required
                      type="text"
                      name="targetEndDate"
                      placeholder="Enter Promotion Code"
                      value={Promocode}
                      onChange={(e) => {
                        setPromocode(e.target.value.toUpperCase());
                      }}
                    />
                  </Col> */}
                    {/* <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Amount</Label>
                    <Input
                      required
                      type="number"
                      placeholder="Enter Amount"
                      value={Discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </Col> */}
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Start Date</Label>
                        <Input
                          required
                          type="date"
                          name="FromDate"
                          onChange={handleInputChange}
                          value={formData?.FromDate}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>End Date</Label>
                        <Input
                          required
                          type="date"
                          name="ToDate"
                          onChange={handleInputChange}
                          value={formData?.ToDate}
                        />
                      </div>
                    </Col>
                    <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                      <Label className="mb-0">Status</Label>
                      <div
                        className="form-label-group mt-1"
                        name="status"
                        onChange={handleInputChange}
                        value={formData?.status}>
                        <input
                          checked={formData?.status == "Active"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="status"
                          value="Active"
                        />
                        <span style={{ marginRight: "20px" }}>Active</span>

                        <input
                          checked={formData?.status == "Deactive"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="status"
                          value="Deactive"
                        />
                        <span style={{ marginRight: "3px" }}>Deactive</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
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
                </Form>
              )}

              {formData?.type == "List" && (
                <>
                  <div className="d-flex justify-content-center">
                    <h4>Activity List </h4>
                  </div>
                  <Table
                    style={{ overflowY: "scroll", height: "100px" }}
                    responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Activity Name</th>
                        <th>Code</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ActivityLists?.length &&
                        ActivityLists?.map((ele, i) => {
                          return (
                            <tr key={i}>
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.ActivityName}</td>
                              <td>{ele?.Code}</td>
                              <td>{ele?.FromDate?.split("T")[0]}</td>
                              <td>{ele?.ToDate?.split("T")[0]}</td>
                              <td>{ele?.status}</td>

                              <td style={{ cursor: "pointer" }}>
                                <span title="Edit">
                                  <Edit
                                    onClick={(e) => {
                                      setFormData({
                                        ...formData,
                                        ActivityName: ele?.ActivityName,
                                        FromDate: ele?.FromDate?.split("T")[0],
                                        ToDate: ele?.ToDate?.split("T")[0],
                                        status: ele?.status,
                                        editActivity: true,
                                        id: ele?._id,
                                        type: "Add",
                                      });
                                    }}
                                    color="green"
                                    size={20}
                                  />
                                </span>{" "}
                                <span title="Delete">
                                  <Trash2
                                    onClick={() => HandleDeleteActivity(ele)}
                                    color="red"
                                    size={20}
                                  />
                                </span>{" "}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              )}
            </ModalBody>
          </Modal>
        </Card>
      </div>
    </div>
  );
};
export default CreatePromotionalActivity;
