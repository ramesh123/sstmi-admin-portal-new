"use client";
import { useEffect, useState } from "react";
//import { makeSignedRequest } from './../layout-client';
import { useRouter } from 'next/navigation';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const log = (...args: unknown[]): void => {
  if (process.env.NEXT_PUBLIC_CONSOLE_LOG === 'on') {
    console.log(...args);
  }
};

// Simple Toast Component
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

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getUsernameFromEmail = (email: string) => {
    if (!email) return '';
    const [username] = email.split('@');
    return username;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setToast({ message: 'Please enter both email and password', type: 'error' });
      return;
    }

    setIsLoading(true);
    // setMessage("");

    log("Form submission started");

    try {
      // if (typeof window.grecaptcha === 'undefined') {
      //   throw new Error('reCAPTCHA has not loaded');
      // }

      // const token = await new Promise<string>((resolve, reject) => {
      //   window.grecaptcha.ready(() => {
      //     window.grecaptcha.execute('6Lfgd58qAAAAAPV03W3LgVMhxu57mDL006Jr3Jhs', { action: 'submit' })
      //       .then(resolve, reject);
      //   });
      // });

      // log("reCAPTCHA token obtained:", token);

      const apiEndpoint = "https://nfgfx2bpj6.execute-api.us-east-1.amazonaws.com/ProdUser/user/login";

      const body = {
        action: "LoginUser",
        user: {
          UserId: formData.email,
          Password: formData.password,
        },
        // token: token,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      let msg = JSON.parse(data?.body);
      if (data?.statusCode === 200) {
        //let username = getUsernameFromEmail(formData.email);
        let user = { name: msg?.name, email: formData.email, roleid: msg?.roleid }
        sessionStorage.setItem('adminuser', JSON.stringify(user));
        sessionStorage.setItem('token', 'token');
        setToast({ message: msg?.message, type: 'success' });
        handleServices();
      } else {
        setToast({ message: msg?.message, type: 'error' });
      }
    } catch (error) {
      setToast({ message: "An error occurred. Please try again later.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  const handleForgotPassword = () => {
    router.push('/forgotpassword/');
  };
  const handleServices = () => {
    router.push('/admin.html');
  };

  useEffect(() => {
      const user = sessionStorage.getItem('adminuser');
      if (user) {
        router.push('/admin');
      }
    }, [router]);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 min-h-screen">
        <div className="container mx-auto max-w-2xl px-6 py-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div style={{
              display: 'flex',
              fontFamily: 'Arial, sans-serif'
            }}>
              <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                <h1 style={{
                  fontSize: '2.0rem',
                  fontWeight: 'bold',
                  color: '#006B5C',
                  marginBottom: '2rem',
                  textAlign: 'left'
                }}>
                  SSTMI Admin Portal
                </h1>

                {/* Email Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: '#e8e8e8',
                    borderRight: '2px solid #ddd'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-Mail / User ID"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '1rem 1.25rem',
                      fontSize: '1rem',
                      color: '#666'
                    }}
                  />
                </div>

                {/* Password Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: '#e8e8e8',
                    borderRight: '2px solid #ddd'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignIn(e);
                      }
                    }}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '1rem 1.25rem',
                      fontSize: '1rem',
                      color: '#666'
                    }}
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#666'
                  }}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      style={{
                        marginRight: '0.5rem',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#006B5C',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      textDecoration: 'none'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white',
                    background: isLoading
                      ? '#9ca3af'
                      : 'linear-gradient(to right, #008C7A, #006B5C)',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}