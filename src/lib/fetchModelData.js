import axiosClient from "../api/axiosClient";

async function fetchModel(url) {
  try {
    const res = await axiosClient.get(`${url}`);
    
    return { data: res.data };
  } catch (error) {
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else {
      throw error;
    }
  }
}

export default fetchModel;