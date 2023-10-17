"use client";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { validate } from "./validations.js";
// import LabelField from "./FieldComponents/LabelField.jsx";
// import CheckboxField from "@/app/FieldComponents/CheckboxField.jsx";
// import DefaultValueField from "./FieldComponents/DefaultValueField.jsx";
// import ChoicesField from "@/app/FieldComponents/ChoicesField.jsx";
// import DisplayAlphaField from "@/app/FieldComponents/DisplayAlphaField.jsx";
//@TODO breakdown all the items in components

const getStoredFormData = () => {
  try {
    const storedFormDataJSON = localStorage.getItem("formData");
    return storedFormDataJSON
      ? JSON.parse(storedFormDataJSON)
      : initialFieldState;
  } catch (error) {
    console.error("Error while retrieving stored form data:", error);
    return initialFieldState;
  }
};
// const getStoredFormData = () => {
//   try {
//     const storedFormDataJSON = localStorage.getItem("formData");
//     if (storedFormDataJSON) {
//       const storedFormData = JSON.parse(storedFormDataJSON);
//       if (
//         storedFormData.displayAlpha &&
//         storedFormData.displayAlpha === "alphabetical"
//       ) {
//         storedFormData.displayAlpha = true;
//       } else storedFormData.displayAlpha = false;
//       return storedFormData;
//     } else {
//       return initialFieldState;
//     }
//   } catch (error) {
//     console.error("Error while retrieving stored form data:", error);
//     return initialFieldState;
//   }
// };

const initialFieldState = {
  label: "",
  default: "",
  choices: "",
  displayAlpha: false,
  multiSelect: false,
};

