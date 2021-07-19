import React, { useState, useContext, Fragment, useEffect } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./Auth.css";
const Auth = () => {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("submitting...");
    console.log(formState.inputs);

    // based on login or signp mode send http req
    if (isLoginMode) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/users/login`;
        const responseData = await sendRequest(
          url,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        console.log(responseData);
        console.log(`the user id is ${responseData.userId}`);
        console.log(`the user name is ${responseData.username}`);
        authCtx.login(
          responseData.userId,
          responseData.username,
          responseData.token
        );
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("username", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const url = `${process.env.REACT_APP_BACKEND_URL}/users/signup`;
        const responseData = await sendRequest(url, "POST", formData);
        console.log(responseData);
        authCtx.login(
          responseData.userId,
          responseData.username,
          responseData.token
        );
      } catch (error) {}
    }
  };

  useEffect(() => {
    document.title = "Login";
  });

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Please Login</h2>
        <hr />
        <form className='auth-form' onSubmit={formSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your Name'
              placeholder='enter your name'
              validators={[
                VALIDATOR_REQUIRE(),
                VALIDATOR_MINLENGTH(7),
                VALIDATOR_MAXLENGTH(20),
              ]}
              errorText='Please enter a name'
              minLengthError='name should contain atleast 7 charecters'
              maxLengthError='name exceeded the limit of 20 charecters'
              onInput={inputHandler}
            />
          )}

          {/* for image upload in signup mode */}
          {!isLoginMode && (
            <ImageUpload
              center
              id='image'
              onInput={inputHandler}
              errorText='Please provide an image'
            />
          )}

          <Input
            element='input'
            id='email'
            type='email'
            placeholder='enter email'
            label='Email'
            validators={[
              VALIDATOR_MINLENGTH(15),
              VALIDATOR_MAXLENGTH(50),
              VALIDATOR_EMAIL(),
            ]}
            errorText='please enter a valid email'
            minLengthError='email should contain atleast 15 charecters'
            maxLengthError='email exceeded the limit of 50 charecters'
            onInput={inputHandler}
          />

          <Input
            element='input'
            id='password'
            type='password'
            placeholder='enter password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(7), VALIDATOR_MAXLENGTH(12)]}
            errorText='please enter a password'
            minLengthError='password should contain atleast 7 charecters'
            maxLengthError='password exceeded the limit of 12 charecters'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Sign-up"}
          </Button>
        </form>
        <div className='mgb'>
          <Button inverse onClick={switchModeHandler}>
            Switch to {isLoginMode ? "Sign-up" : "Login"}
          </Button>
        </div>
      </Card>
    </Fragment>
  );
};

export default Auth;
