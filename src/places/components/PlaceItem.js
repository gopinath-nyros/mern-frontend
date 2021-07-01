import React, { useState, Fragment, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    console.log("deleting...");
    setShowConfirmModal(false);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`;
      await sendRequest(url, "DELETE", null, {
        Authorization: "Bearer " + authCtx.token,
      });
      props.onDelete(props.id);
    } catch (error) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} clearError={clearError} />
      {/* Modal for Map */}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        conteneClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      {/* Modal for Deletion confirm */}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure to Delete?'
        footerClass='place-item__modal-actions'
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              cancel
            </Button>
            <Button delete onClick={confirmDeleteHandler}>
              delete
            </Button>
          </Fragment>
        }
      ></Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img src={props.image} alt={props.title} />
          </div>
          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              View on a Map
            </Button>
            {authCtx.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {authCtx.userId === props.creatorId && (
              <Button danger onClick={showDeleteHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
