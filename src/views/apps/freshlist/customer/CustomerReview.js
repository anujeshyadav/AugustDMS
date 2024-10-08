import React from "react";
import {
    Card, CardBody, Input, Row, Col, Button, UncontrolledDropdown,
    DropdownMenu, DropdownItem, DropdownToggle,
} from "reactstrap";
// import axiosConfig from "../../../../axiosConfig";
import axios from "axios";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { Eye, Edit, Trash2, ChevronDown } from "react-feather";
import { history } from "../../../../history";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
// import ReviewTable from "./ReviewTable";

class CustomerReview extends React.Component {
    state = {
        rowData: [],
        paginationPageSize: 20,
        currenPageSize: "",
        getPageSize: "",
        defaultColDef: {
            sortable: true,
            editable: true,
            resizable: true,
            suppressMenu: true,
        },
        columnDefs: [
            {
                headerName: "S.No",
                valueGetter: "node.rowIndex + 1",
                field: "node.rowIndex + 1",
                width: 150,
                filter: true,
            },
            {
                headerName: "Product",
                field: "customerId",
                filter: true,
                width: 200,
                cellRendererFramework: (params) => {
                    return (
                        <div>
                            <span>{params.data.customerId}</span>
                        </div>
                    );
                },
            },
            {
                headerName: "Customer",
                field: "email	",
                filter: true,
                width: 190,
                cellRendererFramework: (params) => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <span>{params.data.email}</span>
                        </div>
                    );
                },
            },

            {
                headerName: "Rating",
                field: "lastname",
                filter: true,
                width: 200,
                cellRendererFramework: (params) => {
                    return (
                        <div>
                            <span>{params.data.lastname}</span>
                        </div>
                    );
                },
            },
            {
                headerName: "Date",
                field: "lastname",
                filter: true,
                width: 200,
                cellRendererFramework: (params) => {
                    return (
                        <div>
                            <span>{params.data.lastname}</span>
                        </div>
                    );
                },
            },
            {
                headerName: "Review",
                field: "mobile",
                filter: true,
                width: 200,
                cellRendererFramework: (params) => {
                    return (
                        <div>
                            <span>{params.data.mobile}</span>
                        </div>
                    );
                },
            },
            {
                headerName: "Status",
                field: "status",
                filter: true,
                width: 150,
                cellRendererFramework: (params) => {
                    return params.value === "Block" ? (
                        <div className="badge badge-pill badge-success">
                            {params.data.status}
                        </div>
                    ) : params.value === "Unblock" ? (
                        <div className="badge badge-pill badge-warning">
                            {params.data.status}
                        </div>
                    ) : null;
                },
            },
            // {
            //     headerName: "Actions",
            //     field: "sortorder",
            //     field: "transactions",
            //     width: 100,
            //     cellRendererFramework: (params) => {
            //         return (
            //             <div className="actions cursor-pointer">
            //                 <Eye
            //                     className="mr-50"
            //                     size="25px"
            //                     color="green"
            //                     onClick={() =>
            //                         history.push(`/app/customer/viewCustomer/${params.data._id}`)}
            //                 />
            //                 {/* <Edit
            //     className="mr-50"
            //     size="25px"
            //     color="blue"
            //     onClick={() => history.push("/app/customer/editCustomer")}
            //   /> */}
            //                 <Trash2
            //                     className="mr-50"
            //                     size="25px"
            //                     color="red"
            //                     onClick={() => {
            //                         let selectedData = this.gridApi.getSelectedRows();
            //                         this.runthisfunction(params.data._id);
            //                         this.gridApi.updateRowData({ remove: selectedData });
            //                     }}
            //                 />
            //             </div>
            //         );
            //     },
            // },
        ],
    };
    // async componentDidMount() {
    //     await axios.get(`http://35.154.86.59/api/user/view_onecust/${id}`)
    //         .then((response) => {
    //             let rowData = response.data.data;
    //             console.log(rowData);
    //             this.setState({ rowData });
    //         });
    // }
    // async componentDidMount() {
    //     await axios
    //         .get("http://35.154.86.59/api/user/allcustomer")
    //         .then((response) => {
    //             let rowData = response.data.data;
    //             console.log(rowData);
    //             this.setState({ rowData });
    //         });
    // }
    // // async componentDidMount() {
    // //   let { id } = this.props.match.params;
    // //   await axios
    // //     .get(`/http://35.154.86.59/api/user/allcustomer/${id}`, {
    // //       headers: {
    // //         "auth-adtoken": localStorage.getItem("auth-adtoken"),
    // //       },
    // //     })}
    // async runthisfunction(id) {
    //     console.log(id);
    //     await axios.get(`http://35.154.86.59/api/user/delcustomer/${id}`).then(
    //         (response) => {
    //             console.log(response);
    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );
    // }
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
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
    render() {
        const { rowData, columnDefs, defaultColDef } = this.state;
        return (
          console.log(rowData),
          (
            <Row className="app-user-list">
              <Col sm="12">
                <Col>
                  <h1 sm="12">{/* <ReviewTable /> */}</h1>
                </Col>
              </Col>
              <Col sm="12">
                <Card>
                  <Row className="m-2"></Row>
                  <CardBody>
                    {this.state.rowData === null ? null : (
                      <div className="ag-theme-material w-100 my-2 ag-grid-table">
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                          <div className="mb-1">
                            <UncontrolledDropdown className="p-1 ag-dropdown">
                              <DropdownToggle tag="div">
                                {this.gridApi
                                  ? this.state.currenPageSize
                                  : "" * this.state.getPageSize -
                                    (this.state.getPageSize - 1)}{" "}
                                -{" "}
                                {this.state.rowData.length -
                                  this.state.currenPageSize *
                                    this.state.getPageSize >
                                0
                                  ? this.state.currenPageSize *
                                    this.state.getPageSize
                                  : this.state.rowData.length}{" "}
                                of {this.state.rowData.length}
                                <ChevronDown className="ml-50" size={15} />
                              </DropdownToggle>
                              <DropdownMenu right>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(20)}>
                                  20
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(50)}>
                                  50
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(100)}>
                                  100
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(134)}>
                                  134
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </div>
                        </div>
                        <ContextLayout.Consumer>
                          {(context) => (
                            <AgGridReact
                              gridOptions={{}}
                              rowSelection="multiple"
                              defaultColDef={defaultColDef}
                              columnDefs={columnDefs}
                              rowData={rowData}
                              onGridReady={this.onGridReady}
                              colResizeDefault={"shift"}
                              animateRows={true}
                              floatingFilter={false}
                              // pagination={true}
                              paginationPageSize={this.state.paginationPageSize}
                              pivotPanelShow="always"
                              enableRtl={context.state.direction === "rtl"}
                            />
                          )}
                        </ContextLayout.Consumer>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )
        );
    }
}
export default CustomerReview;