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
  ProductList_View,
  UpdateOne_Promotion,
  ViewOne_Promotion,
} from "../../../../ApiEndPoint/Api";

let GrandTotal = [];
let SelectedITems = [];
const CreatePromotionalActivity = (args) => {
  const [DiscountType, setDiscountType] = useState("");
  const [startdate, setStartDate] = useState("");
  const [FreeNumberofProduct, setFreeNumberofProduct] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [addonproductQty, setaddonproductQty] = useState("");
  const [FreeSelectedProduct, setFreeSelectedProduct] = useState(false);
  const [AddAnotherProduct, setAddAnotherProduct] = useState(false);
  const [NumberofProduct, setNumberofProduct] = useState("");
  const [error, setError] = useState("");
  const [Status, setStatus] = useState("");
  const [Promocode, setPromocode] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [PartyList, setPartyList] = useState([]);
  const [SelectedMainProduct, setSelectMainProduct] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [TotalAmount, setTotalAmount] = useState("");
  const [Discountpercent, setDiscountpercentage] = useState("");
  const [Discount, setDiscount] = useState("");
  const [UserInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [audit, setAudit] = useState(false);

  let Params = useParams();
  let History = useHistory();

  const audittoggle = () => {
    setAudit(!audit);
    // setModal(!modal);
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let totalProduct = [];
    let SelectedProductId = "";
    let SelectedExtraProduct = [];
    let url = `${ProductList_View + userdata?._id}/`;

    _Get(ViewOne_Promotion, Params?.id)
      .then((res) => {
        let data = res?.Promotion;
        if (data?.percentageWise?.length) {
          // for Percentage Wise
          setDiscountType("Percentage Wise");
          let currentData = data?.percentageWise[0];
          setDiscountpercentage(currentData?.percentageDiscount);
          setEnddate(currentData?.endDate);
          setStartDate(currentData?.startDate);
          setTotalAmount(currentData?.totalAmount);
          setStatus(currentData?.status);
          setFreeSelectedProduct(false);
          setAddAnotherProduct(false);
        } else if (data?.amountWise?.length) {
          // for Amount Wise
          let currentData = data?.amountWise[0];
          setDiscountType("Amount Wise");
          setTotalAmount(currentData?.totalAmount);
          setDiscount(currentData?.percentageAmount);
          setEnddate(currentData?.endDate);
          setStartDate(currentData?.startDate);
          setStatus(currentData?.status);
          setFreeSelectedProduct(false);
          setAddAnotherProduct(false);
        } else if (data?.productWise?.length) {
          // for Product Wise
          setDiscountType("Product Wise");
          let productwisedata = data?.productWise[0];
          setNumberofProduct(productwisedata?.productQty);
          SelectedProductId = productwisedata?.productId;
          // onSelect1(findProduct, findProduct[0], 1);
          setDiscount(productwisedata?.discountAmount);
          setDiscountpercentage(productwisedata?.discountPercentage);
          setEnddate(productwisedata?.endDate);
          setStatus(data?.status);
          setStartDate(productwisedata?.startDate);
          if (productwisedata?.freeOtherProducts?.length) {
            setAddAnotherProduct(true);
            SelectedExtraProduct = productwisedata?.freeOtherProducts;
            // let freProduct = SelectedExtraProduct?.map((ele) => {
            //   debugger;
            //   // let product=
            //   return { qty: ele?.freeProductQty, product: {} };
            // });
            // setProduct(productwisedata?.freeOtherProducts);
          } else {
            setFreeSelectedProduct(true);
          }
          setFreeNumberofProduct(
            productwisedata?.freeSameProductQty &&
              productwisedata?.freeSameProductQty
              ? productwisedata?.freeSameProductQty
              : null
          );
          // setFreeSelectedProduct(false);
          // setAddAnotherProduct(false);
        } else {
          if (data?.promoCodeWise?.length) {
            let promo = data?.promoCodeWise[0];
            setPromocode(promo?.promoCode);
            setDiscount(promo?.promoAmount);
            setStartDate(promo?.startDate);
            setEnddate(promo?.endDate);
            setStatus(promo?.status);
            toggle();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    (async () => {
      await _Get(url, userdata?.database)
        .then((res) => {
          setProductList(res?.Product);
          totalProduct = res?.Product;
          let findProduct = totalProduct?.filter(
            (item) => item?._id == SelectedProductId
          );
          onSelect1(findProduct, findProduct[0], 1);
          if (SelectedExtraProduct?.length) {
            let freProduct = SelectedExtraProduct?.map((ele) => {
              let product = totalProduct?.filter(
                (item) => item?._id == ele?.productId
              );
              return {
                qty: ele?.freeProductQty,
                productId: product[0]?._id,
                product: product[0],
              };
            });
            setProduct(freProduct);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const handleHistory = () => {
    audittoggle();
  };
  const [product, setProduct] = useState([
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

  const handleProductChangeProduct = (e, index) => {
    // setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;
    let amt = 0;

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
  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.productId = selectedItem?._id;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      let myarr = prevProductList?.map((ele, i) => {
        let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
        GrandTotal[index] = indextotal;
        return indextotal;
      });
      let amt = myarr.reduce((a, b) => a + b);
      setGrandTotalAmt(amt);
      return updatedProductList; // Return the updated product list to set the state
    });
    product.map((value) => console.log(value.totalprice));
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
          totalAmount: TotalAmount,
          percentageDiscount: Discountpercent,
          startDate: startdate,
          endDate: Enddate,
          status: Status,
        },
      ];
      let payload = {
        percentageWise: percentage,
        // created_by: pageparmission?._id,

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
          totalAmount: TotalAmount,
          percentageAmount: +Discount,
          startDate: startdate,
          endDate: Enddate,
          status: Status,
        },
      ];
      let payload = {
        amountWise: amount,
        status: Status,
        // created_by: pageparmission?._id,
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
      if (FreeSelectedProduct) {
        let productWise = [
          {
            productId: SelectedMainProduct?._id,
            productQty: NumberofProduct,
            discountAmount: Discount,
            discountPercentage: Discountpercent,
            startDate: startdate,
            endDate: Enddate,
            freeSameProductQty: +FreeNumberofProduct,
          },
        ];
        let payload = {
          productWise: productWise,
          // created_by: pageparmission?._id,

          status: Status,
        };
        await _Put(UpdateOne_Promotion, Params.id, payload)
          .then((res) => {
            History?.goBack();

            swal("success", "Submitted Successfully");
          })
          .catch((err) => {
            console.log(err);
            swal("Error", "Something went wrong");
          });
      } else {
        let myproduct = product?.map((ele, i) => {
          return { productId: ele?.productId, freeProductQty: +ele?.qty };
        });
        let productWise = [
          {
            productId: SelectedMainProduct?._id,
            productQty: NumberofProduct,
            discountAmount: Discount,
            discountPercentage: Discountpercent,
            startDate: startdate,
            endDate: Enddate,
            freeOtherProducts: myproduct,
          },
        ];
        let payload = {
          productWise: productWise,
          // created_by: pageparmission?._id,
          status: Status,
        };

        await _Put(UpdateOne_Promotion, Params.id, payload)
          .then((res) => {
            History?.goBack();

            swal("success", "Submitted Successfully");
          })
          .catch((err) => {
            console.log(err);
            swal("Error", "Something went wrong");
          });
      }
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
                <h1 className="">Create Promotional Activity</h1>
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
            <Col lg="1" md="1" sm="12">
              <div className="d-flex justify-content-end">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className=" mr-1"
                      color="primary"
                      onClick={toggle}>
                      {" "}
                      +Promocode
                    </Button>
                  )}
                />
              </div>
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
                  <Col className="mb-1" lg="3" md="3" sm="12">
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
                  </Col>
                </>
              ) : null}
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
                  <Col className="mb-1" lg="3" md="3" sm="12">
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
                  </Col>
                </>
              ) : null}
              {DiscountType && DiscountType == "Product Wise" ? (
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
                        selectedValues={[SelectedMainProduct]} // Preselected value to persist in dropdown
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
                            checked={FreeSelectedProduct ? true : false}
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
                            checked={AddAnotherProduct ? true : false}
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
              ) : null}
              <Col lg="12" md="12" sm="12">
                {AddAnotherProduct && (
                  <>
                    {product &&
                      product?.map((product, index) => {
                        return (
                          <Row className="" key={index}>
                            <Col className="mb-1" lg="4" md="4" sm="12">
                              <div className="">
                                <Label>Product Name</Label>
                                <Multiselect
                                  required
                                  selectionLimit={1}
                                  isObject="false"
                                  selectedValues={
                                    product?.product ? [product?.product] : []
                                  }
                                  options={ProductList}
                                  onSelect={(selectedList, selectedItem) =>
                                    handleSelection(
                                      selectedList,
                                      selectedItem,
                                      index
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
                            <Col className="mb-1" lg="4" md="4" sm="12">
                              <div className="">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  name="qty"
                                  placeholder="Req_Qty"
                                  value={product?.qty}
                                  onChange={(e) =>
                                    handleProductChangeProduct(e, index)
                                  }
                                />
                              </div>
                            </Col>

                            <Col
                              className="d-flex mt-1 abb"
                              lg="4"
                              md="4"
                              sm="12">
                              <div className="btnStyle">
                                {index ? (
                                  <Button
                                    type="button"
                                    color="danger"
                                    className="button remove "
                                    onClick={() => removeMoreProduct(index)}>
                                    -
                                  </Button>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
                  </>
                )}
                {AddAnotherProduct && (
                  <Row>
                    <Col>
                      <div className="float-right btnStyle">
                        <Button
                          className="ml-1 mb-1"
                          color="primary"
                          type="button"
                          onClick={() => addMoreProduct()}>
                          + Add
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    {FreeSelectedProduct && (
                      <>
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <div className="">
                            <Label>Free Selected Product Quantity</Label>
                            <Input
                              required
                              type="number"
                              placeholder="Number of Quantity"
                              value={FreeNumberofProduct}
                              onChange={(e) =>
                                setFreeNumberofProduct(e.target.value)
                              }
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
              {/* <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Choose Warehouse(from where) *</Label>

                    <Multiselect
                      required
                      selectionLimit={1}
                      // showCheckbox="true"
                      isObject="false"
                      options={SalesPersonList} // Options to display in the dropdown
                      // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                      onSelect={onSelect1} // Function will trigger on select event
                      onRemove={onRemove1} // Function will trigger on remove event
                      displayValue="firstName" // Property name to display in the dropdown options
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Choose Warehouse (to be Transfer) * </Label>

                    <Multiselect
                      required
                      selectionLimit={1}
                      // showCheckbox="true"
                      isObject="false"
                      options={SalesPersonList} // Options to display in the dropdown
                      // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                      onSelect={onSelect1} // Function will trigger on select event
                      onRemove={onRemove1} // Function will trigger on remove event
                      displayValue="firstName" // Property name to display in the dropdown options
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Stock Transfer date</Label>
                    <Input
                      required
                      type="date"
                      name="targetEndDate"
                      placeholder="Date of Delivery"
                      value={targetStartDate}
                      onChange={(e) => settargetStartDate(e.target.value)}
                    />
                  </div>
                </Col> */}
            </Row>
            {/* {product &&
                product?.map((product, index) => (
                  <Row className="" key={index}>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Product Name</Label>
                        <Multiselect
                          required
                          selectionLimit={1}
                          isObject="false"
                          options={ProductList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelection(selectedList, selectedItem, index)
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
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Quantity To be Transfer</Label>
                        <Input
                          type="number"
                          name="qty"
                          placeholder="Req_Qty"
                          value={product?.qty}
                          onChange={(e) => handleProductChangeProduct(e, index)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          name="price"
                          readOnly
                          placeholder="Price"
                          value={product.price}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Total Price</Label>
                        <Input
                          type="number"
                          name="totalprice"
                          readOnly
                          placeholder="TtlPrice"
                          value={product.price * product?.qty}
                        />
                      </div>
                    </Col>

                    <Col className="d-flex mt-1 abb" lg="3" md="3" sm="12">
                      <div className="btnStyle">
                        {index ? (
                          <Button
                            type="button"
                            color="danger"
                            className="button remove "
                            onClick={() => removeMoreProduct(index)}
                          >
                            - Remove
                          </Button>
                        ) : null}
                      </div>

                      <div className="btnStyle">
                        <Button
                          className="ml-1 mb-1"
                          color="primary"
                          type="button"
                          onClick={() => addMoreProduct()}
                        >
                          + Add
                        </Button>
                      </div>
                    </Col>
                  </Row>
                ))} */}

            {/* <Row>
                <Col className="mb-1" lg="12" md="12" sm="12">
                  <div className=" d-flex justify-content-end">
                    <Label className="pr-5">
                      Grand Total : <stron>{grandTotalAmt}</stron>
                    </Label>
                  </div>
                </Col>
              </Row> */}
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
          <Modal isOpen={modal} toggle={toggle} {...args}>
            <ModalHeader toggle={toggle}>Add Promotion Code here</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmitPromocode}>
                <Row>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Promo code</Label>
                    <Input
                      required
                      type="text"
                      name="targetEndDate"
                      placeholder="Enter Promotion Code"
                      value={Promocode}
                      onChange={(e) => {
                        console.log(e.target.value.toUpperCase());
                        setPromocode(e.target.value.toUpperCase());
                      }}
                    />
                  </Col>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Amount</Label>
                    <Input
                      required
                      type="number"
                      placeholder="Enter Amount"
                      value={Discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </Col>
                  <Col className="mb-1" lg="6" md="6" sm="12">
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
                  <Col className="mb-1" lg="6" md="6" sm="12">
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
                  </Col>
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
            </ModalBody>
          </Modal>
        </Card>
      </div>
    </div>
  );
};
export default CreatePromotionalActivity;
