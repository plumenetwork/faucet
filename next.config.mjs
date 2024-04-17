/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.plumenetwork.xyz",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
