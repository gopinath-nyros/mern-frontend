import React, { Fragment, useEffect, useState, useContext } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Users = () => {
  const [loadedUsers, getLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  // console.log("it is......" + authCtx.username);
  // console.log("it is......" + authCtx.userId);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        getLoadedUsers(responseData.users);
      } catch (err) {}
    };
    getAllUsers();
  }, [sendRequest]);

  useEffect(() => {
    document.title = "Places App";
  });

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {authCtx.username && (
        <h1 className='username'>
          {`Welcome Back ${
            authCtx.username[0].toUpperCase() +
            authCtx.username.slice(1).toLowerCase()
          }`}
        </h1>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </Fragment>
  );
};

export default Users;
