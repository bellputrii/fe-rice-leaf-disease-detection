/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(public)/pengaturan-pengguna/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/public/Navbar';
import { User, Save, Eye, EyeOff, Loader2, X, AlertTriangle, Menu, LogOut, CheckCircle, Info, Phone, Mail, User as UserIcon, Shield } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function PengaturanPenggunaPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState('pengaturan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State untuk modal edit profil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // State untuk profil
  const [profileData, setProfileData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });

  // State untuk edit form di modal
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState({
    profile: false,
    update: false
  });

  // State untuk messages
  const [messages, setMessages] = useState<{
    error: string | null;
    success: string | null;
    modal: {
      error: string | null;
      success: string | null;
      fieldErrors: {
        fullName?: string;
        email?: string;
        phone?: string;
      };
    }
  }>({
    error: null,
    success: null,
    modal: {
      error: null,
      success: null,
      fieldErrors: {}
    }
  });

  // Function to get user role
  const getUserRole = (): string | null => {
    if (!mounted) return null;
    return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  };

  // Function to get token
  const getToken = (): string | null => {
    if (!mounted) return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Function to check if user is authenticated
  const checkAuth = (): boolean => {
    const token = getToken();
    if (!token) {
      setMessages(prev => ({ ...prev, error: 'Anda belum login. Silakan login terlebih dahulu.' }));
      setTimeout(() => router.push('/login'), 1500);
      return false;
    }
    return true;
  };

  // API Base URL
  const API_URL = 'https://padicheckai-backend-production.up.railway.app';

  // Clear messages after timeout
  const clearMessage = (type: 'error' | 'success' | 'modal.error' | 'modal.success') => {
    setTimeout(() => {
      if (type.includes('modal')) {
        setMessages(prev => ({
          ...prev,
          modal: {
            ...prev.modal,
            [type.split('.')[1] as 'error' | 'success']: null
          }
        }));
      } else {
        setMessages(prev => ({ ...prev, [type]: null }));
      }
    }, 5000);
  };

  // Fetch user profile data
  const fetchProfileData = async () => {
    if (!checkAuth()) return;

    const token = getToken();
    if (!token) {
      setMessages(prev => ({ ...prev, error: 'Token tidak ditemukan. Silakan login kembali.' }));
      return;
    }

    setLoading(prev => ({ ...prev, profile: true }));
    setMessages(prev => ({ ...prev, error: null, success: null }));

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(`${API_URL}/profiles/me`, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect
      });

      if (!response.ok) {
        if (response.status === 401) {
          setMessages(prev => ({ ...prev, error: 'Sesi Anda telah berakhir. Silakan login kembali.' }));
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('userRole');
          sessionStorage.removeItem('userRole');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const userData = result.data;
        const profile = {
          id: userData.id || '',
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'ADMIN'
        };
        
        setProfileData(profile);
        setOriginalProfileData(profile);
        
        // Save role to storage if not exists
        const currentRole = getUserRole();
        if (!currentRole && userData.role) {
          localStorage.setItem('userRole', userData.role);
        }

        setMessages(prev => ({ ...prev, success: 'Data profil berhasil dimuat.' }));
        clearMessage('success');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setMessages(prev => ({ ...prev, error: 'Gagal mengambil data profil. Silakan coba lagi.' }));
      clearMessage('error');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const fieldErrors: { fullName?: string; email?: string; phone?: string } = {};
    let isValid = true;

    // Reset field errors
    setMessages(prev => ({
      ...prev,
      modal: { ...prev.modal, fieldErrors: {} }
    }));

    // Validate full name
    if (!editFormData.fullName.trim()) {
      fieldErrors.fullName = 'Nama lengkap wajib diisi';
      isValid = false;
    } else if (editFormData.fullName.trim().length < 2) {
      fieldErrors.fullName = 'Nama lengkap minimal 2 karakter';
      isValid = false;
    }

    // Validate email
    if (!editFormData.email.trim()) {
      fieldErrors.email = 'Email wajib diisi';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        fieldErrors.email = 'Format email tidak valid';
        isValid = false;
      }
    }

    // Validate phone
    if (!editFormData.phone.trim()) {
      fieldErrors.phone = 'Nomor telepon wajib diisi';
      isValid = false;
    } else {
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(editFormData.phone)) {
        fieldErrors.phone = 'Nomor telepon harus 10-13 digit angka';
        isValid = false;
      }
    }

    setMessages(prev => ({
      ...prev,
      modal: { ...prev.modal, fieldErrors }
    }));

    return isValid;
  };

  // Update user profile dengan modal
  const updateProfileData = async () => {
    if (!checkAuth()) return;

    const token = getToken();
    if (!token) {
      setMessages(prev => ({ 
        ...prev, 
        modal: { ...prev.modal, error: 'Token tidak ditemukan. Silakan login kembali.' }
      }));
      clearMessage('modal.error');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if there are changes
    const hasChanges = 
      editFormData.fullName !== originalProfileData.fullName ||
      editFormData.email !== originalProfileData.email ||
      editFormData.phone !== originalProfileData.phone;

    if (!hasChanges) {
      setMessages(prev => ({
        ...prev,
        modal: { ...prev.modal, error: 'Tidak ada perubahan yang perlu disimpan.' }
      }));
      clearMessage('modal.error');
      return;
    }

    setLoading(prev => ({ ...prev, update: true }));
    setMessages(prev => ({ 
      ...prev, 
      modal: { ...prev.modal, error: null, success: null }
    }));

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        "fullName": editFormData.fullName,
        "email": editFormData.email,
        "phone": editFormData.phone
      });

      const response = await fetch(`${API_URL}/profiles/me`, {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setMessages(prev => ({ 
            ...prev, 
            modal: { ...prev.modal, error: 'Sesi Anda telah berakhir. Silakan login kembali.' }
          }));
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('userRole');
          sessionStorage.removeItem('userRole');
          setTimeout(() => {
            setIsEditModalOpen(false);
            router.push('/login');
          }, 2000);
          return;
        }
        
        throw new Error(responseData.message || 'Gagal memperbarui profil');
      }

      if (responseData.success) {
        setMessages(prev => ({ 
          ...prev,
          success: 'Profil berhasil diperbarui!',
          modal: { ...prev.modal, success: 'Profil berhasil diperbarui!' }
        }));
        
        // Update profile data state
        const updatedProfile = {
          ...profileData,
          fullName: editFormData.fullName,
          email: editFormData.email,
          phone: editFormData.phone
        };
        setProfileData(updatedProfile);
        setOriginalProfileData(updatedProfile);
        
        // Clear success messages after delay
        clearMessage('success');
        clearMessage('modal.success');
        
        // Close modal after success
        setTimeout(() => {
          setIsEditModalOpen(false);
          setMessages(prev => ({ 
            ...prev, 
            modal: { error: null, success: null, fieldErrors: {} }
          }));
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setMessages(prev => ({ 
        ...prev, 
        modal: { ...prev.modal, error: err.message || 'Gagal memperbarui profil. Silakan coba lagi.' }
      }));
      clearMessage('modal.error');
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Admin',
      'USER': 'Pengguna',
      'SUPER_ADMIN': 'Super Admin',
      'PETANI': 'Petani',
      'PENGGUNA': 'Pengguna'
    };
    return roleMap[role] || role;
  };

  // Format phone number for display
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    } else if (cleaned.length === 12) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{5})/, '$1 $2 $3');
    } else if (cleaned.length === 13) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{5})/, '$1 $2 $3');
    }
    
    return cleaned;
  };

  // Handle edit form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cleanedValue = value;
    
    if (name === 'phone') {
      cleanedValue = value.replace(/\D/g, '');
    }
    
    setEditFormData(prev => ({
      ...prev,
      [name]: cleanedValue
    }));

    // Clear field error when user starts typing
    if (messages.modal.fieldErrors[name as keyof typeof messages.modal.fieldErrors]) {
      setMessages(prev => ({
        ...prev,
        modal: {
          ...prev.modal,
          fieldErrors: {
            ...prev.modal.fieldErrors,
            [name]: undefined
          }
        }
      }));
    }
  };

  const handleOpenEditModal = () => {
    setEditFormData({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone
    });
    setMessages(prev => ({ 
      ...prev, 
      modal: { error: null, success: null, fieldErrors: {} }
    }));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setMessages(prev => ({ 
      ...prev, 
      modal: { error: null, success: null, fieldErrors: {} }
    }));
  };

  const handleSaveProfile = () => {
    updateProfileData();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('userRole');
    router.push('/login');
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseEditModal();
      }
    };

    if (isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isEditModalOpen]);

  // Set mounted on component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile data on component mount
  useEffect(() => {
    if (mounted) {
      fetchProfileData();
    }
  }, [mounted]);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      
      <div className="flex-1 md:ml-64 w-full">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Pengaturan</h1>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100 text-red-600"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar activeMenu={activeMenu} />
        </div>
        
        <main className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pengaturan Pengguna</h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Kelola informasi akun dan keamanan Anda
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleOpenEditModal}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  Edit Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 active:bg-red-100 transition-colors text-sm hidden md:block"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Success and Error Messages */}
            {messages.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{messages.error}</span>
                </div>
              </div>
            )}

            {messages.success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{messages.success}</span>
                </div>
              </div>
            )}
          </div>

          {/* Profil Pengguna Card */}
          <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Profil Pengguna</h2>
                  <p className="text-gray-500 text-sm">Informasi akun Anda</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {!mounted || loading.profile ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  <span className="text-gray-600 mt-2 text-sm">Memuat data profil...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {/* Nama Lengkap */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        Nama Lengkap
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                        {profileData.fullName || '-'}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        Email
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                        {profileData.email || '-'}
                      </div>
                    </div>

                    {/* Nomor Telepon */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        Nomor Telepon
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                        {formatPhoneDisplay(profileData.phone) || '-'}
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Shield className="w-4 h-4 text-gray-400" />
                        Role
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                        {formatRole(profileData.role)}
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700">
                          Untuk memperbarui informasi profil, klik tombol <strong>Edit Profil</strong> di atas.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Semua data dapat diperbarui kecuali role yang sudah ditetapkan oleh sistem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Modal Edit Profil */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseEditModal}
            />
            
            {/* Modal Container */}
            <div 
              ref={modalRef}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Edit Profil
                    </h2>
                    <p className="text-sm text-gray-600">
                      Perbarui informasi profil Anda
                    </p>
                  </div>
                  <button
                    onClick={handleCloseEditModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Messages */}
              <div className="px-6 pt-4 space-y-3">
                {messages.modal.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{messages.modal.error}</span>
                    </div>
                  </div>
                )}

                {messages.modal.success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{messages.modal.success}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-6 py-4 space-y-4">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border ${messages.modal.fieldErrors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {messages.modal.fieldErrors.fullName && (
                    <p className="text-sm text-red-600">{messages.modal.fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border ${messages.modal.fieldErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                    placeholder="email@contoh.com"
                  />
                  {messages.modal.fieldErrors.email && (
                    <p className="text-sm text-red-600">{messages.modal.fieldErrors.email}</p>
                  )}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nomor Telepon *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border ${messages.modal.fieldErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                    placeholder="08123456789"
                    maxLength={13}
                  />
                  {messages.modal.fieldErrors.phone && (
                    <p className="text-sm text-red-600">{messages.modal.fieldErrors.phone}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Masukkan nomor telepon tanpa kode negara dan spasi.
                  </p>
                </div>

                {/* Role (disabled) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formatRole(profileData.role)}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Role tidak dapat diubah</p>
                </div>

                {/* Validation Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Informasi Validasi</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Field bertanda * wajib diisi</li>
                        <li>• Nama lengkap minimal 2 karakter</li>
                        <li>• Email harus dalam format yang valid</li>
                        <li>• Nomor telepon harus 10-13 digit angka</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    onClick={handleCloseEditModal}
                    disabled={loading.update}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading.update}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading.update ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}