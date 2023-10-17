import { useState, useEffect } from "react";
import { Typography, Table, Modal } from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { confirm } = Modal;
const { Title } = Typography;
const ShowAllAssignedHosting = () => {
  useEffect(() => {
    GetAllAssignedHosting();
  }, []);
  const [tableData, setTableData] = useState([]);

  const GetAllAssignedHosting = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAllAssignedHosting")
      .then((result) => {
        if (result.data !== "") {
          let data = result.data;
          let newData = data.map((x) => ({
            key: x._id,
            emp_name: x.emp_name,
            emp_code: x.emp_code,
            job_title: x.job_title,
            client_name: x.client_name,
            hosting_name: x.hosting_name,
            hosting_url: x.hosting_url,
            hosting_password: x.hosting_password,
            assigned_date: new Date(x.assigned_date).toLocaleDateString(),
          }));
          setTableData(newData);
        }
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
        deleteIcon(id);
      },
    });
  };
  const deleteIcon = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete_assignhosting/${id}`)
      .then((response) => {
        GetAllAssignedHosting();
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
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
    },
    {
      title: "Hosting Name",
      dataIndex: "hosting_name",
      key: "hosting_name",
    },

    {
      title: "Hosting URL",
      dataIndex: "hosting_url",
      key: "hosting_url",
    },
    {
      title: "Hosting Password",
      dataIndex: "hosting_password",
      key: "hosting_password",
    },

    {
      title: "Assigned Date",
      dataIndex: "assigned_date",
      key: "assigned_date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <a onClick={() => handleDelete(record.key)}>
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
        <Title level={3} className="AccountInfo_color">
          Assigned Hosting
        </Title>
      </div>
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowAllAssignedHosting;
