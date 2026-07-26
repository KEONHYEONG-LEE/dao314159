"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "홈", href: "/" },
  { name: "정치", href: "/politics" },
  { name: "경제", href: "/economy" },
  { name: "기술", href: "/tech" },
  { name: "스포츠", href: "/sports" },
  { name: "문화", href: "/culture" },
];

// 5개 국어 리스트
const languages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
  { code: "zh", name: "中国" },
  { code: "ja", name: "日本語" },
  { code: "vi", name: "Tiếng Việt" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); // 언어 드롭다운 상태
  const [currentLang, setCurrentLang] = useState(languages[0]); // 현재 선택된 언어
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">GPNR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* 언어 선택 드롭다운 추가 */}
            <div className="relative mr-2">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-md hover:bg-secondary transition-colors text-xs font-medium"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLang.name}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isLangOpen && "rotate-180")} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-xl z-[60] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setIsLangOpen(false);
                        // 여기서 나중에 전역 언어 설정을 변경할 예정입니다.
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-secondary transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="검색"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="테마 변경"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="메뉴"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
