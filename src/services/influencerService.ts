import axios from 'axios';

export interface InfluencerMatchRequest {
  link: string;
}

export interface InfluencerRanking {
  id?: string | number;
  rank?: number;
  name: string;
  matchScore: number;
  avatarUrl?: string;
  profileUrl?: string;
  category?: string;
  followers?: string;
  reason?: string;
}

const WEBHOOK_URL = 'http://localhost:5678/webhook-test/influencer-match';

export const getInfluencerMatches = async (data: InfluencerMatchRequest): Promise<InfluencerRanking[]> => {
  try {
    const response = await axios.post(WEBHOOK_URL, data);
    let resData = response;
    console.log("Raw N8N Response:", resData);

    // Robust recursive function to drill down and find the actual array of influencers
    const extractData = (data: any): any[] | null => {
      if (!data) return null;

      // Unpack stringified JSON
      if (typeof data === 'string') {
        try {
          return extractData(JSON.parse(data));
        } catch (e) {
          return null;
        }
      }

      if (Array.isArray(data)) {
        if (data.length === 0) return data;

        // If it's an array containing a single stringified JSON (common in N8N)
        if (data.length === 1 && typeof data[0] === 'string') {
          return extractData(data[0]);
        }

        if (typeof data[0] === 'object' && data[0] !== null) {
          // Check if this array actually contains the influencers
          if ('Avater' in data[0] || 'nickname' in data[0] || 'score' in data[0] || 'name' in data[0]) {
            return data;
          }
          // Check for structure like: [ { data: [...] } ]
          if ('data' in data[0]) {
            return extractData(data[0].data);
          }
          // Check for nested arrays: [ [ { ... } ] ]
          if (Array.isArray(data[0])) {
            return extractData(data[0]);
          }
        }
        return data; // Return it anyway if we can't find a better structure
      }

      // If it's a root object with { data: [...] }
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data.data)) {
          return extractData(data.data);
        }
        // Fallback: looking for the first array in the object values
        const possibleArray = Object.values(data).find(val => Array.isArray(val));
        if (possibleArray) {
          return extractData(possibleArray);
        }
      }

      return null;
    };

    let rawData = extractData(resData) || [];
    if (!Array.isArray(rawData)) rawData = [rawData].filter(Boolean);

    console.log("Extracted Array for mapping:", rawData);

    // Map fields from received payload
    let rankings: InfluencerRanking[] = rawData.map((item, index) => {
      // Fix string values that might act as empty indicators
      const avatar = item.Avater && item.Avater !== "N/A" && typeof item.Avater === 'string' && item.Avater.startsWith('http') ? item.Avater : '';
      const profile = item.Tiktok_Profile && item.Tiktok_Profile !== "N/A" && typeof item.Tiktok_Profile === 'string' && item.Tiktok_Profile.startsWith('http') ? item.Tiktok_Profile : '';

      return {
        id: item.id || `influencer-${index}`,
        name: item.nickname || item.name || 'Unknown Influencer',
        matchScore: item.score || item.matchScore || 0,
        avatarUrl: avatar || item.avatarUrl || '',
        profileUrl: profile || item.profileUrl || '',
        reason: item.reason || '',
        category: item.category || '',
        followers: item.followers || ''
      };
    });

    // Sort by match score descending to enforce ranking just in case
    rankings.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // Assign rank
    return rankings.map((influencer, index) => ({
      ...influencer,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Failed to get influencer matches:', error);
    throw error;
  }
};
