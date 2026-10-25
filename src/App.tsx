import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, Bell, Bookmark, BrainCircuit,
  Building2, BarChart3, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, CirclePlus, Clock3, Compass, FileCheck2, GitCompareArrows, Heart,
  BookOpenCheck, LayoutDashboard, LibraryBig, Lightbulb, MapPin, Menu, MonitorPlay, MoreHorizontal,
  PencilLine, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles,
  Star, Target, Trash2, X, Zap
} from 'lucide-react'
import { starterInstitutes } from './data/institutes'
import type { Category, Institute, ListingStatus, TeachingMode } from './types'

type Page = 'Overview' | 'Explore institutes' | 'Saved institutes' | 'Compare' | 'Insights' | 'Manage listings'
const categories: Category[] = ['Engineering', 'Medical', 'Government', 'Technology', 'School & Foundation', 'Design & Law']
const modes: TeachingMode[] = ['Offline', 'Online', 'Hybrid']
const pageIcons = {
  'Overview': LayoutDashboard,
  'Explore institutes': Compass,
  'Saved institutes': Bookmark,
  'Compare': GitCompareArrows,
  'Insights': BarChart3,
  'Manage listings': Building2,
}
const categoryIcons: Record<Category, typeof BrainCircuit> = {
  'Engineering': BrainCircuit,
  'Medical': Activity,
  'Government': ShieldCheck,
  'Technology': Zap,
  'School & Foundation': BookOpenCheck,
  'Design & Law': Lightbulb,
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function money(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`
  return `₹${Math.round(value / 1000)}k`
}

function categoryGradient(accent: string) {
  return { '--accent': accent } as CSSProperties
}

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [institutes, setInstitutes] = useState<Institute[]>(() => readStorage('coachdig.institutes', starterInstitutes))
  const [savedIds, setSavedIds] = useState<string[]>(() => readStorage('coachdig.saved', ['cd-001', 'cd-004']))
  const [compareIds, setCompareIds] = useState<string[]>(['cd-001', 'cd-002'])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All categories'>('All categories')
  const [modeFilter, setModeFilter] = useState<TeachingMode | 'Any mode'>('Any mode')
  const [stateFilter, setStateFilter] = useState('All states')
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [newName, setNewName] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newState, setNewState] = useState('Andhra Pradesh')
  const [newCategory, setNewCategory] = useState<Category>('Engineering')
  const [newExam, setNewExam] = useState('JEE Main')
  const [newMode, setNewMode] = useState<TeachingMode>('Offline')
  const [newFee, setNewFee] = useState('25000')

  useEffect(() => { localStorage.setItem('coachdig.institutes', JSON.stringify(institutes)) }, [institutes])
  useEffect(() => { localStorage.setItem('coachdig.saved', JSON.stringify(savedIds)) }, [savedIds])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const states = useMemo(() => ['All states', ...Array.from(new Set(institutes.map((i) => i.state))).sort()], [institutes])
  const filteredInstitutes = useMemo(() => {
    let list = [...institutes]
    if (page === 'Saved institutes') list = list.filter((i) => savedIds.includes(i.id))
    if (categoryFilter !== 'All categories') list = list.filter((i) => i.category === categoryFilter)
    if (modeFilter !== 'Any mode') list = list.filter((i) => i.modes.includes(modeFilter))
    if (stateFilter !== 'All states') list = list.filter((i) => i.state === stateFilter)
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery) list = list.filter((i) => [i.name, i.city, i.state, i.locality, i.category, ...i.exams].join(' ').toLowerCase().includes(normalizedQuery))
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'fees-low') list.sort((a, b) => a.feeMin - b.feeMin)
    if (sortBy === 'fees-high') list.sort((a, b) => b.feeMax - a.feeMax)
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [institutes, page, savedIds, categoryFilter, modeFilter, stateFilter, query, sortBy])

  const compareInstitutes = institutes.filter((i) => compareIds.includes(i.id))
  const verifiedCount = institutes.filter((i) => i.status === 'Verified').length
  const pendingCount = institutes.filter((i) => i.status === 'Pending review').length
  const saved = (id: string) => savedIds.includes(id)
  const inCompare = (id: string) => compareIds.includes(id)

  const notify = (message: string) => setToast(message)
  const goTo = (nextPage: Page) => {
    setPage(nextPage)
    setMobileSidebarOpen(false)
    if (nextPage !== 'Saved institutes') {
      setCategoryFilter('All categories')
      setModeFilter('Any mode')
      setStateFilter('All states')
      setQuery('')
    }
  }

  function toggleSave(id: string) {
    const willSave = !savedIds.includes(id)
    setSavedIds((current) => willSave ? [...current, id] : current.filter((savedId) => savedId !== id))
    notify(willSave ? 'Added to your shortlist' : 'Removed from your shortlist')
  }

  function toggleCompare(id: string) {
    if (compareIds.includes(id)) {
      setCompareIds((current) => current.filter((compareId) => compareId !== id))
      notify('Removed from comparison')
      return
    }
    if (compareIds.length >= 3) {
      notify('Compare up to 3 institutes at a time')
      return
    }
    setCompareIds((current) => [...current, id])
    notify('Added to comparison')
  }

  function createListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newName.trim() || !newCity.trim()) {
      notify('Add an institute name and city first')
      return
    }
    const baseFee = Math.max(0, Number(newFee) || 0)
    const listing: Institute = {
      id: `custom-${Date.now()}`,
      name: newName.trim(), shortName: newName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
      tagline: 'A new listing, ready for review.', city: newCity.trim(), state: newState,
      locality: 'Locality not added', category: newCategory, exams: newExam.split(',').map((exam) => exam.trim()).filter(Boolean),
      modes: [newMode], feeMin: baseFee, feeMax: Math.round(baseFee * 1.8), rating: 0, reviews: 0,
      status: 'Pending review', accent: '#b8e986',
      description: 'This institute was added in the local demo admin panel. Confirm its identity, courses, fees and source links before publishing it.'
    }
    setInstitutes((current) => [listing, ...current])
    setNewName('')
    setNewCity('')
    setNewExam('')
    notify('Listing created and marked pending review')
  }

  function cycleListingStatus(id: string) {
    setInstitutes((current) => current.map((institute) => {
      if (institute.id !== id) return institute
      const next: ListingStatus = institute.status === 'Pending review' ? 'Verified' : institute.status === 'Verified' ? 'Demo listing' : 'Pending review'
      return { ...institute, status: next }
    }))
    notify('Listing status updated')
  }

  const pageTitle = page === 'Overview' ? 'Your learning dashboard' : page
  const currentSubtitle = page === 'Overview'
    ? 'A little more clarity for your next big move.'
    : page === 'Explore institutes'
      ? 'Discover a place that fits your goals, style and budget.'
      : page === 'Saved institutes'
        ? 'Your shortlist, in one easy place.'
        : page === 'Compare'
          ? 'Put your options side by side before you decide.'
          : page === 'Insights'
            ? 'A live snapshot of this demo workspace.'
            : 'Review listings and manage the directory dataset.'

  return (
    <div className="app-shell">
      {mobileSidebarOpen && <button aria-label="Close menu overlay" className="sidebar-scrim" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={`sidebar ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><span>C</span><i /></div>
          <div className="brand-word">coach<span>dig</span><small>FIND YOUR EDGE</small></div>
          <button className="icon-btn sidebar-close" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-pill"><div className="workspace-avatar">H</div><div><b>Harsha's workspace</b><span>Personal · Starter</span></div><ChevronDown size={14} /></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav">
          {(['Overview', 'Explore institutes', 'Saved institutes', 'Compare', 'Insights'] as Page[]).map((item) => {
            const Icon = pageIcons[item]
            return <button key={item} className={`nav-item ${page === item ? 'active' : ''}`} onClick={() => goTo(item)}><Icon size={18} strokeWidth={1.8} /><span>{item}</span>{item === 'Saved institutes' && <em>{savedIds.length}</em>}{item === 'Compare' && compareIds.length > 0 && <em className="nav-count-lime">{compareIds.length}</em>}</button>
          })}
        </nav>
        <div className="nav-caption nav-caption-spaced">EXPLORE BY GOAL</div>
        <nav className="category-nav">
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            return <button key={category} className={`nav-item category-nav-item ${categoryFilter === category && page === 'Explore institutes' ? 'active' : ''}`} onClick={() => { setPage('Explore institutes'); setCategoryFilter(category); setMobileSidebarOpen(false) }}><Icon size={17} strokeWidth={1.8} /><span>{category}</span></button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-spark"><Sparkles size={16} /></div><b>Not sure where to start?</b><p>Find your next step with a little more clarity.</p><button onClick={() => { goTo('Explore institutes'); notify('Start with your exam, city and learning mode.') }}>Explore options <ArrowRight size={14} /></button><div className="help-orbit orbit-one" /><div className="help-orbit orbit-two" /></div>
          <button className={`nav-item manage-nav ${page === 'Manage listings' ? 'active' : ''}`} onClick={() => goTo('Manage listings')}><Settings2 size={18} /><span>Manage listings</span><span className="admin-dot" /></button>
          <div className="profile-row"><div className="profile-avatar">PH</div><div className="profile-copy"><b>Pola Harsha Vardhan</b><span>Free workspace</span></div><MoreHorizontal size={18} className="profile-more" /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-btn mobile-menu" aria-label="Open navigation" onClick={() => setMobileSidebarOpen(true)}><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>{page}</b></div></div>
          <div className="topbar-actions"><div className="data-chip"><span className="pulse-dot" /> Demo environment</div><button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => notify('You’re all caught up.')}><Bell size={18} /><i /></button><div className="top-avatar">PH</div></div>
        </header>

        <div className="page-content">
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CHAPTER, STARTS HERE</div><h1>{pageTitle}<span className="heading-period">.</span></h1><p>{currentSubtitle}</p></div><div className="heading-actions"><button className="secondary-btn" onClick={() => goTo('Explore institutes')}><Compass size={16} /> Explore directory</button><button className="primary-btn" onClick={() => goTo('Manage listings')}><Plus size={17} /> Add institute</button></div></div>

          {page === 'Overview' && <OverviewHero onExplore={() => goTo('Explore institutes')} onBrowseSaved={() => goTo('Saved institutes')} />}

          {page === 'Overview' && <div className="stats-grid">
            <StatCard icon={<LibraryBig size={18} />} label="Institutes to explore" value={institutes.length.toString().padStart(2, '0')} note="across the sample directory" iconClass="mint" trend="Browse all" onClick={() => goTo('Explore institutes')} />
            <StatCard icon={<Bookmark size={18} />} label="Your shortlist" value={savedIds.length.toString().padStart(2, '0')} note="options saved for later" iconClass="violet" trend="View saved" onClick={() => goTo('Saved institutes')} />
            <StatCard icon={<GitCompareArrows size={18} />} label="In comparison" value={compareIds.length.toString().padStart(2, '0')} note="of 3 comparison slots" iconClass="amber" trend="Compare now" onClick={() => goTo('Compare')} />
            <StatCard icon={<ShieldCheck size={18} />} label="Verified listings" value={verifiedCount.toString().padStart(2, '0')} note="demo records need review" iconClass="blue" trend="See insights" onClick={() => goTo('Insights')} />
          </div>}

          {page === 'Overview' && <div className="section-toolbar"><div><div className="section-kicker">CURATED FOR YOUR DISCOVERY</div><h2>Places to explore <span className="soft-count">{institutes.length}</span></h2><p>Start with a few possibilities. Your best fit is personal.</p></div><button className="text-btn" onClick={() => goTo('Explore institutes')}>View all institutes <ArrowRight size={16} /></button></div>}

          {page === 'Insights' && <InsightsPanel institutes={institutes} savedCount={savedIds.length} compareCount={compareIds.length} pendingCount={pendingCount} verifiedCount={verifiedCount} />}
          {page === 'Compare' && <ComparePage items={compareInstitutes} onRemove={toggleCompare} onExplore={() => goTo('Explore institutes')} onOpen={setSelectedInstitute} />}
          {page === 'Manage listings' && <AdminPage institutes={institutes} newName={newName} setNewName={setNewName} newCity={newCity} setNewCity={setNewCity} newState={newState} setNewState={setNewState} newCategory={newCategory} setNewCategory={setNewCategory} newExam={newExam} setNewExam={setNewExam} newMode={newMode} setNewMode={setNewMode} newFee={newFee} setNewFee={setNewFee} onCreate={createListing} onCycleStatus={cycleListingStatus} onDelete={(id) => { setInstitutes((current) => current.filter((i) => i.id !== id)); setSavedIds((current) => current.filter((savedId) => savedId !== id)); setCompareIds((current) => current.filter((compareId) => compareId !== id)); notify('Listing removed from this browser') }} />}

          {(page === 'Overview' || page === 'Explore institutes' || page === 'Saved institutes') && <>
            {page !== 'Overview' && <div className="directory-intro"><div><div className="section-kicker">THE DIRECTORY</div><h2>{page === 'Saved institutes' ? 'Your saved places' : 'Explore with intention'}</h2><p>{page === 'Saved institutes' ? `${filteredInstitutes.length} places on your shortlist` : 'Filter by what matters most to you. No pressure, just better options.'}</p></div><div className="directory-mini-note"><ShieldCheck size={16} /><span>Check every detail before enrolling</span></div></div>}
            <div className={`filter-bar ${page === 'Overview' ? 'filter-bar-overview' : ''}`}>
              <div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search institutes, exams, cities..." aria-label="Search institutes, exams, cities" /><kbd>⌘ K</kbd></div>
              <div className="filter-controls"><label className="select-wrap"><MapPin size={15} /><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} aria-label="Filter by state">{states.map((state) => <option key={state}>{state}</option>)}</select><ChevronDown size={14} /></label><label className="select-wrap mode-select"><MonitorPlay size={15} /><select value={modeFilter} onChange={(event) => setModeFilter(event.target.value as TeachingMode | 'Any mode')} aria-label="Filter by mode"><option>Any mode</option>{modes.map((mode) => <option key={mode}>{mode}</option>)}</select><ChevronDown size={14} /></label><button className={`filter-toggle ${showFilters ? 'filter-toggle-on' : ''}`} onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={16} /><span>Filters</span><ChevronDown size={13} className={showFilters ? 'rotate-180' : ''} /></button></div>
            </div>
            {showFilters && <div className="expanded-filters"><div className="filter-label">CATEGORY</div><div className="filter-pills"><button className={categoryFilter === 'All categories' ? 'selected' : ''} onClick={() => setCategoryFilter('All categories')}>All categories</button>{categories.map((category) => <button key={category} className={categoryFilter === category ? 'selected' : ''} onClick={() => setCategoryFilter(category)}>{category}</button>)}</div><label className="sort-select"><span>Sort results</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="recommended">Recommended</option><option value="rating">Highest rated</option><option value="fees-low">Lowest fee first</option><option value="fees-high">Highest fee first</option><option value="name">Name A–Z</option></select></label><button className="clear-filters" onClick={() => { setCategoryFilter('All categories'); setModeFilter('Any mode'); setStateFilter('All states'); setQuery(''); setSortBy('recommended') }}>Clear all</button></div>}
            {page === 'Overview' && <div className="quick-category-row"><span className="quick-label">QUICK EXPLORE</span>{categories.slice(0, 5).map((category) => { const Icon = categoryIcons[category]; return <button key={category} className={`quick-category ${categoryFilter === category ? 'quick-selected' : ''}`} onClick={() => { setCategoryFilter(categoryFilter === category ? 'All categories' : category); setPage('Explore institutes') }}><Icon size={15} />{category}</button> })}<button className="quick-more" onClick={() => goTo('Explore institutes')}>All categories <ArrowRight size={14} /></button></div>}
            <div className="results-row"><div><span className="results-count">{filteredInstitutes.length} institutes</span><span className="results-context">{page === 'Saved institutes' ? 'in your shortlist' : 'in this view'}</span></div><label className="inline-sort"><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="fees-low">Lowest fees</option><option value="fees-high">Highest fees</option><option value="name">Name A–Z</option></select><ChevronDown size={13} /></label></div>
            {filteredInstitutes.length > 0 ? <div className="institutes-grid">{(page === 'Overview' ? filteredInstitutes.slice(0, 6) : filteredInstitutes).map((institute, index) => <InstituteCard key={institute.id} institute={institute} saved={saved(institute.id)} compared={inCompare(institute.id)} onSave={() => toggleSave(institute.id)} onCompare={() => toggleCompare(institute.id)} onOpen={() => setSelectedInstitute(institute)} index={index} />)}</div> : <div className="empty-state"><div className="empty-icon"><Search size={24} /></div><h3>Nothing in this search just yet</h3><p>Try a different keyword or loosen a filter to see more options.</p><button className="secondary-btn" onClick={() => { setQuery(''); setCategoryFilter('All categories'); setModeFilter('Any mode'); setStateFilter('All states') }}>Reset filters</button></div>}
            {page === 'Overview' && filteredInstitutes.length > 6 && <div className="view-all-row"><span>Showing 6 of {filteredInstitutes.length} possibilities</span><button className="secondary-btn" onClick={() => goTo('Explore institutes')}>Browse all institutes <ArrowRight size={15} /></button></div>}
            {page === 'Overview' && <div className="bottom-note"><div className="note-icon"><ShieldCheck size={19} /></div><div><b>Good decisions start with good information.</b><p>Compare what matters — course fit, teaching mode, fees, location and the facts you can verify.</p></div><button onClick={() => goTo('Compare')}>Compare options <ArrowRight size={15} /></button></div>}
          </>}
          <footer className="app-footer"><span>© 2026 CoachDig <span className="footer-dot">·</span> Built for clearer choices.</span><span><span className="footer-live-dot" /> Sample workspace <span className="footer-dot">·</span> Data is illustrative</span></footer>
        </div>
      </main>

      {compareIds.length > 0 && page !== 'Compare' && page !== 'Manage listings' && <div className="compare-dock"><div className="dock-left"><div className="dock-icon"><GitCompareArrows size={17} /></div><div><b>Ready to compare?</b><span>{compareIds.length} of 3 selected</span></div></div><div className="dock-avatars">{compareInstitutes.slice(0, 3).map((item) => <div key={item.id} style={categoryGradient(item.accent)} title={item.name}>{item.shortName}</div>)}</div><button className="dock-button" onClick={() => goTo('Compare')}>Compare now <ArrowRight size={15} /></button><button className="dock-close" onClick={() => setCompareIds([])} aria-label="Clear comparison"><X size={15} /></button></div>}

      {selectedInstitute && <InstituteModal institute={selectedInstitute} saved={saved(selectedInstitute.id)} compared={inCompare(selectedInstitute.id)} onClose={() => setSelectedInstitute(null)} onSave={() => toggleSave(selectedInstitute.id)} onCompare={() => toggleCompare(selectedInstitute.id)} />}
      {toast && <div className="toast-message"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  )
}

