// components/GadgetsPage.tsx
'use client';

import { useState } from 'react';
import { Laptop, Calculator, Tablet, Cpu, Monitor, Headphones, Battery, Wifi, Clock, Shield, Star, Users } from 'lucide-react';

interface Gadget {
    id: number;
    title: string;
    category: string;
    description: string;
    price: string;
    duration: string;
    specs: string[];
    features: string[];
    rating: number;
    reviews: number;
    image: string;
    availability: 'In Stock' | 'Limited' | 'Coming Soon';
    icon: React.ReactNode;
}

const gadgets: Gadget[] = [
    {
        id: 1,
        title: "MacBook Air M1",
        category: "Laptops",
        description: "Powerful, portable, and perfect for coding and design work.",
        price: "$35/mo",
        duration: "3-12 months",
        specs: ["8-core CPU", "7-core GPU", "8GB RAM", "256GB SSD", "13.3-inch Retina"],
        features: ["Up to 18 hours battery", "Fanless design", "Touch ID", "Backlit keyboard"],
        rating: 4.8,
        reviews: 124,
        image: "💻",
        availability: "In Stock",
        icon: <Laptop className="h-8 w-8 text-blue-400" />
    },
    {
        id: 2,
        title: "Casio Scientific Calculator",
        category: "Calculators",
        description: "Essential for secondary math, science, and engineering students.",
        price: "$5/mo",
        duration: "1-6 months",
        specs: ["552 functions", "Natural textbook display", "Solar powered", "Dot matrix display"],
        features: ["Equation solving", "Matrix calculations", "Statistical functions", "Durable design"],
        rating: 4.6,
        reviews: 89,
        image: "📱",
        availability: "In Stock",
        icon: <Calculator className="h-8 w-8 text-blue-400" />
    },
    {
        id: 3,
        title: "iPad Pro + Apple Pencil",
        category: "Tablets",
        description: "Great for digital art, note-taking, and creative work.",
        price: "$25/mo",
        duration: "3-12 months",
        specs: ["12.9-inch Liquid Retina", "M1 chip", "128GB storage", "Face ID"],
        features: ["Apple Pencil 2nd gen", "ProMotion technology", "Center Stage", "5G capable"],
        rating: 4.9,
        reviews: 156,
        image: "📱",
        availability: "In Stock",
        icon: <Tablet className="h-8 w-8 text-blue-400" />
    },
    {
        id: 4,
        title: "Raspberry Pi 4 Starter Kit",
        category: "Dev Kits",
        description: "Learn hardware fundamentals and robotics programming.",
        price: "$10/mo",
        duration: "1-3 months",
        specs: ["4GB RAM", "Quad-core CPU", "Micro-HDMI", "USB 3.0 ports", "Bluetooth 5.0"],
        features: ["Pre-loaded SD card", "Case included", "Power supply", "GPIO pins"],
        rating: 4.7,
        reviews: 67,
        image: "🖥️",
        availability: "Limited",
        icon: <Cpu className="h-8 w-8 text-blue-400" />
    },
    {
        id: 5,
        title: "Noise-Canceling Headphones",
        category: "Audio",
        description: "Focus on your studies without distractions.",
        price: "$12/mo",
        duration: "1-6 months",
        specs: ["Active noise cancellation", "30-hour battery", "Bluetooth 5.0", "Built-in mic"],
        features: ["Comfortable ear cushions", "Foldable design", "Quick charge", "Voice assistant"],
        rating: 4.5,
        reviews: 98,
        image: "🎧",
        availability: "In Stock",
        icon: <Headphones className="h-8 w-8 text-blue-400" />
    },
    {
        id: 6,
        title: "Portable Monitor",
        category: "Displays",
        description: "Dual-screen setup for increased productivity.",
        price: "$15/mo",
        duration: "1-6 months",
        specs: ["15.6-inch", "1080p", "USB-C connection", "Built-in speakers"],
        features: ["Lightweight design", "Travel case included", "Plug and play", "Adjustable stand"],
        rating: 4.4,
        reviews: 45,
        image: "🖥️",
        availability: "Coming Soon",
        icon: <Monitor className="h-8 w-8 text-blue-400" />
    }
];

const categories = ["All", "Laptops", "Tablets", "Calculators", "Dev Kits", "Audio", "Displays"];

const availabilityColors = {
    "In Stock": "text-green-400 bg-green-500/10",
    "Limited": "text-yellow-400 bg-yellow-500/10",
    "Coming Soon": "text-blue-400 bg-blue-500/10"
};

export default function GadgetsPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredGadgets = gadgets.filter(gadget => {
        const matchesCategory = selectedCategory === "All" || gadget.category === selectedCategory;
        const matchesSearch = gadget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gadget.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleRent = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
                    <Laptop className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-400">Tech Rentals</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    Rent the Tech You Need
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Access premium devices at affordable monthly rates. Perfect for students and professionals.
                </p>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Laptop className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-slate-400">Devices Available</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">2,000+</div>
                    <div className="text-sm text-slate-400">Happy Renters</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm text-slate-400">Secure Rentals</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-slate-400">Support</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search devices by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gadget Grid */}
            {filteredGadgets.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                    <Laptop className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Devices Found</h2>
                    <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    {filteredGadgets.map((gadget) => (
                        <div
                            key={gadget.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{gadget.image}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {gadget.title}
                                            </h3>
                                            <span className="text-xs text-slate-500">{gadget.category}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${availabilityColors[gadget.availability]}`}>
                                        {gadget.availability}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(gadget.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-slate-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-400">
                                        {gadget.rating} ({gadget.reviews} reviews)
                                    </span>
                                </div>

                                <p className="text-slate-400 text-sm mb-4">{gadget.description}</p>

                                {/* Specs */}
                                <div className="mb-4">
                                    <p className="text-xs text-slate-500 mb-2">Specifications:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {gadget.specs.map((spec, idx) => (
                                            <span key={idx} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <p className="text-xs text-slate-500 mb-2">Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {gadget.features.map((feature, idx) => (
                                            <span key={idx} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price and Duration */}
                                <div className="flex justify-between items-center mb-4 pt-4 border-t border-slate-700">
                                    <div>
                                        <span className="text-2xl font-bold text-white">{gadget.price}</span>
                                        <span className="text-xs text-slate-400 ml-1">rental</span>
                                        <p className="text-xs text-slate-500 mt-1">Duration: {gadget.duration}</p>
                                    </div>
                                    <button
                                        onClick={handleRent}
                                        disabled={gadget.availability === 'Coming Soon'}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${gadget.availability === 'Coming Soon'
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {gadget.availability === 'Coming Soon' ? 'Coming Soon' : 'Rent Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* How It Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
                    <h3 className="text-lg font-bold text-white mb-2">Choose Your Device</h3>
                    <p className="text-slate-400 text-sm">Browse our collection and select the device you need.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
                    <h3 className="text-lg font-bold text-white mb-2">Select Rental Period</h3>
                    <p className="text-slate-400 text-sm">Choose 1-12 months rental term that fits your needs.</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                    <h3 className="text-lg font-bold text-white mb-2">Get It Delivered</h3>
                    <p className="text-slate-400 text-sm">We deliver to your door. Free shipping on all rentals.</p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Need Help Choosing?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Not sure which device is right for you? Contact our experts for personalized recommendations.
                </p>
                <button
                    onClick={handleRent}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                    Talk to an Expert
                </button>
            </div>
        </div>
    );
}