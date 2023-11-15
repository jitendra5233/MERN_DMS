import { useState, useEffect } from "react";
import { Typography, Table, Modal } from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { confirm } = Modal;
const { Title } = Typography;
const ShowAllAssignedSocialMedia = () => {
  useEffect(() => {
    GetAllSocialAssignedHosting();
  }, []);
  const [tableData, setTableData] = useState([]);

  const GetAllSocialAssignedHosting = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAllSocialAssignedHosting")
      .then((result) => {
        if (result.data !== "") {
          let data = result.data;
          let newData = data.map((x) => ({
            key: x._id,
            emp_name: x.emp_name,
            emp_code: x.emp_code,
            job_title: x.job_title,
            client_name: x.client_name,
            icon_name: x.icon_name,
            social_url: x.social_url,
            social_password: x.social_password,
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
      .delete(`${process.env.REACT_APP_API_URL}/delete_assignsocialmedia/${id}`)
      .then((response) => {
        GetAllSocialAssignedHosting();
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
      title: "Icon Name",
      dataIndex: "icon_name",
      key: "icon_name",
    },

    {
      title: "Social URL",
      dataIndex: "social_url",
      key: "social_url",
    },
    {
      title: "Social Password",
      dataIndex: "social_password",
      key: "social_password",
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
          Assigned Social Media Accounts
        </Title>
        {/* <button className="filtercolorbtn">
          Filter <i className="fa fa-filter" aria-hidden="true"></i>
        </button> */}
      </div>
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowAllAssignedSocialMedia;
