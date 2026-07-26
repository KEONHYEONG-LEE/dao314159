"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "mainnet", label: "Mainnet" },
  { id: "community", label: "Global Community" },
  { id: "commerce", label: "Commerce" },
  { id: "social", label: "Social" },
  { id: "education", label: "Education" },
  { id: "health", label: "Health" },
  { id: "travel", label: "Travel" },
  { id: "utilities", label: "Utilities" },
  { id: "career", label: "Career" },
  { id: "entertainment", label: "Entertainment" },
  { id: "games", label: "Games" },
  { id: "finance", label: "Finance" },
  { id: "music", label: "Music" },
  { id: "sports", label: "Sports" },
  { id: "defi", label: "DeFi" },
  { id: "dapp", label: "dApp" },
  { id: "nft", label: "NFT" },
];

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        {/* Category Tabs */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
