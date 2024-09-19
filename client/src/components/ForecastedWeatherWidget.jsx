import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ForecastedWeatherCard from "./ForecastedWeatherCard";

export default function ForecastedWeatherWidget({ weather, forecastedThicknessList, useImperialUnits, ...rest }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="start" width="100%" padding="10px" {...rest}>
      <Text fontWeight="bold" mt="15px" mb="10px" ml={["20px", "50px"]} >5-Day Forecast</Text>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center" // Center the cards horizontally
        alignItems="center"
        width="100%" // Ensure the Box takes full width
      >
        {weather.daily.map((day, index) => (
          (index === 0 || index > 5) ? null :
            <ForecastedWeatherCard key={index} weather={day} thickness={forecastedThicknessList[index]} useImperialUnits={useImperialUnits} />
        ))}
      </Box>
    </Box>
  );
}
