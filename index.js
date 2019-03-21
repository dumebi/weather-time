const r2 = require("r2");

const apiKey = '881ca503b88a2d75e838ffb91cf33a3b';

(async () => {
  try {
    const inputs = [{locationName: 'New York', postalCode: '10009'}, {locationName: 'Lagos', postalCode: '100001'}, {locationName: 'Berlin', postalCode: '10178'}, {locationName: 'Accra', postalCode: '00233'}]
    const cityWeatherPromises = inputs.map(input => r2(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input.locationName)},${input.postalCode}&appid=${apiKey}`).json)
    const cityWeathers = await Promise.all(cityWeatherPromises)


    const cityTimePromises = cityWeathers.map(async (weather) => {
      const rawTimeData = await r2(`https://maps.googleapis.com/maps/api/timezone/json?location=${weather.coord.lat},${weather.coord.lon}&timestamp=${weather.dt}&key=${apiKey}`).json
      const local_timestamp = weather.dt + rawTimeData.dstOffset + rawTimeData.rawOffset;
      const cityDateTime = new Date(local_timestamp * 1000);
     
      console.log(cityDateTime.toDateString() + ' - ' + cityDateTime.getHours() + ':' + cityDateTime.getMinutes());
      return cityDateTime.toDateString() + ' - ' + cityDateTime.getHours() + ':' + cityDateTime.getMinutes()
    })
    const cityTimes = await Promise.all(cityTimePromises)
    
    
    for (let index = 0; index < inputs.length; index++) {
      const weather = cityWeathers[index];
      const time = cityTimes[index];
      const input = inputs[index];

      console.log(`The weather at ${input.locationName} is: ${weather.weather[0].description}, temperature ${weather.main.temp}k, pressure ${weather.main.pressure} hpa, humidity ${weather.main.humidity}% at ${time}`)
      
    }
  } catch (error) {
    console.log(error)
  }

})();


