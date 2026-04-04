import axios from "axios"; 

const BASE_URL = "http://localhost:8000";

async function fetchModel(url) {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    
    return { data: response.data };
  } catch (error) {
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else {
      throw error;
    }
  }
}

export default fetchModel;