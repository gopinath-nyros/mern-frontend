import React, { useReducer, useEffect, useState } from "react";

import { validate } from "../../util/validators";
import countries from "../../util/countries.json";
import "./Input.css";

// reducer function
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
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
  const [countriesMatch, setCountriesMatch] = useState([]);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // useEffect(() => {
  //   if (props.id === "address") {
  //     console.log("suggesting address...");
  //     const url = "https://restcountries.eu/rest/v2/all";
  //     const loadCountries = async () => {
  //       const response = await fetch(url);
  //       const data = await response.json();
  //       console.log(data);
  //       setCountries(data);
  //     };
  //     loadCountries();
  //   }
  // }, [props.id]);

  const inputChangeHandler = (event) => {
    if (props.list) {
      const text = event.target.value.toLowerCase();
      let matches = countries.filter((country) => {
        const regex = new RegExp(`${text}`, "gi");
        return country.name.match(regex) || country.capital.match(regex);
      });
      setCountriesMatch(matches);
      // console.log(countriesMatch);
    }
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

  // const dataList = (
  //   <div id='address'>
  //     {countriesMatch.map((item, index) => (
  //       <p key={index}>{item.name}</p>
  //     ))}
  //   </div>
  // );

  // let dataList;
  // if (props.list) {
  //   dataList = (
  //     <datalist id='address'>
  //       {countries.map((item, index) => (
  //         <option key={index} value={item.name} />
  //       ))}
  //     </datalist>
  //   );
  // }

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
      {dataList}
    </div>
  );
};

export default Input;
