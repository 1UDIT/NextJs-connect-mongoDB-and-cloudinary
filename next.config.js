/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com']
    },
    env: {
        BASE_Login: process.env.userLogin,
        BASE_passWord: process.env.passWord,
        BASE_URL: process.env.NEXTAUTH_URL, 
      }
}

module.exports = nextConfig
