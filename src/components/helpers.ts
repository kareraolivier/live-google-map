import { LatLngLiteral } from "leaflet";

export const generateLocations = (position: LatLngLiteral) => {
  const _locations: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _locations.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _locations;
};
