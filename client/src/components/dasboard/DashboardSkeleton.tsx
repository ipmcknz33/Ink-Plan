export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-4 w-80 max-w-full rounded bg-slate-200" />

          <div className="grid gap-4 pt-4 md:grid-cols-3">
            <div className="h-28 rounded-2xl bg-slate-100" />
            <div className="h-28 rounded-2xl bg-slate-100" />
            <div className="h-28 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-4 w-64 rounded bg-slate-200" />
            <div className="grid gap-4 pt-2 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-44 rounded-2xl bg-slate-100" />
              <div className="h-44 rounded-2xl bg-slate-100" />
              <div className="h-44 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-36 rounded bg-slate-200" />
              <div className="h-4 w-52 rounded bg-slate-200" />
              <div className="space-y-3 pt-2">
                <div className="h-14 rounded-2xl bg-slate-100" />
                <div className="h-14 rounded-2xl bg-slate-100" />
                <div className="h-14 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-44 rounded bg-slate-200" />
              <div className="h-4 w-60 rounded bg-slate-200" />
              <div className="h-24 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}