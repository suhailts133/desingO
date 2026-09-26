export const allowedOrigins: string[] = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((url) => url.trim()) : ["http://localhost:5173"];
