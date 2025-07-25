import { NextResponse } from 'next/server';

import { fetchMarchesPublicsYearlyCounts } from '@/utils/fetchers/marches-publics/fetchMarchesPublicsYearlyCounts-server';

export async function GET(_: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const data = await fetchMarchesPublicsYearlyCounts(siren);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching marches publics yearly counts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
