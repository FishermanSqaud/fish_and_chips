import React from "react";
import { observer, inject } from "mobx-react";
import Overview from './Overview'
import OverviewGraph from './OverviewGraph'
import OverviewTables from './OverviewTables'

const Dashboard = inject("store")(
  observer((props) => {
    
    return (
      <div>
        <Overview></Overview>

        <OverviewGraph></OverviewGraph>

        <OverviewTables></OverviewTables>
      </div>
    );
  }))

export default Dashboard


