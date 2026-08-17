const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://youtube-notes-backend-1c4w.onrender.com';

export const api = {
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  generateNotes: async (data) => {
    const response = await fetch(`${API_BASE_URL}/notes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Map the frontend's 'url' key to the backend's expected 'youtube_url' key
      body: JSON.stringify({ youtube_url: data.url }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  notesGenerate: async (data) => {
    const response = await fetch(`${API_BASE_URL}/notes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  videoProcess: async (data) => {
    const response = await fetch(`${API_BASE_URL}/video/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  submitFeedback: async (data) => {
    const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes('YOUR_SCRIPT_ID')) {
      throw new Error("Apps Script URL is not configured. Please add VITE_APPS_SCRIPT_URL to your .env file.");
    }
    
    // Map frontend fields to the Google Sheet backend expected fields
    const payload = {
      name: data.name || '',
      email: data.email || '',
      feedbackType: data.type || 'general',
      rating: data.rating || '5',
      message: data.intent 
        ? `Intent: ${data.intent}\n\nDescription: ${data.description}`
        : data.description || ''
    };

    // Using no-cors might be necessary depending on the GAS deployment, 
    // but it prevents reading the response. We will assume CORS is configured properly or handle it standardly.
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Some GAS endpoints might return 200 but contain an error message, 
    // but we will check standard HTTP status.
    if (!response.ok) {
      throw new Error("Failed to submit feedback to Google Apps Script.");
    }
    return response.json().catch(() => ({ status: 'success' }));
  }
};
