import React, { useState, useContext ,useRef} from "react";
import "./PlaceItem.css";
import Card from "../../shared/componets/ui elements/Card";
import Modal from "react-bootstrap/Modal";
//import Modal from "../../shared/componets/ui elements/Modal";
import Button from "../../shared/componets/ui elements/Button";
//import Map from "../../shared/componets/ui elements/Map";
import { AuthContext } from "../../shared/componets/hooks/context/auth-context";
import MapComponent from "../../shared/componets/ui elements/Map";
import { useHttpClient } from "../../shared/componets/hooks/http-hook";
import LoadingSpinner from "../../shared/componets/ui elements/LoadingSpinner";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, isError, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmation, setshowConfirmation] = useState(false);
  const mapRef = useRef(null); // Define mapRef here

  const openMapHandler = () => setShowMap(true);
  const openConfirmation = () => setshowConfirmation(true);

  const closeMapHandler = () =>{ 
    if (mapRef.current) {
      mapRef.current.dispose(); // Dispose of the previous map instance
    }
    setShowMap(false);}
  const closeConfirmation = async () => {
    setshowConfirmation(false);
    try{
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id} `, 
      "DELETE",
      null,//body
      { Authorization: 'Bearer ' + auth.token}
      );
      props.onDelete(props.id)
   }catch(err){}
    
  };

  const apiKey = "qP0Mb1XlAJV7xZ7hJKXRsYqI5NffEsQ5KxqB6eXAtE0";

  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onHide={closeMapHandler}
        animation={false}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.address}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent apiKey={apiKey} zoom={15} center={props.coordinates} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeMapHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
{/* deleting */}
      <Modal
        show={showConfirmation}
        onHide={closeConfirmation}
        animation={false}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            fontWeight: "bold",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          ARE YOU SURE?
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to proceed and delete this place?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button inverse onClick={closeConfirmation}>
            CANCEL
          </Button>
          <Button danger onClick={closeConfirmation}>
            DELETE
          </Button>
        </Modal.Footer>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner/>}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId===props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId===props.creatorId && (
              <Button onClick={openConfirmation}>DELETE</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default PlaceItem;
