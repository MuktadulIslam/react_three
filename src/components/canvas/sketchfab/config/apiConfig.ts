export const downloadAPIConfig = {
    clientId: 'EZOYZZxRpZ8WzgbVbVMI9258h4Gyp8nuMSJfZckw',
    clientSecret: 'FW08AMjyF66B5htjM1wKkeX6s3Et0BYl3NwEs55Up4ODpq31AMFsDNr5K7VCjGwxZ7EzcFRJ67Zxu50tiblF8UA7XAeH25pLYkmuF4t7CZRmSLqtpoyf7bTwaw2YeyJj',
    apiBaseUrl: 'https://api.sketchfab.com/v3',
    oauthBaseUrl: 'https://sketchfab.com/oauth2',
    // redirectUri: 'https://layout-playground.vercel.app/api/sketchfab/authorization',
    // redirectUri: 'http://localhost:3000/api/sketchfab/authorization',
    redirectUri: (originUrl: string) => `${originUrl}/api/sketchfab/authorization`,
};