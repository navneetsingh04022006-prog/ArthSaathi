import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, Calculator, ChevronLeft, CircleAlert, Compass,
  Crosshair, Landmark, MapPin, ShieldCheck, Sparkles, WalletCards
} from 'lucide-react';
import {
  fetchFinancialEstimate, fetchNearbyPartners, fetchRecommendations,
  fetchSchemePartners, getApiErrorMessage
} from './services/api.js';

const initialProfile = {
  age: '', income: '', purpose: 'DEMO_BUSINESS_START', projectCost: '',
  requestedLoanAmount: '', educationStatus: false,
  beneficiaryCategory: 'DEMO_ENTREPRENEUR', state: 'DEMO_STATE', district: 'DEMO_DISTRICT'
};

function AppShell({ children }) {
  return <div className="app-shell"><header className="site-header"><Link className="brand" to="/"><span className="brand-mark"><Landmark size={20} /></span><span>ArthSaathi</span></Link><span className="header-note">Guidance for your next step</span></header>{children}<footer className="site-footer">ArthSaathi is a decision-support platform. Final terms and approval come from the authorized institution.</footer></div>;
}

function HomePage() {
  return <AppShell><main className="home-page"><section className="hero-section"><div className="hero-copy"><p className="eyebrow"><Sparkles size={16} /> Financial assistance, made clearer</p><h1>Find the right next step for your plans.</h1><p className="hero-lede">Understand which schemes may fit your requirements, what repayment could look like, and where you can ask for help.</p><Link className="button button-primary" to="/discover">Start with your profile <ArrowRight size={18} /></Link><p className="hero-caption"><ShieldCheck size={15} /> Your information is used to find matches. It is not an approval decision.</p></div><div className="hero-panel"><div className="panel-kicker">A guided path</div><div className="path-line"><PathStep number="01" title="Tell us about you" /><PathStep number="02" title="See why schemes fit" /><PathStep number="03" title="Plan and find help" /></div><div className="hero-stat"><strong>One clear journey</strong><span>Eligibility, estimates, and assistance in one place.</span></div></div></section><section className="value-strip" aria-label="Platform capabilities"><ValueItem icon={<Compass />} title="Discover" text="Explore relevant schemes" /><ValueItem icon={<BadgeCheck />} title="Understand" text="See the reasons behind a match" /><ValueItem icon={<MapPin />} title="Continue" text="Find support nearby" /></section></main></AppShell>;
}

function PathStep({ number, title }) { return <div className="path-step"><span>{number}</span><strong>{title}</strong></div>; }
function ValueItem({ icon, title, text }) { return <div className="value-item"><span className="icon-box">{icon}</span><div><strong>{title}</strong><span>{text}</span></div></div>; }

function DiscoverPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [recommendations, setRecommendations] = useState(null);
  const [selected, setSelected] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [partners, setPartners] = useState(null);
  const [nearby, setNearby] = useState(null);
  const [view, setView] = useState('profile');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function updateProfile(event) { setProfile((current) => ({ ...current, [event.target.name]: event.target.type === 'number' ? event.target.value : event.target.value })); }

  async function submitProfile(event) {
    event.preventDefault(); setError(''); setLoading('recommendations');
    try {
      const data = await fetchRecommendations(normalizeProfile(profile));
      setRecommendations(data.data); setSelected(null); setEstimate(null); setPartners(null); setNearby(null); setView('results');
    } catch (requestError) { setError(getApiErrorMessage(requestError, 'We could not check your profile. Please try again.')); }
    finally { setLoading(''); }
  }

  async function selectScheme(recommendation) {
    setSelected(recommendation); setEstimate(null); setPartners(null); setNearby(null); setError(''); setView('scheme');
    setLoading('partners');
    try { const data = await fetchSchemePartners(recommendation.scheme.schemeId); setPartners(data.data); }
    catch (requestError) { setError(getApiErrorMessage(requestError, 'We could not load assistance partners yet.')); }
    finally { setLoading(''); }
  }

  async function calculate() {
    if (!selected || !profile.requestedLoanAmount) return;
    setError(''); setLoading('estimate');
    try { const data = await fetchFinancialEstimate(selected.scheme.schemeId, Number(profile.requestedLoanAmount)); setEstimate(data.data); setView('estimate'); }
    catch (requestError) { setError(getApiErrorMessage(requestError, 'We could not calculate this estimate. Check the loan amount and try again.')); }
    finally { setLoading(''); }
  }

  async function findNearby() {
    if (!selected) return;
    setError(''); setLoading('nearby');
    if (!navigator.geolocation) { setError('Location is not available in this browser. You can use the relevant partner list below.'); setLoading(''); return; }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try { const data = await fetchNearbyPartners(selected.scheme.schemeId, { latitude: position.coords.latitude, longitude: position.coords.longitude, service: 'SCHEME_APPLICATION_SUPPORT' }); setNearby(data.data); setView('nearby'); }
      catch (requestError) { setError(getApiErrorMessage(requestError, 'We could not find nearby assistance.')); }
      finally { setLoading(''); }
    }, () => { setError('We could not access your location. The relevant partner list is still available below.'); setLoading(''); }, { enableHighAccuracy: false, timeout: 8000 });
  }

  function resetToProfile() { setView('profile'); setRecommendations(null); setSelected(null); setEstimate(null); setPartners(null); setNearby(null); setError(''); }

  return <AppShell><main className="journey-page"><div className="journey-heading"><div><p className="eyebrow">Find support that fits</p><h1>{view === 'profile' ? 'Tell us about your plans.' : view === 'results' ? 'Your scheme matches.' : selected?.scheme.name || 'Your next step'}</h1></div><button className="text-button" onClick={() => navigate('/')}><ChevronLeft size={16} /> Home</button></div><Progress view={view} /><div className="journey-layout"><section className="main-column">{error && <Alert message={error} onDismiss={() => setError('')} />}{loading && <LoadingState label={loading === 'recommendations' ? 'Checking your requirements…' : loading === 'estimate' ? 'Calculating your estimate…' : loading === 'nearby' ? 'Finding nearby assistance…' : 'Finding relevant assistance…'} />}{!loading && view === 'profile' && <ProfileForm profile={profile} onChange={updateProfile} onSubmit={submitProfile} />}{!loading && view === 'results' && <Results recommendations={recommendations?.recommendations || []} onSelect={selectScheme} onReset={resetToProfile} />}{!loading && (view === 'scheme' || view === 'estimate' || view === 'nearby') && <SchemeWorkspace selected={selected} profile={profile} estimate={estimate} partners={partners} nearby={nearby} onCalculate={calculate} onFindNearby={findNearby} onBack={() => setView('results')} onSelectView={setView} />}</section><aside className="journey-aside"><TrustAside view={view} /></aside></div></main></AppShell>;
}

function normalizeProfile(profile) { return { ...profile, age: Number(profile.age), income: Number(profile.income), projectCost: Number(profile.projectCost), requestedLoanAmount: Number(profile.requestedLoanAmount) }; }

function Progress({ view }) { const steps = [['profile', 'Your profile'], ['results', 'Scheme matches'], ['scheme', 'Choose a path'], ['estimate', 'Estimate & help']]; const active = view === 'nearby' ? 3 : Math.max(0, steps.findIndex(([key]) => key === view)); return <div className="progress-trail" aria-label="Journey progress">{steps.map(([key, label], index) => <div className={index <= active ? 'progress-step active' : 'progress-step'} key={key}><span>{String(index + 1).padStart(2, '0')}</span>{label}</div>)}</div>; }

