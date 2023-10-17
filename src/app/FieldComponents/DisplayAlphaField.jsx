//Dropdown Component
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const DisplayAlphaField = ({ handleChange, field }) => (
  <Form.Group as={Row}>
    <Col md={4}> Display Order </Col>
    <Col>
      <Form.Select
        name="displayAlpha"
        onChange={handleChange}
        value={field.displayAlpha}
      >
        <option value="original">Original</option>
        <option value="alphabetical">Alphabetical</option>
      </Form.Select>
    </Col>
  </Form.Group>
);

export default DisplayAlphaField;
