import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";

const EmpMessageInnerAdmin = ({
  message,
  dateTime,
  anonymous,
  photo,
  ShowMesages,
  fromAdmin,
}) => {
  const [messagePhoto, setMessagePhoto] = useState("./user1.png");

  useEffect(() => {
    console.log(fromAdmin, message, photo);
    if (anonymous == false) {
      if (photo != "") {
        setMessagePhoto(photo);
      }
    }
  }, []);

  return (
    <div>
      {fromAdmin == "false" ? (
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
export default EmpMessageInnerAdmin;
