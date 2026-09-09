import React from "react";

const StarRating = ({ rating = 0, showScore = true }) => {
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <img
        key={`full-${i}`}
        src="/assets/icons/Star.svg"
        alt="star"
        width="16"
        height="16"
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <img
        key="half"
        src="/assets/icons/halfStar.svg"
        alt="half star"
        width="16"
        height="16"
      />
    );
  }

  return (
    <div className="stars-wrapper">
      <div className="stars">
        {stars}
      </div>
      {showScore && (
        <span className="score">
          {numericRating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};

export default React.memo(StarRating);
