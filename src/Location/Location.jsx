
import "./Location.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../images/image copy 3.png";
import orange from "../images/image copy 4.png";
import green from "../images/image copy 5.png";

/* API */
const API = "http://127.0.0.1:8000/api";

/* Cities */
const CITIES = [
  "Tiruchi","Pollachi","Coimbatore","Hosur","Dharmapuri","Salem",
  "Erode","Karur","Thanjavur","Chennai","Thiruvallur","Vellore",
  "Madurai","Tiruppur","Mettupalayam","Chengalpattu",
  "Namakkal","Tirunelveli","Dindugal","Theni"
];

/* City Coordinates for distance calculation */
const CITY_COORDINATES = {
  Tiruchi:{lat:10.7905,lng:78.7047},
  Pollachi:{lat:10.6582,lng:77.0082},
  Coimbatore:{lat:11.0168,lng:76.9558},
  Hosur:{lat:12.7409,lng:77.8253},
  Dharmapuri:{lat:12.1277,lng:78.1579},
  Salem:{lat:11.6643,lng:78.1460},
  Erode:{lat:11.3410,lng:77.7172},
  Karur:{lat:10.9601,lng:78.0766},
  Thanjavur:{lat:10.7870,lng:79.1378},
  Chennai:{lat:13.0827,lng:80.2707},
  Thiruvallur:{lat:13.1394,lng:79.9074},
  Vellore:{lat:12.9165,lng:79.1325},
  Madurai:{lat:9.9252,lng:78.1198},
  Tiruppur:{lat:11.1085,lng:77.3411},
  Mettupalayam:{lat:11.3000,lng:76.9400},
  Chengalpattu:{lat:12.6916,lng:79.9763},
  Namakkal:{lat:11.2194,lng:78.1674},
  Tirunelveli:{lat:8.7139,lng:77.7567},
  Dindugal:{lat:10.3673,lng:77.9803},
  Theni:{lat:10.0104,lng:77.4768}
};

