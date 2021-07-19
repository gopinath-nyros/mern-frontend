import React, { useContext, Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Place.css";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const history = useHistory();

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log("submitting...");
    // console.log(formState.inputs);
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      // console.log(authCtx.token);
      const url = `${process.env.REACT_APP_BACKEND_URL}/places`;
      // console.log("the url is..." + url);
      await sendRequest(url, "POST", formData, {
        Authorization: "Bearer " + authCtx.token,
      });

      // Redirect here on success
      history.push("/");
    } catch (error) {}
  };

  useEffect(() => {
    document.title = "New Place";
  });

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={formSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          element='input'
          id='title'
          type='text'
          placeholder='enter place'
          label='Title'
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_MINLENGTH(7),
            VALIDATOR_MAXLENGTH(12),
          ]}
          errorText='please enter a title'
          minLengthError='title should contain atleast 7 charecters'
          maxLengthError='title exceeded the limit of 12 charecters'
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id='image'
          onInput={inputHandler}
          errorText='Please provide an image'
        />
        <Input
          id='description'
          element='textarea'
          type='text'
          placeholder='enter place'
          label='Description'
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_MINLENGTH(7),
            VALIDATOR_MAXLENGTH(150),
          ]}
          errorText='please enter a description'
          minLengthError='description should contain atleast 7 charecters'
          maxLengthError='description exceeded the limit of 150 charecters'
          onInput={inputHandler}
        />
        <Input
          id='address'
          element='input'
          type='text'
          placeholder='enter address'
          label='Address'
          list='address'
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_MINLENGTH(7),
            VALIDATOR_MAXLENGTH(60),
          ]}
          errorText='please enter address'
          minLengthError='address should contain atleast 7 charecters'
          maxLengthError='address exceeded the limit of 60 charecters'
          onInput={inputHandler}
        />

        <Button type='submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
