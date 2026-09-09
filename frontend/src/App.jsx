import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Calculator, ChevronLeft, CircleAlert, Compass,
  Crosshair, Globe, Landmark, MapPin, ShieldCheck, Sparkles, WalletCards
} from 'lucide-react';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer.jsx';
import { useLanguage } from './i18n/LanguageContext.jsx';
import {
  fetchFinancialEstimate, fetchNearbyPartners, fetchRecommendations,
  fetchSchemePartners, getApiErrorMessage
} from './services/api.js';

const initialProfile = {
  age: '', income: '', purpose: 'DEMO_BUSINESS_START', projectCost: '',
  requestedLoanAmount: '', educationStatus: false,
  beneficiaryCategory: 'DEMO_ENTREPRENEUR', state: 'DEMO_STATE', district: 'DEMO_DISTRICT'
};

function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      className="lang-switcher-btn focus-ring"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
    >
      <Globe size={16} />
      <span>{t('langSwitch')}</span>
    </button>
  );
}

function AppShell({ children }) {
  const { t } = useLanguage();
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand focus-ring" to="/" aria-label="ArthSaathi Home">
          <span className="brand-mark"><Landmark size={20} /></span>
          <span>{t('brand')}</span>
        </Link>
        <div className="header-right">
          <span className="header-note">{t('headerTagline')}</span>
          <LanguageSwitcher />
        </div>
      </header>
      {children}
      <footer className="site-footer">{t('footerText')}</footer>
    </div>
  );
}

function HomePage() {
  const { t } = useLanguage();
  return (
    <AppShell>
      <main className="home-page">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} /> {t('heroEyebrow')}</p>
            <h1>{t('heroTitle')}</h1>
            <p className="hero-lede">{t('heroLede')}</p>
            <Link className="button button-primary focus-ring" to="/discover">
              {t('startProfileBtn')} <ArrowRight size={18} />
            </Link>
            <p className="hero-caption"><ShieldCheck size={15} /> {t('heroDisclaimer')}</p>
          </div>
          <div className="hero-panel">
            <div className="panel-kicker">{t('guidedPathTitle')}</div>
            <div className="path-line">
              <PathStep number="01" title={t('step1Title')} />
              <PathStep number="02" title={t('step2Title')} />
              <PathStep number="03" title={t('step3Title')} />
            </div>
            <div className="hero-stat">
              <strong>{t('heroStatTitle')}</strong>
              <span>{t('heroStatDesc')}</span>
            </div>
          </div>
        </section>
        <section className="value-strip" aria-label="Platform capabilities">
          <ValueItem icon={<Compass />} title={t('discoverCapability')} text={t('discoverDesc')} />
          <ValueItem icon={<BadgeCheck />} title={t('understandCapability')} text={t('understandDesc')} />
          <ValueItem icon={<MapPin />} title={t('continueCapability')} text={t('continueDesc')} />
        </section>
      </main>
      <AIAssistantDrawer />
    </AppShell>
  );
}

function PathStep({ number, title }) {
  return (
    <div className="path-step">
      <span>{number}</span>
      <strong>{title}</strong>
    </div>
  );
}

