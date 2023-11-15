import React, { useEffect, useState } from "react";
import { Row, Col, Card, Progress, Tooltip, Avatar } from "antd";
import axios from "axios";
const myStyle = {
  cardTxtContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
};

const CardComp = ({
  title,
  totalNo,
  onetxt,
  twotxt,
  threetxt,
  sno1,
  sno2,
  sno3,
  sno4,
  sno5,
  sno6,
}) => {
  return (
    <Card className="dashboardCard">
      <div style={myStyle.cardTxtContainer}>
        <span className="dashboardCardTxt">{title}</span>
        <span>{totalNo}</span>
      </div>
      <div style={{ margin: "15px 0" }}>
        <Progress
          showInfo={false}
          percent={100}
          success={{
            percent: 60,
          }}
        />
        <div id="min-max">
          <span className="min">0%</span>
          <span className="max">100%</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#52c41a",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          {onetxt}
        </div>
        <div>
          {sno1} {sno2}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{
              backgroundColor: "#1677ff",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          {twotxt}
        </div>
        <div>
          {sno3} {sno4}
        </div>
      </div>
      {threetxt != "" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <Avatar
              style={{
                backgroundColor: "#1FBCDE",
                verticalAlign: "middle",
                width: "12px",
                height: "12px",
                marginRight: "5px",
              }}
              size="small"
            />
            {threetxt}
          </div>
          <div>
            {sno5} {sno6}
          </div>
        </div>
      ) : (
        ""
      )}
    </Card>
  );
};

export const Dashboard = () => {
  useEffect(() => {
    getJobPositions();
    getAllEmployee();
    totalItemQuantity();
    getAssignedItemWithPercentage();
    totalClientwithPercentage();
  }, []);
  const [EmployeeCount, setEmployeeCount] = useState("2");
  const [InterEmployee, setInterEmployee] = useState("1");
  const [PermanentEmployee, setPermanentEmployee] = useState("1");
  const [PermanentEmpPer, setPermanentEmpPer] = useState("0%");
  const [InterEmpPer, setInterEmpPer] = useState("0%");
  const [JobPositions, setJobPositions] = useState("0");
  const [hiredCandidate, sethiredCandidate] = useState("0");
  const [hiredCandidatePer, sethiredCandidatePer] = useState("0%");
  const [jobOpeningPer, setjobOpeningPer] = useState("0%");
  const [TotalItem, setTotalItem] = useState("0");
  const [AssignedItem, setAssignedItem] = useState("0");
  const [AssignedItemPer, setAssignedItemPer] = useState("0%");
  const [TotalAvailableItem, setTotalAvailableItem] = useState("0");
  const [totalAvailableItemPer, settotalAvailableItemPer] = useState("0%");
  const [TotalLossDamageItem, setTotalLossDamageItem] = useState("0");
  const [totalLossDamageItemPer, settotalLossDamageItemPer] = useState("0%");
  const [totalClient, setTotalClient] = useState("0");
  const [newClient, setNewClient] = useState("0");
  const [oldClient, setOldClient] = useState("0");
  const [newClientPer, setNewClientPer] = useState("0%");
  const [oldClientPer, setOldClientPer] = useState("0");
  const [totalClientPer, setTotalClientPer] = useState("0%");

  const getAllEmployee = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAllEmployeedata")
      .then((result) => {
        let data = result.data;
        setPermanentEmployee(data.permanent);
        setEmployeeCount(data.totalEmployeeCount);
        setPermanentEmpPer(data.PermanentEmpPer + "%");
        setInterEmployee(data.intern);
        setInterEmpPer(data.InterEmpPer + "%");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getJobPositions = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getJobPositions")
      .then((result) => {
        let data = result.data;
        setJobPositions(data.jobPositionCount);
        sethiredCandidate(data.hiredEmployee);
        sethiredCandidatePer(data.hiredCandidatePer + "%");
        setjobOpeningPer(data.jobOpeningper + "%");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const totalItemQuantity = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/totalItemQuantity")
      .then((result) => {
        let data = result.data;
        setTotalItem(data.totalQuantity);
        setTotalAvailableItem(data.totalAvailableQuantity);
        settotalAvailableItemPer(data.totalAvailableItemPer + "%");
        setTotalLossDamageItem(data.TotalLossAndDamageQuantity);
        settotalLossDamageItemPer(data.totalLossDamageItemPer + "%");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignedItemWithPercentage = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAssignedItemWithPercentage")
      .then((result) => {
        let data = result.data;
        setAssignedItem(data.totalAssignedQuantity);
        setAssignedItemPer(data.assignedPercentage + "%");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const totalClientwithPercentage = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/totalClientwithPercentage")
      .then((result) => {
        let data = result.data;

        setTotalClient(data.newClient + data.oldClient);
        setNewClient(data.newClient);
        setOldClient(data.oldClient);
        setNewClientPer(data.newClientPer + "%");
        setOldClientPer(data.oldClientPer + "%");
        setTotalClientPer(data.totalClientPer + "%");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Row>
        <Col span={12} style={{ padding: "20px" }}>
          <CardComp
            title="Total No of employees"
            totalNo={EmployeeCount}
            onetxt="Permanent"
            twotxt="Intern"
            threetxt=""
            sno1={PermanentEmployee}
            sno2={PermanentEmpPer}
            sno3={InterEmployee}
            sno4={InterEmpPer}
          />
        </Col>
        <Col span={12} style={{ padding: "20px" }}>
          <CardComp
            title="Job positions this month"
            totalNo={JobPositions}
            onetxt="Hired"
            twotxt="Opening"
            threetxt=""
            sno1={hiredCandidate}
            sno2={hiredCandidatePer}
            sno3={JobPositions}
            sno4={jobOpeningPer}
          />
        </Col>

        <Col span={12} style={{ padding: "20px" }}>
          <CardComp
            title="Total items in inventory"
            totalNo={TotalItem}
            onetxt="Assigned"
            twotxt="Available"
            threetxt="Loss/Damage"
            sno1={AssignedItem}
            sno2={AssignedItemPer}
            sno3={TotalAvailableItem}
            sno4={totalAvailableItemPer}
            sno5={TotalLossDamageItem}
            sno6={totalLossDamageItemPer}
          />
        </Col>

        <Col span={12} style={{ padding: "20px" }}>
          <CardComp
            title="Client Accounts"
            totalNo={totalClient}
            onetxt="New Client"
            twotxt="Old Clients"
            threetxt="Total Clients"
            sno1={newClient}
            sno2={newClientPer}
            sno3={oldClient}
            sno4={oldClientPer}
            sno5={totalClient}
            sno6={totalClientPer}
          />
        </Col>
      </Row>
    </div>
  );
};
