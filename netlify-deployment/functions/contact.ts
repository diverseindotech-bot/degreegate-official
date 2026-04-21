import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { firstName, lastName, university, email, target, payload } = data;

    // Log extraction request to the Netlify Function logs
    console.log(`[NETLIFY EXTRACTION SIGNAL RECEIVED]`);
    console.log(`- TARGET ACCOUNT  : help@degreegate.com`);
    console.log(`- PERSONNEL       : ${firstName} ${lastName}`);
    console.log(`- UNIVERSITY      : ${university}`);
    console.log(`- INTEL PATH      : ${email}`);
    console.log(`- DEPLOYMENT     : ${target}`);
    console.log(`- PAYLOAD         : ${payload}`);

    /**
     * MISSION NOTE:
     * To automate email alerts, integrate a service like Resend or SendGrid here
     * using Netlify environment variables.
     */

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: "SUCCESS", 
        message: "Signal locked. Intelligence routed via Netlify Edge." 
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: "ERROR", message: "Failed to process signal payload." }),
    };
  }
};
