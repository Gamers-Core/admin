export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex-1 w-full pt-20 pb-14 flex flex-col justify-center items-center md:container px-4">
      <div className="flex flex-col gap-6 w-full max-w-md p-6 md:p-12 rounded-2xl border-2 border-border">
        {children}
      </div>
    </main>
  );
}
