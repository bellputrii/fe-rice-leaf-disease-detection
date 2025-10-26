'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import { ChevronLeft, ChevronRight, Play, Users, Trophy, BookOpen, Star, Clock, Award, ArrowRight } from 'lucide-react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Meraih Prestasi Bersama Ambil Prestasi",
      subtitle: "Platform terdepan untuk mahasiswa berprestasi",
      icon: <Trophy className="w-8 h-8" />,
      bgColor: "bg-blue-600"
    },
    {
      title: "E-Learning Interaktif",
      subtitle: "Belajar dengan metode modern dan mentor berpengalaman",
      icon: <BookOpen className="w-8 h-8" />,
      bgColor: "bg-blue-600"
    },
    {
      title: "Komunitas Inspiratif",
      subtitle: "Bergabung dengan mahasiswa berprestasi se-Indonesia",
      icon: <Users className="w-8 h-8" />,
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
    { value: '10K+', label: 'Mahasiswa', icon: <Users className="w-6 h-6" /> },
    { value: '500+', label: 'Prestasi', icon: <Trophy className="w-6 h-6" /> },
    { value: '100+', label: 'Mentor', icon: <BookOpen className="w-6 h-6" /> },
    { value: '50+', label: 'Kampus', icon: <Award className="w-6 h-6" /> },
  ]

  return (
    <LayoutNavbar>
      <div className="flex flex-col gap-16 md:gap-20 px-4 md:px-0 pt-16 md:pt-20">
        {/* Hero Section dengan Carousel */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center gap-4 w-full relative">
            {/* Left Box */}
            <div className="bg-blue-600 h-32 md:h-48 w-full md:w-1/4 rounded-2xl order-2 md:order-1 overflow-hidden group relative hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="p-4 text-white h-full flex flex-col justify-center">
                <h3 className="font-semibold text-sm md:text-base">Video Inspirasi</h3>
                <p className="text-xs mt-2 opacity-90">Tonton kisah sukses</p>
              </div>
            </div>

            {/* Center Carousel */}
            <div className="relative h-40 md:h-48 w-full md:w-2/4 rounded-2xl order-1 md:order-2 overflow-hidden group">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    slide.bgColor
                  } rounded-2xl flex flex-col items-center justify-center text-white p-6 ${
                    index === currentSlide
                      ? 'translate-x-0'
                      : index < currentSlide
                      ? '-translate-x-full'
                      : 'translate-x-full'
                  }`}
                >
                  <div className="bg-white/20 p-3 rounded-xl mb-3">
                    {slide.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold mb-2 px-4 text-center">
                    {slide.title}
                  </h2>
                  <p className="text-sm opacity-90 text-center">{slide.subtitle}</p>
                </div>
              ))}
              
              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Box */}
            <div className="bg-blue-600 h-32 md:h-48 w-full md:w-1/4 rounded-2xl order-3 overflow-hidden group relative hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="p-4 text-white h-full flex flex-col justify-center">
                <h3 className="font-semibold text-sm md:text-base">Komunitas</h3>
                <p className="text-xs mt-2 opacity-90">10K+ Anggota</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
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

        {/* Kategori Prestasi */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
              Kategori Lomba & Kompetisi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai jenis kompetisi yang sesuai dengan minat dan bakatmu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Essay', 
                image: '/images/essay.jpg', 
                count: '50+ Lomba',
                participants: '2.5K+ Peserta'
              },
              { 
                title: 'Business Plan', 
                image: '/images/bpc.jpg', 
                count: '30+ Kompetisi',
                participants: '1.8K+ Peserta'
              },
              { 
                title: 'Karya Tulis Ilmiah', 
                image: '/images/kti.jpg', 
                count: '40+ Event',
                participants: '2.2K+ Peserta'
              },
              { 
                title: 'Poster', 
                image: '/images/poster.jpg', 
                count: '25+ Ajang',
                participants: '1.5K+ Peserta'
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-4 text-gray-800 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-gray-100 group"
              >
                <div className="h-28 w-full bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="rounded-xl object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{item.title}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600 font-semibold">{item.count}</span>
                    <span className="text-gray-500">{item.participants}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kisah Inspiratif */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
              Kisah Inspiratif Mahasiswa Berprestasi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Belajar dari pengalaman mahasiswa yang telah meraih prestasi gemilang
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                image: '/images/person1.jpg', 
                name: 'Ahmad Rizki', 
                achievement: 'Juara 1 Essay Nasional',
                university: 'Universitas Indonesia',
                rating: 4.9
              },
              { 
                image: '/images/person2.jpg', 
                name: 'Sari Dewi', 
                achievement: 'Finalis Business Plan',
                university: 'ITB',
                rating: 4.8
              },
              { 
                image: '/images/person3.jpg', 
                name: 'Budi Santoso', 
                achievement: 'Peneliti Muda',
                university: 'UGM',
                rating: 4.7
              },
              { 
                image: '/images/person4.jpg', 
                name: 'Maya Sari', 
                achievement: 'Inovator Poster',
                university: 'ITS',
                rating: 4.9
              },
            ].map((person, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-full h-40 md:h-52 mx-auto overflow-hidden rounded-2xl mb-4">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="rounded-2xl object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                    <div className="text-white text-left">
                      <p className="text-xs font-semibold">{person.university}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold">{person.rating}</span>
                  </div>
                </div>
                <p className="font-bold text-gray-800">{person.name}</p>
                <p className="text-sm text-blue-600 font-semibold">{person.achievement}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fitur Ambil Prestasi */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
              Berbagai Fitur Ambil Prestasi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform lengkap untuk mendukung perjalanan prestasi mahasiswa Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'E-Learning',
                desc: 'Pelatihan interaktif untuk membantu mahasiswa belajar dan berprestasi dalam berbagai kompetensi.',
                image: '/images/elearning.jpg',
                features: ['Video Materi', 'Quiz Interaktif', 'Sertifikat'],
                icon: <BookOpen className="w-6 h-6" />
              },
              {
                title: 'Kisah Inspiratif',
                desc: 'Forum diskusi dan berbagi pengalaman inspiratif antar mahasiswa berprestasi se-Indonesia.',
                image: '/images/inspiratif.jpg',
                features: ['Sharing Session', 'Networking', 'Motivasi'],
                icon: <Users className="w-6 h-6" />
              },
              {
                title: 'E-Mentoring',
                desc: 'Bimbingan langsung dari para mentor berpengalaman untuk persiapan kompetisi dan lomba.',
                image: '/images/ementoring.jpg',
                features: ['1-on-1 Session', 'Feedback Langsung', 'Tips Expert'],
                icon: <Award className="w-6 h-6" />
              },
            ].map((fitur, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={fitur.image}
                    alt={fitur.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      {fitur.icon}
                    </div>
                    <h3 className="font-bold text-lg text-blue-800">{fitur.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{fitur.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {fitur.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium"
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Meraih Prestasi?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Bergabunglah dengan ribuan mahasiswa lainnya yang telah meraih prestasi melalui platform kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                Lihat Jadwal Lomba
              </button>
            </div>
          </div>
        </section>

        {/* Penutup */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8 shadow-inner w-full border border-gray-200">
            <div className="relative w-full h-48 md:h-64 mb-6 rounded-2xl overflow-hidden">
              <Image
                src="/images/laptop.jpg"
                alt="Platform Ambil Prestasi"
                fill
                className="rounded-2xl object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4">
                Platform Terpadu untuk Prestasi Mahasiswa
              </h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                Ambil Prestasi hadir untuk menjadi teman perjalananmu dalam meraih mimpi dan prestasi. 
                Dengan berbagai fitur unggulan dan dukungan komunitas, kami siap membantumu mencapai 
                potensi terbaik dalam setiap kompetisi dan lomba.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LayoutNavbar>
  )
}