/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import { Plus, Edit, Trash2, Users, UserCheck, UserX, Mail, Phone, BookOpen, X, CheckCircle, XCircle, AlertTriangle, Filter, Search } from 'lucide-react'
import Footer from '@/components/public/Footer'

interface Teacher {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage: string;
  roleId: number;
  telp: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  specialization: string | null;
  bio: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Teacher[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Helper function to get valid image URL
const getValidImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  
  return path;
};

export default function TeachersManagement() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    telp: '',
    specialization: '',
    bio: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  })
  const [error, setError] = useState<string | null>(null)
  
  // State untuk message feedback
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null)
  const [messageFailed, setMessageFailed] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, teacherId: string | null, teacherName: string}>({
    show: false,
    teacherId: null,
    teacherName: ''
  })

  // Auto calculation stats
  const stats = [
    { 
      value: teachers.length.toString(), 
      label: 'Total Teacher', 
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    { 
      value: teachers.filter(t => t.status === 'ACTIVE').length.toString(), 
      label: 'Teacher Aktif', 
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    { 
      value: teachers.filter(t => t.status === 'INACTIVE').length.toString(), 
      label: 'Teacher Non-Aktif', 
      icon: <UserX className="w-5 h-5" />,
      color: 'bg-red-500'
    },
  ]

  // Auto hide messages after 5 seconds
  useEffect(() => {
    if (messageSuccess || messageFailed) {
      const timer = setTimeout(() => {
        setMessageSuccess(null)
        setMessageFailed(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [messageSuccess, messageFailed])

  // Filter teachers when statusFilter, searchQuery or teachers change
  useEffect(() => {
    let result = teachers;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(teacher => teacher.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(teacher => 
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.username.toLowerCase().includes(query) ||
        (teacher.specialization && teacher.specialization.toLowerCase().includes(query))
      );
    }
    
    setFilteredTeachers(result);
  }, [statusFilter, searchQuery, teachers])

  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      setLoading(true)
      
      // Ambil token dari localStorage
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired atau invalid
          localStorage.removeItem("token")
          setError('Sesi telah berakhir. Silakan login kembali.')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse = await response.json()
      
      if (result.success && result.data) {
        setTeachers(result.data)
        setError(null)
      } else {
        throw new Error(result.message || 'Gagal memuat data teacher')
      }
    } catch (err) {
      console.error('Error fetching teachers:', err)
      setError('Gagal memuat data teacher. Silakan coba lagi.')
      setMessageFailed('Gagal memuat data teacher')
      // Fallback ke data statis jika API error
      setTeachers(getFallbackTeachers())
    } finally {
      setLoading(false)
    }
  }

  // Fallback data jika API error
  const getFallbackTeachers = (): Teacher[] => [
    {
      id: '1',
      name: 'Dr. Sarah Wijaya',
      email: 'sarah.wijaya@example.com',
      username: 'sarahwijaya',
      profileImage: 'https://ui-avatars.com/api/?name=Sarah+Wijaya&background=random',
      roleId: 2,
      telp: '081234567890',
      status: 'ACTIVE',
      specialization: 'Matematika, Statistika',
      bio: 'Pengajar berpengalaman dengan spesialisasi dalam matematika dan statistika'
    },
    {
      id: '2',
      name: 'Prof. Ahmad Rahman',
      email: 'ahmad.rahman@example.com',
      username: 'ahmadrahman',
      profileImage: 'https://ui-avatars.com/api/?name=Ahmad+Rahman&background=random',
      roleId: 2,
      telp: '081234567891',
      status: 'ACTIVE',
      specialization: 'Fisika, Engineering',
      bio: 'Profesor fisika dengan pengalaman mengajar lebih dari 10 tahun'
    },
    {
      id: '3',
      name: 'Dr. Lisa Santoso',
      email: 'lisa.santoso@example.com',
      username: 'lisasantoso',
      profileImage: 'https://ui-avatars.com/api/?name=Lisa+Santoso&background=random',
      roleId: 2,
      telp: '081234567892',
      status: 'INACTIVE',
      specialization: 'Biologi, Kimia',
      bio: 'Ahli biologi dengan spesialisasi dalam penelitian medis'
    }
  ]

  useEffect(() => {
    fetchTeachers()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      telp: '',
      specialization: '',
      bio: '',
      status: 'ACTIVE'
    })
    setEditingTeacher(null)
  }

  // Open create modal
  const handleCreateTeacher = () => {
    resetForm()
    setShowCreateModal(true)
  }

  // Open edit modal
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      username: teacher.username,
      password: '', // Password tidak diisi saat edit untuk keamanan
      telp: teacher.telp || '',
      specialization: teacher.specialization || '',
      bio: teacher.bio || '',
      status: teacher.status
    })
    setShowCreateModal(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi form
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      setMessageFailed('Harap isi nama, email, dan username')
      return
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessageFailed('Format email tidak valid')
      return
    }

    // Untuk create, password wajib diisi
    if (!editingTeacher && !formData.password) {
      setMessageFailed('Password wajib diisi untuk teacher baru')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setMessageFailed('Token tidak ditemukan. Silakan login kembali.')
        setLoading(false)
        return
      }

      // Format data untuk API (application/x-www-form-urlencoded)
      const urlencoded = new URLSearchParams()
      urlencoded.append('name', formData.name.trim())
      urlencoded.append('email', formData.email.trim())
      urlencoded.append('username', formData.username.trim())
      
      if (formData.password) {
        urlencoded.append('password', formData.password)
      }
      
      if (formData.telp) {
        urlencoded.append('telp', formData.telp)
      }
      
      if (formData.specialization) {
        urlencoded.append('specialization', formData.specialization)
      }
      
      if (formData.bio) {
        urlencoded.append('bio', formData.bio)
      }
      
      urlencoded.append('status', formData.status)

      const url = editingTeacher 
        ? `${process.env.NEXT_PUBLIC_API_URL}/teachers/${editingTeacher.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/teachers`

      const method = editingTeacher ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          setMessageFailed('Sesi telah berakhir. Silakan login kembali.')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        await fetchTeachers()
        setShowCreateModal(false)
        resetForm()
        setMessageSuccess(editingTeacher ? 'Teacher berhasil diperbarui' : 'Teacher berhasil dibuat')
      } else {
        throw new Error(result.message || 'Failed to save teacher')
      }
    } catch (error) {
      console.error('Error saving teacher:', error)
      setMessageFailed(`Gagal menyimpan teacher: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Delete teacher
  const handleDeleteTeacher = async (teacherId: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setMessageFailed('Token tidak ditemukan. Silakan login kembali.')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          setMessageFailed('Sesi telah berakhir. Silakan login kembali.')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        await fetchTeachers()
        setMessageSuccess('Teacher berhasil dihapus')
      } else {
        throw new Error(result.message || 'Failed to delete teacher')
      }
    } catch (error) {
      console.error('Error deleting teacher:', error)
      setMessageFailed(`Gagal menghapus teacher: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
      setShowDeleteConfirm({ show: false, teacherId: null, teacherName: '' })
    }
  }

  // Open delete confirmation
  const openDeleteConfirm = (teacherId: string, teacherName: string) => {
    setShowDeleteConfirm({
      show: true,
      teacherId,
      teacherName
    })
  }

  return (
    <>
      <LayoutNavbar>
        {/* Success Message */}
        {messageSuccess && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-600 border border-green-700 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">{messageSuccess}</p>
                </div>
                <button 
                  onClick={() => setMessageSuccess(null)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {messageFailed && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-red-600 border border-red-700 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">{messageFailed}</p>
                </div>
                <button 
                  onClick={() => setMessageFailed(null)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gray-50 pt-16">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola Teacher</h1>
                  <p className="text-gray-600 text-sm mt-1">Kelola data teacher dan akun pengajar</p>
                </div>
                <button 
                  onClick={handleCreateTeacher}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Teacher
                </button>
              </div>

              {/* Error State */}
              {error && !loading && (
                <div className="mt-3 bg-yellow-500 border border-yellow-600 rounded-lg p-3">
                  <p className="text-white font-medium text-sm">{error}</p>
                  {error.includes('login kembali') && (
                    <button 
                      onClick={() => router.push('/auth/login')}
                      className="mt-2 bg-white text-yellow-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      Login Kembali
                    </button>
                  )}
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-gray-600 text-xs">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari teacher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'ACTIVE' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => setStatusFilter('INACTIVE')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'INACTIVE' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Non-Aktif
                  </button>
                </div>
              </div>

              {/* Filter Info */}
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Menampilkan:</span>
                <span className="font-medium">
                  {statusFilter === 'all' 
                    ? `Semua Teacher (${filteredTeachers.length})` 
                    : `${statusFilter === 'ACTIVE' ? 'Teacher Aktif' : 'Teacher Non-Aktif'} (${filteredTeachers.length})`
                  }
                </span>
                {searchQuery && (
                  <>
                    <span>•</span>
                    <span>Pencarian: `{searchQuery}`</span>
                  </>
                )}
              </div>
            </div>

            {/* Teachers Grid */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2 text-sm">Memuat data teacher...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher) => (
                  <div 
                    key={teacher.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-colors hover:border-blue-300"
                  >
                    <div className="p-4">
                      {/* Teacher Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={getValidImageUrl(teacher.profileImage)}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`
                            }}
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            teacher.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                            {teacher.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              teacher.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {teacher.status === 'ACTIVE' ? 'Aktif' : 'Non-Aktif'}
                            </span>
                            <span className="text-xs text-gray-500">@{teacher.username}</span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-gray-600 text-xs">
                          <Mail className="w-3 h-3 text-blue-500" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        {teacher.telp && (
                          <div className="flex items-center gap-2 text-gray-600 text-xs">
                            <Phone className="w-3 h-3 text-green-500" />
                            <span>{teacher.telp}</span>
                          </div>
                        )}
                        {teacher.specialization && (
                          <div className="flex items-start gap-2 text-gray-600 text-xs">
                            <BookOpen className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{teacher.specialization}</span>
                          </div>
                        )}
                        {teacher.bio && (
                          <div className="text-gray-600 text-xs line-clamp-2">
                            {teacher.bio}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => handleEditTeacher(teacher)}
                          disabled={loading}
                          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors hover:bg-blue-600 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(teacher.id, teacher.name)}
                          disabled={loading}
                          className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors hover:bg-red-500 hover:text-white flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredTeachers.length === 0 && !loading && (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {statusFilter === 'all' && !searchQuery ? 'Belum ada teacher' : 'Teacher tidak ditemukan'}
                </h3>
                <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                  {statusFilter === 'all' && !searchQuery 
                    ? 'Mulai dengan menambahkan teacher pertama untuk mengelola akun pengajar' 
                    : searchQuery
                    ? `Tidak ada teacher yang sesuai dengan pencarian "${searchQuery}"`
                    : `Tidak ada teacher dengan status ${statusFilter === 'ACTIVE' ? 'Aktif' : 'Non-Aktif'}`
                  }
                </p>
                <button 
                  onClick={handleCreateTeacher}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-blue-700 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Teacher Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </LayoutNavbar>
      <Footer/>

      {/* Create/Edit Teacher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-bold text-gray-900">
                {editingTeacher ? 'Edit Teacher' : 'Tambah Teacher Baru'}
              </h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                        placeholder="Masukkan username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                      placeholder="Masukkan email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {!editingTeacher && '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                      placeholder={editingTeacher ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'}
                    />
                    {editingTeacher && (
                      <p className="text-xs text-gray-500 mt-1">
                        Kosongkan password jika tidak ingin mengubah
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="telp"
                        value={formData.telp}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                      >
                        <option value="ACTIVE">Aktif</option>
                        <option value="INACTIVE">Non-Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spesialisasi
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50 bg-white text-sm"
                      placeholder="Contoh: Matematika, Fisika, Kimia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none disabled:opacity-50 bg-white text-sm"
                      placeholder="Deskripsi singkat tentang teacher"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    disabled={loading}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium disabled:opacity-50 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      editingTeacher ? 'Simpan' : 'Tambah'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full border border-gray-200 shadow-lg">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Konfirmasi Hapus</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Apakah Anda yakin ingin menghapus teacher <span className="font-semibold text-gray-900">`{showDeleteConfirm.teacherName}`</span>? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm({ show: false, teacherId: null, teacherName: '' })}
                  disabled={loading}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium disabled:opacity-50 text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={() => showDeleteConfirm.teacherId && handleDeleteTeacher(showDeleteConfirm.teacherId)}
                  disabled={loading}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}