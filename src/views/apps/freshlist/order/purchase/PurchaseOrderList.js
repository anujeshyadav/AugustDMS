import React from "react";
import { Route } from "react-router-dom";
import { ImDownload } from "react-icons/im";
import {
  Card,
  CardBody,
  Input,
  Row,
  Modal,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  ModalHeader,
  ModalBody,
  Badge,
  Table,
  Label,
  Spinner,
} from "reactstrap";

import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "jspdf-autotable";

import { Eye, ChevronDown, Edit, Trash2 } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  PurchaseOrderList,
  _Delete,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "../../house/Downloader";
import classNames from "classnames";
import {
  Completed_Order_Delete,
  Delete_Purchase_Item,
  Place_Order_Delete,
} from "../../../../../ApiEndPoint/Api";

const SelectedColums = [];

class PurchaseOrderViewList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      MasterShow: false,
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      defaultColDef: {
        sortable: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        suppressMenu: true,
      },
      columnDefs: [
        {
          headerName: "UID",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 55,

          filter: true,
        },

        {
          headerName: "Actions",
          field: "transactions",
          width: 75,
          height: 35,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions.Edit && (
                    <CornerDownLeft
                      className="mr-50"
                      size="25px"
                      color="green"
                      onClick={() => {
                        localStorage.setItem(
                          "OrderList",
                          JSON.stringify(params.data)
                        );
                        this.props.history.push({
                          pathname: `/app/AJGroup/order/purchaseReturn/${params.data?._id}`,
                          state: params.data,
                        });
                      }}
                    />
                  )} */}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions.View && (
                    <Eye
                      className="mr-50"
                      size="20px"
                      color="green"
                      onClick={() => {
                        this.togglemodal();
                        this.handleChangeView(params.data, "readonly");
                      }}
                    />
                  )}
                {params.data?.status ? (
                  <>
                    {this.state.InsiderPermissions &&
                      this.state.InsiderPermissions.Delete && (
                        <Trash2
                          className="mr-50"
                          size="20px"
                          color="red"
                          onClick={() => {
                            this.runthisfunction(
                              params?.data?._id,
                              params.data?.status
                            );
                          }}
                        />
                      )}
                  </>
                ) : (
                  <span className="mr-3"></span>
                )}

                {/* {params.data?.status == "pending" ? (
                  <>
                    {this.state.InsiderPermissions &&
                      this.state.InsiderPermissions.Edit && (
                        <Edit
                          className="mr-50"
                          size="25px"
                          color="blue"
                          onClick={() =>
                            this.props.history.push({
                              pathname: `/app/AJgroup/order/editPurchase/${params.data?._id}`,
                              state: params.data,
                            })
                          }
                        />
                      )}
                  </>
                ) : null} */}
              </div>
            );
          },
        },

        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 110,
          cellRendererFramework: (params) => {
            // console.log(params.data);
            return params.value == "comleted" ? (
              <div className=" text-center">{params.data.status}</div>
            ) : params.value == "pending" ? (
              <div className="text-center">{params.data.status}</div>
            ) : (
              <div className=" text-center">{params.data.status}</div>
            );
          },
        },
        // {
        //   headerName: "Purchase Date",
        //   field: "DateofDelivery",
        //   filter: true,
        //   width: 200,
        //   cellRendererFramework: (params) => {
        //     console.log(params?.data);
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params.data?.DateofDelivery}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Supplier Name",
          field: "partyId.ownerName",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center">
                <div>
                  <span>{params.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Pan No",
          field: "partyId.comPanNo",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>
                  <span>{params.data?.partyId?.comPanNo}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Email",
          field: "partyId.email",
          filter: true,
          editable: true,
          width: 330,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>
                  <span>{params.data?.partyId?.email}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "IGST ",
          field: "igstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.igstTotal && params.data?.igstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "SGST ",
          field: "sgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.sgstTotal && params.data?.sgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "CGST ",
          field: "cgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.cgstTotal && params.data?.cgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "Amount",
          field: "amount",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div className="text-center">
                  {(params.data?.amount).toFixed(2)}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "roundOff",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.roundOff}</div>
              </div>
            );
          },
        },
        {
          headerName: "Charges",
          field: "coolieAndCartage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.coolieAndCartage}</div>
              </div>
            );
          },
        },
        {
          headerName: "Grand Total",
          field: "grandTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.grandTotal}</div>
              </div>
            );
          },
        },
      ],
    };
  }
  togglemodal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChangeView = (data, types) => {
    let type = types;
    if (type == "readonly") {
      this.setState({ ViewOneUserView: true });
      this.setState({ ViewOneData: data });
    } else {
      this.setState({ EditOneUserView: true });
      this.setState({ EditOneData: data });
    }
  };
  runthisfunction(id, status) {
    let URL = "";
    if (status?.toLowerCase()?.includes("completed")) {
      URL = Completed_Order_Delete;
    } else {
      URL = Place_Order_Delete;
    }
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          _Delete(URL, id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }
  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await PurchaseOrderList(id, db)
      .then((res) => {
        this.setState({ Loading: false });

        if (res?.orderHistory) {
          let newList = res?.orderHistory?.filter((lst) => {
            return lst.status !== "Deactive";
          });
          if (newList?.length) {
            this.setState({ rowData: newList?.reverse() });
          } 
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("PurchaseOrderList"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false });
        this.setState({ rowData: [] });

        console.log(err);
      });
  }

  async componentDidMount() {
    const InsidePermissions = CheckPermission("Purchase Order");
    this.setState({ InsiderPermissions: InsidePermissions });

    let userId = JSON.parse(localStorage.getItem("userData"));
    if (userId?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(userId?._id, userId?.database);
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridRef.current = params.api;

    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages(),
    });
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        currenPageSize: val,
        getPageSize: val,
      });
    }
  };
  handleChangeHeader = (e, value, index) => {
    let check = e.target.checked;
    if (check) {
      SelectedColums?.push(value);
    } else {
      const delindex = SelectedColums?.findIndex(
        (ele) => ele?.headerName === value?.headerName
      );

      SelectedColums?.splice(delindex, 1);
    }
  };

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "PurchaseOrderList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "PurchaseOrderList");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "PurchaseOrderList");
  };

  shiftElementUp = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex > 0) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex - 1 });
      myArrayCopy.splice(currentIndex - 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };

  shiftElementDown = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex < this.state.SelectedcolumnDefs.length - 1) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex + 1 });
      myArrayCopy.splice(currentIndex + 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };
  convertCsvToXml = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCsvToXml(CsvData, "PurchaseOrderList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();

    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "PurchaseOrderList",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };

  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs.map((item) => JSON.stringify(item)),
        ...SelectedColums.map((item) => JSON.stringify(item)),
      ]),
    ].map((item) => JSON.parse(item));
    this.setState({
      SelectedcolumnDefs: [...new Set(updatedSelectedColumnDefs)], // Update the state with the combined array
    });
  };
  handleLeftShift = () => {
    let SelectedCols = this.state.SelectedcolumnDefs?.slice();
    let delindex = this.state.Arrindex; /* Your delete index here */

    if (SelectedCols && delindex >= 0) {
      const splicedElement = SelectedCols?.splice(delindex, 1); // Remove the element

      this.setState({
        SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
      });
    }
  };
  handleParentSubmit = (e) => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    this.Apicalling(id, db);
  };
  handleDropdownChange = (selectedValue) => {
    localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
  };
  render() {
    if (this.state.Loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20rem",
          }}>
          <Spinner
            style={{
              height: "4rem",
              width: "4rem",
            }}
            color="primary">
            Loading...
          </Spinner>
        </div>
      );
    }
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      InsiderPermissions,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <>
          <Card>
            <Row style={{marginLeft:'3px',marginRight:'3px'}}>
              <Col  >
                <h1 className="float-left" style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px',marginTop:'25px' }}>
                  Purchased List
                </h1>
              </Col>
              {this.state.MasterShow ? (
                <Col lg="3" md="4" sm="12"  style={{ marginTop:'25px' }}>
                  <SuperAdminUI
                    onDropdownChange={this.handleDropdownChange}
                    onSubmit={this.handleParentSubmit}
                  />
                </Col>
              ) : (
                <Col></Col>
              )}
              <Col
                lg="3"
                md="6"
                sm="12"
                 
                style={{ marginTop:'25px' }}>
                <div className="">
                  
                  <div
                    className="table-input cssforproductlist"
                    style={{ height: "20px" }}>
                    <Input
                      style={{ width: "100%" }}
                      placeholder="search Item here..."
                      onChange={(e) => this.updateSearchQuery(e.target.value)}
                      value={this.state.value}
                    />
                  </div>
                </div>
              </Col>
              
              <Col className=""  style={{ marginTop:'25px' }}>
                {InsiderPermissions && InsiderPermissions.View && (
                  <>
                    <span className="">
                      <FaFilter
                        style={{ cursor: "pointer" }}
                        title="filter coloumn"
                        size="35px"
                        onClick={this.LookupviewStart}
                        color="rgb(8, 91, 245)"
                        className="float-right  "
                      />
                    </span>
                  </>
                )}
                {InsiderPermissions && InsiderPermissions.Download && (
                  <span
                    onMouseEnter={this.toggleDropdown}
                    onMouseLeave={this.toggleDropdown}
                    className="">
                    <div className="dropdown-container float-right ">
                      <ImDownload
                        style={{ cursor: "pointer" }}
                        title="download file"
                        size="35px"
                        className="dropdown-button "
                        color="rgb(8, 91, 245)"
                        onClick={this.toggleDropdown}
                      />
                      {isOpen && (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            border: "1px solid rgb(8, 91, 245)",
                            backgroundColor: "white",
                          }}
                          className="dropdown-content dropdownmy mt-2">
                          <h5
                            onClick={() => this.exportToPDF()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive ">
                            .PDF
                          </h5>
                          <h5
                            onClick={() => this.gridApi.exportDataAsCsv()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .CSV
                          </h5>
                          <h5
                            onClick={this.convertCSVtoExcel}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLS
                          </h5>
                          <h5
                            onClick={this.exportToExcel}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLSX
                          </h5>
                          <h5
                            onClick={() => this.convertCsvToXml()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XML
                          </h5>
                        </div>
                      )}
                    </div>
                  </span>
                )}
                {InsiderPermissions && InsiderPermissions.Create && (
                  <span>
                    <Route
                      render={({ history }) => (
                        <Button
                          style={{
                            cursor: "pointer",
                            backgroundColor: "rgb(8, 91, 245)",
                            color: "white",
                            fontWeight: "600",
                            height: "43px",
                          }}
                          className="float-right mr-1 "
                          color="#39cccc"
                          onClick={() =>
                            history.push("/app/AJgroup/order/AddPurchaseOrder")
                          }>
                          <FaPlus size={15} /> Add Purchase Order
                        </Button>
                      )}
                    />
                  </span>
                )}
              </Col>
            </Row>
            {InsiderPermissions && InsiderPermissions.View && (
              <>
                {this.state.rowData === null ? null : (
                  <div className="ag-theme-material w-100   ag-grid-table">
                    <ContextLayout.Consumer className="ag-theme-alpine">
                      {(context) => (
                        <AgGridReact
                          id="myAgGrid"
                          gridOptions={this.gridOptions}
                          rowSelection="multiple"
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
                          colResizeDefault={"shift"}
                          animateRows={true}
                          floatingFilter={false}
                          pagination={true}
                          paginationPageSize={this.state.paginationPageSize}
                          pivotPanelShow="always"
                          enableRtl={context.state.direction === "rtl"}
                          ref={this.gridRef} // Attach the ref to the grid
                          domLayout="autoHeight" // Adjust layout as needed
                        />
                      )}
                    </ContextLayout.Consumer>
                  </div>
                )}
              </>
            )}
          </Card>
        </>

        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>Change Fileds</ModalHeader>
          <ModalBody className="modalbodyhead">
            <Row>
              <Col lg="4" md="4" sm="12" xl="4" xs="12">
                <h4>Available Columns</h4>
                <div className="mainshffling">
                  <div class="ex1">
                    {AllcolumnDefs &&
                      AllcolumnDefs?.map((ele, i) => {
                        return (
                          <>
                            <div
                              onClick={(e) =>
                                this.handleChangeHeader(e, ele, i)
                              }
                              key={i}
                              className="mycustomtag mt-1">
                              <span className="mt-1">
                                <h5
                                  style={{ cursor: "pointer" }}
                                  className="allfields">
                                  <input
                                    type="checkbox"
                                    // checked={check && check}
                                    className="mx-1"
                                  />

                                  {ele?.headerName}
                                </h5>
                              </span>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </Col>
              <Col lg="2" md="2" sm="12" xl="2" xs="12" className="colarrowbtn">
                <div className="mainarrowbtn">
                  <div style={{ cursor: "pointer" }}>
                    <FaArrowAltCircleRight
                      onClick={this.HeadingRightShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                  <div style={{ cursor: "pointer" }} className="my-2">
                    <FaArrowAltCircleLeft
                      onClick={this.handleLeftShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                </div>
              </Col>
              <Col lg="6" md="6" sm="12" xl="6" xs="12">
                <Row>
                  <Col lg="8" md="8" sm="12" xs="12">
                    <h4>Visible Columns</h4>
                    <div className="mainshffling">
                      <div class="ex1">
                        {SelectedcolumnDefs &&
                          SelectedcolumnDefs?.map((ele, i) => {
                            return (
                              <>
                                <div key={i} className="mycustomtag mt-1">
                                  <span className="mt-1">
                                    <h5
                                      onClick={() =>
                                        this.setState({ Arrindex: i })
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: `${
                                          this.state.Arrindex === i
                                            ? "#1877f2"
                                            : ""
                                        }`,
                                      }}
                                      className="allfields">
                                      <IoMdRemoveCircleOutline
                                        onClick={() => {
                                          const SelectedCols =
                                            this.state.SelectedcolumnDefs?.slice();
                                          const delindex =
                                            SelectedCols?.findIndex(
                                              (element) =>
                                                element?.headerName ==
                                                ele?.headerName
                                            );

                                          if (SelectedCols && delindex >= 0) {
                                            const splicedElement =
                                              SelectedCols?.splice(delindex, 1); // Remove the element
                                            // splicedElement contains the removed element, if needed

                                            this.setState({
                                              SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
                                            });
                                          }
                                        }}
                                        style={{ cursor: "pointer" }}
                                        size="25px"
                                        color="red"
                                        className="mr-1"
                                      />

                                      {ele?.headerName}
                                    </h5>
                                  </span>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </Col>
                  <Col lg="4" md="4" sm="12" xs="12">
                    <div className="updownbtn justify-content-center">
                      <div>
                        <BsFillArrowUpSquareFill
                          className="arrowassign mb-1"
                          size="30px"
                          onClick={this.shiftElementUp}
                        />
                      </div>
                      <div>
                        <BsFillArrowDownSquareFill
                          onClick={this.shiftElementDown}
                          className="arrowassign"
                          size="30px"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  {/* <Button onClick={this.HandleSetVisibleField} color="primary">
                    Submit
                  </Button> */}

                  <Badge
                    style={{ cursor: "pointer" }}
                    className=""
                    color="primary"
                    onClick={this.HandleSetVisibleField}>
                    Submit
                  </Badge>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.modalone}
          toggle={this.togglemodal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Bill Download" : "Purchase View"}
          </ModalHeader>
          <ModalBody
            className={`${this.state.ShowBill ? "p-1" : "modalbodyhead"}`}>
            {this.state.ShowBill ? (
              <>
                <StockTrxInvoice ViewOneData={this.state.ViewOneData} />
              </>
            ) : (
              <>
                {this.state.ViewOneUserView ? (
                  <>
                    <Row>
                      <Col>
                        <Label>Party Name:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.partyId?.ownerName}
                        </h5>
                      </Col>
                      <Col>
                        <Label>Amount:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.amount}
                        </h5>
                      </Col>
                      {this.state.ViewOneData?.igstTaxType &&
                      this.state.ViewOneData?.igstTaxType == 1 ? (
                        <>
                          <Col>
                            <Label>IGST:</Label>
                            <h5>
                              <strong>
                                {this.state.ViewOneData &&
                                  this.state.ViewOneData?.igstTotal}
                              </strong>
                              Rs/-
                            </h5>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col>
                            <Label>SGST:</Label>
                            <h5>
                              <strong>
                                {this.state.ViewOneData &&
                                  this.state.ViewOneData?.sgstTotal}
                              </strong>
                              Rs/-
                            </h5>
                          </Col>
                          <Col>
                            <Label>CGST:</Label>
                            <h5>
                              <strong>
                                {this.state.ViewOneData &&
                                  this.state.ViewOneData?.cgstTotal}
                              </strong>
                              Rs/-
                            </h5>
                          </Col>
                        </>
                      )}

                      <Col>
                        <Label>Grand Total :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.ViewOneData?.grandTotal}
                          </strong>
                          Rs/-
                        </h5>
                      </Col>
                    </Row>
                    <Row className="p-2">
                      <Col>
                        <div className="d-flex justify-content-center">
                          <h4>Sales Order List</h4>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Table style={{ cursor: "pointer" }} responsive>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product Name</th>
                              <th>HSN CODE</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              {/* <th>Discount %</th> */}
                              <th>TAXABLE</th>
                              {this.state.ViewOneData?.igstTaxType &&
                              this.state.ViewOneData?.igstTaxType == 1 ? (
                                <>
                                  <th>IGST</th>
                                </>
                              ) : (
                                <>
                                  <th>SGST</th>
                                  <th>CGST</th>
                                </>
                              )}
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.ViewOneData?.orderItems &&
                              this.state.ViewOneData?.orderItems?.map(
                                (ele, i) => (
                                  <>
                                    <tr>
                                      <th scope="row">{i + 1}</th>
                                      <td>{ele?.productId?.Product_Title}</td>
                                      <td>{ele?.productId?.HSN_Code}</td>
                                      <td>{ele?.productId?.Product_MRP}</td>
                                      <td>{ele?.qty}</td>
                                      <td>{ele?.productId?.primaryUnit}</td>
                                      {/* <td>{ele?.discountPercentage}</td> */}

                                      <td>{ele?.taxableAmount}</td>
                                      {this.state.ViewOneData?.igstTaxType &&
                                      this.state.ViewOneData?.igstTaxType ==
                                        1 ? (
                                        <>
                                          <td>{ele?.igstRate}</td>
                                        </>
                                      ) : (
                                        <>
                                          <td>{ele?.sgstRate}</td>
                                          <td>{ele?.cgstRate}</td>
                                        </>
                                      )}
                                      <td>{ele?.grandTotal}</td>
                                    </tr>
                                  </>
                                )
                              )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default PurchaseOrderViewList;
