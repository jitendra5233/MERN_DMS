import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import { DeleteOutlined } from "@ant-design/icons";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { Table, Typography, Modal } from "antd";
const { Title } = Typography;
const { confirm } = Modal;
const ShowAvailableItems = () => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItemrecord")
      .then((result) => {
        let data = result.data;
        let newData = [];
        console.log(data);
        data.map((x) => {
          const createdAt = new Date(x.createdAt);
          const formattedCreatedAt = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
          newData.push({
            key: x._id,
            item_name: x.item_name,
            quantity: x.quantity,
            createdAt: formattedCreatedAt,
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
      .delete(process.env.REACT_APP_API_URL + "/delete_showrecord", {
        data: { id }, // Pass the data as an object
      })
      .then((response) => {
        getInventory();
        setTableData((prevData) => prevData.filter((item) => item.key !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Created Date/Time",
      dataIndex: "createdAt",
      key: "createdAt",
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
        <Title level={3} className="Expensecolor">
          Show Item Record
        </Title>
        <Link to={`/inventory-item`}>
          <button className="filtercolorbtn">
            Total items <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
        <Link to={`/add-issued`}>
          <button className="filtercolorbtn">Assign Item +</button>
        </Link>
        <Link to={`/show_itemrecord`}>
          <button className="filtercolorbtn">
            Show Record <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
      </div>
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowAvailableItems;
