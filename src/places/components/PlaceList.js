import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceList.css";

const PlaceList = (props) => {
  const authCtx = useContext(AuthContext);
  const loggedInUser = authCtx.userId;
  // console.log(props);
  if (props.items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          {loggedInUser && <h2>No places found. Want to create one?</h2>}
          {!loggedInUser && <h2>No places found for this user</h2>}
          <div className='btn'>
            {loggedInUser && <Button to='/places/new'>share place</Button>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {props.items.map((place, index) => (
        <PlaceItem
          key={index}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
