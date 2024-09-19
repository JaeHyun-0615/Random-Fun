import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  InputRightElement,
  InputGroup,
  Button,
  Spinner,
  Link
} from "@chakra-ui/react";
import { usePlacesWidget } from "react-google-autocomplete";
import CurrentWeatherWidget from "./components/CurrentWeatherWidget";
import ForecastedWeatherWidget from "./components/ForecastedWeatherWidget";
import MapWidget from "./components/MapWidget";
import { SearchIcon } from "@chakra-ui/icons";
import { MdMyLocation } from "react-icons/md";
import logo from "./assets/images/logo.png";
import CurrentIceThickness from "./components/CurrentIceThickness";
import TableandButton from "./components/TableandButton"
import backgroundImage from "./assets/images/background3.webp";
import ServerApi from "./services/serverApi";
import { useCookies } from 'react-cookie';
import TermsOfServiceModal from "./components/TermsOfServiceModal";

const root = document.getElementById("root");

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [forecastedWeather, setForecastedWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todaysThickness, setTodaysThickness] = useState(0);
  const [forecastedThicknessList, setForecastedThicknessList] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);
  const [cookies, setCookie] = useCookies(['acceptedTerms']);
  const [showTerms, setShowTerms] = useState(false);
  const [useImperialUnits, setUseImperialUnits] = useState(false);

  useEffect(() => { // set units based on user locale
    const userLocale = navigator.language;
    if (userLocale.includes('US')) {
      setUseImperialUnits(true);
    }
  }, []);


  useEffect(() => {
    if (!cookies.acceptedTerms) {
      setShowTerms(true);
    }
  }, [cookies]);

  const handleAcceptTerms = () => {
    setCookie('acceptedTerms', 'true', { path: '/', maxAge: 31536000 }); // maxAge is set for 1 year
    setShowTerms(false);
  };

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 900);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const getWeather = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${process.env.REACT_APP_OPENWEATHERMAPS_API_KEY}&units=imperial`
    );
    const data = await response.json();
    console.log(data);
    return data;
  };

  const setLatLngFromAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.REACT_APP_GOOGLEPLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      await setLatitude(lat);
      await setLongitude(lng);
      console.log("Latitude is :", lat);
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Unable to geocode address");
    }
  };

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLEPLACES_API_KEY,
    onPlaceSelected: (place) => handleLocationSubmit(place),
  });

  const handleLocationSubmit = async (event) => {
    try {
      setIsLoading(true);
      // display weather for the place
      console.log(event);
      setLocationInput(event.formatted_address);
      const latLong = await setLatLngFromAddress(event.formatted_address);
      setLatitude(latLong.latitude);
      setLongitude(latLong.longitude);
      const weatherData = await getWeather(latLong.latitude, latLong.longitude);
      console.log("fetching all weather data");
      const fetchedData = await ServerApi.fetchAllWeatherData(latLong.latitude, latLong.longitude);
      console.log("fetched data: " + fetchedData);
      console.log("fetched data: " + fetchedData);
      const todayDate = new Date().toISOString().split('T')[0];
      const todayData = fetchedData.find(d => d.date === todayDate);
      setTodaysThickness(todayData.thickness);
      setForecastedWeather(weatherData);
      extractForecastedThicknessList(fetchedData);
    } catch (error) {
      console.error("Error getting current location: ", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const extractForecastedThicknessList = (fetchedWeatherData) => { // use data from fetchAllWeatherData to get thickness estimates for all days in the future
    const thicknessList = [];
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const futureWeatherData = fetchedWeatherData.filter((day) => day.date >= today);
    console.log("future weather data: " + futureWeatherData);
    futureWeatherData.map((day) => {
      thicknessList.push(day.thickness);
    });
    setForecastedThicknessList(thicknessList);
  };


  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const latLong = await getCurrentLatLong();
      setLatitude(latLong.latitude);
      setLongitude(latLong.longitude);

      setLocationInput(`Lat: ${latLong.latitude}, Long: ${latLong.longitude}`);

      console.log("fetching all weather data");
      const fetchedData = await ServerApi.fetchAllWeatherData(latLong.latitude, latLong.longitude);
      console.log("fetched data: " + fetchedData);

      const todayDate = new Date().toISOString().split('T')[0];
      const todayData = fetchedData.find(d => d.date === todayDate);
      setTodaysThickness(todayData.thickness);

      const weatherData = await getWeather(latLong.latitude, latLong.longitude);
      setForecastedWeather(weatherData);
      extractForecastedThicknessList(fetchedData);
    } catch (error) {
      console.error("Error getting current location: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getCurrentLatLong() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(pos);
        },
        err => reject(err)
      );
    });
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" width="100vw"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <TermsOfServiceModal isOpen={showTerms} handleAcceptTerms={handleAcceptTerms} />
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        px={[4, 8]}
        py={4}
      >
        {isDesktop &&
          <Box flexDirection="row" display="flex" position='absolute'
            left='.5rem' // Use rem units for consistency across devices
            top='.5rem'>
            <img
              src={logo}
              alt="logo"
              style={{
                maxWidth: '100%', // Ensures the image is never wider than its container
                height: 'auto', // Maintains the aspect ratio of the image
                maxHeight: '100px' // Sets a max-height to ensure the logo doesn't get too large on bigger screens
              }}
            />
            <Text
              position={"relative"}
              fontSize="sm" // Chakra UI size for small text
              fontStyle="italic"
              color="gray.500" // Using Chakra UI's color scheme
            >
              (Beta Release)
            </Text>
          </Box>
        }

        {forecastedWeather && (
          <div style={{ position: "absolute", right: 10, top: 0 }}>
            {isDesktop && <CurrentWeatherWidget weather={forecastedWeather} useImperialUnits={useImperialUnits} />}
          </div>
        )}
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
          <InputGroup
            width={{ base: "90%", md: "50%", lg: "25%" }} // Adjust the width based on the screen size
            backgroundColor="white"
            boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)"
            borderRadius="10px"
            border="none"
          >
            <Input
              width="100%" // Make the Input width 100% of the InputGroup
              ref={ref}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onSubmit={handleLocationSubmit}
              placeholder="Search for a city"
            />
            <InputRightElement
              pointerEvents="none"
              children={<SearchIcon />}
            />
          </InputGroup>
          {(forecastedWeather && forecastedThicknessList.length > 0) || <Button mt="5vh" backgroundColor="white" leftIcon={<MdMyLocation />}
            onClick={handleGetCurrentLocation}
            boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)" borderRadius="10px"
            border="none"
          >
            Use Current Location
          </Button>}
        </Box>




      </Box>

      {
        forecastedWeather && forecastedThicknessList.length > 0 ? (
          <>
            <Box
              display="flex"
              flexDirection={["column", "row"]} // Stack elements vertically on small screens, horizontally on larger
              justifyContent={"space-between"}
              alignItems="center"
              width="90%"
              my={"1vh"}
            >
              {isDesktop && <TableandButton></TableandButton>}

              {isLoading ? <Spinner /> : (<CurrentIceThickness estimatedThickness={todaysThickness} useImperialUnits={useImperialUnits} />)}

              {isDesktop && <MapWidget latitude={latitude} longitude={longitude}></MapWidget>}

            </Box>

            <ForecastedWeatherWidget weather={forecastedWeather} forecastedThicknessList={forecastedThicknessList} useImperialUnits={useImperialUnits} />
          </>
        ) : (
          isLoading ? (
            <Spinner mt="10vh" />
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="90%">
              <Text fontSize="xl" fontWeight="bold" my={"10vh"} textAlign={"center"}>
                Enter a location to get an ice thickness estimate.
              </Text>

            </Box>
          )
        )
      }

      <Text
        fontSize={isDesktop ? "sm" : "2xs"}
        fontWeight="light"
        opacity={0.5}
        my={isDesktop ? "5vh" : "1vh"} // Adjust vertical margin based on device
        px={5}
        style={{
          position: "absolute",
          bottom: isDesktop ? "5px" : "0px", // Adjust position for mobile
        }}
      >
        <Text textAlign="center">
          <Text as="span">For a guide on ice safety, </Text>
          <Link href="https://www.weather.gov/safety/winter-ice-frost#:~:text=Stay%20off%20the%20ice%20if,to%2012%20inches%20of%20ice." textDecoration="underline" isExternal>check this out</Link>.
          <Text as="span"> Disclaimer: By using this site, you acknowledge that you have read and accepted the </Text>
          <Link onClick={() => setShowTerms(true)} isExternal textDecoration="underline">Terms of Service</Link>.
          <Text as="span">Estimates provided may not accurately reflect current or future conditions. </Text>
          <Text as="span">Verify ice conditions through personal assessment or consultation with local authorities before using the ice. </Text>
          <Text as="span">The website owner or its affiliates is not liable for any harm or damages arising from your use of this information. </Text>
          <Text as="span">For suggestions, feedback, or questions, please </Text>
          <Link href="mailto:j.steinberg702@gmail.com" textDecoration="underline">reach out</Link>.
        </Text>
      </Text>
    </Box >
  );
}

export default App;
