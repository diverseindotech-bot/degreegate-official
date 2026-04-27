import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { firstName, lastName, email, university, country } = data;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Brevo API key not configured on server." })
      };
    }

    try {
      await axios.post(
        "https://api.brevo.com/v3/contacts",
        {
          email,
          attributes: {
            FIRSTNAME: firstName,
            LASTNAME: lastName,
            UNIVERSITY: university,
            COUNTRY: country,
          }
        },
        {
          headers: {
            'api-key': apiKey,
            'content-type': 'application/json'
          }
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Welcome to DegreeGate Gateway. Check your inbox soon." })
      };
    } catch (error: any) {
      if (error.response?.data?.code === 'duplicate_parameter') {
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: "Welcome back! You're already part of the Gateway." })
        };
      }
      return {
        statusCode: error.response?.status || 500,
        body: JSON.stringify({ error: "Failed to connect to gateway protocol." })
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request payload." })
    };
  }
};
