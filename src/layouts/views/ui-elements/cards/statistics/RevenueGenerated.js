import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CreditCard } from "react-feather";
import { revenueGeneratedSeries, revenueGenerated } from "./StatisticsData";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import {
  view_dashboard_target,
} from "../../../../../ApiEndPoint/Api";
class RevenueGenerated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: {},
      values: {},
      modal: false,
    };
  }
  async componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.database) {
      await _Get(view_dashboard_target, userData?.database)
        .then((res) => {
          this.setState({ rowData: res?.Target });
          console.log(res?.Target)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    return (
      <StatisticsCard
        // icon={<CreditCard className="success" size={22} />}
        // iconBg="success"
        // stat="97.5k"
        statTitle="Target"
        statTitle1={`Current Month Target : ${
          this.state.rowData?.currentMonthTarget
            ? this.state.rowData?.currentMonthTarget?.toFixed(2)
            : 0
        }`}
        statTitle2={`Current Month Acheive : ${
          this.state.rowData?.currentMonthAchieve
            ? this.state.rowData?.currentMonthAchieve?.toFixed(2)
            : 0
        }`}
        statTitle3={`Target Pending : ${
          this.state.rowData?.targerPending
            ? this.state.rowData?.targerPending?.toFixed(2)
            : 0
        }`}
        statTitle4={`Average Target : ${
          this.state.rowData?.averageTarget
            ? this.state.rowData?.averageTarget?.toFixed(2)
            : 0
        }`}
        statTitle5={`Average Achivement : ${
          this.state.rowData?.averageAchievement
            ? this.state.rowData?.averageAchievement?.toFixed(2)
            : 0
        }`}
        statTitle6={`Average Pending : ${
          this.state.rowData?.averagePending
            ? this.state.rowData?.averagePending?.toFixed(2)
            : 0
        }`}
        options={revenueGenerated}
        // series={revenueGeneratedSeries}
        // type="area"
      />
    );
  }
}
export default RevenueGenerated;