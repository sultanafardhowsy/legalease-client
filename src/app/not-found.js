import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="text-center max-w-lg space-y-6">
        {/* Large 404 Heading */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wider">
          404
        </h1>
        
        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-200">
            Page not found
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Sorry, we couldn’t find the page you were looking for. The link might be outdated, or the page may have moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-warning hover:bg-warning/90 rounded-lg shadow-sm transition-colors duration-200"
          >
            Go back home
          </Link>
          <Link 
            href="/lawyers"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm transition-colors duration-200"
          >
            Browse all Lawyers
          </Link>
        </div>
      </div>
    </main>
  );
}