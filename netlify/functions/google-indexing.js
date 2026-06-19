const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const PUBLISH_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const METADATA_URL = 'https://indexing.googleapis.com/v3/urlNotifications/metadata';
const SCOPE = 'https://www.googleapis.com/auth/indexing';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
  body: JSON.stringify(body),
});

const base64url = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const assertConfig = () => {
  const required = [
    'GOOGLE_INDEXING_CLIENT_EMAIL',
    'GOOGLE_INDEXING_PRIVATE_KEY',
    'GOOGLE_INDEXING_API_TOKEN',
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

const getBearerToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const claim = {
    iss: process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsignedJwt = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY.replace(/\\n/g, '\n');
  const crypto = await import('node:crypto');
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsignedJwt)
    .sign(privateKey);
  const jwt = `${unsignedJwt}.${base64url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Failed to get Google access token');
  }

  return data.access_token;
};

const parseBody = (event) => {
  if (!event.body) return {};

  try {
    return JSON.parse(event.body);
  } catch {
    throw new Error('Request body must be valid JSON');
  }
};

const getSiteOrigin = (event) => {
  const configured = process.env.URL || process.env.DEPLOY_PRIME_URL || `https://${event.headers.host}`;
  return new URL(configured).origin;
};

const validateUrl = (event, rawUrl) => {
  if (!rawUrl) {
    throw new Error('Missing required `url` value');
  }

  const siteOrigin = getSiteOrigin(event);
  const url = new URL(rawUrl, siteOrigin);

  if (url.origin !== siteOrigin) {
    throw new Error(`URL must belong to ${siteOrigin}`);
  }

  if (!url.pathname.startsWith('/careers/')) {
    throw new Error('Indexing API submissions are limited to careers URLs');
  }

  return url.toString();
};

const authorize = (event) => {
  const configuredToken = process.env.GOOGLE_INDEXING_API_TOKEN;
  const headerToken =
    event.headers['x-indexing-token'] ||
    event.headers['X-Indexing-Token'] ||
    (event.headers.authorization || '').replace(/^Bearer\s+/i, '');

  if (!configuredToken || headerToken !== configuredToken) {
    return false;
  }

  return true;
};

exports.handler = async (event) => {
  try {
    assertConfig();

    if (!authorize(event)) {
      return json(401, { error: 'Unauthorized' });
    }

    const accessToken = await getBearerToken();

    if (event.httpMethod === 'GET') {
      const url = validateUrl(event, event.queryStringParameters && event.queryStringParameters.url);
      const response = await fetch(`${METADATA_URL}?url=${encodeURIComponent(url)}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      return json(response.status, data);
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const body = parseBody(event);
    const url = validateUrl(event, body.url);
    const type = body.type || 'URL_UPDATED';

    if (!['URL_UPDATED', 'URL_DELETED'].includes(type)) {
      return json(400, { error: '`type` must be URL_UPDATED or URL_DELETED' });
    }

    const response = await fetch(PUBLISH_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
    });
    const data = await response.json();

    return json(response.status, data);
  } catch (error) {
    return json(400, { error: error.message });
  }
};
