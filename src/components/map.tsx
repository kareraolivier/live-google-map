import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import Loader from "./loader";
import { generateLocations } from "./helpers";
import {
  closeOptions,
  middleOptions,
  farOptions,
  VeryFarOptions,
} from "./cycles";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const nightId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_NIGHT_ID;
const dayId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_DAIRY_ID;

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [directions, setDirections] = useState<DirectionsResult>();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const mapRef = useRef<GoogleMap>();
  const mapLoaded = useRef<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [navigator.geolocation]);

  const nightOptions = useMemo<MapOptions>(
    () => ({
      mapId: nightId,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    [isChecked]
  );
  const dayOptions = useMemo<MapOptions>(
    () => ({
      mapId: dayId,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    [isChecked]
  );
  const onLoad = useCallback((map: GoogleMap | undefined | any) => {
    mapRef.current = map;
    mapLoaded.current = true;
  }, []);
  const locations = useMemo(() => generateLocations(center), [center]);

  const fetchDirections = (location: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: location,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="w-full">
      {!mapLoaded.current && <Loader />}
      <div className="controls absolute z-10 top-2 left-2 rounded-md p-2">
        <div className="flex justify-between items-center">
          <h1 className="pb-4 text-green-500 font-bold text-xl">
            Karera's Map.
          </h1>
          <label className="flex gap-2 items-center cursor-pointer">
            <span className="ms-3 text-sm font-medium text-gray-900">
              Nightmode
            </span>
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isChecked}
              onChange={() => setIsChecked((prevState) => !prevState)}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>

        {!office && (
          <p className="text-green-500">Enter the address you want</p>
        )}
        <div>
          <p className="font-semibold text-lg text-green-500">Destination</p>
          <Places
            setOffice={(position) => {
              setOffice(position);
              mapRef.current?.panTo(position);
            }}
          />
        </div>

        {directions && (
          <>
            <Distance leg={directions.routes[0].legs[0]} mode="car" />
            <Distance leg={directions.routes[0].legs[0]} mode="bike" />
            <Distance leg={directions.routes[0].legs[0]} mode="onfoot" />
            <Distance leg={directions.routes[0].legs[0]} mode="bicycle" />
          </>
        )}
      </div>
      <div className="w-full h-screen">
        <GoogleMap
          key={isChecked ? "night" : "day"}
          zoom={10}
          center={center}
          mapContainerClassName="w-full h-screen"
          options={isChecked ? nightOptions : dayOptions}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
          {center && <Marker position={center} />}

          {office && (
            <>
              <Marker position={office} />

              <MarkerClusterer>
                {(clusterer) => (
                  <>
                    {locations.map((location: LatLngLiteral) => (
                      <Marker
                        key={location.lat}
                        position={location}
                        clusterer={clusterer}
                        onClick={() => fetchDirections(location)}
                      />
                    ))}
                  </>
                )}
              </MarkerClusterer>

              <Circle center={office} radius={10000} options={closeOptions} />
              <Circle center={office} radius={20000} options={middleOptions} />
              <Circle center={office} radius={35000} options={farOptions} />
              <Circle center={office} radius={50000} options={VeryFarOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
