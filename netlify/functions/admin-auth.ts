import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    let adminPassword = process.env.ADMIN_PASSWORD;

    // Tactical Fallback for easier setup (consistent with server.ts)
    if (!adminPassword) {
      console.warn("[SIGNAL WARNING] ADMIN_PASSWORD not set in Netlify. Using tactical fallback 'tactical123'");
      adminPassword = "tactical123";
    }

    if (password === adminPassword) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, token: "tactical-session-" + Date.now() }),
      };
    } else {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "REJECTED. Authentication signal mismatch." }),
      };
    }
  } catch (error) {
    console.error('Netlify auth function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Internal processing failure." }),
    };
  }
};
