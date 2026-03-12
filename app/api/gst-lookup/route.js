import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const gstin = searchParams.get('gstin');

    if (!gstin) {
        return NextResponse.json({ error: 'GSTIN is required' }, { status: 400 });
    }

    try {
        // We use the Masters India internal API that powers their free search tool.
        // It requires a unique_id which is typically a session-based UUID.
        // For the proxy, we can use a hardcoded one or attempt to fetch a fresh session if needed.
        const uniqueId = 'K3nUOh0Sn0ZpqtfxbBcWY2M6GBnRat'; 
        const url = `https://blog-backend.mastersindia.co/api/v1/custom/search/gstin/?keyword=${gstin}&unique_id=${uniqueId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Origin': 'https://www.mastersindia.co',
                'Referer': 'https://www.mastersindia.co/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // The Masters India API returns data in a specific structure.
        // We need to handle cases where no data is found or errors are returned within the JSON.
        if (data.error) {
            return NextResponse.json({ error: data.message || 'GSTIN not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('GST Lookup Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch GST details' }, { status: 500 });
    }
}
