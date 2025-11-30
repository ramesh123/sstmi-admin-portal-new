import Image from 'next/image';
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cart from "@/components/Cart";
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
    const { getCartCount } = useCart();

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

                {/* Right: Logout + Cart */}
                <nav className="flex items-center space-x-4 w-1/3 justify-end">
                    <button
                        onClick={signOutRedirect}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCartOpen(true)}
                        className="relative border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none select-none">
                                {getCartCount()}
                            </span>
                        )}
                    </Button>
                </nav>
            </header>


            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}