export async function GET() {
  const content = 'google.com, pub-7108121674893713, DIRECT, f08c47fec0942fa0';
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
