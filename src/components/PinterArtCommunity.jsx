import { useMemo, useState } from 'react'
import { Hash, Users, PlusCircle, Sparkles, Heart, Share2, Bookmark, UserPlus, MessageSquare, X, Search } from 'lucide-react'
import { useArt } from '../context/ArtContext'
import { useAuth } from '../context/AuthContext'

export default function PinterArtCommunity() {
  const { pins, addPin, toggleLike, toggleSave, toggleFollow, addComment } = useArt()
  const { user } = useAuth()

  const [composerOpen, setComposerOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tagText, setTagText] = useState('')
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortBy, setSortBy] = useState('latest') // latest | popular
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const tags = useMemo(() => {
    // naive tags from titles/description words
    const words = pins.flatMap(p => (
      (p.title + ' ' + (p.description || ''))
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
    ))
    const count = new Map()
    words.forEach(w => {
      if (w.length < 3) return
      count.set(w, (count.get(w) || 0) + 1)
    })
    return Array.from(count.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, freq]) => ({ name, freq }))
  }, [pins])

  const filteredPins = useMemo(() => {
    let list = pins.filter(p => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch = !q || (p.title + ' ' + (p.description || '') + ' ' + (p.artist || '')).toLowerCase().includes(q)
      const matchesTag = !selectedTag || (p.title + ' ' + (p.description || '')).toLowerCase().includes(selectedTag.toLowerCase())
      return matchesSearch && matchesTag
    })
    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
    }
    // latest keeps original order (new posts are unshifted by addPin)
    return list
  }, [pins, searchQuery, selectedTag, sortBy])

  const creators = useMemo(() => {
    const names = new Map()
    pins.forEach(p => {
      names.set(p.artist, (names.get(p.artist) || 0) + 1)
    })
    return Array.from(names.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))
  }, [pins])

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  const handlePublish = () => {
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Judul & URL gambar wajib', 'error')
      return
    }
    const id = 'community-' + Date.now()
    const explicitTags = tagText
      .split(/[# ,]+/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
    addPin({
      id,
      src: imageUrl.trim(),
      title: title.trim(),
      description: description.trim(),
      isPremium: false,
      artist: user?.username || 'Community Member',
      avatar: user?.avatarUrl,
      tags: explicitTags,
    })
    setTitle('')
    setImageUrl('')
    setDescription('')
    setTagText('')
    setComposerOpen(false)
    showToast('Postingan komunitas dibuat', 'success')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
      {/* Header + Actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Komunitas</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border bg-gray-100 px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari postingan atau kreator..."
              className="w-64 bg-transparent text-sm outline-none"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-full border bg-white px-3 py-2 text-sm">
            <option value="latest">Terbaru</option>
            <option value="popular">Populer</option>
          </select>
          <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white font-semibold"
        >
          <PlusCircle className="w-5 h-5" />
          Buat Postingan
          </button>
        </div>
      </div>

      {/* Top widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold">Tag Populer</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTag(selectedTag === t.name ? '' : t.name)}
                className={`text-xs px-3 py-1 rounded-full ${selectedTag === t.name ? 'bg-black text-white' : 'bg-gray-100'}`}
                title={`Tag #${t.name}`}
              >
                #{t.name} <span className="text-gray-500">{t.freq}</span>
              </button>
            ))}
            {tags.length === 0 && <p className="text-sm text-gray-600">Belum ada tag.</p>}
          </div>
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold">Kreator Aktif</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {creators.map(c => (
              <div key={c.name} className="flex items-center gap-2 rounded-xl border p-2">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.count} karya</p>
                </div>
              </div>
            ))}
            {creators.length === 0 && <p className="text-sm text-gray-600">Belum ada kreator.</p>}
          </div>
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold">Sorotan Minggu Ini</h2>
          </div>
          <div className="space-y-2">
            {pins.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.src} alt={p.title} className="w-12 h-12 object-cover rounded-xl" />
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-gray-600">{p.artist}</p>
                </div>
              </div>
            ))}
            {pins.length === 0 && <p className="text-sm text-gray-600">Belum ada konten.</p>}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPins.map(p => (
          <div key={p.id} className="rounded-2xl overflow-hidden border bg-white">
            <img src={p.src} alt={p.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-600 mb-3">{p.artist}</p>
              <p className="text-sm text-gray-700 line-clamp-3">{p.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded-full text-xs border ${p.isLiked ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-700'}`}
                  onClick={() => toggleLike(p.id)}
                  title={p.isLiked ? 'Batalkan Suka' : 'Suka'}
                >
                  <span className="inline-flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {p.isLiked ? 'Disukai' : 'Suka'}</span>
                </button>
                <button
                  className={`px-2 py-1 rounded-full text-xs border ${p.isSaved ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}
                  onClick={() => toggleSave(p.id)}
                >
                  <span className="inline-flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" /> {p.isSaved ? 'Disimpan' : 'Simpan'}</span>
                </button>
                <button
                  className={`px-2 py-1 rounded-full text-xs border ${p.isFollowed ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}
                  onClick={() => toggleFollow(p.id)}
                >
                  <span className="inline-flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" /> {p.isFollowed ? 'Mengikuti' : 'Ikuti'}</span>
                </button>
                <button
                  className="px-2 py-1 rounded-full text-xs border bg-white border-gray-200 text-gray-700"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + '/community')
                    showToast('Link disalin ke clipboard', 'success')
                  }}
                >
                  <span className="inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Bagikan</span>
                </button>
                <button
                  className="px-2 py-1 rounded-full text-xs border bg-white border-gray-200 text-gray-700"
                  onClick={() => { setSelectedId(p.id); setCommentOpen(true) }}
                >
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Komentar ({p.comments?.length || 0})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPins.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">Tidak ada postingan sesuai filter.</div>
        )}
      </div>

      {composerOpen && (
        <ComposerModal
          title={title}
          imageUrl={imageUrl}
          description={description}
          tagText={tagText}
          onClose={() => setComposerOpen(false)}
          onChangeTitle={setTitle}
          onChangeImageUrl={setImageUrl}
          onChangeDescription={setDescription}
          onChangeTagText={setTagText}
          onPublish={handlePublish}
        />
      )}
      {commentOpen && (
        <CommentModal
          pin={pins.find(p => p.id === selectedId)}
          onClose={() => { setCommentOpen(false); setSelectedId(null); setCommentText('') }}
          commentText={commentText}
          onChangeComment={setCommentText}
          onSend={() => {
            if (!commentText.trim() || !selectedId) return
            addComment(selectedId, commentText.trim())
            setCommentText('')
          }}
        />
      )}

      <Toast toast={toast} />
    </div>
  )
}

function ComposerModal({ title, imageUrl, description, tagText, onClose, onChangeTitle, onChangeImageUrl, onChangeDescription, onChangeTagText, onPublish }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Buat Postingan Komunitas</h2>
          <p className="text-sm text-gray-600">Bagikan karya atau update ke komunitas.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Judul</label>
            <input value={title} onChange={(e) => onChangeTitle(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="Judul yang menarik" />
          </div>
          <div>
            <label className="text-sm font-semibold">URL Gambar</label>
            <input value={imageUrl} onChange={(e) => onChangeImageUrl(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="https://..." />
            {imageUrl && (
              <div className="mt-3">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border" />
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold">Deskripsi</label>
            <textarea value={description} onChange={(e) => onChangeDescription(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" rows={4} placeholder="Ceritakan sedikit tentang konten ini" />
          </div>
          <div>
            <label className="text-sm font-semibold">Tag (opsional)</label>
            <input value={tagText} onChange={(e) => onChangeTagText(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="#digital #3d #sketch" />
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-200 font-semibold">Batal</button>
          <button onClick={onPublish} className="px-4 py-2 rounded-full bg-black text-white font-bold">Publikasikan</button>
        </div>
      </div>
    </div>
  )
}

function CommentModal({ pin, onClose, commentText, onChangeComment, onSend }) {
  if (!pin) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-semibold">{pin.title}</p>
              <p className="text-xs text-gray-600">{pin.artist}</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
          {pin.comments?.map((c, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-sm"><b>{c.name}</b> {c.text}</p>
              </div>
            </div>
          ))}
          {(!pin.comments || pin.comments.length === 0) && (
            <p className="text-sm text-gray-600">Belum ada komentar.</p>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 rounded-full border bg-gray-100 px-3 py-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <input
              value={commentText}
              onChange={(e) => onChangeComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder="Tulis komentar..."
              className="w-full bg-transparent text-sm outline-none"
            />
            <button onClick={onSend} className="px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold">Kirim</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toast({ toast }) {
  if (!toast) return null
  const color = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-yellow-600' : 'bg-gray-800'
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${color} text-white px-4 py-2 rounded-full shadow-lg z-[60]`}>{toast.message}</div>
  )
}
