import React from "react";
import "./UserItems.css";
import { Link } from "react-router-dom";
import Card from "../../shared/componets/ui elements/Card";
import Avatar from "../../shared/componets/ui elements/Avatar";
const UserItems = (props) => {
  return (
    
      <li className="user-item">
        <div className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt='nnn' />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h4>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h4>
          </div>
        </Link>
      </div>
      </li>

  );
};
export default UserItems;
