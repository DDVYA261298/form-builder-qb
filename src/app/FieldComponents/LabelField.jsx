// Label Component
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const LabelTextBox = ({ handleChange, field }) => (
  <Form.Group as={Row} controlId="label">
    <Col md={4}>
      <Form.Label className="label">Label</Form.Label>
    </Col>
    <Col>
      <Form.Control
        required
        type="text"
        name="label"
        placeholder="Sales Region"
        onChange={handleChange}
        value={field}
        md={7}
      />
    </Col>
  </Form.Group>
);

export default LabelTextBox;
