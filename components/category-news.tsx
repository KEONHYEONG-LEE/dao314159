"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "기술",
    articles: [
      {
        id: 13,
        title: "애플, 차세대 AR 헤드셋 공개 예정",
        image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 14,
        title: "양자컴퓨터 상용화, 2028년 전망",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 15,
        title: "자율주행 레벨 4 인증 확대",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
  {
    name: "경제",
    articles: [
      {
        id: 16,
        title: "미국 연준, 금리 인하 신호 발표",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 17,
        title: "글로벌 공급망 정상화 가속",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 18,
        title: "신흥국 투자 유입 증가세",
        image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
  {
    name: "스포츠",
    articles: [
      {
        id: 19,
        title: "손흥민, 시즌 20호 골 기록",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 20,
        title: "올림픽 신규 종목 5개 확정",
        image: "https://images.unsplash.com/photo-1461896836934-28863eddd877?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: 21,
        title: "MLB 시즌 개막, 주요 이적 정리",
        image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
];

export function CategoryNews() {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{category.name}</h2>
              <Link
                href={`/${category.name.toLowerCase()}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                더보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {category.articles.map((article, index) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group">
                  <article className="flex gap-4">
                    {index === 0 ? (
                      <div className="w-full">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {article.date}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors">
                            {article.title}
                          </h3>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {article.date}
                          </span>
                        </div>
                      </>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