function OverviewHero({ onExplore, onBrowseSaved }: { onExplore: () => void; onBrowseSaved: () => void }) {
  return <section className="hero-panel"><div className="hero-copy"><div className="hero-pill"><Sparkles size={13} /> YOUR NEXT STEP, MADE CLEARER</div><h2>Big goals.<br /><span>Better direction.</span></h2><p>Find learning spaces that fit your ambitions, budget and way of thinking. Your path is yours to shape.</p><div className="hero-buttons"><button className="hero-primary" onClick={onExplore}>Explore institutes <ArrowRight size={16} /></button><button className="hero-secondary" onClick={onBrowseSaved}><Bookmark size={15} /> Your shortlist</button></div><div className="hero-footnote"><div className="footnote-check"><Check size={12} /></div><span>Start with your goals, not the noise.</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-glow" /><div className="orbit orbit-large" /><div className="orbit orbit-small" /><div className="art-grid" /><div className="art-back-card"><span>YOUR LEARNING PATH</span><div className="back-card-line line-a" /><div className="back-card-line line-b" /><div className="back-card-line line-c" /><div className="back-card-progress"><i /></div></div><div className="art-main-card"><div className="art-card-top"><div className="art-card-icon"><Target size={19} /></div><span className="art-card-label">YOUR NEXT MILESTONE</span><MoreHorizontal size={17} /></div><div className="art-main-title">Find your<br />kind of growth.</div><div className="art-card-chips"><span>Clarity</span><span>Consistency</span></div><div className="art-card-bottom"><div className="avatar-stack"><i>H</i><i>J</i><i>A</i></div><span>One step at a time</span><ArrowUpRight size={16} /></div></div><div className="floating-stat floating-stat-top"><div className="floating-icon"><Compass size={16} /></div><div><b>Explore more</b><span>Find your fit</span></div><ArrowUpRight size={14} /></div><div className="floating-stat floating-stat-bottom"><div className="floating-icon green"><Check size={17} /></div><div><b>Your pace. Your path.</b><span>Progress looks different on everyone.</span></div></div><div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✳</div></div><div className="hero-bottom-glow" /></section>
}

