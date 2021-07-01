import React, { Fragment, useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../components/UsersList";
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
  const [loadedUsers, getLoadedUsers] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  useEffect(() => {
    const getAllUsers = async () => {

      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`)

        getLoadedUsers(responseData.users)
      } catch (err) { }
    }
    getAllUsers()
  }, [sendRequest])




  return <Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && <div className="center">
      <LoadingSpinner />
    </div>}
    {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
  </Fragment>
};

export default Users;
