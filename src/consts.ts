export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://shopping-list-manager.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}