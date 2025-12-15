"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Proper suppression of findDOMNode warning for React Quill
const originalError = console.error;
if (typeof window !== 'undefined') {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('findDOMNode')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
}

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

interface EmailFormData {
  to: string;
  from: string;
  subject: string;
  body: string;
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out',
        minWidth: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            marginLeft: '1rem',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const DataTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    to: '',
    from: 'noreply@sstmi.org',
    subject: '',
    body: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuillChange = (content: string) => {
    setEmailFormData(prev => ({
      ...prev,
      body: content
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const stripHtmlTags = (html: string): string => {
    if (typeof window === 'undefined') return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSendEmail = async () => {
    // Validation
    if (!emailFormData.to || !emailFormData.from || !emailFormData.subject) {
      setToast({
        message: 'Please fill in all required fields (To, From, Subject)',
        type: 'error'
      });
      return;
    }

    if (!validateEmail(emailFormData.to)) {
      setToast({
        message: 'Please enter a valid "To" email address',
        type: 'error'
      });
      return;
    }

    if (!validateEmail(emailFormData.from)) {
      setToast({
        message: 'Please enter a valid "From" email address',
        type: 'error'
      });
      return;
    }

    const plainTextBody = stripHtmlTags(emailFormData.body);
    if (!plainTextBody.trim()) {
      setToast({
        message: 'Email body cannot be empty',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      const jsonObj = { sender:"noreply@sstmi.org",recipient: emailFormData.to, subject: emailFormData.subject, body_text: stripHtmlTags(emailFormData.body), body_html: emailFormData.body };
      const response = await fetch("https://u2b0w593t4.execute-api.us-east-1.amazonaws.com/Prod/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonObj)
      });
      const data = await response.json();
      console.log("data",data);
      if (data?.statusCode === 200) {
        setToast({ message: 'Email sent successfully!', type: 'success' });
        setEmailFormData({
        to: '',
        from: '',
        subject: '',
        body: ''
      });
      } else {
        setToast({ message: 'Failed to send email. Please try again.', type: 'error' });
      }       

    } catch (error) {
     // console.error('Error sending email:', error);
      setToast({
        message: 'Failed to send email. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],  // Added 'image' here
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link'
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ 
        maxWidth: '900px', 
        margin: '2rem auto', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          Send Email
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* To Field */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              To <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="to"
              value={emailFormData.to}
              onChange={handleEmailInputChange}
              placeholder="recipient@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* From Field */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              From <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="from"
              value={emailFormData.from}
              onChange={handleEmailInputChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              readOnly
            />
          </div>

          {/* Subject Field */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Subject <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={emailFormData.subject}
              onChange={handleEmailInputChange}
              placeholder="Enter email subject"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* React Quill Editor */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Message <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <ReactQuill
                theme="snow"
                value={emailFormData.body}
                onChange={handleQuillChange}
                modules={modules}
                formats={formats}
                placeholder="Enter your message here..."
                style={{
                  minHeight: '250px',
                  backgroundColor: 'white'
                }}
              />
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              {stripHtmlTags(emailFormData.body).length} characters
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: isLoading ? '#9ca3af' : '#6366f1',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '500',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#6366f1';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Sending...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Send Email
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .ql-container {
          font-family: inherit;
          font-size: 1rem;
          min-height: 200px;
        }
        
        .ql-editor {
          min-height: 200px;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </>
  );
};

export default DataTable;