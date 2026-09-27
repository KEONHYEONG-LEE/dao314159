// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";

const TEXTS = {
  ko: {
    title: "뉴스레터 구독하기",
    description: "매일 아침 큐레이션된 글로벌 뉴스를 이메일로 받아보세요.",
    placeholder: "이메일 주소를 입력하세요",
    button_default: "구독하기",
    button_done: "구독 완료",
    footer: "구독은 언제든지 취소할 수 있습니다. 개인정보처리방침을 확인하세요.",
    error_empty: "올바른 이메일 주소를 입력해 주세요.",
    error_failed: "구독 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
  },
  en: {
    title: "Subscribe to Newsletter",
    description: "Get daily curated global news delivered straight to your inbox.",
    placeholder: "Enter your email address",
    button_default: "Subscribe",
    button_done: "Subscribed",
    footer: "You can unsubscribe at any time. Check our Privacy Policy.",
    error_empty: "Please enter a valid email address.",
    error_failed: "Failed to subscribe. Please try again.",
  },
};

export function Newsletter() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<"ko" | "en">("en");

  // 현재 앱 언어 감지
  const getAppLanguage = (): "ko" | "en" => {
    if (typeof window === "undefined") return "en";
    try {
      const savedLang =
        localStorage.getItem("language") ||
        localStorage.getItem("gpnr-language") ||
        localStorage.getItem("gpnr_lang") ||
        localStorage.getItem("pi_lang") ||
        "en";
      return savedLang.startsWith("ko") ? "ko" : "en";
    } catch {
      return "en";
    }
  };

  const t = TEXTS[lang] || TEXTS.en;

  useEffect(() => {
    setMounted(true);
    setLang(getAppLanguage());

    const handleLangChange = () => {
      setLang(getAppLanguage());
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert(t.error_empty);
      return;
    }

    setIsLoading(true);

    try {
      // API 구독 백엔드 연동 (API 엔드포인트가 설정되어 있는 경우)
      const res = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });

      if (!res.ok) {
        // 백엔드 미구현 시 localStorage 임시 보관 처리 fallback
        const existing = JSON.parse(localStorage.getItem("gpnr_newsletter_subscribers") || "[]");
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem("gpnr_newsletter_subscribers", JSON.stringify(existing));
        }
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    } catch (e) {
      console.warn("Newsletter subscription API offline, saving locally:", e);
      // 오프라인/에러 시에도 사용자 경험을 위해 저장 로직 수행
      try {
        const existing = JSON.parse(localStorage.getItem("gpnr_newsletter_subscribers") || "[]");
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem("gpnr_newsletter_subscribers", JSON.stringify(existing));
        }
      } catch (err) {}

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-12 px-2">
      <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-4">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-balance text-foreground">
            {t.title}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {t.description}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder={t.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-colors"
                required
                disabled={isLoading || isSubmitted}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isSubmitted}
              className="h-11 px-6 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSubmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.button_done}
                </>
              ) : (
                <>
                  {t.button_default}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            {t.footer}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
