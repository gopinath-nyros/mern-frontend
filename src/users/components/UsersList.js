import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='users-list'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  const users = props.items.map((user) => (
    <UserItem
      key={user.id}
      id={user.id}
      image={user.image}
      name={user.username}
      placeCount={user.places.length}
    />
  ));

  return <ul className='users-list'>{users}</ul>;
};

export default UsersList;