function StatCard({ icon, label, value, note, iconClass, trend, onClick }: { icon: ReactNode; label: string; value: string; note: string; iconClass: string; trend: string; onClick: () => void }) {
  return <button className="stat-card" onClick={onClick}><div className={`stat-icon ${iconClass}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value-row"><strong>{value}</strong><span className="stat-trend">{trend} <ArrowUpRight size={12} /></span></div><div className="stat-note">{note}</div><div className="stat-decoration" /></button>
}

function InstituteCard({ institute, saved, compared, onSave, onCompare, onOpen, index }: { institute: Institute; saved: boolean; compared: boolean; onSave: () => void; onCompare: () => void; onOpen: () => void; index: number }) {
  const Icon = categoryIcons[institute.category]
  return <article className="institute-card" style={{ ...categoryGradient(institute.accent), animationDelay: `${index * 55}ms` }}>
    <div className="card-art"><div className="card-art-pattern" /><div className="card-brand-mark"><span>{institute.shortName}</span><i /></div><div className="card-art-category"><Icon size={15} />{institute.category}</div><div className="card-orbit card-orbit-one" /><div className="card-orbit card-orbit-two" /><div className="card-art-glow" /><button className={`save-card-btn ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove from saved' : 'Save institute'}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></button>{institute.featured && <div className="featured-label"><Sparkles size={11} /> FEATURED</div>}</div>
    <div className="card-body"><div className="card-topline"><div className="card-location"><MapPin size={13} />{institute.city}, {institute.state}</div><div className={`status-label ${institute.status === 'Verified' ? 'status-verified' : institute.status === 'Pending review' ? 'status-pending' : 'status-demo'}`}>{institute.status === 'Verified' ? <BadgeCheck size={12} /> : institute.status === 'Pending review' ? <Clock3 size={12} /> : <span className="status-dot" />}{institute.status}</div></div><button className="institute-name-btn" onClick={onOpen}><h3>{institute.name}</h3><ArrowUpRight size={15} /></button><p className="institute-tagline">{institute.tagline}</p><div className="exam-chips">{institute.exams.slice(0, 2).map((exam) => <span key={exam}>{exam}</span>)}{institute.exams.length > 2 && <span className="more-chip">+{institute.exams.length - 2}</span>}</div><div className="card-divider" /><div className="card-meta-row"><div className="fee-info"><span>EST. FEE RANGE</span><b>{money(institute.feeMin)} <i>–</i> {money(institute.feeMax)}</b></div><div className="rating-info"><div><Star size={13} fill="currentColor" /> <b>{institute.rating ? institute.rating.toFixed(1) : '—'}</b></div><span>{institute.reviews ? `${institute.reviews} reviews` : 'No reviews'}</span></div></div><div className="card-actions"><button className="card-view-btn" onClick={onOpen}>View details <ArrowRight size={14} /></button><button className={`card-compare-btn ${compared ? 'compared' : ''}`} onClick={onCompare} aria-label={compared ? 'Remove from comparison' : 'Compare institute'} title={compared ? 'Remove from comparison' : 'Compare institute'}>{compared ? <Check size={15} /> : <GitCompareArrows size={15} />}</button></div></div>
  </article>
}

function InstituteModal({ institute, saved, compared, onClose, onSave, onCompare }: { institute: Institute; saved: boolean; compared: boolean; onClose: () => void; onSave: () => void; onCompare: () => void }) {
  const Icon = categoryIcons[institute.category]
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="institute-modal" role="dialog" aria-modal="true" aria-label={`${institute.name} details`}><button className="modal-close" onClick={onClose} aria-label="Close details"><X size={19} /></button><div className="modal-cover" style={categoryGradient(institute.accent)}><div className="modal-cover-grid" /><div className="modal-brand"><span>{institute.shortName}</span></div><div className="modal-cover-copy"><span><Icon size={14} /> {institute.category}</span><h2>{institute.name}</h2><p><MapPin size={14} /> {institute.locality}, {institute.city}, {institute.state}</p></div><div className="modal-cover-orbit" /></div><div className="modal-content"><div className="modal-status-row"><div className={`status-label ${institute.status === 'Verified' ? 'status-verified' : institute.status === 'Pending review' ? 'status-pending' : 'status-demo'}`}>{institute.status === 'Verified' ? <BadgeCheck size={13} /> : <span className="status-dot" />}{institute.status}</div><span className="demo-warning"><CircleHelp size={14} /> Confirm details independently</span></div><p className="modal-description">{institute.description}</p><div className="modal-facts"><div><span>ESTIMATED FEE RANGE</span><b>{money(institute.feeMin)} – {money(institute.feeMax)}</b></div><div><span>STUDENT RATING</span><b className="modal-rating"><Star size={15} fill="currentColor" /> {institute.rating ? institute.rating.toFixed(1) : 'Not rated'} <small>({institute.reviews})</small></b></div><div><span>TEACHING MODE</span><b>{institute.modes.join(' · ')}</b></div><div><span>EXAM FOCUS</span><b>{institute.exams.join(', ')}</b></div></div><div className="modal-disclaimer"><ShieldCheck size={18} /><p><b>Make an informed choice.</b><br />This is a sample profile. Confirm current batches, exact fees, faculty, outcomes and address directly before enrolling.</p></div><div className="modal-actions"><button className="primary-btn" onClick={onSave}>{saved ? <Check size={16} /> : <Bookmark size={16} />}{saved ? 'Saved to shortlist' : 'Save institute'}</button><button className={`secondary-btn ${compared ? 'comparison-active' : ''}`} onClick={onCompare}>{compared ? <Check size={16} /> : <GitCompareArrows size={16} />}{compared ? 'Added to compare' : 'Compare'}</button></div></div></section></div>
}

function ComparePage({ items, onRemove, onExplore, onOpen }: { items: Institute[]; onRemove: (id: string) => void; onExplore: () => void; onOpen: (institute: Institute) => void }) {
  if (items.length === 0) return <div className="empty-state compare-empty"><div className="empty-icon"><GitCompareArrows size={24} /></div><h3>Your comparison starts here</h3><p>Add up to three institutes from the directory to compare location, fees, teaching modes and exam focus.</p><button className="primary-btn" onClick={onExplore}>Explore institutes <ArrowRight size={15} /></button></div>
  const rows: { label: string; render: (item: Institute) => ReactNode }[] = [
    { label: 'Location', render: (item) => <><MapPin size={13} /> {item.city}, {item.state}</> },
    { label: 'Category', render: (item) => item.category },
    { label: 'Fee range', render: (item) => <b className="compare-fee">{money(item.feeMin)} – {money(item.feeMax)}</b> },
    { label: 'Teaching mode', render: (item) => <div className="compare-modes">{item.modes.map((mode) => <span key={mode}>{mode}</span>)}</div> },
    { label: 'Exam focus', render: (item) => <div className="compare-exams">{item.exams.map((exam) => <span key={exam}>{exam}</span>)}</div> },
    { label: 'Rating', render: (item) => <><Star size={13} fill="currentColor" className="rating-star" /> {item.rating ? item.rating.toFixed(1) : 'Not rated'} <small>({item.reviews} reviews)</small></> },
    { label: 'Listing status', render: (item) => <span className={`status-label ${item.status === 'Verified' ? 'status-verified' : item.status === 'Pending review' ? 'status-pending' : 'status-demo'}`}>{item.status}</span> },
  ]
  return <div className="compare-page"><div className="compare-page-heading"><div><span className="section-kicker">DECIDE WITH CONFIDENCE</span><h2>Your comparison board</h2><p>Compare the details that can help you narrow down your next step.</p></div><div className="compare-progress"><span>{items.length} / 3 selected</span><div>{[0, 1, 2].map((n) => <i className={n < items.length ? 'filled' : ''} key={n} />)}</div></div></div><div className="compare-table-wrap"><table className="compare-table"><thead><tr><th className="compare-label-head">At a glance</th>{items.map((item) => <th key={item.id}><div className="compare-head-card" style={categoryGradient(item.accent)}><div className="compare-head-logo">{item.shortName}</div><button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><X size={14} /></button><span>{item.category}</span><b>{item.name}</b><small><MapPin size={12} /> {item.city}, {item.state}</small><button className="compare-details-btn" onClick={() => onOpen(item)}>View profile <ArrowUpRight size={13} /></button></div></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.label}><th>{row.label}</th>{items.map((item) => <td key={item.id}>{row.render(item)}</td>)}</tr>)}</tbody></table></div><div className="compare-footnote"><ShieldCheck size={17} /><p>Ratings, fees and reviews shown here are illustrative demo values. Confirm course details and total costs directly with each institute before making a decision.</p></div><button className="text-btn compare-add-link" onClick={onExplore}><Plus size={15} /> Add another institute <ArrowRight size={14} /></button></div>
}

