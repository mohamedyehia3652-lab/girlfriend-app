import { useState, useEffect } from 'react'
import { sounds } from './utils/SoundEffects.js'
import confetti from 'canvas-confetti'

const INITIAL_FOLDERS = [
  {
    id: 'know',
    title: 'اعترفات لازم متطلعش من بالك',
    icon: '✨',
    color: '#ff6992',
    notes: [
      'انتي روحي انتي وعمري كله ❤️',
      "اسف لو في يوم زعلتك او كنت بارد بس لازم تعرفي انك اغلي و اكتر حد حبيته في حياتي",
      'انا مدمنك يا سمسم, و مقدرش اقعد لحظة من غير ما تبقي في بالي',
      'انا حسيت معاكي بمشاعر كتير مكنتش اعرف انها عندي و مكنتش اعرف ان ممكن حد يقتحم قلبي بالمنظر ده',
      'يسمسم و للاسف انا ممنوع من السفر بس والله لو علي بس المجهود انا اجيلك اخر الدنيا, هي الدنيا كده بتقرب الحبايب',
      'عارفة كام مرة حلمت انك معايا و نايمة في حضني, عارفة في كام مرة صحيت لقيت نفسي بتكلم في التلفون زي المجنون و افتكرك معايا علي الخط'
    ]
  },
  {
    id: 'special',
    title: 'سيبتي ايه للبنات ؟',
    icon: '👑',
    color: '#c084fc',
    notes: [
      'نبداء بشخصيتك المفهاش غلطة لحد دلوقتي يسمسم مش عارف اقول ان فيكي عيب  , بحب حماسك و بحب طاقتك , بحب غيرتك , بحبك و انتي عاقلة و انتي طفلة و انتي زعلانة بجبك في كل حلاتك.',
      'عيونك خطفتني من اول مرة شوفتك, كل مرة ببص فيها بحس اني بغرق و مش بسمع ولا بشوف حاجة غير لمعة عينك ',
      'بحبك لما تبقي مكسوفة و مبسوطة في نفس الوقت, مش عارف اوصف الموضوع ازاي بس بحب ملامح وشك لما بتقي مكسوفة',
      'عمري ما هنسي نظرتك لما تكوني عايزة حضني, النظرة دي تخليني اجي لحد عندك مشي, نظرة تخليني اقلب الدنيا عشانك',
      'سمسم انا بعشق و يمكن مهووس بكل حاجة فيكي من صباع رجلك الصغير لحد شعرك',
      'علي فكرة انتي معندكيش تناقضات في شخصيتك انتي عندك من كل صفة عكسها في بحس كل صفاتك متوازنة و في حتة مثالية زي انك قوية بس رقيقة, عصبية بس بتتحكمي في نفسك, بتحبيني بس بتقوليلي بكرهك  ... الخ',
      'سيبتي ايه بقي للبنات شخصية و جمال و مش لاقي غلطة'
    ]
  },
  {
    id: 'learned',
    title: 'عارفة انتي علمتيني ايه ؟',
    icon: '🌱',
    color: '#38bdf8',
    notes: [
      'علمتيني اني اهدي شوية لما اتعصب و افكر ثانية في كلامي',
      'علمتيني اني لازم اوضح مشاعري شوية مع الناس الحوليا',
      'علمتيني ان لازم يبقي عندي اوليات في حياتي وازاي انظم علاقتي باهلي و معاكي و مع صحابي و كده',
      'خلتيني اعرف يعني ايه انثي',
      'علمتيني يعني ايه حب يسمسم'
    ]
  },
]

