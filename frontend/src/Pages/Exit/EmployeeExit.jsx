import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Table, Modal, Typography, Form, Input, Select } from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
const { Title } = Typography;
const { confirm } = Modal;
const EmployeeExit = () => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    getEmployeeExit();
  }, []);
  const getEmployeeExit = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/GetEmployeeExit")
      .then((result) => {
        let data = result.data;
        console.log(data);
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            emp_name: x.emp_name,
            emp_code: x.emp_code,
            joining_date: new Date(x.joining_date).toLocaleDateString(),
            designation: x.designation,
            experience: x.experience,
            salary: x.salary,
            personal_email: x.personal_email,
            office_email: x.office_email,
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    confirm({
      title: "Delete the Issued Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Issue Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(id);
      },
    });
  };

  const deleteItem = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete_employeeexit/${id}`)
      .then((response) => {
        console.log(response.data);
        setTableData((prevData) => prevData.filter((item) => item.key !== id));
        getEmployeeExit();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "emp_name",
      key: "emp_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Employee Code",
      dataIndex: "emp_code",
      key: "emp_code",
    },
    {
      title: "Job Title",
      dataIndex: "designation",
      key: "designation",
    },

    {
      title: "Date of Joining",
      dataIndex: "joining_date",
      key: "joining_date",
    },

    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
    },
    // {
    //   title: "Personal Email",
    //   dataIndex: "personal_email",
    //   key: "personal_email",
    // },
    {
      title: "Office Email",
      dataIndex: "office_email",
      key: "office_email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Link to={`/view-employeeexit/${record.key}`}>
            <a>
              <span>
                <EyeOutlined style={{ cursor: "pointer" }} />
              </span>
            </a>
          </Link>
          <Link to={`/edit-employeeexit/${record.key}`}>
            <a>
              {" "}
              <span>
                <EditOutlined style={{ cursor: "pointer" }} />
              </span>
            </a>
          </Link>
          <a onClick={() => handleDelete(record.key)}>
            {" "}
            <span>
              <DeleteOutlined style={{ cursor: "pointer" }} />
            </span>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Employee Details
        </Title>
        <Link to={`/add-employeeexit`}>
          <button className="Expensecolorbtn">Create New Exit +</button>
        </Link>

        {/* <button className="filtercolorbtn">
          Filter <i class="fa fa-filter" aria-hidden="true"></i>
        </button> */}
      </div>

      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default EmployeeExit;
