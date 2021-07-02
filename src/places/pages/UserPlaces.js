import React, { useEffect, useState, Fragment } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const params = useParams();
  const id = params.userId;
  console.log(id);
  useEffect(() => {
    const getPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/user/${id}`;
        console.log(url);
        const responseData = await sendRequest(url);
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, id]);

  const placeDeletedHandler = (deletedPlaceId) => {
    console.log("calling........");
    console.log(`deleted place id is ${deletedPlaceId}`);
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </Fragment>
  );
};

export default UserPlaces;
