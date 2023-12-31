// ButtonSave Component
import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
function ButtonSave({ handleReset }) {
  return (
    <Form.Group as={Row}>
      <Col md={4}></Col>

      <Col md={4}>
        <Button className="save" variant="success" type="submit">
          Save Changes
        </Button>
      </Col>

      <Col md={4}>
        <Button
          className="reset"
          variant="outline-danger"
          type="button"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Col>
    </Form.Group>
  );
}

export default ButtonSave;
