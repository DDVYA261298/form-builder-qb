// TypeCheckBox.jsx
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const CheckboxField = ({ field, handleCheck }) => (
  <Form.Group as={Row}>
    <Col md={4}> Type </Col>
    <Col>
      <Form.Check
        type="checkbox"
        name="multiSelect"
        onChange={handleCheck}
        checked={field}
        label="Multi select & A value is required"
      />
    </Col>
  </Form.Group>
);

export default CheckboxField;
