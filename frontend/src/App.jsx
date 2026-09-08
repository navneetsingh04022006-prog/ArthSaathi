import { Link, Route, Routes } from 'react-router-dom';
import { ArrowRight, Landmark } from 'lucide-react';

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link className="flex items-center gap-2 font-semibold text-forest" to="/">
            <Landmark aria-hidden="true" size={22} />
            ArthSaathi
          </Link>
          <span className="text-sm text-slate-500">Simple guidance for your next step</span>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div>
          <p className="mb-4 font-medium text-forest">Government-backed financial assistance</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
            Find support that fits your requirements.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            ArthSaathi will help you understand suitable schemes, eligibility requirements, and the next steps.
          </p>
          <Link className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-3 font-semibold text-white transition hover:bg-green-800" to="/discover">
            Start exploring
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest">Built for clarity</p>
          <ul className="mt-5 space-y-4 text-slate-700">
            <li>Understand why a scheme may match you.</li>
            <li>See requirements and missing information clearly.</li>
            <li>Use official sources before you apply.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function DiscoverPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-ink">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest">Coming next</p>
        <h1 className="mt-3 text-3xl font-bold">Scheme discovery foundation</h1>
        <p className="mt-4 text-slate-600">The guided profile flow will be added in the next implementation phase.</p>
        <Link className="mt-6 inline-block font-semibold text-forest underline" to="/">Return home</Link>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-ink">
      <div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <Link className="mt-4 inline-block font-semibold text-forest underline" to="/">Return home</Link>
      </div>
    </main>
  );
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
