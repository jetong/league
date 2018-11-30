import React from "react";

const Card = props => {
  return (
    <div className="column">
      <div>
        <img className="card" src={props.imgSrc} alt={props.name} />
      </div>
      <h3>{props.name}</h3>
    </div>
  );
};

export default Card;
