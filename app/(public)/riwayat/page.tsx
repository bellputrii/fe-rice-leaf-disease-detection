/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(public)/riwayat/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/public/Navbar';
import { Calendar, Download, Loader2, X, CheckCircle, AlertCircle, Menu, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface DetectionHistory {
  id: string;
  hasil: string;
  akurasi: string;
  tingkat: string;
  tanggal: string;
  waktu: string;
  status: string;
  detectedAt: Date;
  imageUrl?: string;
  disease?: {
    id: number;
    name: string;
    description: string;
    solutions: string[];
    thumbnailUrl: string;
  };
}

export default function RiwayatDeteksiPage() {
  const [activeMenu, setActiveMenu] = useState('riwayat');
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [detectionData, setDetectionData] = useState<DetectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State untuk modal
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Ref untuk modal
  const modalRef = useRef<HTMLDivElement>(null);

  // Function to get token
  const getToken = useCallback((): string | null => {
    if (!mounted) return null;
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchDetectionHistory = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          setError('Anda belum login. Silakan login terlebih dahulu.');
          setLoading(false);
          return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const response = await fetch(
          "https://padicheckai-backend-production.up.railway.app/detections/history",
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Mapping data dari API ke format yang digunakan di komponen
        const mappedData: DetectionHistory[] = result.data.map((item: any) => {
          const detectedAt = new Date(item.detectedAt);
          const tanggal = detectedAt.toISOString().split('T')[0];
          const waktu = detectedAt.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });

          // Menentukan tingkat berdasarkan akurasi
          const getTingkat = (accuracy: number) => {
            if (accuracy >= 90) return "Tinggi";
            if (accuracy >= 80) return "Sedang";
            if (accuracy >= 70) return "Rendah";
            return "Sangat Rendah";
          };

          // Mapping status
          const statusMap: { [key: string]: string } = {
            "Terdeteksi Penyakit": "Terdeteksi",
            "Healthy": "Sehat"
          };

          return {
            id: item.id,
            hasil: item.disease?.name || "Sehat",
            akurasi: `${item.accuracy.toFixed(1)}%`,
            tingkat: getTingkat(item.accuracy),
            tanggal,
            waktu,
            status: statusMap[item.status] || item.status,
            detectedAt,
            imageUrl: item.imageUrl,
            disease: item.disease
          };
        });

        // Sort by latest date
        mappedData.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
        
        setDetectionData(mappedData);
      } catch (error: any) {
        console.error('Error fetching detection history:', error);
        setError(error.message || 'Terjadi kesalahan saat mengambil data');
        
        // Fallback ke data mockup jika API error
        setDetectionData(getMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchDetectionHistory();
  }, [mounted, getToken]);

  // Mock data fallback
  const getMockData = (): DetectionHistory[] => {
    return [
      { 
        id: "DET-2024-001", 
        hasil: "Tungro", 
        akurasi: "96.5%", 
        tingkat: "Tinggi", 
        tanggal: "2024-11-26", 
        waktu: "14:30", 
        status: "Terdeteksi",
        detectedAt: new Date('2024-11-26T14:30:00')
      },
      { 
        id: "DET-2024-002", 
        hasil: "Blast", 
        akurasi: "94.2%", 
        tingkat: "Sedang", 
        tanggal: "2024-11-26", 
        waktu: "12:15", 
        status: "Terdeteksi",
        detectedAt: new Date('2024-11-26T12:15:00')
      },
      { 
        id: "DET-2024-003", 
        hasil: "Healthy", 
        akurasi: "99.1%", 
        tingkat: "Sehat", 
        tanggal: "2024-11-25", 
        waktu: "16:45", 
        status: "Sehat",
        detectedAt: new Date('2024-11-25T16:45:00')
      },
      { 
        id: "DET-2024-004", 
        hasil: "Bacterial Blight", 
        akurasi: "91.8%", 
        tingkat: "Tinggi", 
        tanggal: "2024-11-25", 
        waktu: "10:20", 
        status: "Terdeteksi",
        detectedAt: new Date('2024-11-25T10:20:00')
      },
      { 
        id: "DET-2024-005", 
        hasil: "Brown Spot", 
        akurasi: "88.7%", 
        tingkat: "Rendah", 
        tanggal: "2024-11-24", 
        waktu: "15:30", 
        status: "Terdeteksi",
        detectedAt: new Date('2024-11-24T15:30:00')
      },
      { 
        id: "DET-2024-006", 
        hasil: "Healthy", 
        akurasi: "97.3%", 
        tingkat: "Sehat", 
        tanggal: "2024-11-24", 
        waktu: "09:10", 
        status: "Sehat",
        detectedAt: new Date('2024-11-24T09:10:00')
      },
    ];
  };

  const filters = ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'];

  // Filter data berdasarkan pilihan
  const filteredData = detectionData.filter((item) => {
    if (selectedFilter === 'Semua') return true;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const date = item.detectedAt;
    
    switch (selectedFilter) {
      case 'Hari Ini':
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
      
      case 'Minggu Ini':
        return date >= startOfWeek && date <= endOfWeek;
      
      case 'Bulan Ini':
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear();
      
      default:
        return true;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const badgeColor = (tingkat: string) => {
    switch (tingkat) {
      case "Tinggi": return "bg-red-50 text-red-700 border border-red-200";
      case "Sedang": return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "Rendah": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Sangat Rendah": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Sehat": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Sehat": return "text-green-600 font-medium";
      case "Terdeteksi": return "text-orange-600 font-medium";
      default: return "text-gray-600 font-medium";
    }
  };

  const handleExportClick = () => {
    setShowExportConfirm(true);
  };

  const handleConfirmExport = () => {
    setIsExporting(true);
    
    // Simulasi proses export
    setTimeout(() => {
      // Format data untuk export
      const exportData = detectionData.map(item => ({
        ID: item.id,
        Hasil: item.hasil,
        Akurasi: item.akurasi,
        Tingkat: item.tingkat,
        Tanggal: item.tanggal,
        Waktu: item.waktu,
        Status: item.status
      }));
      
      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `riwayat-deteksi-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setIsExporting(false);
      setShowExportConfirm(false);
      setShowExportSuccess(true);
      
      // Auto close success message after 3 seconds
      setTimeout(() => {
        setShowExportSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (showExportConfirm) setShowExportConfirm(false);
        if (showExportSuccess) setShowExportSuccess(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportConfirm, showExportSuccess]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Modal Konfirmasi Export
  const ExportConfirmModal = () => (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px]"
        onClick={() => setShowExportConfirm(false)}
      />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-200"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Konfirmasi Export
                  </h3>
                </div>
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                Anda akan mengekspor <span className="font-semibold">{detectionData.length} data riwayat</span> ke dalam format CSV. File akan diunduh secara otomatis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  disabled={isExporting}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmExport}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span>Mengekspor...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Success
  const ExportSuccessModal = () => (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px]"
        onClick={() => setShowExportSuccess(false)}
      />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-200"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 bg-emerald-50 rounded-full mb-3 sm:mb-4">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Export Berhasil!
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  File CSV berhasil diunduh. Data riwayat deteksi telah berhasil diekspor.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 w-full mb-4 sm:mb-6">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">Jumlah Data</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{detectionData.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">Format</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">CSV</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-emerald-600 text-sm sm:text-base">Berhasil</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowExportSuccess(false)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px] z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        
        <div className={`flex-1 transition-all duration-300 ${isMobile && sidebarOpen ? 'ml-72' : 'ml-0'} md:ml-64`}>
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Riwayat Deteksi</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <Navbar activeMenu={activeMenu} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          </div>
          
          <main className="p-4 md:p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600 text-sm md:text-base">Memuat data riwayat...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error && detectionData.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px] z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        
        <div className={`flex-1 transition-all duration-300 ${isMobile && sidebarOpen ? 'ml-72' : 'ml-0'} md:ml-64`}>
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Riwayat Deteksi</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <Navbar activeMenu={activeMenu} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          </div>
          
          <main className="p-4 md:p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 text-center">
              <h3 className="text-base md:text-lg font-semibold text-red-800 mb-1 md:mb-2">Gagal Memuat Data</h3>
              <p className="text-red-600 text-sm md:text-base mb-3 md:mb-4">{error}</p>
              <p className="text-gray-600 text-sm md:text-base">Menampilkan data contoh...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px] z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div className={`flex-1 transition-all duration-300 ${isMobile && sidebarOpen ? 'ml-72' : 'ml-0'} md:ml-64`}>
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Riwayat Deteksi</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar activeMenu={activeMenu} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        </div>
        
        <main className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Riwayat Deteksi</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Lihat semua hasil deteksi penyakit yang telah dilakukan
                </p>
              </div>
              <button
                onClick={handleExportClick}
                className="w-full sm:w-auto px-3 py-2 md:px-4 md:py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Filter className="w-4 h-4" />
                <span>Filter Waktu:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      selectedFilter === filter
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-600">Total Data</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900">{detectionData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-600">Ditampilkan</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900">{currentData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-600">Filter Aktif</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900">{selectedFilter}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-600">Halaman</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900">{currentPage}/{totalPages}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">ID Deteksi</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">Hasil</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">Akurasi</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">Tingkat</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">Tanggal & Waktu</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 md:p-8 text-center">
                        <div className="text-gray-400 text-sm md:text-base">
                          Tidak ada data riwayat untuk filter `{selectedFilter}`
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="p-3 md:p-4">
                          <div className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[100px] md:max-w-[150px]">
                            {item.id}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-[200px]">
                            {item.hasil}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-medium text-gray-900 text-xs md:text-sm">
                            {item.akurasi}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badgeColor(item.tingkat)}`}>
                            {item.tingkat}
                          </span>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-2 text-gray-700 text-xs md:text-sm">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{item.tanggal}</div>
                              <div className="text-gray-500 text-xs">{item.waktu}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <span className={statusColor(item.status)}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs md:text-sm text-gray-600">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} hasil
                </p>
                
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-base md:text-lg">Keterangan Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Sehat: Tanaman tidak terdeteksi penyakit</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Terdeteksi: Tanaman teridentifikasi penyakit</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Tinggi: Akurasi ≥ 90%</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Sedang: Akurasi 80-90%</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Rendah: Akurasi 70-80%</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Export */}
      {showExportConfirm && <ExportConfirmModal />}

      {/* Modal Success */}
      {showExportSuccess && <ExportSuccessModal />}
    </div>
  );
}