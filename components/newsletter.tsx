"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-12">
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-4">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            뉴스레터 구독하기
          </h2>
          <p className="text-muted-foreground mb-6">
            매일 아침 큐레이션된 글로벌 뉴스를 이메일로 받아보세요.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className="h-11 px-6 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  구독 완료
                </>
              ) : (
                <>
                  구독하기
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            구독은 언제든지 취소할 수 있습니다. 개인정보처리방침을 확인하세요.
          </p>
        </div>
      </div>
    </section>
  );
}