export function Folders() {
  const [activeFolderId, setActiveFolderId] = useState(null)
  const [likedNotes, setLikedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('love_liked_notes')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [customNotes, setCustomNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('love_custom_notes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [newNoteText, setNewNoteText] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💌')

  useEffect(() => {
    localStorage.setItem('love_liked_notes', JSON.stringify(likedNotes))
  }, [likedNotes])

  useEffect(() => {
    localStorage.setItem('love_custom_notes', JSON.stringify(customNotes))
  }, [customNotes])

  const allFolders = [
    ...INITIAL_FOLDERS,
  ]

  const activeFolder = allFolders.find((f) => f.id === activeFolderId)

  const handleOpenFolder = (folderId) => {
    setActiveFolderId(folderId)
    sounds.playChime()
  }

  const handleCloseFolder = () => {
    setActiveFolderId(null)
    sounds.playPop()
  }

  const toggleLikeNote = (noteId, e) => {
    e.stopPropagation()
    sounds.playHeartbeat()
    setLikedNotes((prev) => {
      const currentCount = prev[noteId] || 0
      return {
        ...prev,
        [noteId]: currentCount + 1
      }
    })

    try {
      const rect = e.target.getBoundingClientRect()
      confetti({
        particleCount: 15,
        spread: 40,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        shapes: ['circle'],
        colors: ['#ff4d6d', '#ff758f', '#f43f5e']
      })
    } catch {
      // Ignore
    }
  }

  const handleAddCustomNote = (e) => {
    e.preventDefault()
    if (!newNoteText.trim()) return

    const newEntry = {
      id: Date.now().toString(),
      text: `${selectedEmoji} ${newNoteText.trim()}`,
      date: new Date().toLocaleDateString('ar-EG')
    }

    setCustomNotes([newEntry, ...customNotes])
    setNewNoteText('')
    sounds.playFanfare()

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    })
  }

  const handleDeleteCustomNote = (noteId, e) => {
    e.stopPropagation()
    if (window.confirm('هل أنتِ متأكدة من رغبتكِ في حذف هذه الرسالة؟ 🗑️')) {
      setCustomNotes((prev) => prev.filter((n) => n.id !== noteId))
      sounds.playPop()
    }
  }


  return (
    <div className="folders-container" dir="rtl">
      {!activeFolder ? (
        /* Desktop 3D Folder Grid */
        <div className="folders-wrapper">
          <div className="folders-header-badge">
            <span>📂</span> دوسي علي اي مجلد لو عايزة تعرفي انا بحبك قد ايه
          </div>
          <div className="desktop-grid">
            {allFolders.map((folder) => {
              const noteCount = folder.notes.length
              return (
                <div
                  key={folder.id}
                  className="real-folder"
                  onClick={() => handleOpenFolder(folder.id)}
                  style={{ '--folder-color': folder.color }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenFolder(folder.id)}
                >
                  {/* Folder Backing & Tab */}
                  <div className="folder-back">
                    <div className="folder-tab">
                      <span className="folder-tab-icon">{folder.icon}</span>
                    </div>
                  </div>

                  {/* Inner Paper Note */}
                  <div className="folder-paper">
                    <span className="paper-line"></span>
                    <span className="paper-line"></span>
                    <span className="paper-line short"></span>
                  </div>

                  {/* Front Flap Cover with Seal */}
                  <div className="folder-front">
                    <div className="folder-seal">{folder.icon}</div>
                    <span className="folder-label">{folder.title}</span>
                    <span className="folder-count">{noteCount} {noteCount === 1 ? 'رسالة' : 'رسائل'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Opened Folder Document Sheet View */
        <div className="opened-document">
          <button
            type="button"
            className="close-folder-btn"
            onClick={handleCloseFolder}
          >
            ← العودة إلى المجلدات
          </button>

          <div className="document-sheet">
            <div className="sheet-header">
              <span className="sheet-icon">{activeFolder.icon}</span>
              <div>
                <h2>{activeFolder.title}</h2>
                <span className="sheet-meta">{activeFolder.notes.length} رسائلك</span>
              </div>
            </div>

            <div className="document-divider"></div>
            

            {/* Custom Notes Toolbar for Permanent Backup / Actions */}
            {activeFolder.id === 'from_her' && customNotes.length > 0 && (
              <div className="custom-notes-toolbar">
                <div className="toolbar-info">
                  <span>💾 الحفظ الدائم والنسخ الاحتياطي:</span>
                </div>
                <div className="toolbar-actions">
                  <button
                    type="button"
                    className="toolbar-btn export-txt-btn"
                    onClick={handleExportTxt}
                    title="تنزيل الرسائل كملف نصي للحفظ الدائم على جهازك"
                  >
                    📄 تصدير ملف نصي (.txt)
                  </button>
                  <button
                    type="button"
                    className="toolbar-btn backup-btn"
                    onClick={handleExportJSON}
                    title="حفظ نسخة احتياطية لنقلها لأي هاتف أو جهاز آخر"
                  >
                    📦 نسخة احتياطية (.json)
                  </button>
                  <label
                    className="toolbar-btn import-btn"
                    title="استرجاع رسائل من نسخة سابقة"
                  >
                    📥 استيراد نسخة
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    type="button"
                    className="toolbar-btn copy-all-btn"
                    onClick={handleCopyAllNotes}
                    title="نسخ جميع الرسائل دفعة واحدة"
                  >
                    📋 نسخ الكل
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {activeFolder.notes.length === 0 ? (
              <div className="empty-notes-state">
                <p>لا توجد رسائل هنا بعد! اكتبي أول رسالة في الأعلى 🌸</p>
              </div>
            ) : (
              <ul className="notes-list">
                {activeFolder.id === 'from_her'
                  ? customNotes.map((item) => {
                      const likeCount = likedNotes[item.id] || 0
                      return (
                        <li key={item.id} className="note-item-card custom-note-card arabic-text">
                          <div className="note-text-content">
                            <span className="note-bullet">🌸</span>
                            <div className="note-text-wrapper">
                              <p>{item.text}</p>
                              {item.date && (
                                <span className="note-date-tag">📅 {item.date}</span>
                              )}
                            </div>
                          </div>
                          <div className="note-actions-group">
                            <button
                              type="button"
                              className={`like-note-btn ${likeCount > 0 ? 'liked' : ''}`}
                              onClick={(e) => toggleLikeNote(item.id, e)}
                              title="أحببت هذه الرسالة"
                            >
                              <span className="like-heart">{likeCount > 0 ? '💖' : '🤍'}</span>
                              <span className="like-count">{likeCount > 0 ? likeCount : ''}</span>
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn copy-btn"
                              onClick={(e) => handleCopyNote(item.text, e)}
                              title="نسخ هذه الرسالة"
                            >
                              📋
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn delete-btn"
                              onClick={(e) => handleDeleteCustomNote(item.id, e)}
                              title="حذف هذه الرسالة"
                            >
                              🗑️
                            </button>
                          </div>
                        </li>
                      )
                    })
                  : activeFolder.notes.map((note, index) => {
                      const noteKey = `${activeFolder.id}_${index}`
                      const likeCount = likedNotes[noteKey] || 0

                      return (
                        <li key={index} className="note-item-card arabic-text">
                          <div className="note-text-content">
                            <span className="note-bullet">🌸</span>
                            <p>{note}</p>
                          </div>
                          <button
                            type="button"
                            className={`like-note-btn ${likeCount > 0 ? 'liked' : ''}`}
                            onClick={(e) => toggleLikeNote(noteKey, e)}
                            title="أحببت هذه الرسالة"
                          >
                            <span className="like-heart">{likeCount > 0 ? '💖' : '🤍'}</span>
                            <span className="like-count">{likeCount > 0 ? likeCount : ''}</span>
                          </button>
                        </li>
                      )
                    })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}