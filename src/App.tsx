import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Compass, ExternalLink, Heart, Landmark, Leaf, MapPin, Search, SlidersHorizontal, Sparkles, Timer, Trash2, UserRound, UtensilsCrossed, Waves } from 'lucide-react'
import './App.css'

type CityId = 'yamaguchi' | 'mine' | 'nagato' | 'shimonoseki'
type Genre = '歴史・文化' | '自然' | '温泉' | 'グルメ'
type View = 'discover' | 'favorites' | 'mypage'

type Spot = {
  id: string
  name: string
  city: CityId
  cityName: string
  genre: Genre
  stayMinutes: number
  summary: string
  keywords: string[]
  openingHours?: string
  closedDays?: string
  price?: string
  address?: string
  infoSource?: string
  localPick: boolean
  pairIds: string[]
  image: string
  imageTone: string
}

type VisitRecord = {
  spotId: string
  visitedAt: string
}

const cityNames: Record<CityId, string> = {
  yamaguchi: '山口市',
  mine: '美祢市',
  nagato: '長門市',
  shimonoseki: '下関市',
}

const spots: Spot[] = [
  {
    id: 'rurikoji', name: '瑠璃光寺 五重塔', city: 'yamaguchi', cityName: '山口市', genre: '歴史・文化', stayMinutes: 60,
    summary: '香山公園に佇む、山口を代表する歴史的な風景。静かな境内をゆっくり歩くひとときを。', keywords: ['寺院', '歴史', '景色', 'ドライブ', '散歩'],
    openingHours: '24時間営業', closedDays: '休業日なし', price: '無料', address: '〒753-0095 山口県山口市木町 1-2 8', infoSource: 'Google（資料記載）', localPick: true, pairIds: ['yuda', 'kitsune', 'vansan'],
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1000&q=80', imageTone: 'sage',
  },
  {
    id: 'yuda', name: '湯田温泉街', city: 'yamaguchi', cityName: '山口市', genre: '温泉', stayMinutes: 30,
    summary: '足湯や温泉街の散策を楽しめる、山口市中心部の立ち寄りスポット。', keywords: ['温泉', '露天風呂', 'リラックス', '日帰り', 'ドライブ', 'カフェ'], localPick: true, pairIds: ['rurikoji', 'kitsune', 'vansan'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', imageTone: 'coral',
  },
  {
    id: 'akiyoshido', name: '秋芳洞', city: 'mine', cityName: '美祢市', genre: '自然', stayMinutes: 90,
    summary: '秋吉台の地下に広がる鍾乳洞。洞内を歩きながら、自然がつくった景観を楽しめます。', keywords: ['鍾乳洞', '洞窟', '秋吉台', '自然', 'ドライブ', '観光'],
    openingHours: '9:00〜17:30', closedDays: '休業日なし', price: '大人1,600円 / 中学生1,300円 / 小学生850円', address: '〒754-0511 山口県美祢市秋芳町秋吉3506-2', infoSource: 'Google、ChatGPT（資料記載）', localPick: false, pairIds: [],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', imageTone: 'green',
  },
  {
    id: 'kitsune', name: '狐の足あと', city: 'yamaguchi', cityName: '山口市', genre: '温泉', stayMinutes: 90,
    summary: '湯田温泉の足湯と喫茶を楽しめる施設。散策の途中の休憩にもおすすめです。', keywords: ['足湯', '喫茶', 'カフェ', '温泉', 'ドライブ', '休憩'],
    openingHours: '9:00〜21:30', closedDays: '休業日なし', price: '足湯: 大人200円 / 小中学生100円', address: '〒753-0056 山口県山口市湯田温泉2丁目1-3', infoSource: 'Google（資料記載）', localPick: false, pairIds: ['yuda', 'rurikoji', 'vansan'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', imageTone: 'coral',
  },
  {
    id: 'vansan', name: 'Italian Kitchen VANSAN 湯田店', city: 'yamaguchi', cityName: '山口市', genre: 'グルメ', stayMinutes: 90,
    summary: '湯田温泉エリアにあるイタリアンレストラン。食事やカフェ利用の候補です。', keywords: ['イタリアン', 'レストラン', 'カフェ', 'ランチ', 'グルメ', 'ドライブ'],
    openingHours: '11:00〜23:00', closedDays: '休業日なし', price: '予算目安 2,000円', address: '〒753-0056 山口県山口市湯田温泉6丁目8-3', infoSource: 'Google（資料記載）', localPick: false, pairIds: ['yuda', 'kitsune', 'rurikoji'],
    image: 'https://images.unsplash.com/photo-1498654896293-37a604a6c782?auto=format&fit=crop&w=1000&q=80', imageTone: 'yellow',
  },
  {
    id: 'motonosumi', name: '元乃隅神社', city: 'nagato', cityName: '長門市', genre: '歴史・文化', stayMinutes: 60,
    summary: '日本海を望む景色と鳥居の連なりで知られる、長門の海辺の神社。', keywords: ['神社', '海', '景色', 'ドライブ', '写真'], localPick: true, pairIds: ['senjojiki'],
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=80', imageTone: 'blue',
  },
  {
    id: 'senjojiki', name: '千畳敷', city: 'nagato', cityName: '長門市', genre: '自然', stayMinutes: 45,
    summary: '高台から日本海を見渡す景勝地。天候や現地状況を確認してお出かけください。', keywords: ['展望', '海', 'ドライブ', '自然', '景色'], localPick: false, pairIds: ['motonosumi'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', imageTone: 'green',
  },
  {
    id: 'karato', name: '唐戸市場', city: 'shimonoseki', cityName: '下関市', genre: 'グルメ', stayMinutes: 60,
    summary: '関門海峡のそばで、海の幸や市場のにぎわいに出会えるスポット。', keywords: ['市場', 'グルメ', '海鮮', 'カフェ', 'ランチ', 'ドライブ'], localPick: true, pairIds: ['akamagu'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80', imageTone: 'yellow',
  },
  {
    id: 'akamagu', name: '赤間神宮', city: 'shimonoseki', cityName: '下関市', genre: '歴史・文化', stayMinutes: 40,
    summary: '関門海峡を望む場所に建つ、下関の歴史にゆかりの深い神宮。', keywords: ['神社', '歴史', '寺院', '散歩', 'ドライブ'], localPick: false, pairIds: ['karato'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', imageTone: 'coral',
  },
]

const genres: Array<Genre | '指定なし'> = ['指定なし', '歴史・文化', '自然', '温泉', 'グルメ']
const durationOptions = [15, 30, 60, 120, 240]
const favoriteStorageKey = 'yamaguchi-plus-one:favorites'
const visitStorageKey = 'yamaguchi-plus-one:visits'

function readFavorites(): string[] {
  try {
    const stored = window.localStorage.getItem(favoriteStorageKey)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function readVisitRecords(): VisitRecord[] {
  try {
    const stored = window.localStorage.getItem(visitStorageKey)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []

    return parsed.filter((record): record is VisitRecord => (
      typeof record === 'object' && record !== null
      && 'spotId' in record && typeof record.spotId === 'string'
      && 'visitedAt' in record && typeof record.visitedAt === 'string'
      && !Number.isNaN(Date.parse(record.visitedAt))
    ))
  } catch {
    return []
  }
}

function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value))
}

function mapUrl(spot: Spot) {
  const query = encodeURIComponent(`${spot.name} ${spot.cityName} 山口県`)
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`
}

function App() {
  const [origin, setOrigin] = useState('山口宇部空港')
  const [city, setCity] = useState<CityId>('yamaguchi')
  const [duration, setDuration] = useState(60)
  const [genre, setGenre] = useState<Genre | '指定なし'>('指定なし')
  const [view, setView] = useState<View>('discover')
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [keywordQuery, setKeywordQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showMorePairs, setShowMorePairs] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(readFavorites)
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>(readVisitRecords)

  useEffect(() => {
    window.localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    window.localStorage.setItem(visitStorageKey, JSON.stringify(visitRecords))
  }, [visitRecords])

  const selectedSpot = spots.find((spot) => spot.id === selectedId) ?? null

  const normalizedKeywordQuery = keywordQuery.trim().toLowerCase()
  const keywordTerms = normalizedKeywordQuery ? normalizedKeywordQuery.split(/\s+/).filter(Boolean) : []

  const matchesKeyword = (spot: Spot) => {
    if (!keywordTerms.length) return true

    const haystack = [
      spot.name,
      spot.cityName,
      spot.genre,
      spot.summary,
      ...spot.keywords,
    ].join(' ').toLowerCase()

    return keywordTerms.every((term) => haystack.includes(term))
  }

  const visibleSpots = spots
    .filter((spot) => {
      if (view === 'favorites') {
        return favorites.includes(spot.id) && matchesKeyword(spot)
      }

      return spot.city === city && spot.stayMinutes <= duration && matchesKeyword(spot)
    })
    .sort((first, second) => {
      const firstScore = (genre !== '指定なし' && first.genre === genre ? 40 : 0) + (first.localPick ? 15 : 0)
      const secondScore = (genre !== '指定なし' && second.genre === genre ? 40 : 0) + (second.localPick ? 15 : 0)
      return secondScore - firstScore || first.name.localeCompare(second.name, 'ja')
    })

  const relatedSpots = selectedSpot
    ? selectedSpot.pairIds.map((id) => spots.find((spot) => spot.id === id)).filter((spot): spot is Spot => Boolean(spot))
    : []
  const displayedRelatedSpots = showMorePairs ? relatedSpots : relatedSpots.slice(0, 3)

  function toggleFavorite(spotId: string) {
    setFavorites((current) => current.includes(spotId)
      ? current.filter((id) => id !== spotId)
      : [...current, spotId])
  }

  function toggleVisitRecord(spotId: string) {
    setVisitRecords((current) => current.some((record) => record.spotId === spotId)
      ? current.filter((record) => record.spotId !== spotId)
      : [{ spotId, visitedAt: new Date().toISOString() }, ...current])
  }

  function openSpot(spotId: string) {
    setSelectedId(spotId)
    setShowMorePairs(false)
  }

  function extendTime() {
    setDuration((current) => durationOptions.find((option) => option > current) ?? 240)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => { setView('discover'); setSearchSubmitted(false); setSelectedId(null) }}>
          <span className="brand-mark">+1</span>
          <span>やまぐち<span className="brand-plus">＋</span>1</span>
        </a>
        <button className="mobile-favorites-button" aria-label="お気に入りを開く" title="お気に入りを開く" onClick={() => { setView('favorites'); setSelectedId(null) }}>
          <Heart size={17} fill={view === 'favorites' ? 'currentColor' : 'none'} />
          <span>{favorites.length}</span>
        </button>
        <nav className="main-nav" aria-label="メインメニュー">
          <button className={view === 'discover' ? 'nav-button active' : 'nav-button'} onClick={() => { setView('discover'); setSearchSubmitted(false); setSelectedId(null) }}>
            <Compass size={17} /> 見つける
          </button>
          <button className={view === 'favorites' ? 'nav-button active' : 'nav-button'} onClick={() => { setView('favorites'); setSelectedId(null) }}>
            <Heart size={17} /> お気に入り <span className="nav-count">{favorites.length}</span>
          </button>
          <button className={view === 'mypage' ? 'nav-button active' : 'nav-button'} onClick={() => { setView('mypage'); setSelectedId(null) }}>
            <UserRound size={17} /> マイページ
          </button>
        </nav>
      </header>

      <main id="top" className="main-layout">
        {view === 'discover' && !searchSubmitted && (
        <section className="filter-panel" aria-labelledby="search-title">
          <div className="search-panel-heading">
            <div>
              <p className="eyebrow muted-eyebrow">TRIP PLANNER <span className="eyebrow-dot" /></p>
              <h1 id="search-title">山口の「もう1か所」を探す</h1>
            </div>
            <span className="planner-mark" aria-hidden="true"><Compass size={23} /></span>
          </div>

          <div className="route-fields">
            <div className="route-field">
              <label htmlFor="origin-input"><span className="route-icon origin-icon"><MapPin size={17} /></span>出発地</label>
              <input id="origin-input" value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="例：山口宇部空港" />
            </div>
            <div className="route-connector" aria-hidden="true"><span /></div>
            <div className="route-field">
              <label htmlFor="city-select"><span className="route-icon destination-icon"><MapPin size={17} /></span>訪問エリア</label>
              <select id="city-select" value={city} onChange={(event) => { setCity(event.target.value as CityId); setSelectedId(null) }}>
                {Object.entries(cityNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>
          </div>
          <p className="route-note">出発地は表示用です。距離や移動時間による並べ替えは行いません。</p>

          <div className="duration-field">
            <label htmlFor="duration-select"><Timer size={16} /> 使える時間</label>
            <select id="duration-select" value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
              {durationOptions.map((minutes) => <option key={minutes} value={minutes}>{minutes < 60 ? `${minutes}分ほど` : `${minutes / 60}時間ほど`}</option>)}
            </select>
          </div>
          <p className="time-disclaimer">スポットの滞在目安で絞り込みます。移動時間は含みません。</p>

          <div className="keyword-field">
            <label htmlFor="keyword-input"><Search size={16} /> キーワード検索</label>
            <input id="keyword-input" value={keywordQuery} onChange={(event) => setKeywordQuery(event.target.value)} placeholder="例：ドライブ, カフェ, 温泉, 海鮮" />
          </div>

          <fieldset className="genre-fieldset">
            <legend>検索条件を追加 <span>興味のあるジャンル</span></legend>
            <div className="genre-options">
              {genres.map((item) => {
                const Icon = item === '歴史・文化' ? Landmark : item === '自然' ? Leaf : item === '温泉' ? Waves : item === 'グルメ' ? UtensilsCrossed : Compass
                return (
                  <button key={item} type="button" className={genre === item ? 'genre-choice selected' : 'genre-choice'} onClick={() => setGenre(item)} aria-pressed={genre === item}>
                    <span className="genre-icon"><Icon size={19} /></span>
                    <span>{item === '指定なし' ? 'おまかせ' : item}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <button className="search-button" onClick={() => { setView('discover'); setSelectedId(null); setSearchSubmitted(true) }}>
            <Search size={17} /> おすすめを検索 <ArrowRight size={17} />
          </button>
          <p className="search-footnote">営業時間・料金は未確認の場合があります。お出かけ前に公式情報をご確認ください。</p>
        </section>
        )}

        {(view !== 'discover' || searchSubmitted) && (
        <section className="content-panel" aria-live="polite">
          <div className="section-heading">
            <div>
              <p className="eyebrow muted-eyebrow">{view === 'favorites' ? 'SAVED PLACES' : view === 'mypage' ? 'MY PAGE' : 'YOUR NEXT STOP'}</p>
              <h2>{selectedSpot ? 'スポット詳細' : view === 'favorites' ? 'お気に入り' : view === 'mypage' ? 'マイページ' : searchSubmitted ? '検索結果' : `${cityNames[city]}のおすすめ`}</h2>
            </div>
            {selectedSpot ? (
              <button className="text-button back-button" onClick={() => setSelectedId(null)}><ArrowLeft size={16} /> 一覧に戻る</button>
            ) : view === 'discover' && searchSubmitted ? (
              <div className="results-actions">
                <span className="result-count">{visibleSpots.length}<span> SPOTS</span></span>
                <button className="change-conditions" onClick={() => setSearchSubmitted(false)}><SlidersHorizontal size={16} /> 条件を変更</button>
              </div>
            ) : view !== 'mypage' && (
              <span className="result-count">{visibleSpots.length}<span> SPOTS</span></span>
            )}
          </div>

          {view === 'discover' && searchSubmitted && !selectedSpot && (
            <div className="search-summary">
              <span>{origin || '出発地未設定'}</span>
              <ArrowRight size={14} />
              <span>{cityNames[city]}</span>
              <span className="summary-divider" />
              <span>{duration < 60 ? `${duration}分` : `${duration / 60}時間`}</span>
              <span className="summary-divider" />
              <span>{genre === '指定なし' ? 'おまかせ' : genre}</span>
              {keywordQuery.trim() && <><span className="summary-divider" /><span>キーワード: {keywordQuery.trim()}</span></>}
            </div>
          )}

          {view === 'mypage' ? (
            <MyPageView
              origin={origin}
              cityName={cityNames[city]}
              duration={duration}
              genre={genre}
              favoriteCount={favorites.length}
              onOpenFavorites={() => setView('favorites')}
              visitRecords={visitRecords}
              onOpenSpot={(spotId) => { setView('discover'); setSearchSubmitted(true); openSpot(spotId) }}
              onRemoveVisit={toggleVisitRecord}
            />
          ) : selectedSpot ? (
            <article className="detail-view">
              <div className={`detail-image image-tone-${selectedSpot.imageTone}`}>
                <img src={selectedSpot.image} alt={`${selectedSpot.name}のイメージ写真`} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
                <span className="image-label">イメージ写真</span>
                <button className={favorites.includes(selectedSpot.id) ? 'favorite-button is-favorite' : 'favorite-button'} aria-label={favorites.includes(selectedSpot.id) ? 'お気に入りを解除' : 'お気に入りに追加'} title={favorites.includes(selectedSpot.id) ? 'お気に入りを解除' : 'お気に入りに追加'} onClick={() => toggleFavorite(selectedSpot.id)}>
                  <Heart size={19} fill={favorites.includes(selectedSpot.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="detail-copy">
                <div className="spot-meta"><span>{selectedSpot.cityName}</span><span>{selectedSpot.genre}</span><span><Timer size={14} /> 約{selectedSpot.stayMinutes}分</span></div>
                <h3>{selectedSpot.name}</h3>
                <p className="detail-description">{selectedSpot.summary}</p>
                {(selectedSpot.openingHours || selectedSpot.closedDays || selectedSpot.price || selectedSpot.address) && (
                  <dl className="spot-info">
                    {[
                      ['営業時間', selectedSpot.openingHours],
                      ['休業日', selectedSpot.closedDays],
                      ['料金・予算', selectedSpot.price],
                      ['住所', selectedSpot.address],
                    ].filter((item): item is [string, string] => Boolean(item[1])).map(([label, value]) => (
                      <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                )}
                <p className="verification-note">
                  {selectedSpot.infoSource ? `情報元: ${selectedSpot.infoSource}。` : ''}
                  資料記載の情報です。営業時間・料金・所在地は変更される場合があるため、訪問前に公式情報をご確認ください。
                </p>
                <button className={visitRecords.some((record) => record.spotId === selectedSpot.id) ? 'visit-button is-visited' : 'visit-button'} onClick={() => toggleVisitRecord(selectedSpot.id)}>
                  <Check size={16} />
                  {visitRecords.some((record) => record.spotId === selectedSpot.id) ? '訪問記録を取り消す' : '訪問済みにする'}
                </button>
                <a className="map-link" href={mapUrl(selectedSpot)} target="_blank" rel="noreferrer">
                  <MapPin size={17} /> 行き方を地図で確認 <ExternalLink size={15} />
                </a>
              </div>

              <div className="related-section">
                <div className="related-heading">
                  <div><p className="eyebrow muted-eyebrow">ONE MORE IDEA</p><h3>もう1か所の候補</h3></div>
                  <Sparkles size={20} className="sparkle-icon" />
                </div>
                <p className="related-note">組み合わせ候補です。移動手段・所要時間は経路検索でご確認ください。</p>
                {displayedRelatedSpots.length ? (
                  <div className="related-list">
                    {displayedRelatedSpots.map((spot) => <SpotRow key={spot.id} spot={spot} onOpen={openSpot} />)}
                  </div>
                ) : <p className="empty-related">候補を準備中です。</p>}
                {relatedSpots.length > 3 && <button className="text-button more-button" onClick={() => setShowMorePairs((current) => !current)}>{showMorePairs ? '閉じる' : 'もっと見る'} <ArrowRight size={15} /></button>}
              </div>
            </article>
          ) : visibleSpots.length ? (
            <>
              <p className="results-caption">条件に合う場所から、立ち寄り先を選びましょう。</p>
              <div className="spot-grid">
                {visibleSpots.map((spot, index) => (
                  <SpotCard key={spot.id} spot={spot} index={index} favorite={favorites.includes(spot.id)} genre={genre} onFavorite={toggleFavorite} onOpen={openSpot} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Compass size={25} /></div>
              <h3>{view === 'favorites' ? 'お気に入りはまだありません' : '条件に合う場所がありません'}</h3>
              <p>{view === 'favorites' ? '気になるスポットのハートを押すと、ここに保存されます。' : '選んだ時間で滞在できる場所がありません。条件は自動では変更されません。'}</p>
              {view === 'favorites' ? (
                <button className="text-button" onClick={() => setView('discover')}>スポットを探す <ArrowRight size={16} /></button>
              ) : (
                <div className="empty-actions">
                  {duration < 240 && <button className="text-button" onClick={extendTime}>時間を広げる <ArrowRight size={16} /></button>}
                </div>
              )}
            </div>
          )}

          <footer className="content-footer"><span>やまぐち＋1</span><span>移動のきっかけを、もうひとつ。</span></footer>
        </section>
        )}
      </main>
      <nav className="mobile-tabbar" aria-label="ページ">
        <button className={view === 'discover' ? 'mobile-tab active' : 'mobile-tab'} onClick={() => { setView('discover'); setSearchSubmitted(true); setSelectedId(null) }}>
          <Compass size={19} /> おすすめ
        </button>
        <button className={view === 'discover' && !searchSubmitted ? 'mobile-tab active' : 'mobile-tab'} onClick={() => { setView('discover'); setSearchSubmitted(false); setSelectedId(null) }}>
          <Search size={19} /> キーワード検索
        </button>
        <button className={view === 'mypage' ? 'mobile-tab active' : 'mobile-tab'} onClick={() => { setView('mypage'); setSelectedId(null) }}>
          <UserRound size={19} /> マイページ
        </button>
      </nav>
    </div>
  )
}

function MyPageView({ origin, cityName, duration, genre, favoriteCount, onOpenFavorites, visitRecords, onOpenSpot, onRemoveVisit }: { origin: string; cityName: string; duration: number; genre: Genre | '指定なし'; favoriteCount: number; onOpenFavorites: () => void; visitRecords: VisitRecord[]; onOpenSpot: (spotId: string) => void; onRemoveVisit: (spotId: string) => void }) {
  const durationLabel = duration < 60 ? `${duration}分ほど` : `${duration / 60}時間ほど`

  return (
    <div className="my-page">
      <section className="my-profile">
        <span className="profile-avatar"><UserRound size={24} /></span>
        <div>
          <p className="profile-eyebrow">PROFILE</p>
          <h3>ゲスト</h3>
          <p>ログインせずに利用中</p>
        </div>
      </section>

      <button className="my-page-link" onClick={onOpenFavorites}>
        <span className="my-page-link-icon"><Heart size={19} /></span>
        <span className="my-page-link-copy"><strong>お気に入りスポット</strong><small>保存した場所を一覧で見る</small></span>
        <span className="my-page-favorite-count">{favoriteCount}</span>
        <ArrowRight size={17} />
      </button>

      <section className="travel-records">
        <div className="settings-heading">
          <div><p className="profile-eyebrow">TRAVEL LOG</p><h3>旅行記録</h3></div>
          <span className="record-count">{visitRecords.length}</span>
        </div>
        {visitRecords.length ? (
          <div className="travel-record-list">
            {visitRecords.map((record) => {
              const spot = spots.find((item) => item.id === record.spotId)
              if (!spot) return null

              return (
                <article className="travel-record" key={record.spotId}>
                  <button className="travel-record-open" onClick={() => onOpenSpot(spot.id)}>
                    <span className="record-pin"><MapPin size={17} /></span>
                    <span className="travel-record-copy"><strong>{spot.name}</strong><small>{spot.cityName} ・ {spot.genre}</small></span>
                    <span className="travel-record-date">{formatVisitDate(record.visitedAt)}</span>
                  </button>
                  <button className="remove-record" aria-label={`${spot.name}の旅行記録を削除`} title="旅行記録を削除" onClick={() => onRemoveVisit(spot.id)}>
                    <Trash2 size={16} />
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="travel-record-empty">まだ旅行記録はありません。スポット詳細で「訪問済みにする」と記録できます。</p>
        )}
      </section>

      <section className="travel-settings">
        <div className="settings-heading">
          <div><p className="profile-eyebrow">YOUR SEARCH</p><h3>現在の検索条件</h3></div>
          <Compass size={20} />
        </div>
        <dl>
          <div><dt>出発地</dt><dd>{origin || '未設定'}</dd></div>
          <div><dt>訪問エリア</dt><dd>{cityName}</dd></div>
          <div><dt>使える時間</dt><dd>{durationLabel}</dd></div>
          <div><dt>ジャンル</dt><dd>{genre === '指定なし' ? 'おまかせ' : genre}</dd></div>
        </dl>
      </section>

      <p className="my-page-note">旅行記録とお気に入りはこのブラウザー内に保存されます。アカウント登録や端末間の同期には対応していません。</p>
    </div>
  )
}

function SpotCard({ spot, index, favorite, genre, onFavorite, onOpen }: { spot: Spot; index: number; favorite: boolean; genre: Genre | '指定なし'; onFavorite: (id: string) => void; onOpen: (id: string) => void }) {
  const reason = genre !== '指定なし' && spot.genre === genre
    ? '選択ジャンルと一致'
    : spot.localPick ? '地域おすすめ（試作）' : 'エリア内の候補'

  return (
    <article className="spot-card" style={{ animationDelay: `${index * 70}ms` }}>
      <button className={`spot-image image-tone-${spot.imageTone}`} onClick={() => onOpen(spot.id)} aria-label={`${spot.name}の詳細を見る`}>
        <img src={spot.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
        <span className="image-label">イメージ写真</span>
        <span className="image-city">{spot.cityName}</span>
      </button>
      <div className="card-copy">
        <div className="spot-meta"><span>{spot.genre}</span><span><Timer size={13} /> 約{spot.stayMinutes}分</span></div>
        <p className="recommendation-reason"><Sparkles size={12} /> {reason}</p>
        <div className="card-title-row">
          <button className="spot-title" onClick={() => onOpen(spot.id)}>{spot.name}</button>
          <button className={favorite ? 'card-favorite is-favorite' : 'card-favorite'} onClick={() => onFavorite(spot.id)} aria-label={favorite ? 'お気に入りを解除' : 'お気に入りに追加'} title={favorite ? 'お気に入りを解除' : 'お気に入りに追加'}>
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="card-summary">{spot.summary}</p>
        <button className="card-open" onClick={() => onOpen(spot.id)}>詳細を見る <ArrowRight size={15} /></button>
      </div>
    </article>
  )
}

function SpotRow({ spot, onOpen }: { spot: Spot; onOpen: (id: string) => void }) {
  return (
    <button className="related-row" onClick={() => onOpen(spot.id)}>
      <span className={`related-thumb image-tone-${spot.imageTone}`}><img src={spot.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} /></span>
      <span className="related-row-copy"><strong>{spot.name}</strong><small>{spot.cityName} ・ {spot.genre} ・ 約{spot.stayMinutes}分</small></span>
      <ArrowRight size={17} />
    </button>
  )
}

export default App
