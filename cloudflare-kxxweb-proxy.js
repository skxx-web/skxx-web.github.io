export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const origin = new URL(request.url);
    origin.protocol = "https:";
    origin.hostname = "skxx-web-github-io.pages.dev";
    origin.port = "";

    const headers = new Headers(request.headers);
    headers.set("Host", origin.hostname);
    headers.set("X-Forwarded-Host", incoming.hostname);

    return fetch(new Request(origin, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "follow",
    }));
  },
};
