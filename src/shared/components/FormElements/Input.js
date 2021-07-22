import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import countries from "../../util/countries.json";
import "./Input.css";

// reducer function
const inputReducer = (state, action) => {
  if (action.type === "CHANGE") {
    state.strLength = action.val.length;
  }
  // console.log(state);
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
        // strLength: action.val.length,
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  // const [countries, setCountries] = useState([]);
  // const [countriesMatch, setCountriesMatch] = useState([]);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
    strLength: 0,
  });

  const { id, onInput } = props;
  const { value, isValid, strLength } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, strLength, onInput]);

  const inputChangeHandler = (event) => {
    // if (props.list) {
    //   const text = event.target.value.toLowerCase();
    //   let matches = countries.filter((country) => {
    //     const regex = new RegExp(`${text}`, "gi");
    //     return country.name.match(regex) || country.capital.match(regex);
    //   });
    //   // setCountriesMatch(matches);
    //   // console.log(countriesMatch);
    // }
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        list={props.list || null}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  const dataList = (
    <datalist id='address'>
      {countries.map((item, index) => (
        <option key={index} value={item.name} />
      ))}
    </datalist>
  );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid &&
        inputState.isTouched &&
        inputState.strLength === 0 && <p>{props.errorText}</p>}

      {!inputState.isValid &&
        inputState.isTouched &&
        inputState.strLength > 0 &&
        inputState.strLength < 7 && <p>{props.minLengthError}</p>}

      {!inputState.isValid &&
        inputState.isTouched &&
        inputState.strLength > 0 &&
        props.type === "email" &&
        inputState.strLength < 15 && <p>{props.minLengthError}</p>}

      {!inputState.isValid &&
        inputState.isTouched &&
        (props.type === "text" || props.type === "password") &&
        inputState.strLength > 12 && <p>{props.maxLengthError}</p>}

      {!inputState.isValid &&
        inputState.isTouched &&
        props.type === "email" &&
        inputState.strLength > 50 && <p>{props.maxLengthError}</p>}
      {dataList}

      {inputState.strLength >= 15 &&
        inputState.strLength <= 50 &&
        !inputState.isValid &&
        inputState.isTouched &&
        props.type === "email" && <p>{"not a valid email"}</p>}
      {dataList}
    </div>
  );
};

export default Input;
