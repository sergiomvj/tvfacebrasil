
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

async function testSeoConnection() {
    console.log('Testing SEO API connection...');
    console.log('SEO_API_URL:', process.env.SEO_API_URL);

    // Dynamic import to ensure env vars are loaded first
    try {
        const { SEOAPIClient } = await import('../lib/seo-api-client');
        const client = new SEOAPIClient();
        const me = await client.getMe();
        console.log('Connection successful!');
        console.log('Authenticated User:', me);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
}

testSeoConnection();
