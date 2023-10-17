// component Default Value
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
const DefaultValueField = ({
  handleChange,
  field,
  defaultChoiceNotification,
}) => {
  <Form.Group as={Row} controlId="default" className="small-entry">
    <Col md={4}>
      <Form.Label className="label">Default Value</Form.Label>
    </Col>
    <Col>
      <Form.Control
        type="text"
        name="default"
        placeholder="Asia"
        onChange={(e) => handleChange(e)}
        value={field.default}
        md={7}
      />
      <div
        style={{
          fontSize: 14,
          color: "black",
        }}
      >
        {defaultChoiceNotification.defaultCharacterMax}
      </div>
    </Col>
  </Form.Group>;
};

export default DefaultValueField;
