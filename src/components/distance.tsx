import { useState } from "react";

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
  mode: string;
};

export default function Distance({ leg, mode }: DistanceProps) {
  const [isOpen, setIsOpen] = useState(true); // State to manage card open/close

  if (!leg.distance || !leg.duration) return null;

  let modeLabel = "";
  let modeIcon = "";
  let time = 0;

  switch (mode) {
    case "car":
      modeLabel = "car";
      modeIcon = "🚗";
      time = leg.duration.value / 3600; // Convert duration to hours
      break;
    case "bike":
      modeLabel = "bike";
      modeIcon = "🚲";
      time = leg.distance.value / 20000; // Assume average biking speed of 20 km/h
      break;
    case "bicycle":
      modeLabel = "bicycle";
      modeIcon = "🚴";
      time = leg.distance.value / 15000; // Assume average biking speed of 15 km/h
      break;
    case "onfoot":
      modeLabel = "on foot";
      modeIcon = "🚶";
      time = leg.distance.value / 5000; // Assume average walking speed of 5 km/h
      break;
    default:
      modeLabel = "unknown mode";
      modeIcon = "";
      time = 0;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`my-4 p-2 shadow-md rounded-md ${isOpen ? "block" : "hidden"}`}
    >
      <button
        onClick={handleToggle}
        className="text-right text-sm mb-2 text-red-600"
      >
        Close
      </button>
      <p>
        This place is <span className="highlight">{leg.distance.text}</span>{" "}
        away from your place. That would take{" "}
        <span className="highlight">{time.toFixed(2)} hours</span> each
        direction. (by {modeIcon} {modeLabel})
      </p>
    </div>
  );
}
