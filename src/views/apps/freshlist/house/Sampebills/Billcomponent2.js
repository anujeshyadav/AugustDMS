import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Rect,
} from "@react-pdf/renderer";

import logo from "../../../../../assets/img/logo/logowithoutback.png";
import signature from "../../../../../assets/img/logo/signature.png";
 
import { Image_URL } from "../../../../../ApiEndPoint/Api";
// import GstCalculation from ".././GstCalculation";
// import InvoiceCharges from ".././InvoiceCharges";
// import PartyData from ".././PartyDataUi";
// import TransporterDetails from ".././TransporterDetails";
// import SalesProductList from ".././SalesProductList";
// import TermsConditionWords from ".././TermsConditionWords";
import cancelimage from "../../../../../assets/img/cancelledOrder.jpg";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    backgroundColor: "#e2f9ff4a",
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

const Billcomponent2 = ({ invoiceData, BilData }) => {
  // console.log(BilData);
  const curentDate = new Date();
  console.log(curentDate.toTimeString().split(" ")[0]);
  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  // fixed;
  return (
    <>
      <Document>
         
      <View>
     
      <Image src={logo}  style={{ width: "230px", padding: "25px 10px" }}>
      
      </Image>
      </View>

        
      </Document>
    </>
  );
};

export default Billcomponent2;
