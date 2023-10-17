import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import EmpMessContainerAdmin from "./InquiryAdminComponents/EmpMessContainerAdmin";

const AllMessage = () => {
  let selector = useSelector((state) => state.persistedReducer.user);

  const [allIssues, setAllIssues] = useState({
    anonymous: [],
    employee: [],
  });
  const [allFeedbacks, setAllFeedbacks] = useState({
    anonymous: [],
    employee: [],
  });

  useEffect(() => {
    getIssuesAndFeedbacks();
  }, []);

  const getIssuesAndFeedbacks = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getFeedbackIssuesAll", {
        id: selector.token2,
      })
      .then((result) => {
        let feedBackArr = {
          anonymous: [],
          employee: [],
        };
        let issuesArr = {
          anonymous: [],
          employee: [],
        };

        result.data.map((x) => {
          axios
            .post(process.env.REACT_APP_API_URL + "/getEmpDataSingle", {
              id: x.ref_id,
            })
            .then((result) => {
              let newData = result.data[0];
              x.f_name = newData.f_name;
              x.l_name = newData.l_name;
              x.photo = newData.photo;

              if (x.type == "feedback") {
                if (x.anonymous == "true") {
                  feedBackArr.anonymous.push(x);
                } else {
                  feedBackArr.employee.push(x);
                }
              }
              if (x.type == "issue") {
                if (x.anonymous == "true") {
                  issuesArr.anonymous.push(x);
                } else {
                  issuesArr.employee.push(x);
                }
              }

              setAllIssues(issuesArr);
              setAllFeedbacks(feedBackArr);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ margin: "1rem" }}>
      <Row gutter={24} span={12} style={{ backgroundColor: "" }}>
        <Col span={12}>
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ marginBottom: "11px" }}>
                <span className="EmpProfile">Feedback</span>
              </div>
            </Col>
            <Col>
              <EmpMessContainerAdmin
                title="Anonymous message"
                type="feedback"
                anonymous={true}
                getIssuesAndFeedbacks={() => getIssuesAndFeedbacks()}
                data={allFeedbacks.anonymous}
              />
            </Col>
            <Col span={12}>
              <EmpMessContainerAdmin
                title="Employee message"
                type="feedback"
                anonymous={false}
                getIssuesAndFeedbacks={() => getIssuesAndFeedbacks()}
                data={allFeedbacks.employee}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ marginBottom: "11px" }}>
                <span className="EmpProfile">Issues</span>
              </div>
            </Col>
            <Col span={12}>
              <EmpMessContainerAdmin
                title="Anonymous message"
                type="issue"
                anonymous={true}
                getIssuesAndFeedbacks={() => getIssuesAndFeedbacks()}
                data={allIssues.anonymous}
              />
            </Col>
            <Col span={12}>
              <EmpMessContainerAdmin
                title="Employee message"
                type="issue"
                anonymous={false}
                getIssuesAndFeedbacks={() => getIssuesAndFeedbacks()}
                data={allIssues.employee}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AllMessage;