function ProfileForm({ profile, onChange, onSubmit }) { return <form className="surface form-surface" onSubmit={onSubmit}><div className="section-intro"><span className="section-number">01</span><div><h2>About you</h2><p>Share only what we need to find suitable assistance.</p></div></div><div className="form-grid"><Field label="Your age" name="age" type="number" value={profile.age} onChange={onChange} min="18" max="120" required hint="You must be 18 or older." /><Field label="Annual family income" name="income" type="number" value={profile.income} onChange={onChange} min="0" required prefix="₹" hint="Use the total yearly income in rupees." /><SelectField label="Beneficiary category" name="beneficiaryCategory" value={profile.beneficiaryCategory} onChange={onChange} options={[["DEMO_ENTREPRENEUR", 'Entrepreneur']]} /><SelectField label="Education status" name="educationStatus" value={String(profile.educationStatus)} onChange={(event) => onChange({ target: { name: 'educationStatus', value: event.target.value === 'true' } })} options={[["true", 'Education requirement met'], ["false", 'Not applicable / not completed']]} /></div><div className="section-intro section-gap"><span className="section-number">02</span><div><h2>What do you need?</h2><p>These values help compare scheme fit and estimate your repayment.</p></div></div><div className="form-grid"><SelectField label="Purpose" name="purpose" value={profile.purpose} onChange={onChange} options={[["DEMO_BUSINESS_START", 'Start a small business']]} /><Field label="Estimated project cost" name="projectCost" type="number" value={profile.projectCost} onChange={onChange} min="1" required prefix="₹" /><Field label="Loan amount needed" name="requestedLoanAmount" type="number" value={profile.requestedLoanAmount} onChange={onChange} min="1" required prefix="₹" /></div><div className="section-intro section-gap"><span className="section-number">03</span><div><h2>Where are you based?</h2><p>Location fit uses the information you provide here.</p></div></div><div className="form-grid"><Field label="State" name="state" value={profile.state} onChange={onChange} required /><Field label="District" name="district" value={profile.district} onChange={onChange} required /></div><div className="form-actions"><p><ShieldCheck size={15} /> Your answers stay in this journey until you submit.</p><button className="button button-primary" type="submit">Check my options <ArrowRight size={18} /></button></div></form>; }

function Field({ label, name, type = 'text', value, onChange, ...props }) { return <label className="field"><span>{label}</span><span className="input-wrap">{props.prefix && <b>{props.prefix}</b>}<input {...props} type={type} name={name} value={value} onChange={onChange} /></span>{props.hint && <small>{props.hint}</small>}</label>; }
function SelectField({ label, name, value, onChange, options }) { return <label className="field"><span>{label}</span><select name={name} value={value} onChange={onChange}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>; }

function Results({ recommendations, onSelect, onReset }) { return <div className="results-stack"><div className="result-summary"><div><p className="eyebrow">Backend evaluation complete</p><h2>{recommendations.length ? `${recommendations.length} option${recommendations.length > 1 ? 's' : ''} to explore` : 'No matching schemes found'}</h2><p>{recommendations.length ? 'These options passed the eligibility checks and were ranked for fit.' : 'We could not find an eligible scheme for the information provided.'}</p></div><button className="button button-secondary" onClick={onReset}>Review profile</button></div>{recommendations.length ? recommendations.map((item) => <SchemeCard item={item} key={item.scheme.schemeId} onSelect={() => onSelect(item)} />) : <EmptyState title="Nothing suitable yet" text="You can review your information and try again. Final eligibility is always determined by the authorized institution." action="Review information" onClick={onReset} />}</div>; }

