// Get FastAPI backend URL from environment variable or use default
const FASTAPI_URL = process.env.NEXT_PUBLIC_FAST_API || 'http://127.0.0.1:8000';

const nextConfig = {
  reactStrictMode: false,
  distDir: ".next-build",
  output: "standalone",

  // Allow cross-origin requests in development (Electron loads from dynamic ports)
  allowedDevOrigins: ['127.0.0.1:*', 'localhost:*'],

  // Rewrites to proxy API and static asset requests to FastAPI backend
  async rewrites() {
    return [
      // Proxy all /api/v1/* routes to FastAPI
      {
        source: '/api/v1/:path*',
        destination: `${FASTAPI_URL}/api/v1/:path*`,
      },
      // Proxy all /app_data/* routes to FastAPI (fonts, images, etc.)
      {
        source: '/app_data/:path*',
        destination: `${FASTAPI_URL}/app_data/:path*`,
      },
      // Proxy all /static/* routes to FastAPI (icons, placeholders, etc.)
      {
        source: '/static/:path*',
        destination: `${FASTAPI_URL}/static/:path*`,
      },
      // Handle absolute file paths containing app_data/images (from Electron app)
      {
        source: '/:prefix*/app_data/images/:imagePath*',
        destination: `${FASTAPI_URL}/app_data/images/:imagePath*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7c765f3726084c52bcd5d180d51f1255.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "present-for-me.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "yefhrkuqbjcblofdcpnr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  
};

export default nextConfig;
