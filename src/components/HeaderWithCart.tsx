import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";

const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const logoutUri = process.env.NEXT_PUBLIC_LOGOUT_URI;
    const cognitoDomain = `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}`;
    
    sessionStorage.removeItem('adminuser');
    sessionStorage.removeItem('token');
    localStorage.clear();

    if (clientId && logoutUri && cognitoDomain) {
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } else {
        console.error('Missing environment variables for Cognito logout.');
    }
};

export default function HeaderWithCart() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [username, setUsername] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { getCartCount } = useCart();

    // Replace this with actual logged-in user name (e.g., from context or session)
    

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
    const loginName = sessionStorage.getItem('adminuser');
    if (loginName) {
      const loginData = JSON.parse(loginName);
      setUsername(loginData?.name);
    }
  }, []);

    return (
        <>
            <header className="text-white p-4 flex items-center justify-between" style={{ backgroundColor: '#1A3C34' }}>
                {/* Left: Placeholder for alignment */}
                <div className="w-1/3" />

                {/* Center: Logo + Title */}
                <div className="flex items-center space-x-3 w-1/3 justify-center">
                    <Image
                        src={process.env.NEXT_PUBLIC_LOGO_PATH || '/default-logo.png'}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                    <h1 className="text-2xl font-bold">SSTMI POS Portal</h1>
                </div>

                {username && <nav className="flex items-center space-x-6 w-1/3 justify-end">
                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 text-white hover:text-amber-300 transition-colors"
                        >
                            <span className="font-medium">{username}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                       {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-amber-200/50">
                                <div className="px-5 py-4 bg-gradient-to-br from-[#1A3C34] to-[#2d5a4f] text-white">
                                    <p className="text-lg font-semibold mt-1">{username}</p>
                                </div>

                                <ul className="py-2">
                                    <li>
                                        <a
                                            href="/change-password"
                                            className="flex items-center px-5 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150"
                                        >
                                            <span className="mr-3 text-amber-600">Change Password</span>
                                        </a>
                                    </li>
                                    <li className="border-t border-gray-100"></li>
                                    <li>
                                        <button
                                            onClick={signOutRedirect}
                                            className="w-full flex items-center px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors duration-150"
                                        >
                                            <span className="mr-3">Log out</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>}
            </header>

            {/* <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
        </>
    );
}