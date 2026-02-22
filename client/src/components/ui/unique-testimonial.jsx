"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
    {
        id: 1,
        quote: "The professional grade pigments and brushes from Artisan Touch have elevated my studio practice. You can truly feel the quality in every stroke.",
        author: "Elena Vance",
        role: "Contemporary Painter",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
    {
        id: 2,
        quote: "I've been searching for the perfect cold-press paper for years. Artisan Touch's selection is exactly what I needed for my professional commissions.",
        author: "Marcus Thorne",
        role: "Illustrator",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        quote: "The depth of color in their oil paints is remarkable. It's rare to find a brand that respects the tradition of pigment making while staying accessible.",
        author: "Sofia Rossi",
        role: "Fine Artist",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    },
]

export function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
    const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [isPaused, setIsPaused] = useState(false)

    const handleSelect = useCallback((index) => {
        if (index === activeIndex || isAnimating) return
        setIsAnimating(true)

        setTimeout(() => {
            setDisplayedQuote(testimonials[index].quote)
            setDisplayedRole(testimonials[index].role)
            setActiveIndex(index)
            setTimeout(() => {
                setIsAnimating(false)
            }, 400)
        }, 200)
    }, [activeIndex, isAnimating])

    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % testimonials.length
            handleSelect(nextIndex)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [activeIndex, handleSelect, isPaused])

    return (
        <div
            className="flex flex-col items-center gap-10 py-24 bg-[#FAF9F6] font-serif w-full"
            onMouseEnter={() => {
                setIsPaused(true)
            }}
            onMouseLeave={() => {
                setIsPaused(false)
            }}
        >
            {/* Quote Container */}
            <div className="relative px-8">
                <span className="absolute -left-2 -top-6 text-7xl font-serif text-black/[0.06] select-none pointer-events-none">
                    "
                </span>

                <p
                    className={cn(
                        "text-2xl md:text-4xl font-light text-black text-center max-w-2xl leading-relaxed transition-all duration-400 ease-out italic",
                        isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
                    )}
                >
                    {displayedQuote}
                </p>

                <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-black/[0.06] select-none pointer-events-none">
                    "
                </span>
            </div>

            <div className="flex flex-col items-center gap-8 mt-4">
                {/* Role text */}
                <p
                    className={cn(
                        "text-xs text-black/40 tracking-[0.4em] uppercase transition-all duration-500 ease-out font-sans",
                        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
                    )}
                >
                    {displayedRole}
                </p>

                <div className="flex items-center justify-center gap-4">
                    {testimonials.map((testimonial, index) => {
                        const isActive = activeIndex === index
                        const isHovered = hoveredIndex === index && !isActive
                        const showName = isActive || isHovered

                        return (
                            <button
                                key={testimonial.id}
                                onClick={() => handleSelect(index)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={cn(
                                    "relative flex items-center gap-0 rounded-full cursor-pointer",
                                    "transition-all duration-500 ease-in-out",
                                    isActive ? "bg-black shadow-2xl" : "bg-transparent hover:bg-black/5",
                                    showName ? "pr-6 pl-2 py-2" : "p-1",
                                )}
                            >
                                {/* Avatar with ring animation */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={testimonial.avatar || "/placeholder.svg"}
                                        alt={testimonial.author}
                                        className={cn(
                                            "w-10 h-10 rounded-full object-cover",
                                            "transition-all duration-500 ease-in-out",
                                            isActive ? "ring-2 ring-white/20" : "ring-0",
                                            !isActive && "hover:scale-110",
                                        )}
                                    />
                                </div>

                                <div
                                    className={cn(
                                        "grid transition-all duration-500 ease-in-out",
                                        showName ? "grid-cols-[1fr] opacity-100 ml-3" : "grid-cols-[0fr] opacity-0 ml-0",
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <span
                                            className={cn(
                                                "text-xs tracking-widest uppercase font-semibold whitespace-nowrap block",
                                                "transition-colors duration-300 font-sans",
                                                isActive ? "text-white" : "text-black",
                                            )}
                                        >
                                            {testimonial.author}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