function InsightsPanel({ institutes, savedCount, compareCount, pendingCount, verifiedCount }: { institutes: Institute[]; savedCount: number; compareCount: number; pendingCount: number; verifiedCount: number }) {
  const categoryCounts = categories.map((category) => ({ category, count: institutes.filter((item) => item.category === category).length })).sort((a, b) => b.count - a.count)
  const topStates = Array.from(new Set(institutes.map((item) => item.state))).map((state) => ({ state, count: institutes.filter((item) => item.state === state).length })).sort((a, b) => b.count - a.count).slice(0, 5)
  const maxCategory = Math.max(1, ...categoryCounts.map((item) => item.count))
  return <div className="insights-page"><div className="insight-summary-grid"><div className="insight-summary-card"><div className="insight-card-top"><span>Directory size</span><div className="insight-icon mint"><Building2 size={17} /></div></div><b>{institutes.length}</b><p>Sample institute profiles</p><div className="insight-mini-track"><i style={{ width: `${Math.min(100, institutes.length / 30 * 100)}%` }} /></div><small>Starter dataset</small></div><div className="insight-summary-card"><div className="insight-card-top"><span>Verification queue</span><div className="insight-icon amber"><FileCheck2 size={17} /></div></div><b>{pendingCount}</b><p>Listings awaiting review</p><small className="neutral-small">Review before publishing</small></div><div className="insight-summary-card"><div className="insight-card-top"><span>Verified records</span><div className="insight-icon blue"><ShieldCheck size={17} /></div></div><b>{verifiedCount}</b><p>Source-checked listings</p><small className="neutral-small">Only after evidence is checked</small></div><div className="insight-summary-card"><div className="insight-card-top"><span>Your actions</span><div className="insight-icon violet"><Activity size={17} /></div></div><b>{savedCount + compareCount}</b><p>Saved + compared selections</p><small className="neutral-small">Across your workspace</small></div></div><div className="insight-panels"><section className="insight-panel"><div className="panel-heading"><div><span className="section-kicker">DIRECTORY MIX</span><h3>Learning categories</h3></div><span className="panel-tag">{categories.length} categories</span></div><p className="panel-subtitle">How the sample dataset is distributed.</p><div className="category-bars">{categoryCounts.map((item, index) => { const Icon = categoryIcons[item.category]; return <div className="category-bar-row" key={item.category}><div className="bar-category"><span><Icon size={15} /></span>{item.category}</div><div className="bar-track"><i style={{ width: `${item.count / maxCategory * 100}%`, animationDelay: `${index * 80}ms` }} /></div><b>{item.count.toString().padStart(2, '0')}</b></div> })}</div><div className="panel-foot"><span><i className="footer-live-dot" /> Demo dataset</span><span>Updates as records change</span></div></section><section className="insight-panel"><div className="panel-heading"><div><span className="section-kicker">GEOGRAPHIC COVERAGE</span><h3>States in the workspace</h3></div><div className="tiny-map-icon"><MapPin size={17} /></div></div><p className="panel-subtitle">A sample, not a complete national directory.</p><div className="state-rank-list">{topStates.map((item, index) => <div className="state-rank-row" key={item.state}><span className="state-rank-number">0{index + 1}</span><span className="state-rank-name">{item.state}</span><div className="state-rank-bar"><i style={{ width: `${item.count / Math.max(1, ...topStates.map((state) => state.count)) * 100}%` }} /></div><b>{item.count}</b></div>)}</div><div className="coverage-callout"><CircleHelp size={16} /><span>National coverage requires a source-backed data collection and verification workflow.</span></div></section></div><div className="insights-note"><Lightbulb size={18} /><div><b>Use insights to guide the next data batch.</b><p>Prioritize missing states, categories with fewer options, and listings that still need source links, current fee checks and contact validation.</p></div></div></div>
}

