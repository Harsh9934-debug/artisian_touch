import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function ShoppingFooter() {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Link to="/shop/home" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mt-2">
                            Your premier destination for high-quality art and craft supplies.
                            Unleash your creativity with our curated collection of tools and materials.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors group">
                                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors group">
                                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors group">
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors group">
                                <Youtube className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/shop/home" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                            <li><Link to="/shop/listing" className="text-gray-400 hover:text-primary transition-colors text-sm">All Products</Link></li>
                            <li><Link to="/shop/search" className="text-gray-400 hover:text-primary transition-colors text-sm">Search</Link></li>
                            <li><Link to="/shop/account" className="text-gray-400 hover:text-primary transition-colors text-sm">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Categories</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/shop/listing?category=painting" className="text-gray-400 hover:text-primary transition-colors text-sm">Painting Supplies</Link></li>
                            <li><Link to="/shop/listing?category=drawing" className="text-gray-400 hover:text-primary transition-colors text-sm">Drawing Supplies</Link></li>
                            <li><Link to="/shop/listing?category=sculpting" className="text-gray-400 hover:text-primary transition-colors text-sm">Sculpting & Modeling</Link></li>
                            <li><Link to="/shop/listing?category=canvas" className="text-gray-400 hover:text-primary transition-colors text-sm">Canvas & Surfaces</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Art & Craft Ecommerce. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Terms of Service</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default ShoppingFooter;
