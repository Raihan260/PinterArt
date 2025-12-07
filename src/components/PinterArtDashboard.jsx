import { Link } from 'react-router-dom'
import { ArrowLeft, DollarSign, Users, TrendingUp, BarChart3, Star } from 'lucide-react'

export default function PinterArtDashboard() {
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
                    <p className="text-xs text-gray-500">Saldo Saat Ini</p>
                    <p className="font-bold text-green-600">Rp 2.500.000</p>
                </div>
                <div className="w-8 h-8 bg-black rounded-full overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 1. Ringkasan Statistik (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Card 1: Pendapatan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Pendapatan Bulan Ini</p>
                    <h3 className="text-2xl font-bold">Rp 2.5jt</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12% dari bulan lalu
                    </p>
                </div>
            </div>

            {/* Card 2: Subscriber */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Subscriber Aktif</p>
                    <h3 className="text-2xl font-bold">142</h3>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                        +5 subscriber baru hari ini
                    </p>
                </div>
            </div>

            {/* Card 3: Total Views */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Dilihat</p>
                    <h3 className="text-2xl font-bold">18.4k</h3>
                    <p className="text-xs text-gray-400">Dalam 30 hari terakhir</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 2. Grafik Performa (Simulasi Visual CSS) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6">Analitik Pendapatan</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
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
                        <tr>
                            <td className="py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                                    <img src="/images/1.jpg" className="w-full h-full object-cover" alt="" />
                                </div>
                                <span className="font-medium">Cyberpunk City #01</span>
                            </td>
                            <td className="py-3"><span className="bg-black text-white text-[10px] px-2 py-1 rounded-full">Premium</span></td>
                            <td className="py-3">12.5k</td>
                            <td className="py-3 font-bold text-green-600">Rp 1.200.000</td>
                        </tr>
                        <tr>
                            <td className="py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                                    <img src="/images/2.jpg" className="w-full h-full object-cover" alt="" />
                                </div>
                                <span className="font-medium">Sketch of A Girl</span>
                            </td>
                            <td className="py-3"><span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full">Gratis</span></td>
                            <td className="py-3">5.2k</td>
                            <td className="py-3 text-gray-400">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  )
}