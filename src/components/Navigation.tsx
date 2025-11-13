'use client';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-gray-200 p-4 shadow" style={{ marginLeft: 250 }}>
      <ul className="flex space-x-4">
        <li>
          <button
            onClick={() => navigateTo('/admin.html')}
            className="text-blue-600 hover:underline"
          >
            Admin Dashboard
          </button>
        </li>
        {/*<li>*/}
        {/*  <button*/}
        {/*    onClick={() => navigateTo('/priest.html')}*/}
        {/*    className="text-blue-600 hover:underline"*/}
        {/*  >*/}
        {/*    Priest Dashboard*/}
        {/*  </button>*/}
        {/*</li>*/}
        <li>
          <button
            onClick={() => navigateTo('/volunteer.html')}
            className="text-blue-600 hover:underline"
          >
            Volunteer Dashboard
          </button>
        </li>
      </ul>
    </nav>
  );
}
