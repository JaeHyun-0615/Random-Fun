// Define the estimateNetGrowth function with two parameters: historicalWeather and futureWeather
function estimateNetGrowth(historicalWeather, futureWeather) {
    // Constants used in the calculations
    const K = 0.056; // Growth rate constant in cm/°C^2
    const T_freeze = 0; // Freezing point of water in Celsius
    const n = 1.33; // Exponent in the growth rate equation
    const meltingRate = 0.01; // Rate of melting in cm/°C
    const thicknessThreshold = 10; // Threshold in cm for changing the growth rate
    const reducedGrowthFactor = 0.5; // Factor to reduce growth rate when threshold is exceeded
    const cmToInches = 1 / 2.54; // Conversion factor from centimeters to inches

    // Function to convert Fahrenheit to Celsius
    function fahrenheitToCelsius(f) {
        return (f - 32) * 5 / 9;
    }

    // Function to calculate either the growth or melting rate of ice
    function growthOrMeltingRate(tempC, currentThickness) {
        let growthRate = K * Math.pow(T_freeze - tempC, n);

        if (tempC > T_freeze) {
            // If temperature is above freezing, calculate melting
            return -meltingRate * (tempC - T_freeze) * cmToInches;
        } else if (currentThickness > thicknessThreshold) {
            // If ice is thicker than threshold, reduce growth rate
            return growthRate * reducedGrowthFactor * cmToInches;
        } else {
            // Normal growth rate calculation
            return growthRate * cmToInches;
        }
    }

    // Calculate initial ice thickness based on historical weather data
    let h0 = historicalWeather.reduce((thickness, { temp }) => {
        return thickness + growthOrMeltingRate(fahrenheitToCelsius(temp), thickness);
    }, 0);

    // Ensure the thickness does not go below zero
    h0 = Math.max(h0, 0);

    let iceThicknessEstimates = [];
    let currentThickness = h0;
    for (let i = 0; i < futureWeather.length; i++) {
        // Calculate and update ice thickness for each future weather condition
        currentThickness += growthOrMeltingRate(fahrenheitToCelsius(futureWeather[i].temp), currentThickness);
        currentThickness = Math.max(0, currentThickness);
        iceThicknessEstimates.push(currentThickness);
    }

    // Return the array of estimated ice thickness values
    return iceThicknessEstimates;
}

// Export the estimateNetGrowth function for use in other modules
module.exports = { estimateNetGrowth };
