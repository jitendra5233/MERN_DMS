import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";

const EmpMessageNew = ({
  message,
  dateTime,
  anonymous,
  photo,
  ShowMesages,
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
          avatar={<Avatar src={messagePhoto} />}
          title={
            <span
              className="messageHeading"
              onClick={(data) => ShowMesages(data)}
            >
              {message}
            </span>
          }
          description={dateTime}
        />
      </List.Item>
    </div>
  );
};
export default EmpMessageNew;
