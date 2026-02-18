import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Blocks the browser's getDisplayMedia() screen-share API on this page.
          // Prevents browser-based screen recording initiated from within the page itself.
          // Does NOT prevent OS-level screenshots or external screen recorders.
          {
            key: 'Permissions-Policy',
            value: 'display-capture=()',
          },
          // Prevents this page from being embedded in iframes on other domains,
          // which closes off a vector where an attacker embeds your content and
          // uses getDisplayMedia() to stream it.
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
