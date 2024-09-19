import axios from 'axios';

class ServerApi {

   static backendUrl = (window.location.hostname === 'localhost') ? 'http://localhost:3001' : 'https://icethickness.uc.r.appspot.com';

   static async fetchAllWeatherData(latitude, longitude) {
      console.log("fetching all weather data");
      console.log(this.backendUrl);
      try {
         const response = await axios.get(`${this.backendUrl}/get-ice-thickness-estimates/${latitude}/${longitude}`, {
            headers: {
               'x-api-key': process.env.REACT_APP_BACKEND_API_KEY
            }
         });
         return response.data;
      } catch (error) {
         console.error("Error fetching historical data:", error);
         return [];
      }
   }

   static async getEntries() {
      try {
         const response = await axios.get(`${this.backendUrl}/getEntries`, {
            headers: {
               'x-api-key': process.env.REACT_APP_BACKEND_API_KEY
            }
         });
         return response.data;
      } catch (error) {
         console.error("Error fetching entries:", error);
         return [];
      }
   }

   static async addEntry(address, measurements, notes) {
      try {
         await axios.post(`${this.backendUrl}/addEntry`, { address, measurements, notes }, {
            headers: {
               'x-api-key': process.env.REACT_APP_BACKEND_API_KEY
            }
         });
      } catch (error) {
         console.error("Error adding entry:", error);
      }
   }
}

export default ServerApi;



