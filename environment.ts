

export const env: any = {
    ENV: process.env.ENV,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_USER_NAME: process.env.DB_USER_NAME,
    DB_NAME: process.env.DB_NAME,
    // JWT_SECRET is retained for backwards compatibility; current deployments use AUTH_SECRET.
    JWT_SECRET: process.env.JWT_SECRET || process.env.AUTH_SECRET || process.env.SESSION_SECRET,

    // Cloudinary is used for all server-side image uploads.
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_SYSTEM_USER_TOKEN: process.env.WHATSAPP_SYSTEM_USER_TOKEN,
    WHATSAPP_API_WEBHOOK_TOKEN: process.env.WHATSAPP_API_WEBHOOK_TOKEN,

    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET:process.env.RAZORPAY_WEBHOOK_SECRET,
    YOUR_RAZORPAY_VIRTUAL_ACCOUNT: process.env.YOUR_RAZORPAY_VIRTUAL_ACCOUNT,

    PUBLIC_GOOGLE_MAPS_API_KEY:process.env.PUBLIC_GOOGLE_MAPS_API_KEY,

    IMAGE_UPI_QR: "upi-qr",
    IMAGE_PROPERTIES: "properties",
}
