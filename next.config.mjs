/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["reqres.in"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxudxe8oc/**",
      },
    ],
  },
};

export default nextConfig;
