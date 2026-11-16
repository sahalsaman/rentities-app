import React from 'react';


export function FullscreenLoader({ text = 'Loading...', className = '' }) {
    return (
        <div className={`min-h-[40vh] w-full px-4 py-6 ${className}`} aria-label={text} role="status">
            <div className="mx-auto max-w-7xl animate-pulse space-y-5">
                <div className="flex items-center justify-between gap-4"><div className="space-y-2"><div className="h-4 w-24 rounded bg-slate-200" /><div className="h-8 w-48 rounded bg-slate-200" /></div><div className="h-10 w-28 rounded-xl bg-slate-200" /></div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /><div className="hidden h-28 rounded-2xl bg-slate-200 lg:block" /><div className="hidden h-28 rounded-2xl bg-slate-200 lg:block" /></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 h-5 w-40 rounded bg-slate-200" />{[1, 2, 3, 4, 5].map((row) => <div key={row} className="flex gap-4 border-t border-slate-100 py-4"><div className="h-4 flex-[2] rounded bg-slate-100" /><div className="h-4 flex-1 rounded bg-slate-100" /><div className="h-4 flex-1 rounded bg-slate-100" /></div>)}</div>
            </div>
        </div>
    );
}

export function SkeletonCard({ width = 'w-full', height = 'h-40', className = '' }) {
    return (
        <div className={`rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden ${width} ${height} ${className}`}>
            <div className="animate-pulse p-4 h-full flex flex-col">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        </div>
    );
}

export function PageSkeleton({ cards = 0, rows = 5 }: { cards?: number; rows?: number }) {
  return <div className="mx-auto max-w-7xl animate-pulse space-y-6">
    <div className="flex items-center justify-between gap-4"><div className="space-y-2"><div className="h-4 w-24 rounded bg-slate-200" /><div className="h-8 w-44 rounded bg-slate-200" /></div><div className="h-11 w-44 rounded-xl bg-slate-200" /></div>
    {cards > 0 && <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: cards }).map((_, index) => <SkeletonCard key={index} height="h-28" />)}</div>}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 h-11 w-full max-w-sm rounded-xl bg-slate-100" />{Array.from({ length: rows }).map((_, index) => <div key={index} className="flex gap-4 border-t border-slate-100 py-4"><div className="h-4 flex-[2] rounded bg-slate-100" /><div className="h-4 flex-1 rounded bg-slate-100" /><div className="h-4 flex-1 rounded bg-slate-100" /></div>)}</div>
  </div>;
}

export function DashboardSkeleton() {
  return <div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-10 w-56 rounded bg-slate-200" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} height="h-28" />)}</div><div className="grid gap-4 lg:grid-cols-2"><SkeletonCard height="h-72" /><SkeletonCard height="h-72" /></div></div>;
}


