import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function CurrentWeatherWidget({ weather, useImperialUnits, ...rest }) {
  // Correcting the temperature conversion
  const currentTemperature = useImperialUnits ? weather.current.temp : (weather.current.temp - 32) * 5 / 9;

  return (
    <Box display="flex" flexDirection={"row"} alignItems="center" {...rest}>
      <Text fontSize={["2xl", "2.5xl", "3xl", "3.5xl"]} fontWeight="bold" my={["1vh", "1.5vh", "2vh", "2.5vh"]} marginRight={["0.25vw", "0.375vw", "0.5vw", "0.625vw"]}>
        {currentTemperature.toFixed(1)}&deg;{useImperialUnits ? "F" : "C"}
      </Text>
      <img
        height={["43.75px", "65.63px", "87.5px", "109.38px"]} // Increased by 75%
        width={["43.75px", "65.63px", "87.5px", "109.38px"]} // Increased by 75%
        src={`http://openweathermap.org/img/w/${weather.current.weather[0].icon}.png`}
        alt="weather icon"
      />
    </Box>
  );
}
