"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation Schema with Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

interface FormValues {
  password: string;
  confirmPassword: string;
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

const RegisterForm: React.FC = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const searchParams = useSearchParams();
  const [tokencode, setTokencode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (passwordStrength < 3) {
        formik.setFieldError('password', 'Password is too weak. Use a stronger password.');
        return;
      } else {
        handleCreate(values);
      }
    },
  });

  const handleCreate = async (values: any) => {
    try {
      // const token = await new Promise<string>((resolve, reject) => {
      //   window.grecaptcha.ready(() => {
      //     window.grecaptcha
      //       .execute('6Lfgd58qAAAAAPV03W3LgVMhxu57mDL006Jr3Jhs', { action: 'submit' })
      //       .then(resolve, reject);
      //   });
      // });

      const jsonObj = { body: JSON.stringify({ token: tokencode, newPassword: values.password }) };
      const response = await fetch("https://nfgfx2bpj6.execute-api.us-east-1.amazonaws.com/ProdUser/ResetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonObj)
      });
      const data = await response.json();
      let msg = JSON.parse(data?.body);

      if (data?.statusCode === 200) {
        setToast({ message: msg?.message || 'New Password Updated Successfully', type: 'success' });
      } else {
        setToast({ message: msg?.message || 'Something went wrong', type: 'error' });
      }
      formik.resetForm();
      router.push('/login/');
    } catch (error) {
      setToast({ message: "An error occurred. Please try again later.", type: 'error' });
    } finally {
      setIsLoading(false);
      formik.resetForm();
    }
  }

useEffect(() => {
  const tokenParam = searchParams.get("token");
  setTokencode(tokenParam);
}, [searchParams]);

// Calculate password strength in real-time
useEffect(() => {
  const password = formik.values.password;
  if (!password) {
    setPasswordStrength(0);
    setStrengthLabel('');
    return;
  }

  let strength = 0;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  strength = checks.filter(Boolean).length;
  setPasswordStrength(strength);

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
  setStrengthLabel(labels[strength]);
}, [formik.values.password]);

// Get color for strength bar
const getStrengthColor = () => {
  if (passwordStrength <= 1) return '#ff4d4f';
  if (passwordStrength === 2) return '#ffa940';
  if (passwordStrength === 3) return '#52c41a';
  if (passwordStrength >= 4) return '#389e0d';
  return '#d9d9d9';
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
                    >
                      Create Password
                    </h1>

                    <form onSubmit={formik.handleSubmit}>
                      {/* Password Input */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          border: `2px solid ${(formik.touched.password && formik.errors.password) || (passwordStrength > 0 && passwordStrength < 3)
                            ? '#ff4d4f'
                            : '#ddd'
                            }`,
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
                            <rect x="3" y="11" width="18" height="13" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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

                      {passwordStrength > 0 &&
                        <div style={{ marginBottom: '1rem' }}>
                          <div
                            style={{
                              height: '8px',
                              width: '100%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              marginBottom: '0.5rem',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${(passwordStrength / 5) * 100}%`,
                                backgroundColor: getStrengthColor(),
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </div>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: getStrengthColor(),
                              fontWeight: 'bold',
                              textAlign: 'left',
                            }}
                          >
                            {formik.values.password ? `Password Strength: ${strengthLabel}` : ' '}
                          </p>
                        </div>}

                      {formik.touched.password && formik.errors.password && (
                        <p style={{ color: '#ff4d4f', fontSize: '0.875rem', margin: '0.25rem 0 1rem', textAlign: 'left' }}>
                          {formik.errors.password}
                        </p>
                      )}

                      {/* Confirm Password Input */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          border: `2px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword ? '#ff4d4f' : '#ddd'
                            }`,
                          borderRadius: '8px',
                          marginBottom: '1.5rem',
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
                            <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p style={{ color: '#ff4d4f', fontSize: '0.875rem', margin: '0.25rem 0 1rem', textAlign: 'left' }}>
                          {formik.errors.confirmPassword}
                        </p>
                      )}

                      {/* Register Button */}
                      <button
                        type="submit"
                        disabled={formik.isSubmitting || passwordStrength < 3}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: 'white',
                          background: 'linear-gradient(to right, #008C7A, #006B5C)',
                          border: 'none',
                          borderRadius: '50px',
                          cursor: formik.isSubmitting || passwordStrength < 3 ? 'not-allowed' : 'pointer',
                          opacity: formik.isSubmitting || passwordStrength < 3 ? 0.7 : 1,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) =>
                          !formik.isSubmitting &&
                          passwordStrength >= 3 &&
                          (e.currentTarget.style.transform = 'scale(1.02)')
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {formik.isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </form>
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

export default RegisterForm;