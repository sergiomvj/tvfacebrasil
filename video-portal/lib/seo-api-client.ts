
const SEO_API_URL = process.env.SEO_API_URL;
const SEO_API_KEY = process.env.SEO_API_KEY;

export class SEOAPIClient {
    private baseURL: string;
    private apiKey: string;

    constructor() {
        if (!SEO_API_URL || !SEO_API_KEY) {
            throw new Error("SEO_API_URL and SEO_API_KEY must be defined in environment variables.");
        }
        this.baseURL = SEO_API_URL;
        this.apiKey = SEO_API_KEY;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}/api/v1${endpoint}`;
        const headers = {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`SEO API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json() as T;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    async getMe(): Promise<any> {
        return this.request('/auth/me');
    }

    // Add more methods here as needed for keywords, rankings, etc.
}

export const seoClient = new SEOAPIClient();
