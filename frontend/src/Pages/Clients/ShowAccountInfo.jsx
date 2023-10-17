import { useState, useEffect } from "react";
import { Typography, Table } from "antd";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
const { Title } = Typography;
const ShowAccountInfo = () => {
  useEffect(() => {
    getAssignedEmplyee();
  }, []);

  const [tableData, setTableData] = useState([]);
  const getAssignedEmplyee = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAssignedEmp")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            client_name: x.client_name,
            client_userId: x.client_userId,
            client_password: x.client_password,
            emp_name: x.emp_name,
            assignment_date: new Date(x.assignment_date).toLocaleDateString(),
            emp_code: x.emp_code,
            job_title: x.job_title,
            emp_status: "permanent",
          });
        });
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
    },

    {
      title: "Client ID",
      dataIndex: "client_userId",
      key: "client_userId",
    },
    {
      title: "Client Password",
      dataIndex: "client_password",
      key: "client_password",
    },
    {
      title: "Employee Name",
      dataIndex: "emp_name",
      key: "emp_name",
    },

    {
      title: "Employee Code",
      dataIndex: "emp_code",
      key: "emp_code",
    },

    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignment_date",
      key: "assignment_date",
    },

    {
      title: "Status",
      dataIndex: "emp_status",
      key: "emp_status",
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="AccountInfo_color">
          Account Info
        </Title>
        {/* <button className="Expensecolorbtn">
          Filter
          <i className="fa fa-filter" id="filtericon" aria-hidden="true"></i>
        </button> */}
      </div>
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowAccountInfo;
