import React, { useEffect, useState, Fragment, useContext } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";

import "../../App.css";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  text-align: center;
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const MyPlaces = () => {
  const authCtx = useContext(AuthContext);
  const loggedInUser = authCtx.userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [totalPlaceCount, setTotalPlaceCount] = useState(0);
  const [page, setPage] = useState(1);
  const [noPlaces, setNoPlaces] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [show, setShow] = useState();
  const params = useParams();
  const id = params.userId;
  useEffect(() => {
    document.title = "Places App";
  });

  useEffect(() => {
    const getPlaces = async () => {
      console.log(id);
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/user/${id}?page=${page}&size=3`;
        const responseData = await sendRequest(url);
        console.log(responseData);
        if (responseData.count) {
          setTotalPlaceCount(responseData.count);
        }
        if (responseData.places) {
          setLoadedPlaces((prev) => [...prev, ...responseData.places]);
        } else {
          console.log("running...");
          setNoPlaces(responseData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPlaces();
  }, [sendRequest, id, page]);

  useEffect(() => {
    const timeout = setTimeout(() => setShow("no more data"), 0);
    return () => clearTimeout(timeout);
  }, []);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  if (!isLoading && loadedPlaces.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          {loggedInUser === noPlaces.userid && loadedPlaces.length === 0 && (
            <h2>No places found. Want to create one?</h2>
          )}
          {loggedInUser !== noPlaces.userid && loadedPlaces.length === 0 && (
            <h2>No places found for this user</h2>
          )}
          <div className='btn'>
            {loggedInUser === noPlaces.userid && (
              <Button to='/places/new'>create place</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  window.onscroll = function () {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage(page + 1);
    }
  };
  document.body.ontouchmove = function () {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage(page + 1);
    }
  };
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedPlaces.length > 0 && (
        <PlaceList
          totalCount={totalPlaceCount}
          items={loadedPlaces}
          onDeletePlace={placeDeletedHandler}
          comp='myplaces'
        />
      )}
      {isLoading && loadedPlaces.length > 0 && (
        <BeatLoader css={override} loading />
      )}
      {noPlaces && <p className='no-data'>{show}</p>}
    </Fragment>
  );
};

export default MyPlaces;
