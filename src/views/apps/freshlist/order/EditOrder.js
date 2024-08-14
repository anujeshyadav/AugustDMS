import React, { useEffect, useState, useContext } from "react";
import { Route } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import Multiselect from "multiselect-react-dropdown";
import "../../../../assets/scss/pages/users.scss";
import {
  CreateCustomerList,
  _Get,
  SavePurchaseOrder,
  _Put,
  SalesEditOrder,
} from "../../../../ApiEndPoint/ApiCalling";
import { useParams, useLocation, useHistory } from "react-router-dom";
import UserContext from "../../../../context/Context";
import {
  PurchaseProductList_Product,
  Sales_Edit_Order,
  WareHouse_Current_Stock,
} from "../../../../../src/ApiEndPoint/Api";
import { view_create_order_historyBy_id } from "../../../../ApiEndPoint/Api";
import { GstCalculation } from "./GstCalculation";
let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
let PartyListdata = [];
var Stocks = [];
const EditOrder = (args) => {
  const [Index, setIndex] = useState("");
  const [Mode, setMode] = useState("Update");
  const [PartyLogin, setPartyLogin] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ProductList, setProductList] = useState([]);
  const [GSTData, setGSTData] = useState({});
  const [PartyList, setPartyList] = useState([]);
  const [CustomerLimit, setCustomerLimit] = useState(0);
  const [CustomerTerm, setCustomerTerm] = useState("");
  const [PartyId, setPartyId] = useState("");
  const [Party, setParty] = useState(null);
  const [UnitList, setUnitList] = useState([]);
  const [UserInfo, setUserInfo] = useState({});
  const [dateofDelivery, setDateofDelivery] = useState("");
  const Params = useParams();

  let History = useHistory();
  const [product, setProduct] = useState([
    {
      productId: "",
      productData: "",
      availableQty: 0,
      disCountPercentage: "",
      qty: 1,
      price: "",
      Size: "",
      unitType: "",
      unitPriceAfterDiscount: "",
      totalprice: "",
      taxableAmount: 0,
      gstPercentage: 0,
      sgstRate: 0,
      cgstRate: 0,
      igstRate: 0,
      grandTotal: 0,
    },
  ]);
  const Context = useContext(UserContext);
  const handleRequredQty = (e, index, avalaibleSize) => {
    const { name, value } = e.target;
    if (Number(value) <= avalaibleSize) {
      if (Number(value != 0)) {
        setIndex(index);
        const list = [...product];
        list[index][name] = Number(value);
        let amt = 0;
        if (list?.length > 0) {
          const x = list?.map((val) => {
            GrandTotal[index] = val.qty * val.price;
            list[index]["totalprice"] = val.qty * val.price;
            return val.qty * val.price;
          });
          amt = x.reduce((a, b) => a + b);
        }
        const gstdetails = GstCalculation(Party, list, Context);
        setGSTData(gstdetails);
        list[index]["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
        list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
        list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
        list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
        list[index]["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
        list[index]["gstPercentage"] =
          gstdetails?.gstDetails[index]?.gstPercentage;
        list[index]["discountPercentage"] =
          gstdetails?.gstDetails[index]?.discountPercentage;
        // console.log(list);

        if (CustomerTerm == "Cash") {
          setProduct(list);
        } else {
          if (amt < CustomerLimit) {
            // const gstdetails = GstCalculation(Party, list, Context);
            // setGSTData(gstdetails);
            // list[index]["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
            // list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
            // list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
            // list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
            // list[index]["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
            // list[index]["gstPercentage"] =
            //   gstdetails?.gstDetails[index]?.gstPercentage;
            // list[index]["discountPercentage"] =
            //   gstdetails?.gstDetails[index]?.discountPercentage;
            // // console.log(list);

            setProduct(list);
          } else {
            swal("Error", `Your Max Limit is ${CustomerLimit}`);
          }
        }
        // const gstdetails = GstCalculation(Party, list, Context);
        // setGSTData(gstdetails);
        // list[index]["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
        // list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
        // list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
        // list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
        // list[index]["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
        // list[index]["gstPercentage"] =
        //   gstdetails?.gstDetails[index]?.gstPercentage;
        // list[index]["disCountPercentage"] =
        //   gstdetails?.gstDetails[index]?.discountPercentage;
        // setProduct(list);
      }
    }
  };

  const handleSelectionParty = async (selectedList, selectedItem) => {
    setPartyId(selectedItem._id);
    setParty(selectedItem);
    let paymentTermCash = selectedItem?.paymentTerm
      .toLowerCase()
      ?.includes("cash");
    debugger;
    if (!paymentTermCash) {
      let URL = "order/check-party-limit/";
      await _Get(URL, selectedItem._id)
        .then((res) => {
          setCustomerLimit(Number(res?.CustomerLimit));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCustomerLimit(0);
      setCustomerTerm("Cash");
    }
    const gstdetails = GstCalculation(selectedItem, product, Context);
    setGSTData(gstdetails);
  };

  const handleSelection = async (selectedList, selectedItem, index) => {
    const userdata = JSON.parse(localStorage.getItem("userData"));
    SelectedITems.push(selectedItem);
    let costPrice = Number(
      (
        selectedItem?.Product_MRP /
        (((100 +
          Number(Party?.category?.discount ? Party?.category?.discount : 0)) /
          100) *
          ((100 + Number(selectedItem?.GSTRate)) / 100))
      ).toFixed(2)
    );
    // let URl = `${WareHouse_Current_Stock}${selectedItem?.warehouse?._id}/`;
    // var Stock;
    // await _Get(URl, selectedItem?._id)
    //   .then((res) => {
    //     Stock = res?.currentStock;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     swal("something went Wrong");
    //   });
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProduct.discount = Party?.category?.discount;
      // updatedProduct.availableQty = Stock?.currentStock;
      updatedProduct.availableQty = selectedItem?.Opening_Stock;
      updatedProduct.wholeQty = selectedItem?.Opening_Stock;
      updatedProduct.HSN_Code = selectedItem?.HSN_Code;
      updatedProduct.basicPrice = costPrice;

      updatedProduct["discountPercentage"] =
        Party?.category?.discount && Party?.category?.discount
          ? Party?.category?.discount
          : 0;
      updatedProduct.productData = selectedItem;
      updatedProduct.primaryUnit = selectedItem?.primaryUnit;
      updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
      updatedProduct.secondarySize = selectedItem?.secondarySize;

      updatedProduct.disCountPercentage =
        Party?.Category?.discount && Party?.Category?.discount
          ? Party?.Category?.discount
          : 0;

      updatedProductList[index] = updatedProduct;
      const gstdetails = GstCalculation(Party, updatedProductList, Context);
      setGSTData(gstdetails);
      updatedProduct["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
      updatedProduct["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
      updatedProduct["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
      updatedProduct["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
      updatedProduct["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
      updatedProduct["gstPercentage"] =
        gstdetails?.gstDetails[index]?.gstPercentage;
      updatedProduct["disCountPercentage"] =
        gstdetails?.gstDetails[index]?.discountPercentage;

      return updatedProductList; // Return the updated product list to set the state
    });
  };

  const handleSelectionUnit = (selectedList, selectedItem, index) => {
    SelectedSize.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedUnitList = [...prevProductList];
      const updatedProduct = { ...updatedUnitList[index] }; // Create a copy of the product at the specified index
      updatedProduct.Size = selectedItem?.unitQty;
      updatedProduct.unitType = selectedItem.primaryUnit;
      updatedUnitList[index] = updatedProduct;
      let myarr = prevProductList?.map((ele, i) => {
        updatedUnitList[index]["totalprice"] =
          ele?.qty * ele.price * SelectedSize[i]?.unitQty;
        let indextotal = ele?.price * ele.qty * SelectedSize[i]?.unitQty;
        GrandTotal[index] = indextotal;
        return indextotal;
      });
      let amt = myarr.reduce((a, b) => a + b);

      const gstdetails = GstCalculation(Party, updatedUnitList, Context);

      setGSTData(gstdetails);
      updatedProduct["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
      updatedProduct["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
      updatedProduct["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
      updatedProduct["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
      updatedProduct["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
      updatedProduct["gstPercentage"] =
        gstdetails?.gstDetails[index]?.gstPercentage;
      updatedProduct["disCountPercentage"] =
        gstdetails?.gstDetails[index]?.discountPercentage;
      return updatedUnitList; // Return the updated product list
    });
  };

  const fetchQuantity = async (warehouseId) => {
    debugger;

    for (const id of warehouseId) {
      debugger;
      // const quantity = await fetchQuantity(id);
      // results.push({ warehouseId: id, quantity });
      let URl = `${WareHouse_Current_Stock}${id?.warehouseid}/`;

      await _Get(URl, id?.productId?._id)
        .then((res) => {
          debugger;
          console.log(res?.currentStock);
          Stocks.push(res?.currentStock);
        })
        .catch((err) => {
          console.log(err);
          swal("something went Wrong");
        });
    }
  };
  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    setLoading(true);

    let findParty = userdata?.rolename?.roleName == "Customer";
    if (findParty) {
      setPartyLogin(true);
      setPartyId(userdata?._id);
    }

    (async () => {
      await _Get(PurchaseProductList_Product, userdata?.database)
        .then((res) => {
          setProductList(res?.Product);
        })
        .catch((err) => {
          console.log(err);
        });
      await CreateCustomerList(userdata?._id, userdata?.database)
        .then((res) => {
          let value = res?.Customer;
          if (value?.length) {
            const formattedData = value?.map((item) => ({
              ...item,
              displayLabel: `${item.firstName} (Grade: ${
                item?.category?.grade ? item?.category?.grade : "NA"
              })`,
            }));
            setPartyList(formattedData);
            PartyListdata = value;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setMode("Update");
      await _Get(view_create_order_historyBy_id, Params?.id)
        .then((res) => {
          // debugger;
          let value = res?.orderHistory;
          let selectedParty = PartyListdata?.filter(
            (ele) => ele?._id == value?.partyId?._id
          );
          let URL = "order/check-party-limit/";
          _Get(URL, res?.orderHistory?.partyId?._id)
            .then((res) => {
              setCustomerLimit(Number(res?.CustomerLimit));
              // console.log(res?.CustomerLimit);
            })
            .catch((err) => {
              console.log(err);
            });
          setParty(selectedParty[0]);
          setPartyId(value?.partyId?._id);
          let updatedProduct = value?.orderItems;

          // let warhouseid=updatedProduct?.map((ele)=>{
          //   return {
          //     warehouseid:ele?.productId?.warehouse,
          //     productId:ele?.productId,
          //   }
          // })
          // debugger
          // // check stock
          //   const quantity = async ()=>{
          //    let response= await fetchQuantity(warhouseid)
          //   };
          //   quantity()
          //   console.log(Stocks)
          //   debugger

          //

          // const updatedProduct = { ...updatedProductList[index] };
          let order = value?.orderItems?.map((element, index) => {
            let costPrice = Number(
              (
                element?.productId?.Product_MRP /
                (((100 +
                  Number(
                    selectedParty[0]?.category?.discount
                      ? selectedParty[0]?.category?.discount
                      : 0
                  )) /
                  100) *
                  ((100 + Number(element?.productId?.GSTRate)) / 100))
              ).toFixed(2)
            );
            SelectedITems.push(element?.productId);
            // const updatedProductList = [...prevProductList];
            // const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
            updatedProduct[index]["price"] = element?.productId?.Product_MRP; // Update the price of the copied product
            updatedProduct[index]["basicPrice"] = costPrice; // Update the price of the copied product
            updatedProduct[index]["availableQty"] =
              element?.productId?.Product_MRP * 100; // Update the price of the copied product
            updatedProduct[index]["discount"] =
              selectedParty[0]?.category?.discount;
            updatedProduct[index]["HSN_Code"] = element?.productId?.HSN_Code;
            updatedProduct[index]["productData"] = element?.productId;
            updatedProduct[index]["primaryUnit"] =
              element?.productId?.primaryUnit;
            updatedProduct[index]["secondaryUnit"] =
              element?.productId?.secondaryUnit;
            updatedProduct[index]["secondarySize"] =
              element?.productId?.secondarySize;
            updatedProduct[index]["productId"] = element?.productId?._id;

            updatedProduct[index]["disCountPercentage"] =
              selectedParty[0]?.category?.discount &&
              selectedParty[0]?.category?.discount
                ? selectedParty[0]?.category?.discount
                : 0;
            const gstdetails = GstCalculation(
              selectedParty[0],
              updatedProduct,
              Context
            );
            setGSTData(gstdetails);
            updatedProduct[index]["taxableAmount"] =
              gstdetails?.gstDetails[index]?.taxable;
            updatedProduct[index]["sgstRate"] =
              gstdetails?.gstDetails[index]?.sgstRate;
            updatedProduct[index]["cgstRate"] =
              gstdetails?.gstDetails[index]?.cgstRate;
            updatedProduct[index]["igstRate"] =
              gstdetails?.gstDetails[index]?.igstRate;
            updatedProduct[index]["grandTotal"] =
              gstdetails?.gstDetails[index]?.grandTotal;
            updatedProduct[index]["gstPercentage"] =
              gstdetails?.gstDetails[index]?.gstPercentage;
            updatedProduct[index]["disCountPercentage"] =
              gstdetails?.gstDetails[index]?.discountPercentage;
          });

          setProduct(updatedProduct);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false);
        });
    })();
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
        productData: "",
        availableQty: 0,
        disCountPercentage: "",
        qty: 1,
        Size: "",
        price: "",
        totalprice: "",
        unitQty: "",
        unitType: "",
        unitPriceAfterDiscount: "",
        taxableAmount: "",
        gstPercentage: "",
        sgstRate: "",
        cgstRate: "",
        igstRate: "",
        grandTotal: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);
    GrandTotal.splice(i, 1);

    setProduct(newFormValues);
    const gstdetails = GstCalculation(Party, newFormValues, Context);
    setGSTData(gstdetails);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const gstdetails = GstCalculation(Party, product, Context);
    const fullname = UserInfo?.firstName;
    let Product = product?.map((ele) => {
      if (ele?.disCountPercentage > 1) {
        return {
          igstTaxType: gstdetails?.Tax?.IgstTaxType,
          productId: ele?.productId,
          productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.availableQty,
          qty: ele?.qty,
          price: ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          // Size: ele?.Size,
          // unitQty: ele?.unitQty,
          // unitType: ele?.unitType,
          totalPrice: ele?.qty * ele?.price,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: Number(
            (
              (ele?.qty * ele?.price * (100 - ele?.disCountPercentage)) /
              100
            ).toFixed(2)
          ),
        };
      } else {
        return {
          productId: ele?.productId,
          productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.availableQty,
          qty: ele?.qty,
          price: ele?.price,
          // Size: ele?.Size,
          totalPrice: ele?.qty * ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          // unitQty: ele?.unitQty,
          // unitType: ele?.unitType,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: ele?.qty * ele?.price,
          igstTaxType: gstdetails?.Tax?.IgstTaxType,
        };
      }
    });

    const payload = {
      userId: UserInfo?._id,
      database: UserInfo?.database,
      partyId: PartyId,
      SuperAdmin: Context?.CompanyDetails?.created_by,
      fullName: fullname,
      address: UserInfo?.address,
      grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      roundOff: Number(
        (gstdetails?.Tax?.GrandTotal - gstdetails?.Tax?.RoundOff).toFixed(2)
      ),
      amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
      sgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTaxType: gstdetails?.Tax?.IgstTaxType,
      cgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTotal: gstdetails?.Tax?.IgstTotal,
      gstDetails: gstdetails?.gstDetails,
      MobileNo: Party?.contactNumber,
      state: Party?.State,
      city: Party?.City,
      orderItems: Product,
      // DateofDelivery: dateofDelivery,
    };
    if (CustomerTerm == "Cash") {
      await _Put(Sales_Edit_Order, Params.id, payload)
        .then((res) => {
          setLoading(false);
          History.goBack();
          swal("success", "Order Edited Successfully", "success");
        })
        .catch((err) => {
          setLoading(false);
          swal("error", "Error Occured", "error");
        });
    } else {
      if (GSTData?.Tax?.GrandTotal < CustomerLimit) {
        setLoading(true);

        await _Put(Sales_Edit_Order, Params.id, payload)
          .then((res) => {
            setLoading(false);
            History.goBack();
            swal("success", "Order Edited Successfully", "success");
          })
          .catch((err) => {
            setLoading(false);
            swal("error", "Error Occured", "error");
          });
      } else {
        swal("Error", `Your Max Limit is ${CustomerLimit}`);
      }
    }
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-1">
            <Col className="">
              <div>
                <h1 className="">{Mode && Mode} Sales Order</h1>
              </div>
            </Col>
            <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className="btn float-right"
                    color="danger"
                    onClick={() => history.goBack()}>
                    Back
                  </Button>
                )}
              />
            </Col>
          </Row>

          <CardBody>
            {Loading ? (
              <>
                <div className="d-flex justify-content-center p-5">
                  {/* Loading... */}
                  <Spinner size={35} />
                </div>
              </>
            ) : (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    {PartyLogin && PartyLogin ? null : (
                      <>
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <div className="">
                            <Label>
                              Choose Party{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>

                            <Multiselect
                              required
                              selectedValues={Party !== null && [Party]}
                              selectionLimit={1}
                              isObject="false"
                              options={PartyList}
                              onSelect={(selectedList, selectedItem) =>
                                handleSelectionParty(selectedList, selectedItem)
                              }
                              onRemove={onRemove1}
                              displayValue="firstName"
                            />
                          </div>
                        </Col>
                        <Col className="mb-1" lg="3" md="3" sm="12">
                          <div className="">
                            <Label>
                              Balance Amount{" "}
                              <span style={{ color: "red" }}>*</span>{" "}
                            </Label>
                            <Input
                              readOnly
                              type="text"
                              name="CustomerLimit"
                              placeholder="Balance Amount"
                              value={CustomerLimit.toFixed(2)}
                              // onChange={e => setDateofDelivery(e.target.value)}
                            />
                          </div>
                        </Col>
                        {CustomerLimit > 0 && (
                          <Col className="mb-1" lg="3" md="3" sm="12">
                            <div className="">
                              <Label>
                                Net Balance{" "}
                                <span style={{ color: "red" }}>*</span>{" "}
                              </Label>
                              <Input
                                readOnly
                                type="text"
                                name="NetBalance"
                                placeholder=" Net Balance"
                                value={
                                  !!GSTData?.Tax
                                    ? (
                                        CustomerLimit - GSTData?.Tax?.GrandTotal
                                      ).toFixed(2)
                                    : 0.0
                                }

                                // {!!GSTData?.Tax?.GrandTotal
                                //   ? (GSTData?.Tax?.GrandTotal).toFixed(2)
                                //   : 0}
                                // onChange={e => setDateofDelivery(e.target.value)}
                              />
                            </div>
                          </Col>
                        )}
                        {/* <Col className="mb-1" lg="4" md="4" sm="12">
                      <div className="">
                        <Label>Expected Delivery Date</Label>
                        <Input
                          required
                          type="date"
                          name="DateofDelivery"
                          value={dateofDelivery}
                          onChange={(e) => setDateofDelivery(e.target.value)}
                        />
                      </div>
                    </Col> */}
                      </>
                    )}
                    <Col className="mb-1" lg="4" md="4" sm="12"></Col>
                  </Row>
                  {product &&
                    product?.map((product, index) => (
                      <Row className="" key={index}>
                        <Col>
                          <div className="viewspacebetween">
                            <div className="viewspacebetween0">
                              <Label>
                                Product <span style={{ color: "red" }}> *</span>
                              </Label>
                              <Multiselect
                                required
                                selectedValues={
                                  product?.productData && [product?.productData]
                                }
                                selectionLimit={1}
                                isObject="false"
                                options={ProductList}
                                onSelect={(selectedList, selectedItem) =>
                                  handleSelection(
                                    selectedList,
                                    selectedItem,
                                    index
                                  )
                                }
                                onRemove={(selectedList, selectedItem) => {
                                  onRemove1(selectedList, selectedItem, index);
                                }}
                                displayValue="Product_Title" // Property name to display in the dropdown options
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>HSN</Label>
                              <Input
                                readOnly
                                type="text"
                                name="HSN_Code"
                                placeholder="HSN_Code"
                                required
                                value={product?.HSN_Code}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Gross Unit</Label>
                              <Input
                                type="text"
                                name="secondaryUnit"
                                readOnly
                                placeholder="Gross Unit"
                                value={product.secondaryUnit}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Gross Qty</Label>
                              <Input
                                type="number"
                                readOnly
                                // name="qty"
                                // min={0}
                                placeholder="Gross Qty"
                                // required
                                // autocomplete="off"
                                value={(
                                  product?.qty / product?.secondarySize
                                )?.toFixed(2)}
                                // onChange={(e) => handleRequredQty(e, index)}
                              />
                            </div>
                            <div
                              className="viewspacebetween2"
                              style={{ width: "90px" }}>
                              <Label>
                                Avail Qty{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                type="number"
                                name="availQty"
                                min={0}
                                placeholder="availableQty"
                                readOnly
                                autocomplete="off"
                                value={product?.availableQty}
                                // onChange={e =>
                                //   handleRequredQty(e, index, product?.availableQty)
                                // }
                              />
                            </div>
                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Net Qty</Label>
                              <Input
                                type="number"
                                name="qty"
                                min={0}
                                placeholder="Req_Qty"
                                required
                                autocomplete="off"
                                value={product?.qty}
                                onChange={(e) =>
                                  handleRequredQty(
                                    e,
                                    index,
                                    product?.availableQty
                                  )
                                }
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Net Unit</Label>
                              <Input
                                readOnly
                                type="text"
                                name="primaryUnit"
                                // min={0}
                                placeholder="Net Unit"
                                required
                                value={product?.primaryUnit}
                                // onChange={(e) => handleRequredQty(e, index)}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Sales Price</Label>
                              <Input
                                type="number"
                                name="price"
                                readOnly
                                placeholder="Price"
                                value={product.price}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Dis. %</Label>
                              <Input
                                type="number"
                                name="price"
                                readOnly
                                placeholder="Discount %"
                                value={product.disCountPercentage}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Tax %</Label>
                              <Input
                                type="text"
                                name="gstPercentage"
                                disabled
                                placeholder="GST Percentage %"
                                value={product.gstPercentage}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Basic Price</Label>
                              <Input
                                type="number"
                                name="basicPrice"
                                readOnly
                                placeholder="Basic Price"
                                value={product.basicPrice}
                              />
                            </div>

                            <div
                              className="viewspacebetween3"
                              style={{ width: "84px" }}>
                              <Label>Basic Total</Label>
                              <Input
                                type="number"
                                name="taxableAmount"
                                disabled
                                placeholder="taxle Amount"
                                value={product.taxableAmount}
                              />
                            </div>
                          </div>
                        </Col>
                        {/* <Col className="mb-1">
                      <div className="">
                        <Label>Unit</Label>
                        <Multiselect
                          required
                          selectionLimit={1}
                          isObject="false"
                          options={UnitList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelectionUnit(
                              selectedList,
                              selectedItem,
                              index
                            )
                          }
                          onRemove={(selectedList, selectedItem) => {
                            onRemove1(selectedList, selectedItem, index);
                          }}
                          displayValue="primaryUnit"
                        />
                      </div>
                    </Col> */}
                        {/* <Col className="mb-1">
                      <div className="">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          name="price"
                          disabled
                          placeholder="Price"
                          value={product.price}
                        />
                      </div>
                    </Col> */}

                        {/* <Col className="mb-1">
                      <div className="">
                        <Label>Taxable</Label>
                        <Input
                          type="number"
                          name="taxableAmount"
                          disabled
                          placeholder="taxle Amount"
                          value={product.taxableAmount}
                        />
                      </div>
                    </Col> */}

                        {/* {GSTData?.Tax?.IgstTaxType ? (
                      <>
                        <Col className="mb-1">
                          <div className="">
                            <Label>IGST</Label>
                            <Input
                              type="number"
                              name="igstRate"
                              readOnly
                              placeholder="igstRate"
                              value={product.igstRate}
                            />
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col className="mb-1">
                          <div className="">
                            <Label>SGST</Label>
                            <Input
                              type="number"
                              name="sgstRate"
                              readOnly
                              placeholder="sgstRate"
                              value={product.sgstRate}
                            />
                          </div>
                        </Col>
                        <Col className="mb-1">
                          <div className="">
                            <Label>CGST</Label>
                            <Input
                              type="number"
                              name="cgstRate"
                              readOnly
                              placeholder="cgstRate"
                              value={product.cgstRate}
                            />
                          </div>
                        </Col>
                      </>
                    )} */}
                        {/* <Col className="mb-1">
                      <div className="">
                        <Label>Total Price</Label>
                        <Input
                          type="number"
                          name="grandTotal"
                          readOnly
                          placeholder="TtlPrice"
                          value={product.grandTotal}
                        />
                      </div>
                    </Col> */}

                        <Col className="d-flex mt-1 abb">
                          <div className="btnStyle">
                            {index ? (
                              <Button
                                type="button"
                                style={{ padding: "16px 16px" }}
                                color="danger"
                                className="button remove cancel"
                                size="sm"
                                onClick={() => removeMoreProduct(index)}>
                                X
                              </Button>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    ))}
                  <Row>
                    <Col>
                      <div className="btnStyle float-right">
                        <Button
                          className="ml-1 mb-1"
                          color="primary"
                          type="button"
                          size="sm"
                          onClick={() => addMoreProduct()}>
                          +
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mb-1 mt-1" lg="12" md="12" sm="12">
                      <div className=" d-flex justify-content-end">
                        <ul className="subtotal">
                          <li>
                            <div className="totalclas">
                              <span className="">Total:</span>
                              <span className="">
                                {!!GSTData?.Tax?.Amount && GSTData?.Tax?.Amount
                                  ? (GSTData?.Tax?.Amount).toFixed(2)
                                  : 0}
                              </span>
                            </div>
                          </li>
                          {GSTData?.Tax?.IgstTaxType &&
                          GSTData?.Tax?.IgstTaxType ? (
                            <li>
                              <div className="totalclas">
                                <span className="">IGST Tax: </span>
                                <strong>
                                  {!!GSTData?.Tax?.IgstTotal &&
                                  GSTData?.Tax?.IgstTotal
                                    ? (GSTData?.Tax?.IgstTotal).toFixed(2)
                                    : 0}
                                </strong>
                              </div>
                            </li>
                          ) : (
                            <>
                              <li>
                                <div className="totalclas">
                                  <span className="">SGST Tax: </span>
                                  <strong>
                                    {!!GSTData?.Tax?.SgstTotal &&
                                    GSTData?.Tax?.SgstTotal
                                      ? (GSTData?.Tax?.SgstTotal).toFixed(2)
                                      : 0}
                                  </strong>
                                </div>
                              </li>
                              <li>
                                <div className="totalclas">
                                  <span className="">CGST Tax: </span>
                                  <strong>
                                    {!!GSTData?.Tax?.CgstTotal &&
                                    GSTData?.Tax?.CgstTotal
                                      ? (GSTData?.Tax?.CgstTotal).toFixed(2)
                                      : 0}
                                  </strong>
                                </div>
                              </li>
                            </>
                          )}
                          <hr />
                          <li>
                            {" "}
                            <div className="totalclas">
                              <span className="">Grand Total : </span>
                              <strong>
                                {!!GSTData?.Tax?.GrandTotal
                                  ? (GSTData?.Tax?.GrandTotal).toFixed(2)
                                  : 0}
                              </strong>
                            </div>
                          </li>
                          <hr />
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  {!Loading && !Loading ? (
                    <>
                      {GSTData?.Tax?.GrandTotal > 0 && (
                        <Row>
                          <Col>
                            <div className="d-flex justify-content-center">
                              <Button
                                color="primary"
                                type="submit"
                                className="mt-2">
                                {Mode && Mode}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </>
                  ) : (
                    <Row>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <Button color="secondary" className="mt-2">
                            Loading...
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Form>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default EditOrder;
