import React, { useState } from 'react';
import { BetaBadge } from '../components/BetaBadge';
import { Button } from '../components/Button';
import { api } from '../api';
import { AlertCircle, FileText, Loader2, PlayCircle, Clock, Video, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { downloadNotesPdf } from '../utils/generatePdf';
import './Notes.css';

export const Notes = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [notesData, setNotesData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const isValidYoutubeUrl = (string) => {
    try {
      const parsed = new URL(string);
      return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be');
    } catch {
      return false;
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    if (!isValidYoutubeUrl(trimmedUrl)) {
      setStatus('error');
      setErrorMsg('Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=...)');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    setNotesData(null);

    try {
      const response = await api.generateNotes({ url: trimmedUrl });
      let finalNotes = response.notes;
      if (finalNotes && finalNotes.content_markdown) {
        finalNotes = finalNotes.content_markdown;
      }
      setNotesData(finalNotes || response.data || response);
      setStatus('success');
    } catch (err) {
      console.error("Error generating notes:", err);
      try {
        const fallbackResponse = await api.notesGenerate({ url: trimmedUrl });
        let fallbackNotes = fallbackResponse.notes;
        if (fallbackNotes && fallbackNotes.content_markdown) {
          fallbackNotes = fallbackNotes.content_markdown;
        }
        setNotesData(fallbackNotes || fallbackResponse.data || fallbackResponse);
        setStatus('success');
      } catch (fallbackErr) {
        setStatus('error');
        // Provide user-friendly error messages based on common scenarios
        if (fallbackErr.message.includes('timeout') || fallbackErr.message.includes('Failed to fetch')) {
          setErrorMsg('The server took too long to respond or is unavailable. Please try again later.');
        } else {
          setErrorMsg('Failed to process this video. Ensure it has captions available and is not private.');
        }
      }
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMsg('');
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !notesData || typeof notesData !== 'string') return;
    setIsGeneratingPdf(true);
    setPdfError('');
    try {
      await downloadNotesPdf(notesData);
    } catch (err) {
      console.error("[PDF] FULL ERROR:", err);
      console.error("[PDF] ERROR MESSAGE:", err?.message);
      console.error("[PDF] ERROR STACK:", err?.stack);
      setPdfError(`Failed to generate PDF: ${err?.message || 'Unknown error'}`);
    } finally {
      console.log("[PDF] finally reached");
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="notes-page bg-gradient-soft">
      <div className="container notes-container">
        
        {/* Input Section */}
        <div className="notes-header-wrapper">
          <BetaBadge className="mb-2" />
          <h1 className="notes-title">Generate Notes</h1>
          <p className="notes-subtitle">Paste any educational YouTube link below.</p>
        </div>

        <div className="notes-input-card">
          <form onSubmit={handleGenerate} className="notes-input-form">
            <div className="input-with-icon">
              <Video className="input-icon" size={20} />
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={status === 'loading'}
                required
                className="elegant-input"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="pill-btn generate-btn"
              disabled={!url.trim() || status === 'loading'}
            >
              {status === 'loading' ? 'Processing...' : 'Generate Notes'}
            </Button>
          </form>
        </div>

        {/* Content Area */}
        <div className="notes-content-area">
          
          {/* Idle State */}
          {status === 'idle' && (
            <div className="notes-empty-state">
              <div className="empty-icon-wrapper">
                <FileText size={48} className="empty-icon" />
              </div>
              <h3>Ready to Learn</h3>
              <p>Enter a YouTube URL above and we'll generate beautifully structured study notes for you.</p>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="notes-loading-state">
              <div className="loading-animation">
                <Loader2 className="spinner" size={40} />
              </div>
              <h3>Analyzing Video</h3>
              <p>Our AI is extracting the core concepts and formatting your notes. This may take a minute depending on video length.</p>
              
              <div className="skeleton-wrapper">
                <div className="skeleton-title"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-block">
                  <div className="skeleton-heading"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                </div>
                <div className="skeleton-block">
                  <div className="skeleton-heading"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="notes-error-state">
              <div className="error-icon-wrapper">
                <AlertCircle size={48} className="error-icon" />
              </div>
              <h3>Something went wrong</h3>
              <p>{errorMsg}</p>
              <Button onClick={handleRetry} variant="outline" className="mt-md pill-btn">
                Try Again
              </Button>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && notesData && (
            <div className="notes-result-card">
              <div className="notes-result-header">
                <div>
                  <h2 className="result-title">Generated Study Notes</h2>
                  <div className="result-meta">
                    <span className="meta-item"><PlayCircle size={14}/> YouTube Video</span>
                    <span className="meta-item"><Clock size={14}/> Processed by Oveka AI</span>
                  </div>
                </div>
              </div>
              
              <div className="notes-result-body">
                {typeof notesData === 'string' ? (
                  <div className="notes-markdown-container">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({node, ...props}) => (
                          <div className="table-responsive-wrapper">
                            <table {...props} />
                          </div>
                        )
                      }}
                    >
                      {notesData}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <pre className="notes-raw-data">{JSON.stringify(notesData, null, 2)}</pre>
                )}
              </div>
              
              <div className="notes-result-footer">
                {pdfError && (
                  <span className="pdf-error-msg">{pdfError}</span>
                )}
                <div className="notes-footer-actions">
                  <Button
                    variant="outline"
                    className="pill-btn pdf-download-btn"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                  >
                    {isGeneratingPdf ? (
                      <><Loader2 size={15} className="btn-spinner" /> Generating PDF…</>
                    ) : (
                      <><Download size={15} /> Download PDF</>
                    )}
                  </Button>
                  <Button variant="outline" className="pill-btn" onClick={() => {
                    setUrl('');
                    setStatus('idle');
                    setNotesData(null);
                    setPdfError('');
                  }}>
                    Process Another Video
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