function SchemeCard({ item, onSelect }) { const isDemo = item.scheme.source?.sourceType === 'DEMO'; return <article className="surface scheme-card"><div className="card-topline"><span className={isDemo ? 'badge badge-demo' : 'badge badge-verified'}>{isDemo ? 'Demo information' : 'Source available'}</span><span className="match-score">{item.score}<small>Scheme Match Score</small></span></div><h3>{item.scheme.name}</h3><p className="card-description">{item.scheme.description}</p><div className="mini-facts"><Fact label="Interest" value={item.scheme.financialRules?.interestRate === undefined ? 'Not listed' : `${item.scheme.financialRules.interestRate}%`} /><Fact label="Maximum" value={item.scheme.financialRules?.maximumLoanAmount ? formatCurrency(item.scheme.financialRules.maximumLoanAmount) : 'Not listed'} /><Fact label="Tenure" value={item.scheme.financialRules?.tenureMonths ? `${item.scheme.financialRules.tenureMonths} months` : 'Not listed'} /></div><div className="reason-list"><strong>Why it matches</strong>{item.reasons.slice(0, 3).map((reason) => <span key={reason}><BadgeCheck size={15} />{reason}</span>)}</div><button className="button button-primary full-button" onClick={onSelect}>Explore this scheme <ArrowRight size={17} /></button><p className="score-note">Match score reflects fit with your information, not approval probability.</p></article>; }
function Fact({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function SchemeWorkspace({ selected, profile, estimate, partners, nearby, onCalculate, onFindNearby, onBack, onSelectView }) { const scheme = selected.scheme; return <div className="workspace"><button className="back-link" onClick={onBack}><ChevronLeft size={16} /> Back to matches</button><article className="surface detail-card"><div className="card-topline"><span className={scheme.source?.sourceType === 'DEMO' ? 'badge badge-demo' : 'badge badge-verified'}>{scheme.source?.sourceType === 'DEMO' ? 'Demo information — not an official record' : 'Source information available'}</span><span className="match-score">{selected.score}<small>Scheme Match Score</small></span></div><h2>{scheme.name}</h2><p className="large-description">{scheme.description}</p><div className="detail-columns"><div><h3>Why this matches</h3><div className="reason-list">{selected.reasons.map((reason) => <span key={reason}><BadgeCheck size={15} />{reason}</span>)}</div></div><div><h3>Financial details</h3><div className="detail-facts"><Fact label="Financing range" value={`${formatCurrency(scheme.financialRules?.minimumLoanAmount)} – ${formatCurrency(scheme.financialRules?.maximumLoanAmount)}`} /><Fact label="Interest rate" value={scheme.financialRules?.interestRate === undefined ? 'Not listed' : `${scheme.financialRules.interestRate}%`} /><Fact label="Tenure" value={scheme.financialRules?.tenureMonths ? `${scheme.financialRules.tenureMonths} months` : 'Not listed'} /></div></div></div><div className="source-line"><ShieldCheck size={16} /><span>Source: {scheme.source?.authority || 'Not specified'} · Status: {scheme.source?.sourceType || 'Not specified'}</span></div></article><div className="action-grid"><ActionCard icon={<Calculator />} title="Estimate repayment" text="See an illustrative EMI from the scheme's financial rules." onClick={onCalculate} active={estimate} /><ActionCard icon={<MapPin />} title="Find nearby help" text="Use your location to find relevant assistance." onClick={onFindNearby} active={nearby} /></div>{estimate && <FinancialSummary estimate={estimate} />}{partners && <PartnerSection partners={nearby?.partners || partners.partners || []} nearby={Boolean(nearby)} onNearby={onFindNearby} />}</div>; }
function ActionCard({ icon, title, text, onClick, active }) { return <button className={active ? 'action-card active' : 'action-card'} onClick={onClick}><span className="action-icon">{icon}</span><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={18} /></button>; }
function FinancialSummary({ estimate }) { return <section className="surface financial-summary"><div className="summary-heading"><div><p className="eyebrow">Illustrative estimate</p><h2>Your repayment picture</h2></div><span className="badge badge-calc">Calculated by ArthSaathi</span></div><div className="money-grid"><Money label="Estimated monthly EMI" value={estimate.emi?.value} strong /><Money label="Total interest" value={estimate.totalInterest?.value} /><Money label="Estimated repayment" value={estimate.totalRepayment?.value} /></div><div className="estimate-meta"><span>Loan amount: {formatCurrency(estimate.loanAmount?.value)}</span><span>Rate: {estimate.interestRate?.value}%</span><span>Tenure: {estimate.tenureMonths?.value} months</span></div><p className="disclaimer"><CircleAlert size={16} /> Actual terms may vary based on final sanction, lender terms, fees, and moratorium treatment.</p></section>; }
function Money({ label, value, strong }) { return <div className={strong ? 'money strong' : 'money'}><span>{label}</span><strong>{formatCurrency(value)}</strong></div>; }
function PartnerSection({ partners, nearby, onNearby }) { return <section className="surface partner-section"><div className="summary-heading"><div><p className="eyebrow">{nearby ? 'Geographic results' : 'Relevant assistance'}</p><h2>{partners.length ? `${partners.length} partner${partners.length > 1 ? 's' : ''} to consider` : 'No partners found'}</h2></div>{!nearby && <button className="button button-secondary" onClick={onNearby}><Crosshair size={16} /> Find nearby</button>}</div>{partners.length ? <div className="partner-list">{partners.map((partner) => <PartnerCard partner={partner} key={partner.partnerId} />)}</div> : <EmptyState title={nearby ? 'No nearby assistance found' : 'No relevant partners listed'} text={nearby ? 'Try a larger area or use the relevant partner list when available.' : 'No active partner records are currently available for this scheme.'} />}</section>; }
function PartnerCard({ partner }) { const demo = partner.verificationStatus === 'DEMO'; return <article className="partner-card"><div className="partner-icon"><MapPin size={19} /></div><div className="partner-body"><div className="partner-title"><h3>{partner.name}</h3><span className={demo ? 'badge badge-demo' : 'badge badge-verified'}>{demo ? 'Demo data' : partner.verificationStatus}</span></div><p>{partner.partnerType.replaceAll('_', ' ').toLowerCase()} · {partner.address?.district}, {partner.address?.state}</p><div className="partner-tags">{partner.serviceTypes?.slice(0, 2).map((service) => <span key={service}>{service.replaceAll('_', ' ').toLowerCase()}</span>)}{partner.distance && <span>{`Approximately ${partner.distance.value} km away`}</span>}</div></div></article>; }
function TrustAside({ view }) { return <div className="trust-aside"><div className="trust-seal"><ShieldCheck size={20} /><span>Trust first</span></div><h2>{view === 'profile' ? 'Clear answers start with the right details.' : 'Know what each result means.'}</h2><p>ArthSaathi presents structured information from the backend. It does not guarantee eligibility, approval, or repayment terms.</p><div className="aside-rule" /><div className="aside-item"><WalletCards size={17} /><span><strong>Estimated</strong> means calculated from scheme data.</span></div><div className="aside-item"><BadgeCheck size={17} /><span><strong>Demo</strong> means it is for demonstration only.</span></div></div>; }
function LoadingState({ label }) { return <div className="surface state-card"><span className="spinner" aria-hidden="true" /><h2>{label}</h2><p>Using the platform's structured data to prepare your next step.</p></div>; }
function Alert({ message, onDismiss }) { return <div className="alert" role="alert"><CircleAlert size={18} /><span>{message}</span><button onClick={onDismiss} aria-label="Dismiss message">×</button></div>; }
function EmptyState({ title, text, action, onClick }) { return <div className="empty-state"><div className="empty-icon"><Compass size={22} /></div><h3>{title}</h3><p>{text}</p>{action && <button className="button button-secondary" onClick={onClick}>{action}</button>}</div>; }
function NotFoundPage() { return <AppShell><main className="state-page"><EmptyState title="Page not found" text="That page is not part of the ArthSaathi journey." action="Return home" onClick={() => window.location.assign('/')} /></main></AppShell>; }
function formatCurrency(value) { if (value === undefined || value === null || Number.isNaN(Number(value))) return 'Not listed'; return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value)); }

export default function App() { return <Routes><Route path="/" element={<HomePage />} /><Route path="/discover" element={<DiscoverPage />} /><Route path="*" element={<NotFoundPage />} /></Routes>; }
