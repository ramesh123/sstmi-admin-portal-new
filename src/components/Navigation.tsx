'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [roleCond, setRoleCond] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('adminuser');
    if (!storedUser && pathname !== '/login') {
      router.push('/login');
    } else if (storedUser) {
      const user = JSON.parse(storedUser);
      setRoleCond(user.roleid);
    }
  }, [router, pathname]);

  return (
    <nav className="bg-gray-200 p-6 shadow">
      <ul className="flex space-x-4">
        {(roleCond===1 || roleCond===2) && <li>
          <button
            onClick={() => navigateTo('/admin')}
            className="text-blue-600 hover:underline"
          >
            Admin Dashboard
          </button>
        </li>}
        {(roleCond===1 || roleCond===2) && <li>
          <button
            onClick={() => navigateTo('/priest')}
            className="text-blue-600 hover:underline"
          >
            Priest Dashboard
          </button>
        </li>}
        {(roleCond===1 || roleCond===2 || roleCond===3) && <li>
          <button
            onClick={() => navigateTo('/volunteer')}
            className="text-blue-600 hover:underline"
          >
            Volunteer Dashboard
          </button>
        </li>}
        {(roleCond===1) && <li>
          <button
            onClick={() => navigateTo('/manageusers')}
            className="text-blue-600 hover:underline"
          >Manage Users</button>
        </li>}
        {(roleCond===1 || roleCond===2) && <li>
          <button
            onClick={() => navigateTo('/managefaqs')}
            className="text-blue-600 hover:underline"
          >Manage Faq's</button>
        </li>}
        {(roleCond===1 || roleCond===2) && <li>
          <button
            onClick={() => navigateTo('/sendmail')}
            className="text-blue-600 hover:underline"
          >Send Mail</button>
        </li>}
      </ul>
    </nav>
  );
}
