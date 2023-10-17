//Choice Component
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";

const ChoicesField = ({ handleChange, field, notifications }) => {
  // Check if field and notifications are defined
  const fieldExists = field !== undefined;
  const notificationsExist = notifications !== undefined;

  return (
    <Form.Group as={Row} controlId="choices">
      <Col md={4}>
        <Form.Label className="label">Choices</Form.Label>
      </Col>
      <Col>
        <Form.Control
          as="textarea"
          className="text-area"
          name="choices"
          placeholder="Add Choices"
          onChange={handleChange}
          value={fieldExists ? field : ""}
          md={7}
        />
        <div style={{ fontSize: 14, color: "black" }}></div>

        {notificationsExist && notifications.duplicatesError && (
          <div style={{ fontSize: 14, color: "red", marginLeft: "2px" }}>
            {notifications.duplicatesError}
          </div>
        )}

        {notificationsExist && notifications.choicesError && (
          <div style={{ fontSize: 14, color: "red" }}>
            {notifications.choicesError}
          </div>
        )}

        {notificationsExist && notifications.lengthError && (
          <div style={{ fontSize: 14, color: "red" }}>
            {notifications.lengthError}
          </div>
        )}
      </Col>
    </Form.Group>
  );
};

export default ChoicesField;
