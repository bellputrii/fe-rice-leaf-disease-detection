'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import { CheckCircle, Play, Users, Clock, BookOpen, Star, ArrowRight, Video, FileText, Award } from 'lucide-react'

export default function ELearningPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua Kursus' },
    { id: 'essay', name: 'Essay' },
    { id: 'business', name: 'Business Plan' },
    { id: 'research', name: 'Penelitian' },
    { id: 'design', name: 'Desain' }
  ]

  const courses = [
    {
      id: 1,
      category: 'essay',
      title: 'Menulis Esai Akademik yang Menang',
      image: '/images/essay.jpg',
      duration: '6 Jam',
      participants: '420',
      level: 'Pemula',
      rating: 4.8,
      instructor: 'Dr. Sarah Wijaya',
      featured: true
    },
    {
      id: 2,
      category: 'business',
      title: 'Business Plan untuk Kompetisi Startup',
      image: '/images/bplan.jpg',
      duration: '8 Jam',
      participants: '310',
      level: 'Menengah',
      rating: 4.9,
      instructor: 'Prof. Ahmad Rahman',
      featured: true
    },
    {
      id: 3,
      category: 'research',
      title: 'Karya Tulis Ilmiah & Publikasi',
      image: '/images/kti.jpg',
      duration: '5 Jam',
      participants: '280',
      level: 'Pemula',
      rating: 4.7,
      instructor: 'Dr. Lisa Santoso'
    },
    {
      id: 4,
      category: 'design',
      title: 'Desain Poster Akademik yang Impactful',
      image: '/images/poster.jpg',
      duration: '4 Jam',
      participants: '355',
      level: 'Pemula',
      rating: 4.6,
      instructor: 'Maya Desain'
    },
    {
      id: 5,
      category: 'essay',
      title: 'Advanced Essay Writing Techniques',
      image: '/images/essay-advanced.jpg',
      duration: '7 Jam',
      participants: '190',
      level: 'Lanjutan',
      rating: 4.9,
      instructor: 'Dr. Budi Prasetyo'
    },
    {
      id: 6,
      category: 'business',
      title: 'Financial Modeling untuk Business Plan',
      image: '/images/financial-modeling.jpg',
      duration: '6 Jam',
      participants: '225',
      level: 'Menengah',
      rating: 4.8,
      instructor: 'Prof. Dian Sastro'
    }
  ]

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory)

  const stats = [
    { value: '180+', label: 'Video Pembelajaran', icon: <Video className="w-6 h-6" /> },
    { value: '90+', label: 'Modul Belajar', icon: <FileText className="w-6 h-6" /> },
    { value: '6500+', label: 'Peserta Aktif', icon: <Users className="w-6 h-6" /> },
    { value: '300+', label: 'Pemenang Kompetisi', icon: <Award className="w-6 h-6" /> },
  ]

  const learningPath = [
    {
      step: '1',
      title: 'Belajar Interaktif',
      desc: 'Pelajari konten-konten berkualitas dan tonton video dari mentor berpengalaman.',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      step: '2',
      title: 'Praktik Langsung',
      desc: 'Implementasikan materi dengan latihan dan studi kasus nyata.',
      icon: <Play className="w-8 h-8" />
    },
    {
      step: '3',
      title: 'Raih Prestasi',
      desc: 'Siap berkompetisi dan raih prestasi terbaik dengan bekal yang matang!',
      icon: <Award className="w-8 h-8" />
    }
  ]

  return (
    <LayoutNavbar>
      <div className="flex flex-col gap-16 md:gap-20 px-4 md:px-0 pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">E-Learning Platform</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Tingkatkan Skill & Raih Prestasi Bersama E-Learning
              </h1>
              
              <p className="text-blue-100 text-lg leading-relaxed">
                Pelajari berbagai materi kuliah, lomba, dan keterampilan kompetitif.  
                Belajar fleksibel dengan video, modul belajar, serta forum diskusi interaktif.
              </p>

              <div className="space-y-3">
                {[
                  "Belajar fleksibel di mana saja & kapan saja",
                  "Modul dikurasi langsung oleh mentor berpengalaman",
                  "Gratis dan mudah diakses oleh seluruh mahasiswa"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-300 flex-shrink-0" size={20} />
                    <span className="text-blue-100">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Jelajahi Kursus
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                  Lihat Preview
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/images/elearning.jpg"
                  alt="E-Learning"
                  width={500}
                  height={400}
                  className="rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">300+</p>
                      <p className="text-sm text-gray-600">Pemenang Lomba</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistik Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kategori Kursus */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
              Kategori Kursus
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih kategori yang sesuai dengan minat dan kebutuhan belajarmu
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Kursus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {course.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/90 text-blue-600 p-3 rounded-full hover:bg-white transition-colors">
                      <Play className="w-6 h-6" fill="currentColor" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded-full">
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

                  <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.participants}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 group-hover:shadow-lg flex items-center justify-center gap-2">
                    Mulai Belajar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alur Pembelajaran */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                Alur Pembelajaran
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ikuti langkah-langkah sistematis untuk mencapai kesuksesan dalam kompetisi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {learningPath.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 text-center"
                >
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 mx-auto group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl w-fit mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Mengembangkan Potensimu?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Bergabung dengan ribuan mahasiswa lainnya dan raih prestasi terbaik melalui program E-Learning kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                <BookOpen className="w-5 h-5" />
                Mulai Belajar Sekarang
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                Lihat Semua Kursus
              </button>
            </div>
          </div>
        </section>
      </div>
    </LayoutNavbar>
  )
}