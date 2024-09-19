import React from "react";
import { VStack, Text } from "@chakra-ui/react";

export default function CurrentIceThickness({ estimatedThickness, useImperialUnits, ...rest }) {
  // Convert to cm if useImperialUnits is false, otherwise keep in inches
  const displayThickness = useImperialUnits
    ? Math.round(estimatedThickness * 10) / 10 // Rounded to one decimal place
    : Math.round(estimatedThickness * 2.54 * 10) / 10; // Convert inches to cm and round

  return (
    <VStack spacing={4} align="center">
      <Text
        my="25px"
        fontSize="6xl"
        fontWeight="bold"
        textAlign="center"
      >
        {displayThickness}{useImperialUnits ? '"' : 'cm'}
      </Text>
      <Text>
        Today's Estimated Ice Thickness
      </Text>
    </VStack>
  );
}
