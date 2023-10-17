import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import EmpMessContainer from "./Feedback_Issues_Components/EmpMessContainer";
import { useSelector } from "react-redux";
import axios from "axios";

const Feedback_Issues = () => {
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
      .post(process.env.REACT_APP_API_URL + "/getFeedbackIssues", {
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
        });

        setAllIssues(issuesArr);
        setAllFeedbacks(feedBackArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ margin: "1rem" }}>
      <Row gutter={24}>
        <Col span={12}>
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ marginBottom: "11px" }}>
                <span className="EmpProfile">Feedback</span>
              </div>
            </Col>
            <Col span={12}>
              <EmpMessContainer
                title="Anonymous message"
                type="feedback"
                anonymous={true}
                data={allFeedbacks.anonymous}
              />
            </Col>
            <Col span={12}>
              <EmpMessContainer
                title="Employee message"
                type="feedback"
                anonymous={false}
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
              <EmpMessContainer
                title="Anonymous message"
                type="issue"
                anonymous={true}
                data={allIssues.anonymous}
              />
            </Col>
            <Col span={12}>
              <EmpMessContainer
                title="Employee message"
                type="issue"
                anonymous={false}
                data={allIssues.employee}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Feedback_Issues;
