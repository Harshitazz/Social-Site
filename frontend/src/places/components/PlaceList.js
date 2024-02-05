import React from "react";
import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/componets/ui elements/Card";
const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      
      <div className="place-list center" >
        <Card style={{height:"15rem" }}> 
        <h2 style={{padding:"2rem"}}>no places found. maybe create a one?</h2>
        <button type="button" class="btn btn-secondary">SHARE PLACE</button>
        </Card>
      </div>
      
    );
  }
  return (
    <>
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
        key={place.id}
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
    </>
  );
};
export default PlaceList;
