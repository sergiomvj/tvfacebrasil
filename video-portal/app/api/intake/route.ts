import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// We try to use the Service Role Key for admin privileges (writing to DB)
// If not available, we fall back to the Anon Key (which might be restricted by RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        // 1. Authenticate the request
        // We expect an API Key in the headers to prevent unauthorized access
        // You should add a TV_FACEBRASIL_API_KEY to your .env variables
        const apiKey = request.headers.get('x-api-key');
        const validApiKey = process.env.TV_FACEBRASIL_API_KEY || process.env.N8N_API_KEY;

        if (validApiKey && apiKey !== validApiKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse the body
        const body = await request.json();
        const { articles } = body;

        if (!articles || !Array.isArray(articles)) {
            return NextResponse.json({ error: 'Invalid payload: "articles" array is required' }, { status: 400 });
        }

        const results = [];

        // 3. Process each article
        for (const article of articles) {
            // Map the payload to the TV Facebrasil database schema
            // Based on the n8n workflow, the table is 'articles' and fields are:
            // external_id, title, url, content, score, recommended_format, analysis_result

            const mappedArticle = {
                external_id: article.id,
                title: article.titulo,
                content: article.conteudo,
                url: article.link,
                // status field removed to match current database schema
                // recommended_format removed to match current database schema
            };

            // Remove status if not sure about schema, let's try basic insert first
            // We use upsert to avoid duplicates based on external_id if it's a unique constraint
            const { data, error } = await supabase
                .from('articles')
                .upsert(mappedArticle, { onConflict: 'external_id', ignoreDuplicates: true }) // strict handling
                .select();

            if (error) {
                console.error(`Error processing article ${article.id}:`, error);
                results.push({ id: article.id, success: false, error: error.message });
            } else {
                results.push({ id: article.id, success: true });
            }
        }

        return NextResponse.json({
            message: 'Articles processed',
            details: results
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
