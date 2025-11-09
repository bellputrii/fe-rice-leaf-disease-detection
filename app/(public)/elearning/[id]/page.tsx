'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import Footer from '@/components/public/Footer'
import { Play, FileText, Clock, Users, ArrowLeft, CheckCircle, Star, Award, Video, Download, ChevronDown, ChevronUp, File, VideoIcon } from 'lucide-react'

interface Material {
  id: number
  title: string
  content: string
  thumnail_path: string
}

interface Quiz {
  id: number
  title: string
  description: string | null
}

interface Section {
  id: number
  title: string
  description: string | null
  order: number
  Material: Material[]
  Quiz: Quiz[]
}

interface ClassDetail {
  id: number
  name: string
  description: string
  image_path: string
  categoryId: number
  image_path_relative: string
  sections: Section[]
}

interface MaterialDetail {
  id: number
  title: string
  content: string
  xp: number
  thumnail_path: string
  video_path: string
  materialFilePath: string
  ringkasanPath: string
  templatePath: string
  createdAt: string
  updatedAt: string
  sectionId: number
}

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null)
  const [materialDetail, setMaterialDetail] = useState<MaterialDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [materialLoading, setMaterialLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)

  // Fungsi untuk toggle section
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Fungsi untuk navigasi ke halaman pricing
  const handleGoToPricing = () => {
    router.push('/ementoring')
  }

  // Fungsi untuk mengambil detail materi
  const fetchMaterialDetail = async (materialId: number) => {
    try {
      setMaterialLoading(true)
      setSelectedMaterialId(materialId)
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/materials/${materialId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        redirect: "follow" as RequestRedirect
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setMaterialDetail(result.data)
        setError(null)
      } else {
        throw new Error(result.message || 'Gagal memuat detail materi')
      }
    } catch (err) {
      console.error('Error fetching material detail:', err)
      setError('Gagal memuat detail materi. Silakan coba lagi.')
    } finally {
      setMaterialLoading(false)
    }
  }

  // Fetch data detail kelas
  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.')
          setLoading(false)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/classes/${params.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          redirect: "follow" as RequestRedirect
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            setError('Sesi telah berakhir. Silakan login kembali.')
            setTimeout(() => router.push('/login'), 2000)
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.success) {
          setClassDetail(result.data)
          // Expand first section by default
          if (result.data.sections.length > 0) {
            setExpandedSections([result.data.sections[0].id])
            // Load first material by default if exists
            const firstSection = result.data.sections[0]
            if (firstSection.Material.length > 0) {
              fetchMaterialDetail(firstSection.Material[0].id)
            }
          }
          setError(null)
        } else {
          throw new Error(result.message || 'Gagal memuat detail kelas')
        }
      } catch (err) {
        console.error('Error fetching class detail:', err)
        setError('Gagal memuat detail kelas. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchClassDetail()
    }
  }, [params.id, router])

  // Helper function untuk map category
  const mapCategory = (categoryId: number): string => {
    const categoryMap: { [key: number]: string } = {
      1: 'Essay',
      2: 'Business Plan',
      3: 'Penelitian',
      4: 'Desain'
    }
    return categoryMap[categoryId] || 'Kursus'
  }

  // Hitung total materi dan quiz
  const totalMaterials = classDetail?.sections.reduce((acc, section) => acc + section.Material.length, 0) || 0
  const totalQuizzes = classDetail?.sections.reduce((acc, section) => acc + section.Quiz.length, 0) || 0

  if (loading) {
    return (
      <LayoutNavbar>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <span className="ml-3 text-gray-600">Memuat detail kelas...</span>
        </div>
      </LayoutNavbar>
    )
  }

  if (error) {
    return (
      <LayoutNavbar>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-700 font-medium">{error}</p>
            {error.includes('login kembali') && (
              <button 
                onClick={() => router.push('/login')}
                className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Login Kembali
              </button>
            )}
          </div>
        </div>
      </LayoutNavbar>
    )
  }

  if (!classDetail) {
    return (
      <LayoutNavbar>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Kelas tidak ditemukan</h2>
            <button 
              onClick={() => router.push('/elearning')}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Kembali ke E-Learning
            </button>
          </div>
        </div>
      </LayoutNavbar>
    )
  }

  return (
    <>
      <LayoutNavbar>
        <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
          {/* Header Section */}
          <section className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Kelas</span>
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {mapCategory(classDetail.categoryId)}
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{classDetail.name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{classDetail.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>6 Jam</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>420 Peserta</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video className="w-5 h-5" />
                      <span>{totalMaterials} Materi</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-gray-700">M</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mentor Ahli</p>
                      <p className="text-sm text-gray-600">Pengajar Berpengalaman</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
                    <Image
                      src={classDetail.image_path_relative}
                      alt={classDetail.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900">Rp 30.000</span>
                        <span className="text-sm text-gray-500 line-through">Rp 100.000</span>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={handleGoToPricing}
                          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-800 hover:scale-105 active:scale-95"
                        >
                          Daftar Kelas Sekarang
                        </button>
                      </div>

                      <div className="mt-6 space-y-3">
                        {[
                          "Akses seumur hidup",
                          "Sertifikat kelulusan",
                          "Konsultasi dengan mentor",
                          "Download materi PDF",
                          "Grup diskusi eksklusif"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Kurikulum Kelas */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kurikulum Kelas</h2>
                
                <div className="space-y-4">
                  {classDetail.sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          {section.description && (
                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {section.Material.length} Materi • {section.Quiz.length} Quiz
                          </p>
                        </div>
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedSections.includes(section.id) && (
                        <div className="divide-y divide-gray-200">
                          {section.Material.map((material) => (
                            <div 
                              key={material.id} 
                              className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                selectedMaterialId === material.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                              }`}
                              onClick={() => fetchMaterialDetail(material.id)}
                            >
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                                <Play className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{material.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{material.content}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-2">
                                <span className="text-sm text-gray-500">10:00</span>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            </div>
                          ))}
                          
                          {section.Quiz.map((quiz) => (
                            <div key={quiz.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                                {quiz.description && (
                                  <p className="text-sm text-gray-600">{quiz.description}</p>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <span className="text-sm text-gray-500">5 soal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Detail Materi */}
                {materialDetail && (
                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Materi</h3>
                      
                      {materialLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                          <span className="ml-3 text-gray-600">Memuat detail materi...</span>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Video Materi */}
                          {materialDetail.video_path && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <VideoIcon className="w-5 h-5 text-blue-600" />
                                Video Pembelajaran
                              </h4>
                              <div className="bg-black rounded-lg overflow-hidden">
                                <video 
                                  controls 
                                  className="w-full h-auto max-h-96"
                                  poster={materialDetail.thumnail_path}
                                >
                                  <source src={materialDetail.video_path} type="video/mp4" />
                                  Browser Anda tidak mendukung pemutaran video.
                                </video>
                              </div>
                            </div>
                          )}

                          {/* Konten Materi */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Deskripsi Materi</h4>
                            <div className="prose max-w-none">
                              <p className="text-gray-700 whitespace-pre-line">{materialDetail.content}</p>
                            </div>
                          </div>

                          {/* File-file Pendukung */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">File Pendukung</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {materialDetail.materialFilePath && (
                                <a 
                                  href={materialDetail.materialFilePath} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <File className="w-8 h-8 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-gray-900">Materi PDF</p>
                                    <p className="text-sm text-gray-600">Download materi lengkap</p>
                                  </div>
                                </a>
                              )}
                              
                              {materialDetail.ringkasanPath && (
                                <a 
                                  href={materialDetail.ringkasanPath} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <FileText className="w-8 h-8 text-green-600" />
                                  <div>
                                    <p className="font-medium text-gray-900">Ringkasan</p>
                                    <p className="text-sm text-gray-600">Download ringkasan materi</p>
                                  </div>
                                </a>
                              )}
                              
                              {materialDetail.templatePath && (
                                <a 
                                  href={materialDetail.templatePath} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Download className="w-8 h-8 text-purple-600" />
                                  <div>
                                    <p className="font-medium text-gray-900">Template</p>
                                    <p className="text-sm text-gray-600">Download template</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Informasi XP */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <Award className="w-6 h-6 text-blue-600" />
                              <div>
                                <p className="font-semibold text-blue-900">Dapatkan {materialDetail.xp} XP</p>
                                <p className="text-sm text-blue-700">Selesaikan materi ini untuk mendapatkan poin pengalaman</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Statistik Kelas */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Statistik Kelas</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Video className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Materi Video</p>
                          <p className="font-semibold text-gray-900">{totalMaterials} Video</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Quiz</p>
                          <p className="font-semibold text-gray-900">{totalQuizzes} Quiz</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Durasi Belajar</p>
                          <p className="font-semibold text-gray-900">6 Jam</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Award className="w-5 h-5 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tingkat Kesulitan</p>
                          <p className="font-semibold text-gray-900">Pemula</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tentang Mentor */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Tentang Mentor</h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Mentor Ahli</h4>
                        <p className="text-sm text-gray-600">Pengajar Berpengalaman</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Mentor kami memiliki pengalaman lebih dari 5 tahun dalam bidangnya dan telah membantu ratusan siswa meraih prestasi terbaik.
                    </p>
                  </div>

                  {/* CTA Box */}
                  <div className="bg-blue-700 rounded-lg p-6 text-white">
                    <h3 className="font-bold mb-3">Siap Memulai Perjalanan Belajarmu?</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Bergabung dengan {totalMaterials + totalQuizzes} materi pembelajaran berkualitas tinggi
                    </p>
                    <button 
                      onClick={handleGoToPricing}
                      className="w-full bg-white text-blue-700 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Daftar Kelas Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </LayoutNavbar>
      <Footer />
    </>
  )
}