import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, DollarSign, Users, TrendingUp, BarChart3, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useArt } from '../context/ArtContext'

export default function PinterArtDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { pins } = useArt()

    // Filters: 'today' | '7d' | '30d'
    const [range, setRange] = useState('30d')

    const now = Date.now()
    const rangeMs = useMemo(() => ({
        today: 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
    }[range]), [range])

    const recentPins = useMemo(() => {
        return pins.filter(p => {
            const ts = p.updatedAt || p.createdAt || now
            return now - (typeof ts === 'number' ? ts : new Date(ts).getTime()) <= rangeMs
        })
    }, [pins, rangeMs])

    // Derived metrics (mock): revenue ~ premium pins * 50k, subscribers ~ followers on premium pins, views ~ saved + likes
    const stats = useMemo(() => {
        const premiumCount = recentPins.filter(p => p.isPremium).length
        const revenue = premiumCount * 50000
        const subscribers = recentPins.reduce((acc, p) => acc + (p.isPremium && p.isUnlocked ? 1 : 0), 0) + premiumCount * 2
        const views = recentPins.reduce((acc, p) => acc + (p.isSaved ? 50 : 20) + (p.isLiked ? 30 : 10), 0)
        // Simple trend mock: compare with pins outside range
        const prevPins = pins.length - recentPins.length
        const trend = prevPins > 0 ? Math.min(25, Math.max(-25, Math.round((recentPins.length - prevPins) / Math.max(prevPins,1) * 100))) : 12
        return { revenue, subscribers, views, trend }
    }, [recentPins, pins.length])

    const topWorks = useMemo(() => {
        return pins.slice(0, 5).map(p => ({
            title: p.title,
            src: p.src,
            premium: !!p.isPremium,
            views: (p.isSaved ? 1200 : 500) + (p.isLiked ? 800 : 200),
            earning: p.isPremium ? 120000 : 0,
        }))
    }, [pins])

    useEffect(() => {
        if (!user) {
            navigate('/auth', { replace: true, state: { from: location.pathname } })
        }
    }, [user, navigate, location])
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Header Dashboard */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></Link>
                <span className="font-bold text-lg">Creator Studio</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Pendapatan {range}</p>
                        <p className="font-bold text-green-600">Rp {stats.revenue.toLocaleString('id-ID')}</p>
                </div>
                <div className="w-8 h-8 bg-black rounded-full overflow-hidden">
                        <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user?.username||'Artist')}`} alt="avatar" />
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Range Filters */}
            <div className="flex items-center justify-end gap-2 mb-4">
              {['today','7d','30d'].map(r => (
                <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${range===r?'bg-black text-white border-black':'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                  {r==='today'?'Hari ini':r==='7d'?'7 Hari':'30 Hari'}
                </button>
              ))}
            </div>
        
        {/* 1. Ringkasan Statistik (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Card 1: Pendapatan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                        <p className="text-gray-500 text-sm font-medium">Pendapatan</p>
                        <h3 className="text-2xl font-bold">Rp {stats.revenue.toLocaleString('id-ID')}</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {stats.trend}% dibanding periode sebelumnya
                    </p>
                </div>
            </div>

            {/* Card 2: Subscriber */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                        <p className="text-gray-500 text-sm font-medium">Subscriber (perkiraan)</p>
                        <h3 className="text-2xl font-bold">{stats.subscribers.toLocaleString('id-ID')}</h3>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                            Periode: {range === 'today' ? 'Hari ini' : range === '7d' ? '7 Hari' : '30 Hari'}
                    </p>
                </div>
            </div>

            {/* Card 3: Total Views */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                        <p className="text-gray-500 text-sm font-medium">Total Dilihat (estimasi)</p>
                        <h3 className="text-2xl font-bold">{stats.views.toLocaleString('id-ID')}</h3>
                        <p className="text-xs text-gray-400">Periode: {range === 'today' ? 'Hari ini' : range === '7d' ? '7 Hari' : '30 Hari'}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 2. Grafik Performa (Simulasi Visual CSS) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6">Analitik Pendapatan</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {([40, 65, 45, 80, 55, 90, 70].map((h,i)=>h + (range==='today'? -10 : range==='7d'? 0 : 10))).map((h, i) => (
                        <div key={i} className="w-full flex flex-col items-center gap-2 group">
                            <div 
                                style={{ height: `${h}%` }} 
                                className="w-full bg-gray-100 rounded-t-lg group-hover:bg-red-500 transition-colors relative"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    Rp{h}0k
                                </div>
                            </div>
                                <span className="text-xs text-gray-400">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Subscriber Terbaru */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Subscriber Terbaru</h3>
                <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} alt="user" />
                                </div>
                                <div>
                                        <p className="text-sm font-semibold">User #{i + 120}</p>
                                    <p className="text-[10px] text-gray-500">Bergabung 2j yang lalu</p>
                                </div>
                            </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+Rp 50rb</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 text-center text-sm font-semibold text-gray-500 hover:text-black">Lihat Semua</button>
            </div>

        </div>

        {/* 4. Top Karya */}
        <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Karya Terpopuler</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500">
                            <th className="pb-3 font-medium">Judul Karya</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Dilihat</th>
                            <th className="pb-3 font-medium">Pendapatan</th>
                        </tr>
                    </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topWorks.map((w, idx) => (
                              <tr key={idx}>
                                <td className="py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                                        <img src={w.src} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <span className="font-medium">{w.title}</span>
                                </td>
                                <td className="py-3">
                                  <span className={`text-[10px] px-2 py-1 rounded-full ${w.premium ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    {w.premium ? 'Premium' : 'Gratis'}
                                  </span>
                                </td>
                                <td className="py-3">{w.views.toLocaleString('id-ID')}</td>
                                <td className="py-3 {w.earning>0 ? 'font-bold text-green-600' : 'text-gray-400'}">{w.earning>0 ? `Rp ${w.earning.toLocaleString('id-ID')}` : '-'}</td>
                              </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  )
}