import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

const Home: React.FC<any> = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });
  console.log("first", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
};

export default Home;
