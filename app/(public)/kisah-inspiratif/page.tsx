'use client'

import { useState } from 'react'
import Image from 'next/image'
import LayoutNavbar from '@/components/public/LayoutNavbar'
import { CheckCircle, Users, Award, BookOpen, Star, ArrowRight, Quote, Calendar, MapPin } from 'lucide-react'

export default function KisahInspiratifPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua Kisah' },
    { id: 'essay', name: 'Essay' },
    { id: 'business', name: 'Business Plan' },
    { id: 'research', name: 'Penelitian' },
    { id: 'design', name: 'Desain' }
  ]

  const stats = [
    { value: '60+', label: 'Kisah Inspiratif', icon: <Users className="w-6 h-6" /> },
    { value: '30+', label: 'Kompetisi Internasional', icon: <Award className="w-6 h-6" /> },
    { value: '100+', label: 'Tips & Trik', icon: <BookOpen className="w-6 h-6" /> },
    { value: '50+', label: 'Mahasiswa Berprestasi', icon: <Star className="w-6 h-6" /> },
  ]

  const stories = [
    {
      id: 1,
      category: 'essay',
      name: 'Arif Nugraha',
      image: '/images/person1.jpg',
      achievement: 'Juara 1 Essay Nasional',
      university: 'Universitas Indonesia',
      story: 'Mahasiswa Teknik Informatika yang berhasil menjuarai lomba esai nasional dengan topik inovasi teknologi ramah lingkungan.',
      rating: 4.9,
      date: '2024',
      featured: true
    },
    {
      id: 2,
      category: 'business',
      name: 'Mila S. Putri',
      image: '/images/person2.jpg',
      achievement: 'Runner-Up Public Speaking Competition',
      university: 'ITB',
      story: 'Berhasil menjadi runner-up dalam kompetisi public speaking tingkat nasional dengan presentasi bisnis yang inovatif.',
      rating: 4.8,
      date: '2024'
    },
    {
      id: 3,
      category: 'research',
      name: 'Rudi Tri Saputra',
      image: '/images/person3.jpg',
      achievement: 'Best Paper Youth Competition',
      university: 'UGM',
      story: 'Meraih penghargaan best paper dalam kompetisi youth competition dengan penelitian tentang energi terbarukan.',
      rating: 4.7,
      date: '2024'
    },
    {
      id: 4,
      category: 'design',
      name: 'Dewi Lestari',
      image: '/images/person4.jpg',
      achievement: 'Finalis Karya Tulis Ilmiah Nasional',
      university: 'ITS',
      story: 'Finalis karya tulis ilmiah nasional dengan desain prototype alat pendeteksi dini bencana alam.',
      rating: 4.9,
      date: '2024'
    },
    {
      id: 5,
      category: 'essay',
      name: 'Budi Santoso',
      image: '/images/person5.jpg',
      achievement: 'Juara 2 Essay Internasional',
      university: 'Universitas Gadjah Mada',
      story: 'Berhasil meraih juara 2 dalam kompetisi essay internasional tentang sustainable development goals.',
      rating: 4.8,
      date: '2023'
    },
    {
      id: 6,
      category: 'business',
      name: 'Sari Dewi',
      image: '/images/person6.jpg',
      achievement: 'Finalis Business Plan Competition',
      university: 'Universitas Brawijaya',
      story: 'Finalis business plan competition dengan startup di bidang pendidikan digital untuk daerah terpencil.',
      rating: 4.6,
      date: '2023'
    }
  ]

  const filteredStories = activeCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === activeCategory)

  const tips = [
    {
      title: 'Atur Waktu dengan Efektif',
      desc: 'Gunakan teknik Pomodoro untuk menjaga fokus dan efisiensi belajar dalam persiapan kompetisi.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Lingkungan Positif',
      desc: 'Berkumpul dengan teman-teman yang mendukung impian dan semangatmu untuk mencapai prestasi.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Berani Bermimpi Besar',
      desc: 'Tidak ada batas untuk mimpi jika kamu terus berusaha, belajar, dan percaya pada kemampuan diri.',
      icon: <Star className="w-6 h-6" />
    }
  ]

  const featuredStory = stories[0]

  return (
    <LayoutNavbar>
      <div className="flex flex-col gap-16 md:gap-20 px-4 md:px-0 pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit">
                <Quote className="w-4 h-4" />
                <span className="text-sm font-medium">Inspirasi & Motivasi</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Kisah Inspiratif Mahasiswa Berprestasi
              </h1>
              
              <p className="text-blue-100 text-lg leading-relaxed">
                Setiap mahasiswa memiliki kisah perjuangan unik dalam meraih prestasi.  
                Dari mereka yang berjuang dari nol, hingga yang terus berbagi semangat 
                untuk berprestasi dan menginspirasi sesama.
              </p>

              <div className="space-y-3">
                {[
                  "Cerita nyata mahasiswa yang berhasil menginspirasi banyak orang",
                  "Motivasi dan semangat pantang menyerah dari berbagai latar belakang",
                  "Wadah untuk berbagi inspirasi dan perjalanan menuju sukses"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-300 flex-shrink-0" size={20} />
                    <span className="text-blue-100">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Jelajahi Kisah
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                  Bagikan Kisahmu
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/images/inspiration-hero.jpg"
                  alt="Kisah Inspiratif"
                  width={500}
                  height={400}
                  className="rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">50+</p>
                      <p className="text-sm text-gray-600">Mahasiswa Berprestasi</p>
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

        {/* Featured Story */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Kisah Utama Bulan Ini</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold">
                  {featuredStory.name}
                </h2>
                
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{featuredStory.university}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{featuredStory.achievement}</span>
                  </div>
                </div>

                <p className="text-blue-100 leading-relaxed">
                  {featuredStory.story} Ia memulai perjalanannya dari keterbatasan, 
                  namun semangat belajar dan dukungan komunitas membuatnya terus 
                  berkembang hingga mampu menginspirasi banyak mahasiswa lain.
                </p>

                <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center gap-2">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm">
                  <Image
                    src={featuredStory.image}
                    alt={featuredStory.name}
                    width={400}
                    height={400}
                    className="rounded-2xl object-cover shadow-2xl"
                  />
                  <div className="absolute -top-3 -right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori Kisah */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
              Kisah Mahasiswa Berprestasi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan inspirasi dari perjalanan mahasiswa berprestasi di berbagai bidang
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

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {story.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold">{story.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/90 text-blue-600 p-3 rounded-full hover:bg-white transition-colors">
                      <Quote className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded-full">
                      {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">{story.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                    {story.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{story.university}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {story.story}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">
                      {story.achievement}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center gap-1">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips & Trik Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                Tips & Trik dari Para Juara
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pelajari strategi dan tips dari mahasiswa berprestasi untuk meraih kesuksesan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 text-center"
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl w-fit mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {tip.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Punya Kisah Inspiratif?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Bagikan pengalaman dan perjalanan prestasimu untuk menginspirasi mahasiswa lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                <Quote className="w-5 h-5" />
                Bagikan Kisahmu
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                Lihat Semua Kisah
              </button>
            </div>
          </div>
        </section>
      </div>
    </LayoutNavbar>
  )
}