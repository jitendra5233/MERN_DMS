import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";

const EmpMessageRootAdmin = ({
  message,
  dateTime,
  anonymous,
  photo,
  ShowMesages,
  senderName,
}) => {
  const [messagePhoto, setMessagePhoto] = useState("./user1.png");

  useEffect(() => {
    if (anonymous == false) {
      setMessagePhoto(photo);
    }
  }, []);

  return (
    <div>
      <List.Item>
        <List.Item.Meta
          title={
            <div>
              <div>
                <span style={{ fontSize: "11px" }}>{senderName}</span>
              </div>
              <div>
                <span
                  className="messageHeading"
                  onClick={(data) => ShowMesages(data)}
                >
                  {message}
                </span>
              </div>
            </div>
          }
          description={<p style={{ fontSize: "11px" }}>{dateTime}</p>}
          avatar={<Avatar src={messagePhoto} />}
        />
      </List.Item>
    </div>
  );
};
export default EmpMessageRootAdmin;
