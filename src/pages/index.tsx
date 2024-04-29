import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";
import Loader from "@/components/loader";
const Home: React.FC<any> = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });
  if (!isLoaded) return <Loader />;
  return <Map />;
};

export default Home;
