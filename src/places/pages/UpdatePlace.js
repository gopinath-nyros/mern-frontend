import React, { useState, useEffect, Fragment, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Place.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    document.title = "Update Place";
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`;
        const responseData = await sendRequest(url);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No Place Identified...</h2>
        </Card>
      </div>
    );
  }

  // updating the form
  const updateFormHandler = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`;
      await sendRequest(
        url,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      history.push("/" + authCtx.userId + "/places");
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={updateFormHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='please enter a valid title'
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />

          <Input
            id='description'
            element='textarea'
            type='text'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='please enter a valid description'
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