const Location = () => {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [selectedCity,setSelectedCity] = useState(localStorage.getItem("locationName"));
  const [autoDetecting,setAutoDetecting] = useState(false);
  const [detectedCity,setDetectedCity] = useState(null);
  const [error,setError] = useState(null);
  const [retryCount,setRetryCount] = useState(0);

  const watchIdRef = useRef(null);
  const isAutoSelecting = useRef(false);

  /* Normalize city */
  const normalizeCityName = (city) => {

    if(!city) return null;

    const exact = CITIES.find(c => c.toLowerCase() === city.toLowerCase());
    if(exact) return exact;

    const partial = CITIES.find(
      c =>
        c.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(c.toLowerCase())
    );

    return partial || city;
  };

  /* Select city */
  const selectCity = async (city) => {

    if(loading) return;

    const normalizedCity = normalizeCityName(city);

    if(!normalizedCity){
      setError("City not recognized. Please select from the list.");
      return;
    }

    setLoading(true);
    setError(null);

    try{

      const res = await fetch(`${API}/select-location/`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({city:normalizedCity})
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.error || "Location not available");
      }

      localStorage.setItem("locationId",data.location_id);
      localStorage.setItem("locationName",data.location_name);

      /* Save coordinates for distance calculation */
      const coords = CITY_COORDINATES[normalizedCity];

      if(coords){
        localStorage.setItem("latitude",coords.lat);
        localStorage.setItem("longitude",coords.lng);
      }

      setSelectedCity(data.location_name);

      window.dispatchEvent(new Event("locationChange"));

      if(watchIdRef.current!==null){
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current=null;
      }

      setAutoDetecting(false);

      setTimeout(()=>navigate("/"),500);

    }catch(err){

      console.error("Select city error:",err);
      setError(err.message || "Location not available");
      alert(err.message);

    }

    setLoading(false);
    isAutoSelecting.current=false;
  };

  /* Detect city from coordinates */
  const detectCityFromCoords = async (latitude,longitude) => {

    try{

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { headers:{'User-Agent':'AdugalamApp/1.0'} }
      );

      const data = await res.json();

      let city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.district ||
        data.address?.county ||
        data.address?.municipality;

      if(!city) return null;

      const matchedCity = normalizeCityName(city);

      return matchedCity;

    }catch{
      return null;
    }
  };

  /* Location errors */
  const getLocationErrorMessage = (error) => {

    switch(error.code){

      case error.PERMISSION_DENIED:
        return "Location permission denied. Please enable location access in your browser settings.";

      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please try again.";

      case error.TIMEOUT:
        return "Location request timed out.";

      default:
        return "Unable to get your location.";
    }
  };

  /* Watch location */
  const startLocationWatch = () => {

    if(!navigator.geolocation){
      setError("Geolocation not supported");
      return;
    }

    setAutoDetecting(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(

      async(position)=>{

        const {latitude,longitude} = position.coords;

        const city = await detectCityFromCoords(latitude,longitude);

        if(city && !isAutoSelecting.current){
          isAutoSelecting.current=true;
          setDetectedCity(city);
          selectCity(city);
        }

      },

      (error)=>{

        if(error.code === error.PERMISSION_DENIED){
          setError(getLocationErrorMessage(error));
          setAutoDetecting(false);
        }

      },

      {
        enableHighAccuracy:true,
        timeout:15000,
        maximumAge:0
      }

    );
  };

  /* Retry */
  const retryLocation = () => {
    setError(null);
    setRetryCount(prev=>prev+1);
    startLocationWatch();
  };

  /* Use current location */
  const useCurrentLocation = () => {

    if(!navigator.geolocation){
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    isAutoSelecting.current=true;

    navigator.geolocation.getCurrentPosition(

      async(position)=>{

        const {latitude,longitude} = position.coords;

        localStorage.setItem("latitude",latitude);
        localStorage.setItem("longitude",longitude);

        const city = await detectCityFromCoords(latitude,longitude);

        if(city) selectCity(city);

        else{
          setError("Could not detect your city.");
          setLoading(false);
          isAutoSelecting.current=false;
        }

      },

      (error)=>{

        setError(getLocationErrorMessage(error));
        setLoading(false);
        isAutoSelecting.current=false;

      },

      {
        enableHighAccuracy:true,
        timeout:15000,
        maximumAge:0
      }

    );
  };

  /* Auto start */
  useEffect(()=>{

    if(!selectedCity){
      startLocationWatch();
    }

    return ()=>{
      if(watchIdRef.current!==null){
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };

  },[]);

  const backSymbol = String.fromCharCode(60);

  return(

    <div className="location">

      <div className="pick-location">
        <h1 className="back-btn" onClick={()=>navigate(-1)}>
          {backSymbol}
        </h1>
        <h4>Pick Location</h4>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          {retryCount < 3 && (
            <button onClick={retryLocation}>Try Again</button>
          )}
        </div>
      )}

      {autoDetecting && !selectedCity && (
        <div className="auto-detecting">
          <div className="detecting-spinner"></div>
          <p>Detecting your location...</p>
        </div>
      )}

      {detectedCity && !selectedCity && (
        <div className="detected-city-banner">
          <p>Detected: <strong>{detectedCity}</strong></p>
        </div>
      )}

      <div
        className={`use-current-location ${loading ? "disabled" : ""}`}
        onClick={useCurrentLocation}
      >
        <img src={logo} alt="" className="use" />
        <h4 className="current">
          {loading ? "Detecting location..." : "Use Current Location"}
        </h4>
      </div>

      <div className="pick-location">
        <h5 className="popularrr">Popular Areas</h5>
      </div>

      <div className="all">
        {["Tirunelveli","Chennai","Madurai"].map((city)=>(
          <div
            key={city}
            className={`use-current-location1 ${
              selectedCity === city ? "active-city" : ""
            }`}
            onClick={()=>selectCity(city)}
          >
            <img src={orange} alt="" className="use" />
            <h4 className="current">{city}</h4>
          </div>
        ))}
      </div>

      <div className="pick-location">
        <h5 className="popularrr">Cities We Operate In</h5>
      </div>

      <div className="all">
        {CITIES.map((city)=>(
          <div
            key={city}
            className={`use-current-location1 ${
              selectedCity === city ? "active-city" : ""
            }`}
            onClick={()=>selectCity(city)}
          >
            <img src={green} alt="" className="use" />
            <h4 className="current">{city}</h4>
          </div>
        ))}
      </div>

    </div>

  );
};

export default Location;

