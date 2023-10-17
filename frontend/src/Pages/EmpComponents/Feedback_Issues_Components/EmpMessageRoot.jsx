import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";

const EmpMessageRoot = ({
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
          title={
            <span
              className="messageHeading"
              onClick={(data) => ShowMesages(data)}
            >
              {message}
            </span>
          }
          description={dateTime}
          avatar={<Avatar src={messagePhoto} />}
        />
      </List.Item>
    </div>
  );
};
export default EmpMessageRoot;
