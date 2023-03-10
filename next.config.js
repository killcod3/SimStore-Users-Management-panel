module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'https://localhost:3000/api/v1/auth' // development api
            : 'https://localhost:3000/api/v1/auth' // production api
    }
}
