import React from 'react';
import {
  Flame,
  Globe,
  Tv,
  Zap,
  Wallet,
  Compass,
  Map,
  FileText,
  ShoppingCart,
  ShieldCheck,
  Code,
  TrendingUp,
  DollarSign,
  Gavel,
  Coins,
  Shield,
  Calendar,
  Users,
  HelpCircle,
  Cpu,
  type LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  name: string;      // 한국어 모드용 라벨
  enName: string;    // 영어 모드용 라벨
  label?: string;    // GpnrHeader 호환용
  enLabel?: string;  // GpnrHeader 호환용
  iconName: string;  // 문자열 명칭
  Icon: LucideIcon;  // Lucide 아이콘 컴포넌트 객체
  group: 'core' | 'ecosystem' | 'market_legal';
  isModal?: boolean; // 팝업 모달 전용 여부
}

export const NEWS_CATEGORIES: Category[] = [
  // 1행 (1~4): 코어 네트워크 1
  { id: "top-news", name: "주요뉴스", label: "주요뉴스", enName: "Top News", enLabel: "Top News", iconName: "Flame", Icon: Flame, group: "core" }, 
  { id: "mainnet", name: "메인넷", label: "메인넷", enName: "Mainnet", enLabel: "Mainnet", iconName: "Globe", Icon: Globe, group: "core" },
  { id: "node", name: "노드", label: "노드", enName: "Node", enLabel: "Node", iconName: "Tv", Icon: Tv, group: "core" },
  { id: "mining", name: "채굴", label: "채굴", enName: "Mining", enLabel: "Mining", iconName: "Zap", Icon: Zap, group: "core" },

  // 2행 (5~8): 코어 네트워크 2
  { id: "wallet", name: "지갑", label: "지갑", enName: "Wallet", enLabel: "Wallet", iconName: "Wallet", Icon: Wallet, group: "core" },
  { id: "browser", name: "브라우저", label: "브라우저", enName: "Browser", enLabel: "Browser", iconName: "Compass", Icon: Compass, group: "core" },
  { id: "roadmap", name: "로드맵", label: "로드맵", enName: "Roadmap", enLabel: "Roadmap", iconName: "Map", Icon: Map, group: "core" },
  { id: "whitepaper", name: "백서", label: "백서", enName: "Whitepaper", enLabel: "Whitepaper", iconName: "FileText", Icon: FileText, group: "core" },

  // 3행 (9~12): 생태계 및 서비스
  { id: "commerce", name: "커머스", label: "커머스", enName: "Commerce", enLabel: "Commerce", iconName: "ShoppingCart", Icon: ShoppingCart, group: "ecosystem" },
  { id: "kyc", name: "KYC", label: "KYC", enName: "KYC", enLabel: "KYC", iconName: "ShieldCheck", Icon: ShieldCheck, group: "ecosystem" },
  { id: "developer", name: "개발자", label: "개발자", enName: "Developers", enLabel: "Developers", iconName: "Code", Icon: Code, group: "ecosystem" },
  { id: "outlook", name: "가격 전망", label: "가격 전망", enName: "Outlook", enLabel: "Outlook", iconName: "TrendingUp", Icon: TrendingUp, group: "market_legal" },

  // 4행 (13~16): 시장 / 가격 / 규정 / 디파이
  { id: "price", name: "가격", label: "가격", enName: "Price", enLabel: "Price", iconName: "DollarSign", Icon: DollarSign, group: "market_legal" },
  { id: "rules", name: "규정", label: "규정", enName: "Rules", enLabel: "Rules", iconName: "Gavel", Icon: Gavel, group: "market_legal" },
  { id: "defi", name: "디파이", label: "디파이", enName: "DeFi", enLabel: "DeFi", iconName: "Coins", Icon: Coins, group: "ecosystem" },
  { id: "tech", name: "기술/생태계", label: "기술/생태계", enName: "Ecosystem", enLabel: "Ecosystem", iconName: "Cpu", Icon: Cpu, group: "ecosystem" },

  // 5행 (17~20): [마지막 줄 고정 4개: 보안 -> 일정 -> 커뮤니티 -> 이용방법]
  { id: "security", name: "보안", label: "보안", enName: "Security", enLabel: "Security", iconName: "Shield", Icon: Shield, group: "market_legal" },
  { id: "schedule", name: "일정", label: "일정", enName: "Schedule", enLabel: "Schedule", iconName: "Calendar", Icon: Calendar, group: "ecosystem" },
  { id: "community", name: "커뮤니티", label: "커뮤니티", enName: "Community", enLabel: "Community", iconName: "Users", Icon: Users, group: "ecosystem", isModal: true },
  { id: "usage", name: "이용방법", label: "이용방법", enName: "How to Use", enLabel: "How to Use", iconName: "HelpCircle", Icon: HelpCircle, group: "ecosystem", isModal: true }
];

export default NEWS_CATEGORIES;
