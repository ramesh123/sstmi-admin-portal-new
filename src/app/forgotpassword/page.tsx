"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation Schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

interface FormValues {
  email: string;
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

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleForgotPassword(values);
    },
  });

  const handleForgotPassword = async (values: FormValues) => {
    if (!values.email) {
      setToast({ message: 'Please enter valid email', type: 'error' });
      return;
    }
    setIsLoading(true);
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

     const jsonObj = { body: JSON.stringify({ email:values.email }) };   
      const response = await fetch("https://nfgfx2bpj6.execute-api.us-east-1.amazonaws.com/ProdUser/ForgotPassword", {
      method: "POST",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonObj)
      });
      const data = await response.json();
      let msg = JSON.parse(data?.body);
      if (data?.statusCode === 200) {
      setToast({ message: msg?.message || 'Password reset link sent!', type: 'success' });
      } else {
      setToast({ message: msg?.message || 'Something went wrong', type: 'error' });
      }
      formik.resetForm();
    } catch (error) {
      setToast({ message: "An error occurred. Please try again later.", type: 'error' });
    } finally {
      setIsLoading(false);
      formik.resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

const handleLogin = () => {
    router.push('/login/');
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="gradient-background">
        <div className="bg-gradient-to-b from-golden-gradient-start via-golden-gradient-middle to-golden-gradient-end text-darkRed min-h-screen">
          <div className="container mx-auto max-w-2xl">
            <div className="container mx-auto py-12 px-6">
              <section className="mb-16">
                <div id="newsletter" className="bg-white p-6 rounded-lg shadow-lg">
                  <div style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                      <h1
                        style={{
                          fontSize: '2.0rem',
                          fontWeight: 'bold',
                          color: '#006B5C',
                          marginBottom: '2rem',
                          textAlign: 'left',
                        }}
                      >Forgot Password</h1>

                      <div onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            border: `2px solid ${formik.touched.email && formik.errors.email ? '#ff4d4f' : '#ddd'}`,
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              padding: '1rem 1.25rem',
                              backgroundColor: '#e8e8e8',
                              borderRight: '2px solid #ddd',
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSubmit(e);
                              }
                            }}
                            style={{
                              flex: 1,
                              border: 'none',
                              outline: 'none',
                              padding: '1rem 1.25rem',
                              fontSize: '1rem',
                              color: '#666',
                            }}
                          />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                          <p style={{ color: '#ff4d4f', fontSize: '0.875rem', margin: '0.25rem 0 1.5rem', textAlign: 'left' }}>
                            {formik.errors.email}
                          </p>
                        )}

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() => formik.handleSubmit()}
                          disabled={formik.isSubmitting}
                          style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: 'white',
                            background: 'linear-gradient(to right, #008C7A, #006B5C)',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: formik.isSubmitting ? 0.7 : 1,
                            transition: 'all 0.2s',
                            marginTop: '1rem'
                          }}
                          onMouseEnter={(e) =>
                            !formik.isSubmitting &&
                            (e.currentTarget.style.transform = 'scale(1.02)')
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        {/* Back to Login Link */}
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                          <a
                            href="javascript:void(0);"
                            onClick={handleLogin}
                            style={{
                              color: '#006B5C',
                              textDecoration: 'none',
                              fontSize: '0.95rem',
                              fontWeight: '500'
                            }}
                          >
                            ← Back to Login
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ForgotPassword;