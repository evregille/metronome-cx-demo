import { NextRequest, NextResponse } from 'next/server';

interface PredictCostRequest {
  customerId: string;
  apiKey: string;
  events: Array<{
    event_type: string;
    timestamp: string;
    properties: {
      count_seconds: number;
      cpu: string;
      instance_type: string;
      memory: string;
      type: string;
      workspace: string;
    };
  }>;
}

interface MetronomePreviewResponse {
  data: {
    line_items: Array<{
      name: string;
      total: number;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictCostRequest = await request.json();
    const { customerId, apiKey, events } = body;

    if (!events) {
      return NextResponse.json(
        { error: 'Missing required fields: events' },
        { status: 400 }
      );
    }

    // Call Metronome API
    const response = await fetch(`https://api.metronome.com/v1/customers/${customerId || process.env.METRONOME_CUSTOMER_ID}/previewEvents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || process.env.METRONOME_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Metronome API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check if the response has the expected structure
    if (!data.data || !data.data.line_items) {
      console.error('Unexpected response structure:', data);
      return NextResponse.json(
        { error: 'Unexpected response structure from Metronome API' },
        { status: 500 }
      );
    }

    // Calculate total from line items
    const total = data.data.line_items.filter(item => item.total > 0).reduce((sum: number, item: any) => sum + item.total, 0);

    const result = {
      total,
      lineItems: data.data.line_items,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error predicting cost:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 