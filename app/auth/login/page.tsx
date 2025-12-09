/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(auth)/login/page.tsx
'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Cek jika sudah login, redirect ke home - DENGAN VALIDASI TOKEN
  useEffect(() => {
    const checkAndValidateAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Validasi token dengan endpoint protected
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://padicheckai-backend-production.up.railway.app'}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          // Redirect berdasarkan role
          const userRole = userData.role?.toLowerCase();
          switch (userRole) {
            case 'admin':
              router.push('/home');
              break;
            default:
              router.push('/home');
          }
        } else {
          // Token tidak valid, hapus
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('userRole');
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userRole');
        setIsCheckingAuth(false);
      }
    };

    checkAndValidateAuth();
  }, [router]);

  // Fungsi untuk menyimpan auth data
  const saveAuthData = (token: string, userData: any, remember: boolean) => {
    if (remember) {
      // Simpan di localStorage (tahan lama)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role?.toLowerCase() || '');
      localStorage.setItem('auth_timestamp', Date.now().toString());
      localStorage.setItem('rememberMe', 'true');
      
      // Hapus dari sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userRole');
    } else {
      // Simpan di sessionStorage (hanya untuk session)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('userRole', userData.role?.toLowerCase() || '');
      
      // Hapus dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('auth_timestamp');
      localStorage.removeItem('rememberMe');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    // Validasi input
    if (!formData.email || !formData.password) {
      setStatus("error");
      setMessage('Email dan password harus diisi');
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus("error");
      setMessage('Format email tidak valid');
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://padicheckai-backend-production.up.railway.app';
      
      // Menggunakan format x-www-form-urlencoded sesuai contoh
      const formDataEncoded = new URLSearchParams();
      formDataEncoded.append('email', formData.email.trim());
      formDataEncoded.append('password', formData.password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formDataEncoded,
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Login gagal');
      }

      if (!result.accessToken) {
        throw new Error('Token tidak ditemukan dalam response');
      }

      // Simpan data auth
      saveAuthData(result.accessToken, result.user, rememberMe);

      setStatus("success");
      setMessage(result.message || 'Login berhasil!');

      // Reset form
      setFormData({
        email: '',
        password: '',
      });

      // Redirect berdasarkan role
      const userRole = result.user.role?.toLowerCase();
      console.log('User role:', userRole);
      
      // Gunakan router.replace untuk menghindari history stack
      switch (userRole) {
        case 'admin':
          setTimeout(() => router.replace('/home'), 500);
          break;
        default:
          setStatus("error");
          setMessage('Role tidak dikenali: ' + userRole);
          setTimeout(() => setStatus("idle"), 4000);
          return;
      }

    } catch (error: unknown) {
      console.error('Login error:', error);
      setStatus("error");
      const errMsg = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat login. Silakan coba lagi.';
      setMessage(errMsg);
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Tampilkan loading saat mengecek auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md">
        {/* Logo Section */}
        <div className="px-6 pt-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">PadiCheck AI</h1>
              <p className="text-sm text-gray-500 mt-1">Disease Detection System</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Selamat Datang</h2>
            <p className="text-gray-600 text-sm md:text-base">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                    className="block w-full pl-10 pr-3 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                    placeholder="contoh@email.com"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Kata Sandi
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs text-emerald-600 hover:text-emerald-500 font-medium"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                    className="block w-full pl-10 pr-12 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={status === "loading"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={status === "loading"}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">Ingat saya</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`
                w-full py-4 px-4 rounded-lg font-semibold text-base
                transition-all duration-200
                flex items-center justify-center gap-2
                ${status === "loading"
                  ? 'bg-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white'
                }
                active:transform active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>

            {/* Demo Credentials Hint (Mobile Only) */}
            <div className="lg:hidden bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Demo:</span> demo@example.com / demo123
              </p>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Belum punya akun?{' '}
              <Link 
                href="/auth/register" 
                className="text-emerald-600 font-semibold hover:text-emerald-500 hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} PadiCheck AI. Semua hak dilindungi.
          </p>
        </div>
      </div>

      {/* Responsive CSS untuk mencegah zoom di iOS */}
      <style jsx global>{`
        /* Pastikan input tidak zoom di iOS */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* Improve touch targets */
          button, 
          [role="button"], 
          input[type="submit"], 
          input[type="reset"] {
            min-height: 44px;
          }
        }
        
        /* Improve form accessibility */
        input:focus, 
        button:focus {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
        }
      `}</style>
    </div>
  );
}