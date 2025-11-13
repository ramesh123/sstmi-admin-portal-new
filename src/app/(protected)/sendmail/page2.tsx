"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';

interface User {
  RoleId: number;
  UserId: string;
  IsActive: boolean;
  CreatedAt: string;
  Email: string;
  Name: string;
}

interface SortConfig {
  key: keyof User | null;
  direction: 'asc' | 'desc';
}

interface EmailFormData {
  to: string;
  from: string;
  subject: string;
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    to: '',
    from: '',
    subject: ''
  });
  const editorRef = useRef<any>(null);

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!editorRef.current) {
      setToast({
        message: 'Editor is not initialized',
        type: 'error'
      });
      return;
    }

    const emailBody = editorRef.current.getContent();
    
    if (!emailBody.trim() || emailBody === '<p></p>' || emailBody === '') {
      setToast({
        message: 'Email body cannot be empty',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Replace this with your actual API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailFormData.to,
          from: emailFormData.from,
          subject: emailFormData.subject,
          body: emailBody,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();

      setToast({
        message: 'Email sent successfully!',
        type: 'success'
      });

      // Reset form
      setEmailFormData({
        to: '',
        from: '',
        subject: ''
      });
      
      if (editorRef.current) {
        editorRef.current.setContent('');
      }

    } catch (error) {
      console.error('Error sending email:', error);
      setToast({
        message: 'Failed to send email. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Component initialization logic
  }, []);

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
              placeholder="sender@example.com"
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

          {/* TinyMCE Editor */}
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
            <Editor
              apiKey="no-api-key"
              onInit={(evt, editor) => editorRef.current = editor}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                branding: false
              }}
            />
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
      `}</style>
    </>
  );
};

export default DataTable;