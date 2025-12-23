import { createUserData } from '~/models/user-data';

// Define allowed origins
const ALLOWED_ORIGINS = ['https://www.acmecorp.com'];

// Helper function to create CORS headers
const corsHeaders = origin => {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
};

// Loader to handle OPTIONS (preflight) requests
export const loader = async ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
};

export const action = async ({ request }) => {
  const origin = request.headers.get('Origin');

  try {
    const body = await request.json();

    if (!body.target || !body.region || !body.ttfb || !body.timings) {
      throw new Response('Missing data', { status: 400 });
    }

    const { target, region, ttfb, timings } = body;
    const record = await createUserData({ target, region, ttfb, timings });
    return Response.json(record, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  } catch (err) {
    console.log(`Failed to save user data:`, err);
    return Response.json(
      { error: err?.message || 'Failed to save user data' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin),
        },
      }
    );
  }
};
