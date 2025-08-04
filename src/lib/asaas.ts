
import axios from "axios";

const apiKey = process.env.ASAAS_API_KEY;
const apiUrl = process.env.ASAAS_API_URL

if (!apiKey || !apiUrl) {
    throw new Error("ASaas API key or URL is not defined");
}

export const asaasApi = axios.create({
    baseURL: apiUrl,
    headers: {
        access_token: apiKey,
    }

})