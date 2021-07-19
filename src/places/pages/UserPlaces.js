import React, { useEffect, useState, Fragment, useContext } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";

import InfiniteScroll from "react-infinite-scroll-component";

const UserPlaces = () => {
  const authCtx = useContext(AuthContext);
  const loggedInUser = authCtx.userId;
  // console.log(authCtx.userId);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [page, setPage] = useState(1);
  // const [size, setSize] = useState();
  const [noPlaces, setNoPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const params = useParams();
  const id = params.userId;
  // console.log(id);

  useEffect(() => {
    document.title = "Places App";
  });

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/places/user/${id}?page=${page}&size=3`;
        // console.log(url);
        const responseData = await sendRequest(url);
        if (!responseData.message) {
          setLoadedPlaces(responseData.places);
          setNoPlaces();
        } else {
          setNoPlaces(responseData);
          setLoadedPlaces();
        }
        // console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    getPlaces();
  }, [sendRequest, id, page]);

  const placeDeletedHandler = (deletedPlaceId) => {
    // console.log("calling........");
    // console.log(`deleted place id is ${deletedPlaceId}`);
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  if (!isLoading && noPlaces) {
    // console.log(!isLoading);
    // console.log(!!noPlaces);
    // console.log("TRIGGERED");
    return (
      <div className='place-list center'>
        <Card>
          {loggedInUser === noPlaces.userid && (
            <h2>No places found. Want to create one?</h2>
          )}
          {loggedInUser !== noPlaces.userid && !loadedPlaces && (
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

  const fetchPlaces = async () => {
    setPage(page + 1);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/places/user/${id}?page=${page}&size=3`;
      const responseData = await sendRequest(url);
      if (!responseData.message) {
        // setLoadedPlaces(loadedPlaces.concat(responseData.places));
        // setLoadedPlaces([...loadedPlaces, responseData.places]);
        setLoadedPlaces((loadedPlaces) => [
          ...loadedPlaces,
          // [...responseData.places],
          loadedPlaces.concat(responseData.places),
        ]);
        // setLoadedPlaces((prevState) => {
        //   return {
        //     ...prevState,
        //     places: prevState.concat(responseData.places),
        //   };
        // });
        // console.log(responseData.places);
        setNoPlaces();
      } else {
        setNoPlaces(responseData);
        setLoadedPlaces();
      }
      // console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("start");
  console.log(loadedPlaces);
  console.log(
    `the length of the array is ${loadedPlaces.length} in fetch places`
  );
  console.log("end");
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {noPlaces && !isLoading && (
        <div className='place-list center'>
          <Card>
            {loggedInUser === noPlaces.userid && (
              <h2>No places found. Want to create one?</h2>
            )}
            {loggedInUser !== noPlaces.userid && !loadedPlaces && (
              <h2>No places found for this user</h2>
            )}
            <div className='btn'>
              {loggedInUser === noPlaces.userid && (
                <Button to='/places/new'>create place</Button>
              )}
            </div>
          </Card>
        </div>
      )} */}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedPlaces && !error && (
        <InfiniteScroll
          dataLength={loadedPlaces.length}
          next={fetchPlaces}
          hasMore={true}
          loader={<h3>Loading...</h3>}
        >
          <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
        </InfiniteScroll>
      )}
    </Fragment>
  );
};

export default UserPlaces;
