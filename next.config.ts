const nextConfig = {
  images: {
    domains: ['static.vecteezy.com'], // Add this line
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
