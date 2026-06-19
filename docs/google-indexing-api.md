# Google Indexing API

This site includes a protected Netlify Function for notifying Google when job posting URLs are updated or removed.

Endpoint:

```text
/.netlify/functions/google-indexing
```

Required Netlify environment variables:

```text
GOOGLE_INDEXING_CLIENT_EMAIL
GOOGLE_INDEXING_PRIVATE_KEY
GOOGLE_INDEXING_API_TOKEN
```

`GOOGLE_INDEXING_CLIENT_EMAIL` and `GOOGLE_INDEXING_PRIVATE_KEY` come from a Google Cloud service account with access to the Indexing API. The service account must also be added as an owner or full user in Google Search Console for the verified property.

`GOOGLE_INDEXING_API_TOKEN` is an internal shared secret used to protect the Netlify Function.

Notify Google that a job URL was updated:

```bash
curl -X POST "https://xpslogistics.netlify.app/.netlify/functions/google-indexing" \
  -H "content-type: application/json" \
  -H "x-indexing-token: $GOOGLE_INDEXING_API_TOKEN" \
  -d '{"url":"https://xpslogistics.netlify.app/careers/warehouse-operations-associate/","type":"URL_UPDATED"}'
```

Notify Google that a job URL was removed:

```bash
curl -X POST "https://xpslogistics.netlify.app/.netlify/functions/google-indexing" \
  -H "content-type: application/json" \
  -H "x-indexing-token: $GOOGLE_INDEXING_API_TOKEN" \
  -d '{"url":"https://xpslogistics.netlify.app/careers/warehouse-operations-associate/","type":"URL_DELETED"}'
```

Check notification status:

```bash
curl "https://xpslogistics.netlify.app/.netlify/functions/google-indexing?url=https%3A%2F%2Fxpslogistics.netlify.app%2Fcareers%2Fwarehouse-operations-associate%2F" \
  -H "x-indexing-token: $GOOGLE_INDEXING_API_TOKEN"
```

The function only accepts URLs under `/careers/`.
