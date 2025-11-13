// // src/app/(protected)/layout.tsx
// 'use client';
// import Navigation from '@/components/Navigation';
// import { useEffect, useState } from 'react';
// import { checkAuth } from '@/lib/authUtils';
// import { useRouter } from 'next/navigation';

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null indicates loading

//   useEffect(() => {
//     const authenticate = () => {
//       if (!checkAuth()) {
//         window.location.href = '/login';
//       } else {
//         setIsAuthenticated(true);
//       }
//     };

//     authenticate();
//   }, []);

//   if (isAuthenticated === null) {
//     // Optionally, render a loading spinner or placeholder
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navigation />
//       <main className="container mx-auto px-4 py-8">
//         {children}
//       </main>
//     </div>
//   );
// }
// src/app/(protected)/layout.tsx
import Navigation from '@/components/Navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
