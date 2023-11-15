import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EmployeeProfile = () => {
  let selector = useSelector((state) => state.persistedReducer.user);
  const [EmpData, setEmpData] = useState({ photo: "./user1.png" });

  useEffect(() => {
    getEmpDetails(selector.token);
  }, []);

  const getEmpDetails = (token) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getEmpData", { token })
      .then((res) => {
        setEmpData(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={EmpData.photo}
          style={{ borderRadius: "50%", height: "60px", width: "60px" }}
        />
        <div style={{ margin: "0 10px " }}>
          <div>
            <span className="EmpName">
              {EmpData.f_name} {EmpData.l_name}
            </span>
          </div>
          <div>
            <span className="EmpProfile">{EmpData.designation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
