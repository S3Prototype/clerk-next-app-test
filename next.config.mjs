/** @type {import('next').NextConfig} */

const cspHeader = `
  script-src: https://clerk.example.com
  connect-src: https://clerk.example.com
  img-src: https://img.clerk.com
  worker-src: https://app.example.com
`;

// const nextConfig = {};

const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./loaderFile.js",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