function ValueItem({ icon, title, text }) {
  return (
    <div className="value-item">
      <span className="icon-box">{icon}</span>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function DiscoverPage() {
  const { t } = useLanguage();
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
  const location = useLocation();

  useEffect(() => {
    if (location.state?.autoFillProfile) {
      handleAutoFillProfile(location.state.autoFillProfile);
    }
  }, [location.state]);

  function updateProfile(event) {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.type === 'number' ? event.target.value : event.target.value
    }));
  }

  function handleAutoFillProfile(extracted) {
    setProfile((current) => ({
      ...current,
      age: extracted.age !== undefined ? String(extracted.age) : (current.age || '25'),
      income: extracted.income !== undefined ? String(extracted.income) : current.income,
      projectCost: extracted.projectCost !== undefined ? String(extracted.projectCost) : current.projectCost,
      requestedLoanAmount: extracted.requestedLoanAmount !== undefined ? String(extracted.requestedLoanAmount) : (extracted.projectCost !== undefined ? String(extracted.projectCost) : current.requestedLoanAmount),
      educationStatus: extracted.educationStatus !== undefined ? Boolean(extracted.educationStatus) : current.educationStatus,
      beneficiaryCategory: extracted.beneficiaryCategory || current.beneficiaryCategory,
      purpose: extracted.purpose || current.purpose
    }));
    setView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitProfile(event) {
    event.preventDefault();
    setError('');
    setLoading('recommendations');
    try {
      const data = await fetchRecommendations(normalizeProfile(profile));
      setRecommendations(data.data);
      setSelected(null);
      setEstimate(null);
      setPartners(null);
      setNearby(null);
      setView('results');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not check your profile. Please try again.'));
    } finally {
      setLoading('');
    }
  }

  async function selectScheme(recommendation) {
    setSelected(recommendation);
    setEstimate(null);
    setPartners(null);
    setNearby(null);
    setError('');
    setView('scheme');
    setLoading('partners');
    try {
      const data = await fetchSchemePartners(recommendation.scheme.schemeId);
      setPartners(data.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not load assistance partners yet.'));
    } finally {
      setLoading('');
    }
  }

  async function calculate() {
    if (!selected || !profile.requestedLoanAmount) return;
    setError('');
    setLoading('estimate');
    try {
      const data = await fetchFinancialEstimate(selected.scheme.schemeId, Number(profile.requestedLoanAmount));
      setEstimate(data.data);
      setView('estimate');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not calculate this estimate. Check the loan amount and try again.'));
    } finally {
      setLoading('');
    }
  }

  async function findNearby() {
    if (!selected) return;
    setError('');
    setLoading('nearby');
    if (!navigator.geolocation) {
      setError('Location is not available in this browser. You can use the relevant partner list below.');
      setLoading('');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchNearbyPartners(selected.scheme.schemeId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            service: 'SCHEME_APPLICATION_SUPPORT'
          });
          setNearby(data.data);
          setView('nearby');
        } catch (requestError) {
          setError(getApiErrorMessage(requestError, 'We could not find nearby assistance.'));
        } finally {
          setLoading('');
        }
      },
      () => {
        setError('We could not access your location. The relevant partner list is still available below.');
        setLoading('');
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  function resetToProfile() {
    setView('profile');
    setRecommendations(null);
    setSelected(null);
    setEstimate(null);
    setPartners(null);
    setNearby(null);
    setError('');
  }

  return (
    <AppShell>
      <main className="journey-page">
        <div className="journey-heading">
          <div>
            <p className="eyebrow">{t('supportFitsEyebrow')}</p>
            <h1>
              {view === 'profile'
                ? t('tellUsPlans')
                : view === 'results'
                ? t('schemeMatchesHeading')
                : selected?.scheme.name || t('nextStepHeading')}
            </h1>
          </div>
          <button type="button" className="text-button focus-ring" onClick={() => navigate('/')}>
            <ChevronLeft size={16} /> {t('homeLink')}
          </button>
        </div>
        <Progress view={view} />
        <div className="journey-layout">
          <section className="main-column" aria-live="polite">
            {error && <Alert message={error} onDismiss={() => setError('')} />}
            {loading && (
              <LoadingState
                label={
                  loading === 'recommendations'
                    ? 'Checking your requirements…'
                    : loading === 'estimate'
                    ? 'Calculating your estimate…'
                    : loading === 'nearby'
                    ? 'Finding nearby assistance…'
                    : 'Finding relevant assistance…'
                }
              />
            )}
            {!loading && view === 'profile' && (
              <ProfileForm profile={profile} onChange={updateProfile} onSubmit={submitProfile} />
            )}
            {!loading && view === 'results' && (
              <Results
                recommendations={recommendations?.recommendations || []}
                onSelect={selectScheme}
                onReset={resetToProfile}
              />
            )}
            {!loading && (view === 'scheme' || view === 'estimate' || view === 'nearby') && (
              <SchemeWorkspace
                selected={selected}
                profile={profile}
                estimate={estimate}
                partners={partners}
                nearby={nearby}
                onCalculate={calculate}
                onFindNearby={findNearby}
                onBack={() => setView('results')}
                onSelectView={setView}
              />
            )}
          </section>
          <aside className="journey-aside">
            <TrustAside view={view} />
          </aside>
        </div>
        <AIAssistantDrawer onAutoFillProfile={handleAutoFillProfile} currentProfile={profile} />
      </main>
    </AppShell>
  );
}

function normalizeProfile(profile) {
  return {
    ...profile,
    age: Number(profile.age),
    income: Number(profile.income),
    projectCost: Number(profile.projectCost),
    requestedLoanAmount: Number(profile.requestedLoanAmount)
  };
}

function Progress({ view }) {
  const { t } = useLanguage();
  const steps = [
    ['profile', t('progressProfile')],
    ['results', t('progressMatches')],
    ['scheme', t('progressChoose')],
    ['estimate', t('progressEstimate')]
  ];
  const active = view === 'nearby' ? 3 : Math.max(0, steps.findIndex(([key]) => key === view));
  return (
    <div className="progress-trail" aria-label="Journey progress">
      {steps.map(([key, label], index) => (
        <div className={index <= active ? 'progress-step active' : 'progress-step'} key={key}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

function ProfileForm({ profile, onChange, onSubmit }) {
  const { t } = useLanguage();
  const categoryOptions = [
    ['DEMO_ENTREPRENEUR', t('catDemo')],
    ['SC', t('catSC')],
    ['ST', t('catST')],
    ['OBC', t('catOBC')],
    ['General', t('catGen')]
  ];

  const purposeOptions = [
    ['DEMO_BUSINESS_START', t('purposeStart')],
    ['dairy', t('purposeDairy')],
    ['retail', t('purposeRetail')],
    ['manufacturing', t('purposeMfg')],
    ['handicraft', t('purposeHandicraft')],
    ['agriculture', t('purposeAgri')],
    ['service', t('purposeService')]
  ];

  return (
    <form className="surface form-surface" onSubmit={onSubmit}>
      <div className="section-intro">
        <span className="section-number">{t('section1Number')}</span>
        <div>
          <h2>{t('aboutYouTitle')}</h2>
          <p>{t('aboutYouDesc')}</p>
        </div>
      </div>
      <div className="form-grid">
        <Field
          label={t('ageLabel')}
          name="age"
          type="number"
          value={profile.age}
          onChange={onChange}
          min="18"
          max="120"
          required
          hint={t('ageHint')}
        />
        <Field
          label={t('incomeLabel')}
          name="income"
          type="number"
          value={profile.income}
          onChange={onChange}
          min="0"
          required
          prefix="₹"
          hint={t('incomeHint')}
        />
        <SelectField
          label={t('categoryLabel')}
          name="beneficiaryCategory"
          value={profile.beneficiaryCategory}
          onChange={onChange}
          options={categoryOptions}
        />
        <SelectField
          label={t('educationLabel')}
          name="educationStatus"
          value={String(profile.educationStatus)}
          onChange={(event) => onChange({ target: { name: 'educationStatus', value: event.target.value === 'true' } })}
          options={[
            ['true', t('eduMet')],
            ['false', t('eduNotMet')]
          ]}
        />
      </div>
      <div className="section-intro section-gap">
        <span className="section-number">{t('section2Number')}</span>
        <div>
          <h2>{t('needTitle')}</h2>
          <p>{t('needDesc')}</p>
        </div>
      </div>
      <div className="form-grid">
        <SelectField
          label={t('purposeLabel')}
          name="purpose"
          value={profile.purpose}
          onChange={onChange}
          options={purposeOptions}
        />
        <Field
          label={t('projectCostLabel')}
          name="projectCost"
          type="number"
          value={profile.projectCost}
          onChange={onChange}
          min="1"
          required
          prefix="₹"
        />
        <Field
          label={t('loanNeededLabel')}
          name="requestedLoanAmount"
          type="number"
          value={profile.requestedLoanAmount}
          onChange={onChange}
          min="1"
          required
          prefix="₹"
        />
      </div>
      <div className="section-intro section-gap">
        <span className="section-number">{t('section3Number')}</span>
        <div>
          <h2>{t('locationTitle')}</h2>
          <p>{t('locationDesc')}</p>
        </div>
      </div>
      <div className="form-grid">
        <Field label={t('stateLabel')} name="state" value={profile.state} onChange={onChange} required />
        <Field label={t('districtLabel')} name="district" value={profile.district} onChange={onChange} required />
      </div>
      <div className="form-actions">
        <p><ShieldCheck size={15} /> {t('privacyNote')}</p>
        <button className="button button-primary focus-ring" type="submit">
          {t('checkOptionsBtn')} <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = 'text', value, onChange, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-wrap">
        {props.prefix && <b>{props.prefix}</b>}
        <input {...props} type={type} name={name} value={value} onChange={onChange} className="focus-ring" />
      </span>
      {props.hint && <small>{props.hint}</small>}
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange} className="focus-ring">
        {options.map(([option, text]) => (
          <option key={option} value={option}>{text}</option>
        ))}
      </select>
    </label>
  );
}

function Results({ recommendations, onSelect, onReset }) {
  const { t } = useLanguage();
  return (
    <div className="results-stack">
      <div className="result-summary">
        <div>
          <p className="eyebrow">{t('evalCompleteEyebrow')}</p>
          <h2>
            {recommendations.length
              ? `${recommendations.length} ${t('optionsFound')}`
              : t('noMatchesFound')}
          </h2>
          <p>
            {recommendations.length
              ? t('optionsMatchedDesc')
              : t('noMatchesDesc')}
          </p>
        </div>
        <button type="button" className="button button-secondary focus-ring" onClick={onReset}>
          {t('reviewProfileBtn')}
        </button>
      </div>
      {recommendations.length ? (
        recommendations.map((item) => (
          <SchemeCard item={item} key={item.scheme.schemeId} onSelect={() => onSelect(item)} />
        ))
      ) : (
        <EmptyState
          title={t('noMatchesFound')}
          text={t('noMatchesDesc')}
          action={t('reviewProfileBtn')}
          onClick={onReset}
        />
      )}
    </div>
  );
}

function SchemeCard({ item, onSelect }) {
  const { t } = useLanguage();
  const isDemo = item.scheme.source?.sourceType === 'DEMO';
  return (
    <article className="surface scheme-card">
      <div className="card-topline">
        <span className={isDemo ? 'badge badge-demo' : 'badge badge-verified'}>
          {isDemo ? t('demoInfoBadge') : t('sourceAvailableBadge')}
        </span>
        <span className="match-score">
          {item.score}
          <small>{t('matchScoreLabel')}</small>
        </span>
      </div>
      <h3>{item.scheme.name}</h3>
      <p className="card-description">{item.scheme.description}</p>
      <div className="mini-facts">
        <Fact label={t('interestRateLabel')} value={item.scheme.financialRules?.interestRate === undefined ? 'Not listed' : `${item.scheme.financialRules.interestRate}%`} />
        <Fact label="Maximum" value={item.scheme.financialRules?.maximumLoanAmount ? formatCurrency(item.scheme.financialRules.maximumLoanAmount) : 'Not listed'} />
        <Fact label={t('tenureLabel')} value={item.scheme.financialRules?.tenureMonths ? `${item.scheme.financialRules.tenureMonths} months` : 'Not listed'} />
      </div>
      <div className="reason-list">
        <strong>{t('whyMatchesTitle')}</strong>
        {item.reasons.slice(0, 3).map((reason) => (
          <span key={reason}><BadgeCheck size={15} />{reason}</span>
        ))}
      </div>
      <button type="button" className="button button-primary full-button focus-ring" onClick={onSelect}>
        {t('exploreSchemeBtn')} <ArrowRight size={17} />
      </button>
      <p className="score-note">{t('scoreNote')}</p>
    </article>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SchemeWorkspace({ selected, estimate, partners, nearby, onCalculate, onFindNearby, onBack }) {
  const { t } = useLanguage();
  const scheme = selected.scheme;
  return (
    <div className="workspace">
      <button type="button" className="back-link focus-ring" onClick={onBack}>
        <ChevronLeft size={16} /> {t('backToMatchesBtn')}
      </button>
      <article className="surface detail-card">
        <div className="card-topline">
          <span className={scheme.source?.sourceType === 'DEMO' ? 'badge badge-demo' : 'badge badge-verified'}>
            {scheme.source?.sourceType === 'DEMO' ? `${t('demoInfoBadge')} — not an official record` : t('sourceAvailableBadge')}
          </span>
          <span className="match-score">
            {selected.score}
            <small>{t('matchScoreLabel')}</small>
          </span>
        </div>
        <h2>{scheme.name}</h2>
        <p className="large-description">{scheme.description}</p>
        <div className="detail-columns">
          <div>
            <h3>{t('whyMatchesTitle')}</h3>
            <div className="reason-list">
              {selected.reasons.map((reason) => (
                <span key={reason}><BadgeCheck size={15} />{reason}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>{t('financialDetailsTitle')}</h3>
            <div className="detail-facts">
              <Fact label={t('financingRangeLabel')} value={`${formatCurrency(scheme.financialRules?.minimumLoanAmount)} – ${formatCurrency(scheme.financialRules?.maximumLoanAmount)}`} />
              <Fact label={t('interestRateLabel')} value={scheme.financialRules?.interestRate === undefined ? 'Not listed' : `${scheme.financialRules.interestRate}%`} />
              <Fact label={t('tenureLabel')} value={scheme.financialRules?.tenureMonths ? `${scheme.financialRules.tenureMonths} months` : 'Not listed'} />
            </div>
          </div>
        </div>
        <div className="source-line">
          <ShieldCheck size={16} />
          <span>{t('sourceLabel')}: {scheme.source?.authority || 'Not specified'} · Status: {scheme.source?.sourceType || 'Not specified'}</span>
        </div>
      </article>
      <div className="action-grid">
        <ActionCard
          icon={<Calculator />}
          title={t('estimateRepaymentTitle')}
          text={t('estimateRepaymentDesc')}
          onClick={onCalculate}
          active={estimate}
        />
        <ActionCard
          icon={<MapPin />}
          title={t('findNearbyTitle')}
          text={t('findNearbyDesc')}
          onClick={onFindNearby}
          active={nearby}
        />
      </div>
      {estimate && <FinancialSummary estimate={estimate} />}
      {partners && <PartnerSection partners={nearby?.partners || partners.partners || []} nearby={Boolean(nearby)} onNearby={onFindNearby} />}
    </div>
  );
}

function ActionCard({ icon, title, text, onClick, active }) {
  return (
    <button type="button" className={active ? 'action-card active focus-ring' : 'action-card focus-ring'} onClick={onClick}>
      <span className="action-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowRight size={18} />
    </button>
  );
}

function FinancialSummary({ estimate }) {
  const { t } = useLanguage();
  return (
    <section className="surface financial-summary">
      <div className="summary-heading">
        <div>
          <p className="eyebrow">{t('illustrativeEyebrow')}</p>
          <h2>{t('repaymentPictureTitle')}</h2>
        </div>
        <span className="badge badge-calc">{t('calcBadge')}</span>
      </div>
      <div className="money-grid">
        <Money label={t('monthlyEmiLabel')} value={estimate.emi?.value} strong />
        <Money label={t('totalInterestLabel')} value={estimate.totalInterest?.value} />
        <Money label={t('totalRepaymentLabel')} value={estimate.totalRepayment?.value} />
      </div>
      <div className="estimate-meta">
        <span>Loan amount: {formatCurrency(estimate.loanAmount?.value)}</span>
        <span>Rate: {estimate.interestRate?.value}%</span>
        <span>Tenure: {estimate.tenureMonths?.value} months</span>
      </div>
      <p className="disclaimer">
        <CircleAlert size={16} /> {t('emiDisclaimer')}
      </p>
    </section>
  );
}

function Money({ label, value, strong }) {
  return (
    <div className={strong ? 'money strong' : 'money'}>
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  );
}

function PartnerSection({ partners, nearby, onNearby }) {
  const { t } = useLanguage();
  return (
    <section className="surface partner-section">
      <div className="summary-heading">
        <div>
          <p className="eyebrow">{nearby ? t('geoResultsEyebrow') : t('relevantAssistanceEyebrow')}</p>
          <h2>
            {partners.length
              ? `${partners.length} ${t('partnersConsiderTitle')}`
              : t('noPartnersTitle')}
          </h2>
        </div>
        {!nearby && (
          <button type="button" className="button button-secondary focus-ring" onClick={onNearby}>
            <Crosshair size={16} /> {t('findNearbyBtn')}
          </button>
        )}
      </div>
      {partners.length ? (
        <div className="partner-list">
          {partners.map((partner) => (
            <PartnerCard partner={partner} key={partner.partnerId} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={nearby ? t('noNearbyFoundTitle') : t('noRelevantPartnersTitle')}
          text={
            nearby
              ? 'Try a larger area or use the relevant partner list when available.'
              : 'No active partner records are currently available for this scheme.'
          }
        />
      )}
    </section>
  );
}

function PartnerCard({ partner }) {
  const demo = partner.verificationStatus === 'DEMO';
  return (
    <article className="partner-card">
      <div className="partner-icon"><MapPin size={19} /></div>
      <div className="partner-body">
        <div className="partner-title">
          <h3>{partner.name}</h3>
          <span className={demo ? 'badge badge-demo' : 'badge badge-verified'}>
            {demo ? 'Demo data' : partner.verificationStatus}
          </span>
        </div>
        <p>{partner.partnerType.replaceAll('_', ' ').toLowerCase()} · {partner.address?.district}, {partner.address?.state}</p>
        <div className="partner-tags">
          {partner.serviceTypes?.slice(0, 2).map((service) => (
            <span key={service}>{service.replaceAll('_', ' ').toLowerCase()}</span>
          ))}
          {partner.distance && <span>{`Approximately ${partner.distance.value} km away`}</span>}
        </div>
      </div>
    </article>
  );
}

function TrustAside({ view }) {
  const { t } = useLanguage();
  return (
    <div className="trust-aside">
      <div className="trust-seal">
        <ShieldCheck size={20} />
        <span>{t('trustFirstSeal')}</span>
      </div>
      <h2>{view === 'profile' ? t('trustAsideTitle1') : t('trustAsideTitle2')}</h2>
      <p>{t('trustAsideDesc')}</p>
      <div className="aside-rule" />
      <div className="aside-item">
        <WalletCards size={17} />
        <span><strong>Estimated</strong> means calculated from scheme data.</span>
      </div>
      <div className="aside-item">
        <BadgeCheck size={17} />
        <span><strong>Demo</strong> means it is for demonstration only.</span>
      </div>
    </div>
  );
}

function LoadingState({ label }) {
  return (
    <div className="surface state-card">
      <span className="spinner" aria-hidden="true" />
      <h2>{label}</h2>
      <p>Using the platform's structured data to prepare your next step.</p>
    </div>
  );
}

function Alert({ message, onDismiss }) {
  return (
    <div className="alert" role="alert">
      <CircleAlert size={18} />
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss message">×</button>
    </div>
  );
}

function EmptyState({ title, text, action, onClick }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Compass size={22} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button type="button" className="button button-secondary focus-ring" onClick={onClick}>
          {action}
        </button>
      )}
    </div>
  );
}

function NotFoundPage() {
  return (
    <AppShell>
      <main className="state-page">
        <EmptyState
          title="Page not found"
          text="That page is not part of the ArthSaathi journey."
          action="Return home"
          onClick={() => window.location.assign('/')}
        />
      </main>
    </AppShell>
  );
}

function formatCurrency(value) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return 'Not listed';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value));
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