const Builder = () => {
  const MAX_CHARACTER_LIMIT = 40;

  const [field, setField] = useState(getStoredFormData());

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(field));
  }, [field]);

  //const [field, setField] = useState({
  //   label: "",
  //   default: "",
  //   choices: "",
  //   displayAlpha: false,
  //   multiSelect: false,
  //   //  required: false,
  // });
  const [defaultChoiceNotification, setDefaultChoiceNotification] = useState({
    defaultCharacterMax: `${MAX_CHARACTER_LIMIT} character maximum`,
  });
  const [notifications, setNotifications] = useState({
    duplicatesError: "",
    choicesError: "",
    lengthError: "",
  });
  const [created, setCreated] = useState("");

  // Turn choices string into an array
  const normalizeChoices = (choices) => {
    let choicesArray = choices.split("\n");

    choicesArray = choicesArray.map((x) => x.trim());
    choicesArray = choicesArray.filter((element) => element !== "");

    return choicesArray;
  };

  // Add defaultChoice value if not already included
  const addDefaultIfNeeded = (defaultChoice, choicesArray) => {
    if (!defaultChoice) {
      return choicesArray;
    }

    const defaultLowerCase = defaultChoice.toLowerCase().trim();

    notifyDefaultChoiceLength(defaultLowerCase, MAX_CHARACTER_LIMIT);

    const choicesArrayLowerCase = choicesArray.map((choice) =>
      choice.toLowerCase()
    );

    if (!choicesArrayLowerCase.includes(defaultLowerCase)) {
      choicesArray.unshift(defaultChoice.trim());
    }
    return choicesArray;
  };

  // Determine Default Choice length
  const notifyDefaultChoiceLength = (defaultChoice, maxCharacterLength) => {
    const choiceLength = defaultChoice.length;
    const characterDifference = maxCharacterLength - choiceLength;

    let notification;
    if (!choiceLength) {
      notification = `${MAX_CHARACTER_LIMIT} character maximum`;
    } else if (characterDifference >= 0) {
      if (characterDifference === 1) {
        notification = `${characterDifference} character left`;
      } else {
        notification = `${characterDifference} characters left`;
      }
    } else if (characterDifference < 0) {
      if (Math.abs(characterDifference) === 1) {
        notification = `${Math.abs(
          characterDifference
        )} character past maximum`;
      } else {
        notification = `${Math.abs(
          characterDifference
        )} characters past maximum`;
      }
    }
    setDefaultChoiceNotification({ defaultCharacterMax: notification });
  };
  // The empty dependency array ensures this effect runs only once when the component mounts
  // useEffect(() => {
  //   // Load the form data from localStorage
  //   const savedFormData = localStorage.getItem("formData");
  //   if (savedFormData) {
  //     const parsedFormData = JSON.parse(savedFormData);
  //     setField(parsedFormData);
  //   }
  // }, []);

  // Updates field state to reflect changes in text areas
  const handleChange = (event) => {
    event.persist();
    setField((field) => ({
      ...field,
      [event.target.name]: event.target.value,
    }));

    // Characters remaining/countdown for Default Choice ONLY
    const isDefault = event.target.name === "default";
    const defaultChoice = event.target.value;

    if (!isDefault) {
    } else {
      notifyDefaultChoiceLength(defaultChoice, MAX_CHARACTER_LIMIT);
    }
  };

  // Check box handling
  const handleCheck = (event) => {
    event.persist();
    setField((field) => ({
      ...field,
      [event.target.name]: !field[event.target.name],
    }));
  };

  // If Default Choice exceeds character limit
  // remove it from choicesArray
  // This is called after validations to prevent
  const removeInvalidDefaultChoice = (defaultChoice, choicesArray) => {
    if (defaultChoice.length > MAX_CHARACTER_LIMIT) {
      choicesArray = choicesArray.filter(
        (element) => element !== defaultChoice
      );
    }
    return choicesArray;
  };

  // Alphabetize Choices
  const alphabetize = (choicesArray, displayAlpha) => {
    if (displayAlpha) {
      choicesArray = choicesArray.sort();
      return choicesArray;
    }
    return choicesArray;
  };

  // Move Default Choice to first choice unless Choices are alphabetized
  const prioritizeDefaultChoice = (
    defaultChoice,
    choicesArray,
    displayAlpha
  ) => {
    if (displayAlpha) {
      return choicesArray;
    }

    if (choicesArray.indexOf(defaultChoice) <= 0) {
      return choicesArray;
    }
    choicesArray = choicesArray.filter((element) => element !== defaultChoice);
    choicesArray = [defaultChoice, ...choicesArray];
    return choicesArray;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let choicesArray = normalizeChoices(field.choices, field.displayAlpha);
    choicesArray = addDefaultIfNeeded(field.default, choicesArray);
    const errors = validate(choicesArray, MAX_CHARACTER_LIMIT);
    choicesArray = removeInvalidDefaultChoice(
      field.default,
      choicesArray,
      MAX_CHARACTER_LIMIT
    );
    choicesArray = alphabetize(choicesArray, field.displayAlpha);
    choicesArray = prioritizeDefaultChoice(
      field.default,
      choicesArray,
      field.displayAlpha
    );
    const choicesString = choicesArray.join("\n");

    setField({
      ...field,
      default: field.default.trim(),
      choices: choicesString,
    });
    setNotifications({ ...errors });
    setCreated("");
    if (Object.values(errors).every((x) => x === "")) {
      submit(choicesArray);
    }
  };

  const submit = (choicesArray) => {
    const data = {
      label: field.label,
      default: field.default,
      choices: choicesArray,
      displayAlpha: field.displayAlpha,
      multiSelect: field.multiSelect,
      //required: field.required,
    };

    axios({
      method: "POST",
      url: "http://www.mocky.io/v2/566061f21200008e3aabd919",
      data: data,
    })
      .then((data) => {
        if (data.status === 200) {
          setCreated("Post data successful");
        }
      })
      .catch(console.error)
      .then(response => response.json())
.then(data => console.log(data))

    console.log("Field data", data);
  };

  const resetState = () => {
    localStorage.removeItem(FormData);
    setField({
      label: "",
      default: "",
      choices: "",
      displayAlpha: false,
      multiSelect: false,
      // required: false,
    });

    setDefaultChoiceNotification({
      defaultCharacterMax: `${MAX_CHARACTER_LIMIT} character maximum`,
    });

    setNotifications({
      duplicatesError: "",
      choicesError: "",
      lengthError: "",
    });

    setCreated("");
  };
  // const [label, setLabel] = useState(""); // State for the label input
  // const [choices, setChoices] = useState([]); // State for the list of choices
  // const [newChoice, setNewChoice] = useState(""); // State for the new choice input

  // const handleLabelChange = (e) => {
  //   setLabel(e.target.value);
  // };

  // const handleNewChoiceChange = (e) => {
  //   setNewChoice(e.target.value);
  // };

  // const handleAddChoice = () => {
  //   if (newChoice) {
  //     // Check if the new choice is not empty
  //     setChoices([...choices, newChoice]);
  //     setNewChoice(""); // Clear the new choice input
  //   }
  // };

  // const handleRemoveChoice = (index) => {
  //   const updatedChoices = [...choices];
  //   updatedChoices.splice(index, 1);
  //   setChoices(updatedChoices);
  // };
  const handleReset = (event) => {
    event.preventDefault();
    resetState();
  };

  return (
    <div>
      <Container className="container">
        <div className="form-field">
          <h1 id="form-name">Field Builder</h1>

          <Form className="form" onSubmit={handleSubmit}>
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
                  value={field.label}
                  md={7}
                />
              </Col>
            </Form.Group>
            <br></br>
            <Form.Group as={Row}>
              <Col md={4}> Type </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  name="multiSelect"
                  onChange={handleCheck}
                  checked={field.multiSelect}
                  label="Multi select & A value is required"
                />
              </Col>
            </Form.Group>
            <br></br>
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
                  value={field.default}
                  md={7}
                />

                <div style={{ fontSize: 14, color: "black" }}>
                  {defaultChoiceNotification.defaultCharacterMax}
                </div>
              </Col>
            </Form.Group>
            <br></br>
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
                  value={field.choices}
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
            <br></br>
            <Form.Group as={Row}>
              <Col md={4}> Display Order </Col>
              <Col>
                <Form.Select
                  name="displayAlpha"
                  onChange={handleChange}
                  value={field.displayAlpha ? "alphabetical" : "original"}
                >
                  <option value="original">Original</option>
                  <option value="alphabetical">Alphabetical</option>
                </Form.Select>
              </Col>
            </Form.Group>
            {/* 
            <LabelField onChange={handleChange} value={field.label} />
            <CheckboxField onChange={handleCheck} checked={field.multiSelect} />
            <DefaultValueField onChange={handleChange} value={field.default} />
            <ChoicesField
              onChange={handleChange}
              value={field.choices}
              notifications={notifications}
            />
            <DisplayAlphaField
              onChange={handleChange}
              value={field.displayAlpha}
            /> */}
            {/* <Form.Group as={Row}>
              <Col md={4}></Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="displayAlpha"
                  onChange={handleCheck}
                  checked={field.displayAlpha}
                  label="Display Alphabetically"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col md={4}></Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="multiSelect"
                  onChange={handleCheck}
                  checked={field.multiSelect}
                  label="Select Multiple Choices"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="required">
              <Col md={4}></Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="required"
                  onChange={handleCheck}
                  checked={field.required}
                  label="Required Field"
                  value={field.required}
                />
              </Col>
            </Form.Group> */}
            <br></br>
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

            <div style={{ fontSize: 18, color: "green" }}>{created}</div>
          </Form>

          {/* <div>
            <label>
              Label:
              <input type="text" value={label} onChange={handleLabelChange} />
            </label>

            <div>
              <label>
                New Choice:
                <input
                  type="text"
                  value={newChoice}
                  onChange={handleNewChoiceChange}
                />
              </label>
              <button onClick={handleAddChoice}>Add Choice</button>
            </div>

            <ul>
              {choices.map((choice, index) => (
                <li key={index}>
                  {choice}
                  <button onClick={() => handleRemoveChoice(index)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </Container>
    </div>
  );
};

export default Builder;
