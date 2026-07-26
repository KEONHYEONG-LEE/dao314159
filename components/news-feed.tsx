"use client"; 

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  image?: string;       
  urlToImage?: string;  
  url: string;
  source: string;
  date: string;
  content?: string; 
}

// 한국어 카테고리 매핑
const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요뉴스", MAINNET: "메인넷", COMMUNITY: "커뮤니티", COMMERCE: "커머스",
  NODE: "노드", MINING: "채굴", WALLET: "지갑", BROWSER: "브라우저",
  KYC: "KYC", DEVELOPER: "개발자", ECOSYSTEM: "부동산", LISTING: "전망시세",
  OUTLOOK: "전망시세", PRICE: "가격", SECURITY: "보안", EVENT: "주요행사", ROADMAP: "로드맵",
  WHITEPAPER: "백서", LEGAL: "관련법규"
};

// [추가] 기본 영어 모드용 카테고리 매핑
const EN_CATEGORY_MAP: Record<string, string> = {
  ALL: "Top News", MAINNET: "Mainnet", COMMUNITY: "Community", COMMERCE: "Commerce",
  NODE: "Node", MINING: "Mining", WALLET: "Wallet", BROWSER: "Browser",
  KYC: "KYC", DEVELOPER: "Developers", ECOSYSTEM: "Real Estate", LISTING: "Price Outlook",
  OUTLOOK: "Price Outlook", PRICE: "Price", SECURITY: "Security", EVENT: "Events", ROADMAP: "Roadmap",
  WHITEPAPER: "Whitepaper", LEGAL: "Regulations"
};

const stripHtml = (html: string) => {
  if (!html) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
  } catch (e) {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }
};

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState("en"); // [추가] 기본 영어 모드 세팅

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    // [추가] 현재 앱 언어 감지 (이전 컴포넌트와 키값 동기화)
    const targetLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
    setCurrentLang(targetLang);

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}`); 
        const allData = await response.json();
        setNews(allData || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();

    // 언어 실시간 변경 감지 이벤트 바인딩
    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
      setCurrentLang(updatedLang);
    };
    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);Normally I can help with things like this, but I don't seem to have access to that content. You can try again or ask me for something else.
