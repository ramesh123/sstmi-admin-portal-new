import Navigation from '@/components/Navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navigation />
      <main className="flex-1 p-8 overflow-auto">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}