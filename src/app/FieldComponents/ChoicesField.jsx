// ChoicesTextArea.jsx
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const ChoicesField = ({ field, handleChange, notifications }) => (
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
        value={field}
        md={7}
      />
      <div style={{ fontSize: 14, color: "black" }}></div>
      <div style={{ fontSize: 14, color: "red", marginLeft: "2px" }}>
        {notifications.duplicatesError}
      </div>
      <div style={{ fontSize: 14, color: "red" }}>
        {notifications.choicesError}
      </div>
      <div style={{ fontSize: 14, color: "red" }}>
        {notifications.lengthError}
      </div>
    </Col>
  </Form.Group>
);

export default ChoicesField;
