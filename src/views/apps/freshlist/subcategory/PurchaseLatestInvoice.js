import React from "react";
import QRCode from "./QRCode";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Rect,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import logo from "../../../../assets/img/logo/logowithoutback.png";

import cancelimage from "../../../../assets/img/cancelledOrder.jpg";
import { Image_URL } from "../../../../ApiEndPoint/Api";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: "30%",
    left: "25%",
    transform: "translate(-30%, -30%) rotate(-18deg)",
    opacity: 0.3, // Set opacity to make it a watermark
    zIndex: -1, // Ensure it's behind the content
    width: "400px", // Set width based on your requirement
    height: "380px", // Adjust the height as needed
  },
  header: {
    fontSize: "8px",
    marginTop: "1px",
    marginBottom: "2px",
  },
  GSTIN: {
    fontSize: "10px",
    fontWeight: "bold",
    marginTop: "1px",
    marginBottom: "2px",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  customername: {
    fontSize: 14,
    marginBottom: 8,
  },
  image: {
    width: 70,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  item: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    fontSize: 15,
  },
});

const PurchaseLatestInvoice = ({ invoiceData, BilData }) => {
  debugger
  const curentDate = new Date();
  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          {BilData?.PrintData?.canceledInvoice && (
            <Image src={cancelimage} style={styles.watermark} />
          )}

          <View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
                borderTop: "1px solid black",
                height: "90px",
              }}>
              <View
                style={{
                  width: "25%",
                  padding: "5px 5px",
                  borderRight: "1px solid black",
                }}>
                {BilData?.CompanyDetails?.logo &&
                BilData?.CompanyDetails?.logo ? (
                  <>
                    <Image
                      style={{ width: "100%", padding: "1px 1px" }}
                      src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                  </>
                ) : (
                  <>
                    <Image
                      style={{ width: "100%", padding: "1px 1px" }}
                      src={logo}></Image>
                  </>
                )}
              </View>

              <View
                style={{
                  padding: "10px",
                  width: "50%",
                  borderRight: "1px solid black",
                }}>
                <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.PrintData?.partyId?.CompanyName &&
                      BilData?.PrintData?.partyId?.CompanyName}
                  </Text>
                  <Text
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.PrintData?.partyId?.address &&
                      BilData?.PrintData?.partyId?.address}
                  </Text>
                  <Text
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.PrintData?.partyId?.email &&
                      BilData?.PrintData?.partyId?.email}
                  </Text>
                  <Text
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.PrintData?.partyId?.mobileNumber &&
                      BilData?.PrintData?.partyId?.mobileNumber}
                  </Text>
                  <Text
                    style={{
                      fontSize: "9px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.PrintData?.partyId?.gstNumber &&
                      BilData?.PrintData?.partyId?.gstNumber}
                  </Text>
                  <Text style={styles.header}></Text>
                  <Text style={styles.header}></Text>
                </View>
              </View>
              <View style={{ padding: "10px", width: "25%" }}>
                <Text style={{ textAlign: "center" }}>
                  QR CODE{" "}
                  {/* <QRCode invoiceData={invoiceData} BilData={BilData} /> */}
                  {/* <Image
                    style={{ width: "230px", padding: "25px 10px" }}
                    src={logo}></Image> */}
                </Text>
                <View></View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",

                borderBottom: "1px solid black",

                borderLeft: "1px solid black",
                height: "96px",
              }}>
              <View
                style={{
                  borderRight: "1px solid black",
                }}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "30%",
                      borderRight: "1px solid black",
                      height: "96",
                    }}>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginBottom: "5px",

                        textTransform: "uppercase",
                      }}>
                      Bill To
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",

                        textTransform: "uppercase",
                      }}>
                      {BilData?.CompanyDetails?.name &&
                        BilData?.CompanyDetails?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.CompanyDetails?.address &&
                        BilData?.CompanyDetails?.address}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {/* {`${
                        BilData?.CompanyDetails?.City &&
                        BilData?.CompanyDetails?.City
                      }-${
                        BilData?.CompanyDetails?.State &&
                        BilData?.CompanyDetails?.State
                      }`} */}
                    </Text>

                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.CompanyDetails?.email &&
                        BilData?.CompanyDetails?.email}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.CompanyDetails?.mobileNo &&
                        BilData?.CompanyDetails?.mobileNo}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.CompanyDetails?.gstNo &&
                        BilData?.CompanyDetails?.gstNo}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      borderRight: "1px solid black",
                      height: "96",
                    }}>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginBottom: "5px",
                        textTransform: "uppercase",
                      }}>
                      Bill From
                    </Text>

                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",

                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.CompanyName &&
                        BilData?.PrintData?.partyId?.CompanyName}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.address &&
                        BilData?.PrintData?.partyId?.address}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.City &&
                        BilData?.PrintData?.partyId?.City}
                      -
                      {BilData?.PrintData?.partyId?.State &&
                        BilData?.CompanyDetails?.State}
                    </Text>

                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.email &&
                        BilData?.PrintData?.partyId?.email}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.contactNumber &&
                        BilData?.PrintData?.partyId?.contactNumber}
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      {BilData?.PrintData?.partyId?.gstNumber &&
                        BilData?.PrintData?.partyId?.gstNumber}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      borderBottom: "1px solid black",
                      height: "96px",
                    }}>
                    <View style={{ flexDirection: "row", height: "16px" }}>
                      <View style={{ width: "40%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          Date:{" "}
                          {invoiceData?.date &&
                            invoiceData?.date?.split("T")[0]}
                        </Text>
                      </View>
                      <View style={{ width: "60%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          SP NAME:{" "}
                          {BilData?.PrintData?.userId?.firstName &&
                            `${BilData?.PrintData?.userId?.firstName}`}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          {invoiceData?.DeliveryType == "Local" ? (
                            <>
                              Challan No:{" "}
                              {invoiceData?.orderNo && invoiceData?.orderNo}
                            </>
                          ) : (
                            <>
                              {invoiceData?.status == "completed" ? (
                                <>
                                  Invoice No:{" "}
                                  {invoiceData?.invoiceId &&
                                    invoiceData?.invoiceId}
                                </>
                              ) : (
                                <>
                                  Challan No:{" "}
                                  {invoiceData?.orderNo && invoiceData?.orderNo}
                                </>
                              )}
                            </>
                          )}
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          Ledger Balance:{" "}
                          {BilData?.PrintData?.lastLedgerBalance &&
                            BilData?.PrintData?.lastLedgerBalance}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          eway bill no
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          payment mode :
                          {invoiceData?.partyId?.paymentTerm &&
                            invoiceData?.partyId?.paymentTerm}{" "}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          transporter name :
                          {!!invoiceData?.transporter &&
                            invoiceData?.transporter?.companyName}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          address :
                          {!!invoiceData?.transporter &&
                            invoiceData?.transporter?.address1}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          mobile no :{" "}
                          {!!invoiceData?.transporter &&
                            invoiceData?.transporter?.contactNumber}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",

                height: "14px",
              }}>
              <View
                style={{
                  width: "5%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      paddingTop: "2px",
                    }}>
                    s.no
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "25%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      paddingTop: "2px",
                    }}>
                    particulars
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    hsn/sac
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    tax rate
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    qnty
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    price
                  </Text>
                </View>
              </View>
              {invoiceData?.igstTaxType == 1 ? (
                <>
                  <View
                    style={{
                      width: "10%",
                      borderRight: "1px solid black",
                      paddingTop: "1px",
                    }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",
                          paddingTop: "2px",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}>
                        igst
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      width: "10%",
                      borderRight: "1px solid black",
                      paddingTop: "1px",
                    }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",
                          paddingTop: "2px",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}>
                        cgst
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      borderRight: "1px solid black",
                      paddingTop: "1px",
                    }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",
                          paddingTop: "2px",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}>
                        sgst
                      </Text>
                    </View>
                  </View>
                </>
              )}
              <View style={{ width: "10%" }}>
                <View style={{ flexDirection: "", paddingTop: "1px" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    Amount
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: "200px",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                borderLeft: "1px solid black",
              }}>
              {invoiceData?.orderItems?.map((ele, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      borderBottom: "1px solid black",
                      // borderRight: "1px solid black",
                      // borderLeft: "1px solid black",
                      height: "14px",
                    }}>
                    <View
                      style={{
                        width: "5%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            textAlign: "center",
                            textTransform: "uppercase",
                            paddingTop: "2px",
                          }}>
                          {i + 1}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "25%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            textAlign: "center",
                            textTransform: "uppercase",
                            paddingTop: "2px",
                          }}>
                          {ele?.productId?.Product_Title}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2px",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {ele?.productId?.HSN_Code}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2px",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {ele?.productId?.GSTRate}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2px",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {ele?.qty?.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRight: "1px solid black",
                        paddingTop: "1px",
                      }}>
                      <View style={{ flexDirection: "" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2px",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {invoiceData?.purchaseStatus &&
                          invoiceData?.purchaseStatus ? (
                            <>
                              {(
                                ele?.price /
                                ((100 + ele?.productId?.GSTRate) / 100)
                              ).toFixed(2)}
                            </>
                          ) : (
                            <>
                              {ele?.discountPercentage >= 0 ? (
                                <>
                                  {(
                                    ele?.price /
                                    (((100 + ele?.discountPercentage) / 100) *
                                      ((100 + ele?.productId?.GSTRate) / 100))
                                  ).toFixed(2)}
                                </>
                              ) : (
                                <>
                                  {(
                                    ele?.price /
                                    ((100 + ele?.productId?.GSTRate) / 100)
                                  ).toFixed(2)}
                                </>
                              )}
                            </>
                          )}
                        </Text>
                      </View>
                    </View>
                    {invoiceData?.igstTaxType == 1 ? (
                      <>
                        <View
                          style={{
                            width: "10%",
                            borderRight: "1px solid black",
                            paddingTop: "1px",
                          }}>
                          <View style={{ flexDirection: "" }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2px",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {ele?.igstRate}
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <View
                          style={{
                            width: "10%",
                            borderRight: "1px solid black",
                            paddingTop: "1px",
                          }}>
                          <View style={{ flexDirection: "" }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2px",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {ele?.cgstRate}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRight: "1px solid black",
                            paddingTop: "1px",
                          }}>
                          <View style={{ flexDirection: "" }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2px",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {ele?.sgstRate}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                    <View style={{ width: "10%" }}>
                      <View style={{ flexDirection: "", paddingTop: "1px" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2px",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {ele?.taxableAmount?.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",

                height: "200px",
              }}>
              <View style={{ width: "5%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "25%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%" }}>
                <View style={{ flexDirection: "", paddingTop: "1px" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
            </View> */}
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                height: "165",
                borderLeft: "1px solid black",
              }}>
              <View style={{ width: "70%", borderRight: "1px solid black" }}>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    borderBottom: "1px solid black",
                    height: "14px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      padding: "2px",
                      fontWeight: "bold",
                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    Total: {BilData?.wordsNumber && BilData?.wordsNumber}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", padding: "4px" }}>
                  <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        Bank name:{" "}
                        {BilData?.CompanyDetails?.bankName &&
                          BilData?.CompanyDetails?.bankName}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row", padding: "4px" }}>
                  <View style={{ width: "35%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        A/C No. :{" "}
                        {BilData?.CompanyDetails?.accountNumber &&
                          BilData?.CompanyDetails?.accountNumber}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "32%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        ifsc code:
                        {BilData?.CompanyDetails?.bankIFSC &&
                          BilData?.CompanyDetails?.bankIFSC}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "33%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        micr no :
                        {BilData?.CompanyDetails?.bankMicr &&
                          BilData?.CompanyDetails?.bankMicr}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    padding: "4px",
                    borderBottom: "1px solid black",
                  }}>
                  <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        address :
                        {BilData?.CompanyDetails?.bankAddress &&
                          BilData?.CompanyDetails?.bankAddress}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    paddingLeft: "3px",
                    borderBottom: "1px solid black",
                    height: "15px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      padding: "2px",
                      fontWeight: "bold",
                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    ARN No.:{" "}
                    {invoiceData?.ARNStatus && (
                      <>
                        <Text
                          style={{
                            fontSize: "6px",
                          }}>
                          {invoiceData?.ARN}
                        </Text>
                      </>
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    padding: "3px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    terms & conditions :
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "3px",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.CompanyDetails?.termsAndCondition &&
                      BilData?.CompanyDetails?.termsAndCondition}
                  </Text>

                  {/* <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    subject to surat jurisdiction.
                  </Text> */}
                </View>
              </View>
              <View
                style={{
                  width: "30%",
                  borderRight: "1px solid black",
                  padding: "3px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: "10px",
                      paddingBottom: "3px",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      Taxable Value
                    </Text>{" "}
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      {invoiceData?.amount && (
                        <>{(invoiceData?.amount).toFixed(2)}</>
                      )}
                    </Text>
                  </View>
                  {/* <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    discount
                  </Text> */}
                  {/* {invoiceData?.coolieAndCartage > 0 && (

                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    charges
                  </Text>
                   )} */}
                  {invoiceData?.coolieAndCartage > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: "10px",
                        paddingBottom: "3px",
                        justifyContent: "space-between",
                      }}>
                      <Text
                        style={{
                          fontSize: "6px",
                          fontWeight: "bold",
                          marginBottom: "6px",
                        }}>
                        Coolie and Cartage
                      </Text>{" "}
                      <Text
                        style={{
                          fontSize: "6px",
                          fontWeight: "bold",
                          marginBottom: "6px",
                        }}>
                        {invoiceData?.coolieAndCartage.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  {invoiceData?.discountDetails?.length > 0 && (
                    <>
                      {invoiceData?.discountDetails[0].title && (
                        <>
                          {invoiceData?.discountDetails?.map((ele, i) => (
                            <View
                              key={i}
                              style={{
                                flexDirection: "row",
                                gap: "10px",
                                paddingBottom: "3px",
                                justifyContent: "space-between",
                              }}>
                              <Text
                                style={{
                                  fontSize: "6px",
                                  fontWeight: "bold",

                                  marginBottom: "6px",
                                }}>
                                {ele?.title && (
                                  <>
                                    {ele?.title}({ele?.percentage}%)
                                  </>
                                )}
                              </Text>{" "}
                              <Text
                                style={{
                                  fontSize: "6px",
                                  fontWeight: "bold",

                                  marginBottom: "6px",
                                }}>
                                {ele?.title && <>- {ele?.discountedValue}</>}
                              </Text>
                            </View>
                          ))}
                        </>
                      )}
                    </>
                  )}
                  {invoiceData?.chargesDetails > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: "10px",
                        paddingBottom: "3px",
                        justifyContent: "space-between",
                      }}>
                      <Text
                        style={{
                          fontSize: "6px",
                          fontWeight: "bold",
                          marginBottom: "6px",
                        }}>
                        Charges
                      </Text>{" "}
                      <Text
                        style={{
                          fontSize: "6px",
                          fontWeight: "bold",
                        }}>
                        {invoiceData?.chargesDetails && (
                          <>{(invoiceData?.chargesDetails).toFixed(2)}</>
                        )}
                      </Text>
                    </View>
                  )}
                  {invoiceData?.igstTaxType == 1 ? (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          IGST
                        </Text>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          {invoiceData?.igstTotal}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          CGST
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          {invoiceData?.cgstTotal}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          SGST
                        </Text>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "bold",
                          }}>
                          {invoiceData?.sgstTotal}
                        </Text>
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: "10px",
                      borderBottom: "1px solid black",
                      paddingBottom: "3px",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      RoundOff
                    </Text>{" "}
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      {invoiceData?.roundOff && invoiceData?.roundOff}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: "10px",
                      paddingBottom: "3px",
                      marginTop: "2px",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      Grand Total
                    </Text>{" "}
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                      }}>
                      {/* {/ {grandTotal} /} */}
                      {invoiceData?.grandTotal}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                height: "150",
                borderLeft: "1px solid black",
              }}>
              <View style={{ width: "70%", borderRight: "1px solid black" }}>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",

                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      hsn/sac
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      taxable value
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      tax rate
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      cgst
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      sgst
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      igst
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      total
                    </Text>
                  </View>
                </View>
                {invoiceData?.gstDetails?.length > 0 &&
                  invoiceData?.gstDetails?.map((ele, i) => {
                    debugger;
                    return (
                      <>
                        <View style={{ flexDirection: "row", height: "15px" }}>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "25%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {ele?.hsn}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "18%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {(ele?.taxable).toFixed(2)}
                            </Text>
                          </View>
                          {ele?.igstTax?.length && (
                            <>
                              {ele?.igstTax?.map((val, index) => {
                                return (
                                  <>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "12%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.rate} %
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {ele?.centralTax?.length && (
                            <>
                              {ele?.centralTax?.map((val, index) => {
                                return (
                                  <>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "12%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.rate * 2} %
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                  </>
                                );
                              })}
                            </>
                          )}
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "17%",
                              borderBottom: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {" "}
                              {ele?.withDiscountAmount?.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </>
                    );
                  })}
                {invoiceData?.gstOtherCharges?.length > 0 &&
                  invoiceData?.gstOtherCharges?.map((ele, i) => {
                    return (
                      <>
                        <View style={{ flexDirection: "row", height: "15px" }}>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "25%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              charges
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "18%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {(ele?.taxable).toFixed(2)}
                            </Text>
                          </View>
                          {ele?.igstTax?.length && (
                            <>
                              {ele?.igstTax?.map((val, index) => {
                                return (
                                  <>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "12%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.rate} %
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {ele?.centralTax?.length && (
                            <>
                              {ele?.centralTax?.map((val, index) => {
                                return (
                                  <>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "12%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.rate * 2} %
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}>
                                        {val?.amount?.toFixed(2)}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        paddingTop: "1px",
                                        width: "10%",
                                        borderBottom: "1px solid black",
                                        borderRight: "1px solid black",
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: "6px",
                                          paddingTop: "2",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                        }}></Text>
                                    </View>
                                  </>
                                );
                              })}
                            </>
                          )}
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "17%",
                              borderBottom: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {" "}
                              {ele?.withDiscountAmount?.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </>
                    );
                  })}
                {invoiceData?.coolieAndCartage > 0 && (
                  <>
                    <View style={{ flexDirection: "row", height: "15px" }}>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "25%",
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          Coolie and Cartage
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "18%",
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {invoiceData?.coolieAndCartage}
                        </Text>
                      </View>
                      {invoiceData && invoiceData?.igstTaxType == 1 ? (
                        <>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "12%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {invoiceData?.maxGstPercentage} %
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}></Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}></Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {(
                                (invoiceData?.coolieAndCartage *
                                  invoiceData?.maxGstPercentage) /
                                100
                              ).toFixed(2)}
                            </Text>
                          </View>
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "12%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {invoiceData?.maxGstPercentage} %
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {" "}
                              {(
                                (invoiceData?.coolieAndCartage *
                                  invoiceData?.maxGstPercentage *
                                  0.5) /
                                100
                              ).toFixed(2)}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}>
                              {" "}
                              {(
                                (invoiceData?.coolieAndCartage *
                                  invoiceData?.maxGstPercentage *
                                  0.5) /
                                100
                              ).toFixed(2)}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingTop: "1px",
                              width: "10%",
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}>
                            <Text
                              style={{
                                fontSize: "6px",
                                paddingTop: "2",
                                fontWeight: "bold",
                                color: "black",
                                textAlign: "center",
                                textTransform: "uppercase",
                              }}></Text>
                          </View>
                        </>
                      )}

                      <View
                        style={{
                          paddingTop: "1px",
                          width: "17%",
                          borderBottom: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {(
                            (invoiceData?.coolieAndCartage *
                              (100 + invoiceData?.maxGstPercentage)) /
                            100
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    height: "15px",
                    borderBottom: "1px solid black",
                  }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      total
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      {invoiceData?.amount && (
                        <>
                          {!!invoiceData?.chargesDetails &&
                          invoiceData?.chargesDetails > 0 ? (
                            <>
                              {(
                                invoiceData?.amount +
                                invoiceData?.chargesDetails
                              ).toFixed(2)}
                            </>
                          ) : (
                            <>
                              {!!invoiceData?.coolieAndCartage &&
                              invoiceData?.coolieAndCartage > 0 ? (
                                <>
                                  {(
                                    invoiceData?.amount +
                                    invoiceData?.coolieAndCartage
                                  ).toFixed(2)}
                                </>
                              ) : (
                                <>{(invoiceData?.amount).toFixed(2)}</>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Text>
                  </View>
                  {invoiceData && invoiceData?.igstTaxType == 1 ? (
                    <>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "12%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}></Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}></Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}></Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {invoiceData?.igstTotal}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "12%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}></Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {" "}
                          {invoiceData?.cgstTotal}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}>
                          {" "}
                          {invoiceData?.sgstTotal}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingTop: "1px",
                          width: "10%",
                          // borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                        }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            paddingTop: "2",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}></Text>
                      </View>
                    </>
                  )}
                  <View style={{ paddingTop: "1px", width: "17%" }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      {invoiceData?.grandTotal}
                    </Text>
                  </View>
                  {/* <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View style={{ paddingTop: "1px", width: "17%" }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View> */}
                </View>
              </View>
              <View
                style={{
                  width: "30%",
                  borderRight: "1px solid black",
                  padding: "3px",
                }}>
                <View style={{ flexDirection: "", height: "20px" }}>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    For
                  </Text>
                </View>
                <View style={{ flexDirection: "", height: "110px" }}>
                  <Text
                    style={{
                      fontSize: "7px",

                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    {BilData?.CompanyDetails?.name &&
                      BilData?.CompanyDetails?.name}
                  </Text>
                </View>
                <View>
                  <Image
                    style={{ width: "100%", padding: "2px 2px" }}
                    src={`${Image_URL}/Images/${BilData?.CompanyDetails?.signature}`}></Image>
                </View>
                <View style={{ flexDirection: "", height: "20px" }}>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      textAlign: "right",
                      textTransform: "uppercase",
                    }}>
                    authorized signatoroy
                  </Text>
                </View>
              </View>
            </View>

            <View></View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default PurchaseLatestInvoice;
