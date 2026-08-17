const fetch = globalThis.fetch || require('node-fetch');

async function testBackend() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const endpoints = ['/generate-notes', '/notes/generate', '/video/process', '/api/notes', '/api/generate'];
  const baseUrl = 'https://youtube-notes-backend-1c4w.onrender.com';

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: url })
      });
      
      console.log(`Status: ${response.status}`);
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        console.log(`Response JSON keys:`, Object.keys(json));
        console.log(`Preview:`, JSON.stringify(json).substring(0, 300));
        if (response.ok) {
          console.log(`✅ SUCCESS on ${endpoint}`);
        }
      } catch (e) {
        console.log(`Response text preview:`, text.substring(0, 100));
      }
    } catch (err) {
      console.error(`Error:`, err.message);
    }
    console.log('---');
  }
}

testBackend();
