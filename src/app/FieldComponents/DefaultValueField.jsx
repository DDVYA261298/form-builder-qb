// DefaultValueTextBox.jsx
import React from "react";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
// const [inputText, setInputText] = useState("");
const DefaultValueField = ({
  handleChange,
  field,
  defaultChoiceNotification,
}) => {
  // const isExceedingLimit = field.length > 40;
  //const textStyle = isExceedingLimit ? { color: "red" } : {};

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
        value={field}
        // style={textStyle}
        md={7}
      />
      <div
        style={{
          fontSize: 14,
          //color: isExceedingLimit ? "red" : "inherit",
        }}
      >
        {defaultChoiceNotification.defaultCharacterMax}
      </div>
    </Col>
  </Form.Group>;
};

export default DefaultValueField;
