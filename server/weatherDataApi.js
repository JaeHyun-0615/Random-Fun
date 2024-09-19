async function fetchWeatherData(latitude, longitude) {

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=31&daily=temperature_2m_mean,rain_sum,snowfall_sum&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto`
    );
    const data = await response.json();

    console.log(data);

    // Format the data
    const formattedData = data.daily.time.map((date, i) => ({
        date: date,
        temp: data.daily.temperature_2m_mean[i], // Assuming temperature_2m_mean is the desired field
        // Other data fields can be added as needed
    }));

    return formattedData;
}

module.exports = { fetchWeatherData };