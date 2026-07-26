"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

const featuredArticle = {
  id: 1,
  title: "Pi Network 오픈 메인넷 전환, 글로벌 암호화폐 시장에 새로운 전환점",
  description:
    "Pi Network가 오픈 메인넷으로의 전환을 앞두고 있습니다. 전 세계 수백만 파이오니어들이 주목하는 이 역사적인 순간을 GPNR이 실시간으로 전합니다.",
  image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop",
  category: "기술",
  date: "2026년 3월 24일",
  readTime: "5분",
};

const secondaryArticles = [
  {
    id: 2,
    title: "글로벌 기후 정상회담 개최, 탄소중립 2040 목표 합의",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=400&fit=crop",
    category: "정치",
    date: "2026년 3월 24일",
  },
  {
    id: 3,
    title: "AI 기술 혁명, 의료 분야에서 새로운 가능성 열다",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    category: "기술",
    date: "2026년 3월 23일",
  },
  {
    id: 4,
    title: "세계 경제 전망: 2026년 성장률 3.5% 예상",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    category: "경제",
    date: "2026년 3월 23일",
  },
];

export function FeaturedNews() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">주요 뉴스</h2>
        </div>
        <Link
          href="/featured"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          더보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <Link href={`/news/${featuredArticle.id}`} className="lg:col-span-2 group">
          <article className="relative h-[400px] lg:h-full rounded-xl overflow-hidden">
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                {featuredArticle.category}
              </span>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 line-clamp-2 text-balance">
                {featuredArticle.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 hidden sm:block">
                {featuredArticle.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{featuredArticle.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {featuredArticle.readTime}
                </span>
              </div>
            </div>
          </article>
        </Link>

        {/* Secondary Articles */}
        <div className="flex flex-col gap-4">
          {secondaryArticles.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`} className="group">
              <article className="flex gap-4 p-3 rounded-lg bg-card hover:bg-secondary transition-colors">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-xs text-accent font-medium mb-1">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-xs text-muted-foreground mt-1">
                    {article.date}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
