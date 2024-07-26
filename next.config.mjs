/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
        buildActivity: true,
    },
    // Otras configuraciones aquí
    async redirects() {
        return [
            {
                source: '/',
                destination: '/sign-in',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;