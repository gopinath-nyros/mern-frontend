import React, { useState, useEffect, Fragment } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import "../../App.css";

import { BeatLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  text-align: center;
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const AllPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
  const [page, setPage] = useState(1);
  const [noPlaces, setNoPlaces] = useState(false);
  const [show, setShow] = useState();
  const [triggerCount, setTriggerCount] = useState(0);
  useEffect(() => {
    const getAllPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/allplaces?page=${page}&size=5`;
        const responseData = await sendRequest(url);
        if (responseData.places && responseData.places.length > 0) {
          setLoadedPlaces((prev) => [...prev, ...responseData.places]);
        } else {
          setNoPlaces(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllPlaces();
  }, [sendRequest, page]);

  useEffect(() => {
    const timeout = setTimeout(() => setShow("no more data"), 0);
    return () => clearTimeout(timeout);
  }, []);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  window.onscroll = function () {
    if (noPlaces) {
      return;
    }
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("EQUAL");
      setTriggerCount(triggerCount + 1);
      if (triggerCount === 1) {
        setTriggerCount(0);
        setPage(page + 1);
      }
    }
  };

  return (
    <Fragment>
      <h1 className='title'>All Places</h1>
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedPlaces.length > 0 && (
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={placeDeletedHandler}
          comp='allplaces'
        />
      )}
      {isLoading && loadedPlaces.length > 0 && (
        <BeatLoader css={override} loading />
      )}
      {noPlaces && <p className='no-data'>{show}</p>}
    </Fragment>
  );
};

export default AllPlaces;
