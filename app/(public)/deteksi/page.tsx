// app/(public)/deteksi/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/public/Navbar';
import { 
  Upload, Camera, Image, AlertCircle, Check, X, 
  CheckCircle, Thermometer, Shield, Sprout, Menu,
  Maximize, Minimize, RotateCw, ImageIcon, Droplets,
  Calendar, Clock, User, AlertTriangle, Leaf, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Disease {
  name: string;
  description: string;
  solutions: string[];
}

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  description: string;
  symptoms: string;
  causes: string;
  treatment: string;
  prevention: string;
  conclusion: string;
  thumbnailUrl: string;
  createdAt: string;
  diseaseId: number;
  disease: {
    name: string;
    code: string;
  };
}

interface DetectionResponse {
  message: string;
  data: {
    id: string;
    imageUrl: string;
    accuracy: number;
    status: string;
    detectedAt: string;
    disease: Disease;
    articleSlug: string;
  };
}

export default function DeteksiPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('deteksi');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State untuk hasil deteksi
  const [detectionResult, setDetectionResult] = useState<DetectionResponse['data'] | null>(null);
  
  // State untuk modal artikel
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  
  // State untuk kamera
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraModalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to get token
  const getToken = (): string | null => {
    if (!mounted) return null;
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Function to get user role
  const getUserRole = (): string | null => {
    if (!mounted) return null;
    return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  };

  // Check authentication
  const checkAuth = (): boolean => {
    const token = getToken();
    if (!token) {
      return false;
    }
    return true;
  };

  // Set mounted to true when component is mounted
  useEffect(() => {
    setMounted(true);
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Effect untuk fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Effect untuk menutup sidebar ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar-container');
      const menuButton = document.querySelector('.menu-button');
      
      if (sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) && 
          menuButton && 
          !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Fungsi untuk fetch detail artikel
  const fetchArticleDetail = async (slug: string) => {
    const token = getToken();
    
    if (!token) {
      setModalError('Anda belum login. Silakan login terlebih dahulu.');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://padicheckai-backend-production.up.railway.app';
      const response = await fetch(`${API_URL}/articles/${slug}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const articleData = result.data;
        setSelectedArticle({
          ...articleData,
          disease: articleData.disease || {
            name: articleData.category || 'Tidak Diketahui',
            code: articleData.category?.toLowerCase().replace(/\s+/g, '_') || 'unknown'
          },
          thumbnailUrl: articleData.thumbnailUrl || generateFallbackThumbnail(articleData.title)
        });
      } else {
        throw new Error('Gagal mengambil data artikel');
      }
    } catch (err) {
      console.error('Error fetching article detail:', err);
      setModalError('Gagal memuat detail artikel. Silakan coba lagi.');
      
      // Fallback article data
      if (detectionResult) {
        setSelectedArticle({
          id: 1,
          title: `Informasi Lengkap: ${detectionResult.disease.name}`,
          slug: slug,
          category: detectionResult.disease.name,
          author: "Admin PadiCheck AI",
          description: detectionResult.disease.description,
          symptoms: "Gejala umum penyakit pada tanaman padi.",
          causes: "Penyebab utama penyakit pada tanaman padi.",
          treatment: "Pengobatan yang disarankan untuk mengatasi penyakit.",
          prevention: "Langkah-langkah pencegahan yang bisa dilakukan.",
          conclusion: "Kesimpulan dan rekomendasi penanganan.",
          thumbnailUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=300&fit=crop",
          createdAt: new Date().toISOString(),
          diseaseId: 1,
          disease: {
            name: detectionResult.disease.name,
            code: slug
          }
        });
      }
    } finally {
      setModalLoading(false);
    }
  };

  // Fungsi untuk membuka modal artikel
  const openArticleModal = async (slug: string) => {
    setIsArticleModalOpen(true);
    await fetchArticleDetail(slug);
  };

  // Fungsi untuk menutup modal
  const closeArticleModal = () => {
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
    setModalError(null);
  };

  // Helper functions
  const generateFallbackThumbnail = (title: string) => {
    const colors = ['6B7280', '10B981', '3B82F6'];
    const color = colors[title.length % colors.length];
    return `https://via.placeholder.com/600x300/${color}/FFFFFF?text=${encodeURIComponent(title)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fungsi untuk membuka kamera
  const openCamera = async () => {
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser tidak mendukung akses kamera.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraOpen(true);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
  };

  // Fungsi untuk mengambil foto dari kamera
  const takePhoto = () => {
    if (!videoRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera_photo.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        setFile(file);
        setDetectionResult(null);
        
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        closeCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  // Fungsi untuk menutup kamera
  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setIsCameraActive(false);
    setCameraError(null);
  };

  // Fungsi untuk mengganti kamera
  const switchCamera = async () => {
    if (!cameraStream || !isCameraActive) return;

    const currentVideoTrack = cameraStream.getVideoTracks()[0];
    if (!currentVideoTrack) return;

    currentVideoTrack.stop();

    const newFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(newFacingMode);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      setCameraError('Gagal mengganti kamera');
    }
  };

  // Fungsi untuk toggle fullscreen
  const toggleFullscreen = () => {
    if (!cameraModalRef.current) return;

    if (!document.fullscreenElement) {
      cameraModalRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal ukuran file adalah 5MB.');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
        return;
      }

      setFile(selectedFile);
      setDetectionResult(null);
      
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Silakan pilih file terlebih dahulu.');
      return;
    }

    if (!checkAuth()) {
      alert('Anda harus login terlebih dahulu untuk menggunakan fitur deteksi.');
      router.push('/login');
      return;
    }

    const token = getToken();
    if (!token) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      router.push('/login');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://padicheckai-backend-production.up.railway.app';
      const response = await fetch(`${API_URL}/detections`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token tidak valid. Silakan login kembali.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DetectionResponse = await response.json();

      if (result.message === "Deteksi berhasil" && result.data) {
        setDetectionResult(result.data);
      } else {
        throw new Error(result.message || 'Deteksi gagal');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setDetectionResult(null);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal ukuran file adalah 5MB.');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(droppedFile.type)) {
        alert('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
        return;
      }

      setFile(droppedFile);
      setDetectionResult(null);
      
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('userRole');
    router.push('/login');
  };

  // Render login warning
  const renderLoginWarning = () => {
    if (mounted && !getToken()) {
      return (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Anda harus <a href="/login" className="font-medium underline">login</a> terlebih dahulu untuk menggunakan fitur deteksi.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format accuracy for display
  const formatAccuracy = (accuracy: number) => {
    return accuracy.toFixed(1) + '%';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sehat':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'terinfeksi':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'ringan':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-container fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      
      <div className="flex-1 md:ml-64 w-full">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-button p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Deteksi</h1>
          
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
        
        <main className="p-4 md:p-6 space-y-6">
          {/* Warning jika belum login */}
          {renderLoginWarning()}

          {/* Upload Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Deteksi Penyakit Daun Padi</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Upload foto daun padi untuk mendeteksi penyakit menggunakan AI.
              </p>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-8 bg-gray-50">
              <label
                htmlFor="fileInput"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="cursor-pointer flex flex-col items-center justify-center py-4 md:py-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-700 font-medium text-base md:text-lg">
                      {file ? 'File terpilih' : 'Seret & lepas file di sini'}
                    </p>
                    <p className="text-gray-500 text-sm md:text-base mt-1 truncate max-w-xs md:max-w-md">
                      {file ? file.name : 'atau klik untuk memilih file'}
                    </p>
                  </div>

                  {!file && (
                    <div className="mt-4">
                      <div className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-block">
                        Pilih File
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-6 text-sm text-gray-400">
                  Format: JPG, PNG (Maksimal 5MB)
                </p>

                <input
                  id="fileInput"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Preview Image */}
              {previewUrl && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Preview:</p>
                    <button
                      onClick={handleClear}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                  <div className="relative w-full mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg border border-gray-300 max-h-96 object-contain bg-gray-100"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {file && (file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading || !getToken()}
                className={`py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  !file || isUploading || !getToken()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Mulai Deteksi
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={openCamera}
                  className="py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-5 h-5" />
                  <span>Ambil Foto</span>
                </button>

                <button
                  onClick={handleClear}
                  disabled={!file}
                  className={`py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    !file
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                  <span>Hapus File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {detectionResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Hasil Deteksi</h2>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      Analisis penyakit daun padi berdasarkan gambar yang diupload
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Status dan Informasi Dasar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">Status Tanaman:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(detectionResult.status)}`}>
                        {detectionResult.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tingkat Akurasi:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatAccuracy(detectionResult.accuracy)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Waktu Deteksi:</span>
                        <span className="text-sm text-gray-700">{formatDate(detectionResult.detectedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-green-800">Penyakit Terdeteksi</h3>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-2">{detectionResult.disease.name}</p>
                    <p className="text-sm text-gray-600">{detectionResult.disease.description}</p>
                  </div>
                </div>

                {/* Rekomendasi Penanganan */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-800 text-lg">Rekomendasi Penanganan</h3>
                  </div>
                  <div className="space-y-3">
                    {detectionResult.disease.solutions.map((solution, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-white border border-blue-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <p className="text-sm md:text-base text-gray-700">{solution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informasi Lengkap */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">Informasi Lengkap</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Pelajari lebih detail tentang penyakit ini
                      </p>
                    </div>
                    <button
                      onClick={() => openArticleModal(detectionResult.articleSlug)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Baca Artikel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Kategori</span>
                      </div>
                      <p className="text-gray-900">{detectionResult.disease.name}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Tingkat Keparahan</span>
                      </div>
                      <p className="text-gray-900">{detectionResult.status}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openArticleModal(detectionResult.articleSlug)}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Pelajari Lebih Lanjut
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Deteksi Ulang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900 text-lg">Tips untuk Hasil Terbaik</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Pencahayaan yang Cukup</p>
                    <p className="text-gray-600 text-sm mt-1">Pastikan foto diambil di tempat dengan pencahayaan yang baik</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Fokus pada Daun</p>
                    <p className="text-gray-600 text-sm mt-1">Pastikan kamera fokus pada bagian daun yang menunjukkan gejala</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Jarak yang Tepat</p>
                    <p className="text-gray-600 text-sm mt-1">Ambil foto dari jarak yang cukup dekat untuk detail yang jelas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Latar Belakang Netral</p>
                    <p className="text-gray-600 text-sm mt-1">Gunakan latar belakang yang kontras dengan daun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900 text-lg">Informasi Penting</h3>
            </div>
            <p className="text-gray-700 text-sm md:text-base">
              Sistem deteksi menggunakan teknologi AI dengan tingkat akurasi tinggi. Hasil deteksi merupakan 
              perkiraan berdasarkan data training. Untuk diagnosis yang lebih akurat dan penanganan yang tepat, 
              disarankan untuk berkonsultasi langsung dengan ahli pertanian atau petugas penyuluh lapangan.
            </p>
          </div>
        </main>
      </div>

      {/* Modal Kamera */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black">
            <div 
              ref={cameraModalRef}
              className="relative h-full w-full"
            >
              {/* Camera Error */}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-red-600 text-white rounded-xl p-6 text-center max-w-sm mx-4">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="font-medium text-lg mb-2">Gagal Mengakses Kamera</h3>
                    <p className="text-sm mb-4">{cameraError}</p>
                    <button
                      onClick={closeCamera}
                      className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                      Tutup Kamera
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Preview */}
              {!cameraError && (
                <div className="relative h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Camera Guidelines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-white/50 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Camera Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                    <div className="flex justify-center items-center gap-4 sm:gap-6">
                      {/* Switch Camera Button */}
                      <button
                        onClick={switchCamera}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="Ganti Kamera"
                      >
                        <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </button>

                      {/* Take Photo Button */}
                      <button
                        onClick={takePhoto}
                        className="p-4 sm:p-5 bg-white rounded-full transition-colors border-4 border-white/50"
                        title="Ambil Foto"
                      >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full"></div>
                      </button>

                      {/* Fullscreen Button */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : (
                          <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        )}
                      </button>
                    </div>

                    {/* Camera Instructions */}
                    <p className="text-center text-white/90 text-sm mt-4">
                      Arahkan kamera ke daun padi dan tekan tombol lingkaran
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={closeCamera}
                    className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Artikel */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeArticleModal}
          />
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
              <div className="relative bg-white rounded-lg sm:rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                  <div className="flex justify-between items-start gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Category and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium bg-green-100 text-green-800 border border-green-300 w-fit">
                          <Leaf className="w-3.5 h-3.5" />
                          <span>{selectedArticle?.category || 'Artikel'}</span>
                        </span>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{selectedArticle?.author || 'Admin'}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {selectedArticle ? new Date(selectedArticle.createdAt).toLocaleDateString('id-ID') : ''}
                          </span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 pr-6 sm:pr-8">
                        {selectedArticle?.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeArticleModal}
                      className="flex-shrink-0 rounded-lg p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors -mt-1 -mr-1"
                      aria-label="Tutup modal"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                  {/* Modal Loading State */}
                  {modalLoading && (
                    <div className="px-4 sm:px-6 py-4 sm:py-8 space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal Error State */}
                  {modalError && !modalLoading && (
                    <div className="px-4 sm:px-6 py-4 sm:py-8">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
                        <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-red-400 mx-auto mb-2 sm:mb-3" />
                        <h3 className="text-red-800 font-medium text-sm sm:text-base mb-1 sm:mb-2">Gagal Memuat Artikel</h3>
                        <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4">{modalError}</p>
                        <button
                          onClick={closeArticleModal}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-xs sm:text-sm"
                        >
                          Tutup Artikel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Modal Content */}
                  {selectedArticle && !modalLoading && !modalError && (
                    <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6">
                      {/* Disease Information Card */}
                      <div className="bg-green-50 rounded-lg p-4 sm:p-5 border border-green-200">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Thermometer className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800 text-base sm:text-lg mb-1">Informasi Penyakit</h3>
                            <p className="text-sm text-green-600">Detail penyakit yang dibahas dalam artikel ini</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                          <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">Nama Penyakit</p>
                            <p className="text-gray-900 font-medium">
                              {selectedArticle.disease?.name || selectedArticle.category}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">Kode Penyakit</p>
                            <p className="text-gray-900 font-medium text-sm font-mono">
                              {selectedArticle.disease?.code || 'unknown'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Symptoms */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Gejala yang Terlihat</h3>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-5">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                            {selectedArticle.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Grid: Treatment dan Prevention */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        {/* Treatment */}
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Pengobatan</h3>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-5">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                              {selectedArticle.treatment}
                            </p>
                          </div>
                        </div>

                        {/* Prevention */}
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Pencegahan</h3>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-5">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                              {selectedArticle.prevention}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Conclusion */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Sprout className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Kesimpulan</h3>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-5">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                            {selectedArticle.conclusion}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 sm:pt-8 pb-4 sm:pb-8 mt-4 sm:mt-6 border-t border-gray-200">
                        <div className="flex justify-center">
                          <button
                            onClick={closeArticleModal}
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            Tutup Artikel
                          </button>
                        </div>
                        <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4">
                          Artikel ini memberikan informasi lengkap tentang penyakit yang terdeteksi
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}