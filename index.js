export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try to serve the requested file
    let response = await env.ASSETS.fetch(request);

    // If not found and not a static asset, try to serve 404.html
    if (response.status === 404) {
      // Check if requesting a likely static file
      if (!pathname.match(/\.(html|css|js|svg|png|jpg|jpeg|gif|ico|json|xml|txt|woff|woff2)$/i)) {
        const notFoundRequest = new Request(new URL('/404.html', url));
        const notFoundResponse = await env.ASSETS.fetch(notFoundRequest);
        if (notFoundResponse.status === 200) {
          return new Response(notFoundResponse.body, {
            status: 404,
            headers: notFoundResponse.headers,
          });
        }
      }
    }

    return response;
  },
};

