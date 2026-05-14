export const handler = async () => {
  const clarityID = process.env.CLARITY_PROJECT_ID;

  if (!clarityID) {
    return {
      statusCode: 500,
      body: "// Missing CLARITY_PROJECT_ID",
    };
  }

  const upstream = `https://www.clarity.ms/tag/${encodeURIComponent(clarityID)}`;
  const res = await fetch(upstream, {
    headers: {
      Accept: "application/javascript, text/javascript;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    return {
      statusCode: 500,
      body: `// Failed to fetch Clarity tag: ${res.status}`,
    };
  }

  const js = await res.text();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      Vary: "Accept",
    },
    body: js,
  };
};
