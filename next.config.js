/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
              pathname: '**',
            },
          ],
    },
    env: {
        BASE_Login: process.env.userLogin,
        BASE_passWord: process.env.passWord,
        // BASE_URL: process.env.NEXTAUTH_URL, 
      }
}

module.exports = nextConfig
