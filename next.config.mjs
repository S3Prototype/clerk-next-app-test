/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./loaderFile.js",
  },
};

export default nextConfig;
