"use client";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
//import Button from "react-bootstrap/Button";
import axios from "axios";
import { validate } from "./validations.js";
import LabelField from "./FieldComponents/LabelField.jsx";
import CheckboxField from "@/app/FieldComponents/CheckboxField.jsx";
import DefaultValueField from "./FieldComponents/DefaultValueField.jsx";
import ChoicesField from "@/app/FieldComponents/ChoicesField.jsx";
//import DisplayAlphaField from "@/app/FieldComponents/DisplayAlphaField.jsx";
import ButtonSave from "./FieldComponents/buttonsave.jsx";
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
  //
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
    console.log(field);
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
      .then((response) => {
        if (response.status === 200) {
          setCreated("Post data successful");
          //console.log(response);
          return response.data;
        } else {
          throw new error("Http status ${response.status}");
        }
      })

      .then((data) => console.log(data))
      .catch(console.error);

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
            <LabelField handleChange={handleChange} value={field.label} />
            <br></br>
            <CheckboxField
              handleCheck={handleCheck}
              checked={field.multiSelect}
            />
            <br></br>
            <DefaultValueField
              handleChange={handleChange}
              value={field.default}
              defaultChoiceNotification={defaultChoiceNotification}
            />
            <br></br>

            <ChoicesField
              handleChange={handleChange}
              field={field.choices}
              notifications={notifications}
            />
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
            <br></br>

            <ButtonSave handleReset={handleReset} />

            <div style={{ fontSize: 18, color: "green" }}>{created}</div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Builder;
