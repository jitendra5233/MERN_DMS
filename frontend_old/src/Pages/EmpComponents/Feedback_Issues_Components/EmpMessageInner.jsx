import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";

const EmpMessageInner = ({
  message,
  dateTime,
  anonymous,
  photo,
  ShowMesages,
  fromAdmin,
}) => {
  const [messagePhoto, setMessagePhoto] = useState("./user1.png");

  useEffect(() => {
    console.log(fromAdmin, message);
    if (anonymous == false) {
      setMessagePhoto(photo);
    }
  }, []);

  return (
    <div>
      {fromAdmin == "true" ? (
        <>
          <List.Item>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Avatar src={"./user1.png"} />
              </div>
              <div style={{ marginLeft: "5px" }}>{message}</div>
            </div>
          </List.Item>
        </>
      ) : (
        <>
          <List.Item style={{ justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "5px" }}>{message}</div>
              <div>
                <Avatar src={messagePhoto} />
              </div>
            </div>
          </List.Item>
        </>
      )}
    </div>
  );
};
export default EmpMessageInner;
