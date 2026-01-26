import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
            },
            timeout: 5000,
        });

        const $ = cheerio.load(response.data);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';

        return NextResponse.json({
            title,
            description,
            image,
            url
        });
    } catch (error: any) {
        console.error('Preview error:', error.message);
        return NextResponse.json({
            title: 'Preview unavailable',
            description: 'Could not fetch link preview',
            image: '',
            url
        });
    }
}
