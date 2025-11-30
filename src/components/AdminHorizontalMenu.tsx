import React from 'react';
import { Home, Heart, Flower2Icon } from "lucide-react";

interface AdminHorizontalMenuProps {
    onNavigate: (section: string) => void;
    activeSection: string;
}

const menuItems = [
    {
        title: "Home",
        section: "home",
        icon: Home,
    },
    {
        title: "All Services",
        section: "services",
        icon: Heart,
    },
    {
        title: "Pooja",
        section: "Pooja",
        icon: Flower2Icon,
    },
    {
        title: "Abhishekam",
        section: "Abhishekam",
        image: "🔥"
    },
    {
        title: "Priest Services",
        section: "PriestServices",
        icon: Flower2Icon,
    },
    {
        title: "Donations",
        section: "Donations",
        icon: Heart,
    },
];

export function AdminHorizontalMenu({ onNavigate, activeSection }: AdminHorizontalMenuProps) {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-1 overflow-x-auto py-3">
                    {/* {menuItems.map((item) => (
                        <button
                            key={item.title}
                            onClick={() => onNavigate(item.section)}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                                ${activeSection === item.section
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                            `}
                        >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            {item.image && <span>{item.image}</span>}
                            <span>{item.title}</span>
                        </button>
                    ))} */}
                </div>
            </div>
        </div>
    );
}
