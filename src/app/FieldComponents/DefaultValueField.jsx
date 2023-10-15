// DefaultValueTextBox.jsx
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const DefaultValueField = ({
  field,
  handleChange,
  defaultChoiceNotification,
}) => (
  <Form.Group as={Row} controlId="default" className="small-entry">
    <Col md={4}>
      <Form.Label className="label">Default Value</Form.Label>
    </Col>
    <Col>
      <Form.Control
        type="text"
        name="default"
        placeholder="Asia"
        onChange={handleChange}
        value={field}
        md={7}
      />
      <div style={{ fontSize: 14, color: "black" }}>
        {defaultChoiceNotification}
      </div>
    </Col>
  </Form.Group>
);

export default DefaultValueField;
