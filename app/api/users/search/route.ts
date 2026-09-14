import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7rniavv5.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_fbe25dbdbcb2578a0bc8213c1f388426';

function getCountryFlag(countryCode?: string): string {
  switch (countryCode?.toUpperCase()) {
    case 'ZA':
      return '🇿🇦';
    case 'NG':
      return '🇳🇬';
    case 'KE':
      return '🇰🇪';
    case 'GH':
      return '🇬🇭';
    case 'SN':
      return '🇸🇳';
    case 'RW':
      return '🇷🇼';
    default:
      return '🌍';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = (searchParams.get('q') || '').trim();
    const currentUserId = (searchParams.get('currentUserId') || '').trim();
    const currentUserEmail = (searchParams.get('currentUserEmail') || '').trim().toLowerCase();

    const cleanQuery = rawQuery.replace(/^@/, '').toLowerCase();

    // Query InsForge /api/auth/users (up to 100 users)
    const insforgeUrl = `${baseUrl}/api/auth/users?limit=100`;

    let rawUsers: any[] = [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(insforgeUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json?.data)) {
          rawUsers = json.data;
        }
      } else {
        console.warn('InsForge /api/auth/users returned status:', response.status);
      }
    } catch (fetchErr) {
      console.warn('Error fetching from InsForge /api/auth/users:', fetchErr);
    }

    // Filter out current user and map to DiscoverableContact format
    const realUsers = rawUsers
      .filter((u) => {
        if (!u || !u.id) return false;
        // Exclude current user
        if (currentUserId && u.id === currentUserId) return false;
        if (currentUserEmail && u.email?.toLowerCase() === currentUserEmail) return false;
        return true;
      })
      .map((u) => {
        const profile = u.profile || {};
        const userName = profile.name || u.name || u.email?.split('@')[0] || 'Yethu User';
        const rawHandle = profile.handle || `@${userName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
        const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
        const countryCode = profile.countryCode || profile.country_code || 'ZA';
        const country = profile.country || (countryCode === 'ZA' ? 'South Africa' : 'Pan-African');
        const language = profile.nativeLanguage || profile.native_language || profile.language || 'isiXhosa / English';
        const bio = profile.bio || 'Afropolitan creator on Yethu Live.';
        const avatar = profile.avatar_url || profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

        return {
          id: u.id,
          name: userName,
          handle,
          email: u.email,
          avatar,
          country,
          countryCode,
          countryFlag: getCountryFlag(countryCode),
          language,
          bio,
          isCreator: true,
          createdAt: u.createdAt,
        };
      });

    // Secondary filter if search query is present
    const filtered = cleanQuery
      ? realUsers.filter((u) => {
          const matchName = u.name.toLowerCase().includes(cleanQuery);
          const matchHandle = u.handle.toLowerCase().replace('@', '').includes(cleanQuery);
          const matchEmail = u.email?.toLowerCase().includes(cleanQuery);
          const matchCountry = u.country.toLowerCase().includes(cleanQuery);
          const matchLanguage = u.language.toLowerCase().includes(cleanQuery);
          return matchName || matchHandle || matchEmail || matchCountry || matchLanguage;
        })
      : realUsers;

    return NextResponse.json({
      users: filtered,
      count: filtered.length,
    });
  } catch (err: any) {
    console.error('Users search API route error:', err);
    return NextResponse.json(
      { users: [], error: err?.message || 'Failed to search users' },
      { status: 500 }
    );
  }
}
