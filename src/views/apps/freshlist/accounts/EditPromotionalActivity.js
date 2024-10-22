import React, { useEffect, useState, useContext } from "react";
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
  InputGroup,
  Badge,
  CustomInput,
} from "reactstrap";

import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import { _Get, _Put } from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
// import Timepickers from "../../../forms/form-elements/datepicker/Timepicker";
// import Pickers from "../../../forms/form-elements/datepicker/Pickers";
import { Route, useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";
import {
  ActivityList,
  ProductList_View,
  UpdateOne_Promotion,
  UpdateProductWisePromotion,
  ViewOne_Promotion,
} from "../../../../ApiEndPoint/Api";
import { Copy } from "react-feather";

let GrandTotal = [];
let SelectedITems = [];
const CreatePromotionalActivity = (args) => {
  const [formData, setFormData] = useState({});

  const [DiscountType, setDiscountType] = useState("");
  const [startdate, setStartDate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [FreeSelectedProduct, setFreeSelectedProduct] = useState(false);
  const [AddAnotherProduct, setAddAnotherProduct] = useState(false);
  const [NumberofProduct, setNumberofProduct] = useState("");
  const [error, setError] = useState("");
  const [Status, setStatus] = useState("");
  const [Promocode, setPromocode] = useState("");
  const [ActivityLists, setActivityList] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const [SelectedMainProduct, setSelectMainProduct] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [TotalAmount, setTotalAmount] = useState("");
  const [Discountpercent, setDiscountpercentage] = useState("");
  const [Discount, setDiscount] = useState("");
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [audit, setAudit] = useState(false);

  let Params = useParams();
  let History = useHistory();

  const HandleActivityList = async (userdata) => {
    let list = await _Get(ActivityList, userdata?.database);
    debugger;
    // setActivityList(list?.Activity);
    return list;
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    // let list = HandleActivityList(userdata);
    let list = [];
    const fetchData = async () => {
      try {
        list = await new Promise((resolve, reject) => {
          let value = _Get(ActivityList, userdata?.database);
          resolve(value);
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    };
    fetchData();

    let totalProduct = [];
    let SelectedProductId = "";
    let SelectedExtraProduct = [];
    _Get(ViewOne_Promotion, Params?.id)
      .then((res) => {
        let data = res?.Promotion;
        let selectedActivity = list?.Activity?.filter(
          (item) => item?._id == data?.activityId
        );

        setFormData({
          ...formData,
          ["ActivityName"]: selectedActivity[0]?._id,
          selectedActivity: selectedActivity[0],
        });
        setActivityList(list?.Activity);
        if (data?.percentageWise?.length) {
          // for Percentage Wise
          let currentData = data?.percentageWise[0];
          setDiscountType("Percentage Wise");
          setDiscountpercentage(currentData?.percentageDiscount);
          setTotalAmount(currentData?.totalAmount);
          setStatus(currentData?.status);
        } else if (data?.amountWise?.length) {
          // for Amount Wise
          let currentData = data?.amountWise[0];
          setDiscountType("Amount Wise");
          setTotalAmount(currentData?.totalAmount);
          setDiscount(currentData?.percentageAmount);

          setStatus(currentData?.status);
          setFreeSelectedProduct(false);
          setAddAnotherProduct(false);
        } else if (data?.productWise?.length) {
          // for Product Wise
         

          let selectedProduct = data?.productWise?.filter(
            (item) => item?._id == Params?.Uid
          );
          setDiscountType("Product Wise");
          let productwisedata = data?.productWise;
          selectedProduct?.forEach((ele) => {
            ele["productId"] = ele?.productId;
            ele["targetQty"] = ele?.targetQty;
            if (ele?.freeProductQty > 0) {
              ele["freeProductQty"] = ele?.freeProductQty;
              ele["freeProduct"] = ele?.freeProduct;
            }
            if (ele?.discountPercentage > 0) {
              ele["discountPercentage"] = ele?.discountPercentage;
            }
            if (ele?.discountAmount > 0) {
              ele["discountAmount"] = ele?.discountAmount;
            }
          });
          setProduct(selectedProduct);
          setNumberofProduct(productwisedata?.productQty);
          SelectedProductId = productwisedata?.productId;
          setStatus(data?.status);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
    (async () => {
      let url = `${ProductList_View + userdata?._id}/`;
      await _Get(url, userdata?.database)
        .then((res) => {
          setProductList(res?.Product);
          totalProduct = res?.Product;
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const [product, setProduct] = useState([
    {
      productId: "",
      targetQty: null,
      // discountAmount: null,
      // discountPercentage: null,
      // freeProductQty: null,
      // freeProduct: "",
    },
  ]);

  const handleProductChangeProduct = (e, index) => {
    // setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = +value;

    setProduct(list);
  };

  const handleRemoveSelected = (selectedList, selectedItem, index) => {
    SelectedITems.splice(index, 1);
  };
  const handleSelection = (selectedList, selectedItem, index, type) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      if (type == "productId") {
        updatedProduct.productId = selectedItem?._id;
      } else {
        updatedProduct.freeProduct = selectedItem?._id;
      }
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one

      return updatedProductList; // Return the updated product list to set the state
    });
  };

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        product: "", //
        productId: "",
        availableQty: "",
        qty: 1, //
        price: "", //
        totalprice: "", //
        Salespersonname: "",
        targetstartDate: "",
        targetEndDate: "",
        discount: "",
        Shipping: "",
        tax: "",
        grandTotal: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);

    setProduct(newFormValues);
  };

  const handleSubmitPromocode = async (e) => {
    e.preventDefault();

    let promo = [
      {
        promoCode: Promocode,
        promoAmount: Discount,
        startDate: startdate,
        endDate: Enddate,
        status: Status,
      },
    ];
    let mypromot = {
      promoCodeWise: promo,
      status: Status,
    };
    await _Put(UpdateOne_Promotion, Params.id, mypromot)
      .then((res) => {
        console.log(res);
        History?.goBack();
        swal("success", "Promotion Code Submitted Successfully");
      })
      .catch((err) => {
        console.log(err);
        swal("Error", "Something went wrong");
      });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (DiscountType == "Percentage Wise") {
      let percentage = [
        {
          totalAmount: +TotalAmount,
          percentageDiscount: +Discountpercent,
          status: Status,
          database: pageparmission?.database,
        },
      ];
      let payload = {
        activityId: formData?.selectedActivity?._id,
        database: pageparmission?.database,
        percentageWise: percentage,
        created_by: pageparmission?._id,

        status: Status,
      };
      await _Put(UpdateOne_Promotion, Params.id, payload)
        .then((res) => {
          console.log(res);
          History?.goBack();

          swal("success", "Promotion Code Updated Successfully");
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
          database: pageparmission?.database,
          status: Status,
        },
      ];
      let payload = {
        activityId: formData?.selectedActivity?._id,
        amountWise: amount,
        status: Status,
        database: pageparmission?.database,
        created_by: pageparmission?._id,
      };
      await _Put(UpdateOne_Promotion, Params.id, payload)
        .then((res) => {
          History?.goBack();

          swal("success", "Updated Successfully");
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
          activityId: formData?.selectedActivity?._id,
        };
      });
      _Put(UpdateProductWisePromotion, Params?.Uid, myproduct[0])
        .then((res) => {
          console.log(res);
          History?.goBack();
          swal("success", "Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    }

    if (error) {
      swal("Error occured while Entering Details");
    } else {
    }
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    setSelectMainProduct(selectedItem);
  };
  const onRemove1 = (selectedList, removedItem, index) => {};
  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h1 className="">Edit Promotional Activity</h1>
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
                  value={!!formData?.ActivityName ? formData?.ActivityName : ""}
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
                        <span style={{ color: "green" }}>
                          {!!formData?.clipboardCopy && <>Copied</>}
                        </span>
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
            <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
              <div className="form-label-group">
                <input
                  checked={DiscountType && DiscountType == "Percentage Wise"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => {
                    setDiscountType("Percentage Wise");
                    setFreeSelectedProduct(false);
                    setAddAnotherProduct(false);
                  }}
                />
                <span style={{ marginRight: "60px" }}>Percentage Wise</span>

                <input
                  checked={DiscountType && DiscountType == "Amount Wise"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => {
                    setDiscountType("Amount Wise");
                    setFreeSelectedProduct(false);
                    setAddAnotherProduct(false);
                  }}
                />
                <span style={{ marginRight: "60px" }}>Amount Wise</span>
                <input
                  checked={DiscountType && DiscountType == "Product Wise"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="Product Quantity"
                  placeholder="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => setDiscountType("Product Wise")}
                />
                <span style={{ marginRight: "60px" }}>Product Wise</span>
              </div>
            </Col>

            <Row className="p-1">
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
                        min={0}
                        max={99}
                        type="number"
                        name="DiscountinPercentage"
                        placeholder="Discount in Percentage %"
                        value={Discountpercent}
                        onChange={(e) => {
                          if (e.target.value.length < 3) {
                            setDiscountpercentage(e.target.value);
                          } else {
                          }
                        }}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
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
                </>
              ) : null}
            </Row>

            <div>
              {DiscountType && DiscountType == "Product Wise" && (
                <>
                  {product &&
                    product?.map((product, index) => {
                      let findOtherProduct;
                      let findProduct = ProductList?.filter(
                        (item) => item?._id == product?.productId
                      );
                      if (product?.freeProductQty > 0) {
                        findOtherProduct = ProductList?.filter(
                          (item) => item?._id == product?.freeProduct
                        );
                      }
                      return (
                        <Row className="" key={index}>
                          <Col className="mb-1" lg="3" md="3" sm="12">
                            <div className="">
                              <Label>Product Name</Label>
                              <Multiselect
                                required
                                selectedValues={findProduct}
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
                          {product?.freeProductQty > 0 && (
                            <Col className="mb-1" lg="3" md="3" sm="12">
                              <div className="">
                                <Label>
                                  Free Piece Product Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Multiselect
                                  required
                                  selectionLimit={1}
                                  selectedValues={
                                    findOtherProduct?.length > 0
                                      ? findOtherProduct
                                      : []
                                  }
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
                          )}

                          {/* <Col className="" lg="1" md="1" sm="12">
                            {index ? (
                              <Button
                                type="button"
                                color="danger"
                                className="button remove mt-2 "
                                onClick={() => removeMoreProduct(index)}>
                                X
                              </Button>
                            ) : null}
                          </Col> */}
                        </Row>
                      );
                    })}
                </>
              )}
            </div>
            {/* {DiscountType && DiscountType == "Product Wise" && (
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
                  // checked={status == "Inactive"}
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
        </Card>
      </div>
    </div>
  );
};
export default CreatePromotionalActivity;
