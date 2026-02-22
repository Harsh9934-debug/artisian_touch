import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Palette, LucideLink } from "lucide-react";
import { Link } from "react-router-dom";

function ShoppingFooter() {
    return (
        <section className="bg-[#FAF9F6] py-12">
            <footer className="container mx-auto bg-[#151515] text-white pt-24 pb-12 font-serif rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/5">
                <div className="px-12 md:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16 items-start relative z-10">
                        {/* Brand Section - Left */}
                        <div className="md:col-span-3">
                            <div className="mb-8 flex items-center gap-4">
                                <h2 className="text-5xl font-normal tracking-tight">Artisans</h2>
                                <Palette className="w-8 h-8 text-primary/80" />
                            </div>
                            <p className="text-gray-400 text-sm leading-[1.8] max-w-xs italic font-light">
                                Crafting sacred moments for the modern creator. <br />
                                Rooted in tradition, designed for you.
                            </p>
                        </div>

                        {/* Decorative Motif - Center */}
                        <div className="md:col-span-4 flex justify-center items-center">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                                
                            </div>
                        </div>

                        {/* Navigation - Right Columns */}
                        <div className="md:col-span-5 grid grid-cols-2 gap-12">
                            {/* Explore Column */}
                            <div>
                                <h3 className="text-xl font-normal mb-10 text-white border-b border-white/10 pb-4 inline-block pr-12">Explore</h3>
                                <ul className="flex flex-col gap-6">
                                    <li><Link to="/shop/listing" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 inline-block">Shop All Collections</Link></li>
                                    <li><Link to="/shop/home" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 inline-block">Our Heritage Story</Link></li>
                                    <li><Link to="/shop/listing" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 inline-block">Craftsmanship</Link></li>
                                    <li><Link to="/shop/search" className="text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1 inline-block">Contact & Support</Link></li>
                                </ul>
                            </div>

                            {/* Connect Column */}
                            <div>
                                <h3 className="text-xl font-normal mb-10 text-white border-b border-white/10 pb-4 inline-block pr-12">Connect</h3>
                                <ul className="flex flex-col gap-6">
                                    <li>
                                        <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1">
                                            <Instagram className="w-5 h-5 text-primary/60" />
                                            <span>Instagram</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1">
                                            <Facebook className="w-5 h-5 text-primary/60" />
                                            <span>Facebook</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition-all text-sm hover:translate-x-1">
                                            <Twitter className="w-5 h-5 text-primary/60" />
                                            <span>Pinterest</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 pt-10 border-t border-white/5 flex justify-center items-center">
                        <p className="text-gray-500 text-[11px] uppercase tracking-[0.4em] font-light">
                            Copyright: © {new Date().getFullYear()} Artisan Touch. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </section>
    );
}

export default ShoppingFooter;
