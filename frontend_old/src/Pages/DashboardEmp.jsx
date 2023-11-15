import { Col, Row } from "antd";
import React from "react";
import EmployeeProfile from "./EmpComponents/EmployeeProfile";
import { Tabs } from "antd";
import Feedback_Issues from "./EmpComponents/Feedback_Issues";
import RequestInventory from "./EmpComponents/RequestInventory";
import EmpKpi from "./EmpComponents/EmpKpi";
import { Link } from "react-router-dom";
// import ShowAllAssignedHostingEmp from "./EmpComponents/ShowAllAssignedHostingEmp";
// import ShowAllAssignedSocialMediaEmp from "./EmpComponents/ShowAllAssignedSocialMediaEmp";

const DashboardEmp = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Feedback/Issues",
      children: <Feedback_Issues />,
    },
    {
      key: "2",
      label: "Request inventory",
      children: <RequestInventory />,
    },

    {
      key: "3",
      label: "KPI",
      children: <EmpKpi />,
    },
    // {
    //   key: "4",
    //   label: "Assigned Hosting",
    //   children: <ShowAllAssignedHostingEmp />,
    // },
    // {
    //   key: "5",
    //   label: "Assigned Social Media",
    //   children: <ShowAllAssignedSocialMediaEmp />,
    // },
  ];
  return (
    <div>
      <Row>
        <Col span={24}>
          <EmployeeProfile />
        </Col>
        <Col span={24}>
          <div style={{ padding: "2rem 0" }}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardEmp;