interface AdminPageProps {
  institutes: Institute[]; newName: string; setNewName: (value: string) => void; newCity: string; setNewCity: (value: string) => void; newState: string; setNewState: (value: string) => void; newCategory: Category; setNewCategory: (value: Category) => void; newExam: string; setNewExam: (value: string) => void; newMode: TeachingMode; setNewMode: (value: TeachingMode) => void; newFee: string; setNewFee: (value: string) => void; onCreate: (event: FormEvent<HTMLFormElement>) => void; onCycleStatus: (id: string) => void; onDelete: (id: string) => void
}
function AdminPage({ institutes, newName, setNewName, newCity, setNewCity, newState, setNewState, newCategory, setNewCategory, newExam, setNewExam, newMode, setNewMode, newFee, setNewFee, onCreate, onCycleStatus, onDelete }: AdminPageProps) {
  const [adminSearch, setAdminSearch] = useState('')
  const filtered = institutes.filter((item) => `${item.name} ${item.city} ${item.state} ${item.status}`.toLowerCase().includes(adminSearch.toLowerCase()))
  return <div className="admin-page"><div className="admin-banner"><div className="admin-banner-icon"><Settings2 size={20} /></div><div><b>Local admin workspace</b><p>Changes are saved in this browser using local storage. This is a front-end demo, not a secure multi-user production admin system.</p></div><span className="admin-banner-badge">LOCAL ONLY</span></div><div className="admin-columns"><section className="admin-form-panel"><div className="panel-heading"><div><span className="section-kicker">CREATE RECORD</span><h3>Add an institute</h3></div><div className="form-heading-icon"><CirclePlus size={18} /></div></div><p className="panel-subtitle">New records start as pending review. Verify the source before publishing.</p><form className="listing-form" onSubmit={onCreate}><label>Institute name<input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="e.g. Summit Learning Centre" required /></label><div className="form-two-col"><label>City<input value={newCity} onChange={(event) => setNewCity(event.target.value)} placeholder="City" required /></label><label>State / UT<select value={newState} onChange={(event) => setNewState(event.target.value)}>{['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Delhi', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Other'].map((state) => <option key={state}>{state}</option>)}</select></label></div><div className="form-two-col"><label>Category<select value={newCategory} onChange={(event) => setNewCategory(event.target.value as Category)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Teaching mode<select value={newMode} onChange={(event) => setNewMode(event.target.value as TeachingMode)}>{modes.map((mode) => <option key={mode}>{mode}</option>)}</select></label></div><label>Exams or courses<input value={newExam} onChange={(event) => setNewExam(event.target.value)} placeholder="JEE Main, EAPCET" /></label><label>Starting fee estimate (₹)<input type="number" min="0" value={newFee} onChange={(event) => setNewFee(event.target.value)} placeholder="25000" /></label><button type="submit" className="primary-btn admin-submit"><Plus size={16} /> Create pending listing</button></form><div className="admin-form-note"><ShieldCheck size={16} /><span>Do not mark a listing verified until the identity and key details have been source-checked.</span></div></section><section className="admin-records-panel"><div className="panel-heading"><div><span className="section-kicker">DIRECTORY CONTROL</span><h3>Institute records</h3></div><span className="record-count">{institutes.length} total</span></div><div className="admin-record-search"><Search size={15} /><input value={adminSearch} onChange={(event) => setAdminSearch(event.target.value)} placeholder="Search records..." /></div><div className="admin-record-list">{filtered.map((item) => <div className="admin-record" key={item.id}><div className="admin-record-mark" style={categoryGradient(item.accent)}>{item.shortName}</div><div className="admin-record-copy"><b>{item.name}</b><span>{item.city}, {item.state}</span><span className={`status-label ${item.status === 'Verified' ? 'status-verified' : item.status === 'Pending review' ? 'status-pending' : 'status-demo'}`}>{item.status}</span></div><div className="admin-record-actions"><button title="Cycle demo status" aria-label={`Change status for ${item.name}`} onClick={() => onCycleStatus(item.id)}><PencilLine size={14} /></button><button title="Delete record" aria-label={`Delete ${item.name}`} onClick={() => onDelete(item.id)}><Trash2 size={14} /></button></div></div>)}{filtered.length === 0 && <div className="admin-no-results">No matching records.</div>}</div><div className="admin-records-footer"><span><i className="footer-live-dot" /> Local changes</span><span>Review records one by one</span></div></section></div></div>
}

export default App
