import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

export default function ForecastedWeatherCard({ weather, thickness, useImperialUnits }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth > 900);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function capitalizeDescription(description) {
    return description.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const formatDate = (date, options) =>
    new Date(date * 1000).toLocaleDateString("en-US", options);

  const formatThickness = (thickness) => {
    const thicknessValue = useImperialUnits
      ? Math.round(thickness * 10) / 10 // inches
      : Math.round(thickness * 2.54 * 10) / 10; // cm
    return `${thicknessValue}${(useImperialUnits ? '"' : '\ncm')}`;
  };

  // Function to convert temperature
  const convertTemp = (temp) =>
    useImperialUnits ? temp : Math.round((temp - 32) * 5 / 9);

  return (
    <Box
      display="flex"
      flexDirection="column"
      py={["10px", "15px"]}
      px={["5px", "15px"]}
      alignItems="start"
      boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)"
      borderRadius="10px"
      maxHeight={"200px"}
      width={["80vw", "200px"]}
      mx="10px"
      background="rgba(235, 245, 255, 0.8)"
    >
      <Text fontWeight="semibold" fontSize={["md", "lg"]}>
        {!isDesktop ? formatDate(weather.dt, { weekday: "narrow" }) : formatDate(weather.dt, { weekday: "long" })}
      </Text>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Text fontSize={["lg", "4xl"]} fontWeight="bold" my="10px">
          {formatThickness(thickness)}
        </Text>
        {isDesktop && <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginLeft="10px">
          <img
            height="60px"
            width="60px"
            src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt="weather icon"
          />
          <Text fontSize="sm" fontWeight="bold" marginTop="10px" letterSpacing="tighter">
            {capitalizeDescription(weather.weather[0].description)}
          </Text>
        </Box>}
      </Box>
      <Text fontSize={["sm", "md"]} style={{ position: "relative", bottom: 0 }}>
        Hi: {convertTemp(Math.round(weather.temp.max))}° Lo: {convertTemp(Math.round(weather.temp.min))}°
      </Text>
    </Box>
  );
}
