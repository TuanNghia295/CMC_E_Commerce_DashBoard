/**
 * Fix avatar URL from backend
 * Backend returns URLs with port 3001, but we need to use the API base URL
 */
export const getAvatarUrl = (avatarUrl: string | null | undefined): string | null => {
  if (!avatarUrl) return null;

  // If it's already a full S3 URL, return as is
  if (avatarUrl.startsWith('https://') && avatarUrl.includes('amazonaws.com')) {
    return avatarUrl;
  }

  // If it's a localhost URL with port 3001, replace with correct API base
  if (avatarUrl.includes('localhost:3001')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Extract the base URL without /api/v1
    const baseUrl = apiBaseUrl.replace('/api/v1', '');

    // Replace localhost:3001 with the correct base URL
    return avatarUrl.replace('http://localhost:3001', baseUrl);
  }

  // If it's a relative path, prepend the base URL
  if (avatarUrl.startsWith('/')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const baseUrl = apiBaseUrl.replace('/api/v1', '');
    return `${baseUrl}${avatarUrl}`;
  }

  return avatarUrl;
};
