'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import { ChevronLeft, ChevronRight, Play, Users, Trophy, BookOpen, Award, ArrowRight, Video, FileText, Clock, Star, Eye } from 'lucide-react'
import Footer from '@/components/public/Footer'

interface Course {
  id: number
  category: string
  title: string
  image: string
  duration: string
  participants: string
  level: string
  rating: number
  instructor: string
  featured?: boolean
  description: string
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    setIsVisible(true)
    // Set dummy data untuk courses
    setCourses([
      {
        id: 1,
        category: 'essay',
        title: 'Menulis Esai Akademik yang Menang',
        image: '/essay.png',
        duration: '6 Jam',
        participants: '420',
        level: 'Pemula',
        rating: 4.8,
        instructor: 'Dr. Sarah Wijaya',
        featured: true,
        description: 'Pelajari teknik menulis esai akademik yang memenangkan kompetisi'
      },
      {
        id: 2,
        category: 'business',
        title: 'Business Plan untuk Kompetisi Startup',
        image: '/business-plan.png',
        duration: '8 Jam',
        participants: '310',
        level: 'Menengah',
        rating: 4.9,
        instructor: 'Prof. Ahmad Rahman',
        featured: true,
        description: 'Buat business plan yang menarik investor dan juri kompetisi'
      },
      {
        id: 3,
        category: 'research',
        title: 'Karya Tulis Ilmiah & Publikasi',
        image: '/karya-tulis-ilmiah.png',
        duration: '5 Jam',
        participants: '280',
        level: 'Pemula',
        rating: 4.7,
        instructor: 'Dr. Lisa Santoso',
        description: 'Teknik penulisan karya ilmiah dan strategi publikasi'
      },
      {
        id: 4,
        category: 'design',
        title: 'Desain Poster Akademik yang Impactful',
        image: '/poster.png',
        duration: '4 Jam',
        participants: '355',
        level: 'Pemula',
        rating: 4.6,
        instructor: 'Maya Desain',
        description: 'Belajar prinsip desain visual untuk poster akademik'
      },
      {
        id: 5,
        category: 'essay',
        title: 'Teknik Menulis Essay Beasiswa',
        image: '/essay.png',
        duration: '7 Jam',
        participants: '290',
        level: 'Menengah',
        rating: 4.8,
        instructor: 'Dr. Sarah Wijaya',
        description: 'Rahasia menulis essay beasiswa yang mendapatkan approval'
      },
      {
        id: 6,
        category: 'business',
        title: 'Analisis Pasar untuk Business Plan',
        image: '/business-plan.png',
        duration: '5 Jam',
        participants: '320',
        level: 'Lanjutan',
        rating: 4.7,
        instructor: 'Prof. Ahmad Rahman',
        description: 'Teknik analisis pasar yang komprehensif untuk business plan'
      }
    ])
  }, [])

  const heroSlides = [
    {
      title: "Meraih Prestasi Bersama Ambil Prestasi",
      subtitle: "Platform terdepan untuk mahasiswa berprestasi",
      icon: <Trophy className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "bg-blue-600"
    },
    {
      title: "E-Learning Interaktif",
      subtitle: "Belajar dengan metode modern dan mentor berpengalaman",
      icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "bg-blue-600"
    },
    {
      title: "Komunitas Inspiratif",
      subtitle: "Bergabung dengan mahasiswa berprestasi se-Indonesia",
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "bg-blue-600"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const stats = [
    { value: '10K+', label: 'Mahasiswa', icon: <Users className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: '500+', label: 'Prestasi', icon: <Trophy className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: '100+', label: 'Mentor', icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: '50+', label: 'Kampus', icon: <Award className="w-5 h-5 md:w-6 md:h-6" /> },
  ]

  const categories = [
    { id: 'all', name: 'Semua Kelas', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'essay', name: 'Essay & Writing', icon: <FileText className="w-5 h-5" /> },
    { id: 'business', name: 'Business Plan', icon: <Trophy className="w-5 h-5" /> },
    { id: 'research', name: 'Penelitian', icon: <Award className="w-5 h-5" /> },
    { id: 'design', name: 'Desain', icon: <Video className="w-5 h-5" /> }
  ]

  return (
    <>
      <LayoutNavbar>
        <div className={`flex flex-col gap-8 md:gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Hero Section dengan Carousel */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Platform Terdepan untuk Prestasi Mahasiswa
              </h1>
              <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
                Raih prestasi terbaikmu dengan dukungan lengkap dari e-learning, mentoring, dan komunitas inspiratif
              </p>
            </div>

            <div className="flex flex-col lg:flex-row justify-center gap-4 w-full relative">
              {/* Left Box */}
              <div className="bg-blue-600 h-28 sm:h-32 md:h-48 w-full lg:w-1/4 rounded-xl md:rounded-2xl order-2 lg:order-1 overflow-hidden group relative transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer hidden sm:block">
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="p-3 sm:p-4 text-white h-full flex flex-col justify-center items-center text-center transition-all duration-300 group-hover:scale-110">
                  <Video className="w-5 h-5 md:w-6 md:h-6 mb-2" />
                  <h3 className="font-semibold text-sm md:text-base">Video Inspirasi</h3>
                  <p className="text-xs mt-1">Tonton kisah sukses</p>
                </div>
              </div>

              {/* Center Carousel */}
              <div className="relative h-36 sm:h-40 md:h-48 w-full lg:w-2/4 rounded-xl md:rounded-2xl order-1 lg:order-2 overflow-hidden group">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                      slide.bgColor
                    } rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-white p-4 sm:p-6 ${
                      index === currentSlide
                        ? 'translate-x-0'
                        : index < currentSlide
                        ? '-translate-x-full'
                        : 'translate-x-full'
                    }`}
                  >
                    <div className="bg-blue-700 p-2 sm:p-3 rounded-lg md:rounded-xl mb-2 sm:mb-3 transition-all duration-300 group-hover:scale-110">
                      {slide.icon}
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 px-2 sm:px-4 text-center transition-all duration-300 group-hover:scale-105">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-center px-2 transition-all duration-300 group-hover:scale-105">{slide.subtitle}</p>
                  </div>
                ))}
                
                {/* Carousel Controls */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white p-1 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-blue-900"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white p-1 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-blue-900"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                        index === currentSlide
                          ? 'bg-white w-4'
                          : 'bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Box */}
              <div className="bg-blue-600 h-28 sm:h-32 md:h-48 w-full lg:w-1/4 rounded-xl md:rounded-2xl order-3 overflow-hidden group relative transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer hidden sm:block">
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="p-3 sm:p-4 text-white h-full flex flex-col justify-center items-center text-center transition-all duration-300 group-hover:scale-110">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 mb-2" />
                  <h3 className="font-semibold text-sm md:text-base">Template</h3>
                  <p className="text-xs mt-1">Download gratis</p>
                </div>
              </div>
            </div>

            {/* Mobile Only Boxes */}
            <div className="flex flex-row gap-3 mt-4 sm:hidden">
              <div className="bg-blue-600 h-20 w-1/2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 active:scale-95">
                <div className="p-3 text-white h-full flex flex-col justify-center items-center text-center">
                  <Video className="w-4 h-4 mb-1" />
                  <h3 className="font-semibold text-xs">Video Inspirasi</h3>
                  <p className="text-xs mt-1">Tonton kisah sukses</p>
                </div>
              </div>
              <div className="bg-blue-600 h-20 w-1/2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 active:scale-95">
                <div className="p-3 text-white h-full flex flex-col justify-center items-center text-center">
                  <FileText className="w-4 h-4 mb-1" />
                  <h3 className="font-semibold text-xs">Template</h3>
                  <p className="text-xs mt-1">Download gratis</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Dalam Angka
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
                Bukti nyata kesuksesan platform Ambil Prestasi
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg md:rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-blue-700">{stat.value}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm transition-all duration-300 group-hover:text-gray-900">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kategori Kelas - Menggantikan Kategori Lomba & Kompetisi */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Kategori Kelas yang Tersedia
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
                Pilih kategori kelas yang sesuai dengan minat dan kebutuhan belajarmu
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category, index) => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-lg md:rounded-xl p-4 text-gray-900 transition-all duration-300 cursor-pointer shadow-md border border-gray-200 hover:scale-105 hover:shadow-lg hover:border-blue-300 group text-center"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mb-3 transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110 mx-auto w-fit">
                    <div className="text-blue-600 transition-all duration-300 group-hover:text-white">
                      {category.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 text-sm transition-all duration-300 group-hover:text-blue-700">{category.name}</p>
                    <span className="text-blue-600 text-xs font-semibold transition-all duration-300 group-hover:text-blue-800">
                      {courses.filter(course => category.id === 'all' || course.category === category.id).length}+ Kelas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kelas Populer */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Kelas Populer
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
                Temukan kelas terpopuler yang sedang banyak diminati oleh mahasiswa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.slice(0, 3).map((course) => (
                <Link href={`/elearning/${course.id}`} key={course.id}>
                  <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group hover:scale-105 cursor-pointer">
                    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      {course.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-blue-600 p-2 md:p-3 rounded-full hover:bg-blue-50 transition-colors">
                          <Eye className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs md:text-sm text-blue-700 font-semibold bg-blue-100 px-2 py-1 md:px-3 md:py-1 rounded-full">
                          {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          course.level === 'Pemula' ? 'bg-green-100 text-green-700' :
                          course.level === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium text-xs md:text-sm">{course.instructor}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{course.participants}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{course.rating}</span>
                        </div>
                      </div>

                      <button className="w-full bg-blue-700 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:bg-blue-800 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base">
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        Lihat Detail Kelas
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/elearning">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95 flex items-center gap-2 justify-center mx-auto">
                  Lihat Semua Kelas
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </section>

          {/* Fitur Ambil Prestasi */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Layanan Unggulan Kami
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
                Platform lengkap untuk mendukung perjalanan prestasi mahasiswa Indonesia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: 'E-Learning',
                  desc: 'Pelatihan interaktif untuk membantu mahasiswa belajar dan berprestasi dalam berbagai kompetensi.',
                  image: '/e-learning.png',
                  features: ['Video Materi', 'Quiz Interaktif', 'Sertifikat'],
                  icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
                  color: 'blue'
                },
                {
                  title: 'Kisah Inspiratif',
                  desc: 'Forum diskusi dan berbagi pengalaman inspiratif antar mahasiswa berprestasi se-Indonesia.',
                  image: '/poster.png',
                  features: ['Sharing Session', 'Networking', 'Motivasi'],
                  icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
                  color: 'green'
                },
                {
                  title: 'E-Mentoring',
                  desc: 'Bimbingan langsung dari para mentor berpengalaman untuk persiapan kompetisi dan lomba.',
                  image: '/e-mentoring.png',
                  features: ['1-on-1 Session', 'Feedback Langsung', 'Tips Expert'],
                  icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
                  color: 'purple'
                },
              ].map((fitur, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300 cursor-pointer group"
                >
                  <div className="relative h-32 sm:h-36 md:h-40 w-full overflow-hidden">
                    <Image
                      src={fitur.image}
                      alt={fitur.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-${fitur.color}-600 opacity-0 group-hover:opacity-10 transition-all duration-300`}></div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className={`bg-${fitur.color}-100 p-1 sm:p-2 rounded-lg text-${fitur.color}-600 transition-all duration-300 group-hover:bg-${fitur.color}-600 group-hover:text-white group-hover:scale-110`}>
                        {fitur.icon}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 transition-all duration-300 group-hover:text-blue-700">{fitur.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3 transition-all duration-300 group-hover:text-gray-800">{fitur.desc}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {fitur.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium transition-all duration-300 hover:bg-blue-200 hover:scale-105"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full max-w-7xl mx-auto">
            <div className="bg-blue-600 rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 text-white text-center transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 transition-all duration-300 hover:scale-105">
                Siap Meraih Prestasi?
              </h2>
              <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                Bergabunglah dengan ribuan mahasiswa lainnya yang telah meraih prestasi melalui platform kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Link href="/elearning">
                  <button className="bg-white text-blue-700 px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 justify-center text-sm sm:text-base group">
                    Jelajahi Kelas
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="border border-white text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600 active:scale-95 text-sm sm:text-base">
                    Lihat Paket Harga
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </LayoutNavbar>
      <Footer/>
    </>
  )
}