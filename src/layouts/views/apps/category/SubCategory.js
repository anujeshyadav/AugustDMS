import React from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
} from "reactstrap";
import axiosConfig from "../../../axiosConfig";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { Edit, Trash2, ChevronDown } from "react-feather";
//import classnames from "classnames";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";

class SubCategory extends React.Component {
  state = {
    rowData: [],
    paginationPageSize: 20,
    currenPageSize: "",
    getPageSize: "",
    defaultColDef: {
      sortable: true,
      // editable: true,
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
        // checkboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        // headerCheckboxSelection: true,
      },
      {
        headerName: "Sub Category",
        field: "name",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <span>{params.data.name}</span>
            </div>
          );
        },
      },
      {
        headerName: " Image",
        field: "product_img",
        filter: true,
        width: 180,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <img
                className="rounded-circle mr-50"
                src={params.data.productcategory.product_img}
                alt="user avatar"
                height="40"
                width="40"
              />
            </div>
          );
        },
      },
      {
        headerName: " SubCategory",
        field: "desc",
        filter: true,
        width: 180,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <div className="ml-2">
                <span>{params.data.productcategory.desc}</span>
              </div>
            </div>
          );
        },
      },
      // {
      //   headerName: "Description",
      //   field: "desc",
      //   filter: true,
      //   width: 200,
      //   cellRendererFramework: (params) => {
      //     return (
      //       <div className="d-flex align-items-center cursor-pointer">
      //         <span>{params.data.desc}</span>
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: "Status",
        field: "status",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return params.value === "Active" ? (
            <div className="badge badge-pill badge-success">
              {params.data.status}
            </div>
          ) : params.value === "Inactive" ? (
            <div className="badge badge-pill badge-danger">
              {params.data.status}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Actions",
        field: "transactions",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Eye
                className="mr-50"
                size={20}
                onClick={() =>
                  history.push(
                    `/app/category/subcategory/viewSubcategory/${params.data._id}`
                  )
                }
              />
              <Edit
                className="mr-50"
                size={20}
                onClick={() =>
                  history.push("/app/category/subcategory/editSubcategory")
                }
              />
              <Trash2
                size={20}
                onClick={() => {
                  let selectedData = this.gridApi.getSelectedRows();
                  this.runthisfunction(params.data._id);
                  this.gridApi.updateRowData({ remove: selectedData });
                }}
              />
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
    await axiosConfig.get("/getproductsubcategory").then((response) => {
      let rowData = response.data.data;
      console.log(rowData);
      this.setState({ rowData });
    });
  }

  async runthisfunction(id) {
    console.log(id);
    await axiosConfig
      .get(`/deleteproductsubcategory/${id}`)
      .then((response) => {
        console.log(response);
      });
  }

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
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12">
          <Card>
            <Row className="m-2">
              <Col>
                <h1 col-sm-6 className="float-left">
                  Sub Category List
                </h1>
              </Col>
              <Col>
                <Button
                  className=" btn btn-danger float-right"
                  onClick={() => history.push("/app/category/addSubCategory")}>
                  Add Sub-Category
                </Button>
              </Col>
            </Row>
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
                            this.state.currenPageSize * this.state.getPageSize >
                          0
                            ? this.state.currenPageSize * this.state.getPageSize
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
                    <div className="d-flex flex-wrap justify-content-between mb-1">
                      <div className="table-input mr-1">
                        <Input
                          placeholder="search..."
                          onChange={(e) =>
                            this.updateSearchQuery(e.target.value)
                          }
                          value={this.state.value}
                        />
                      </div>
                      <div className="export-btn">
                        <Button.Ripple
                          color="primary"
                          onClick={() => this.gridApi.exportDataAsCsv()}>
                          Export as CSV
                        </Button.Ripple>
                      </div>
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
    );
  }
}
export default SubCategory;
