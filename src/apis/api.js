import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': process.env.REACT_APP_SECRET_KEY,
  },
});

export const triggerSMSCampaign = async (data) => {
    try{
        const response = await api.post('/send-sms-campaign', data);
        return response.data;
    }catch(error){
        console.error("Error triggering SMS campaign:", error);
        throw error; // Re-throw the error to handle it in the calling function if needed
    }
};

export const getSMSListing = async () => {
  const response = await api.get('/sms-listing');
  return response.data;
};
