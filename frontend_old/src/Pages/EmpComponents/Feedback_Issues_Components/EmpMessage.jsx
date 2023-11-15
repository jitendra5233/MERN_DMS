import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

const EmpMessage = ({ message, dateTime }) => {
  return (
    <div style={{ padding: "11px" }}>
      <div>
        <div>
          <span className="EmpMessageContent">{message}</span>
        </div>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span className="EmpMessageContent">{dateTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmpMessage;
