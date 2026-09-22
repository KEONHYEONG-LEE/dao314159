// @ts-nocheck
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";

// 1. Lucide 아이콘 패키지 불러오기
import {
Flame,
Globe,
Tv,
Zap,
Wallet,
Compass,
Map,
FileText,
Users,
ShoppingCart,
ShieldCheck,
Code,
Building,
TrendingUp,
DollarSign,
Shield,
Scale,
Calendar,
LayoutGrid,
Newspaper
} from "lucide-react";

// 2. 카테고리 ID, 언더바 형태, 한글명 완벽 대응 매핑 테이블
const ID_TO_ICON_MAP: Record<string, React.ElementType> = {
// ID 및 Slug 대응 (하이픈/언더바 모두 포함)
"top-news": Flame,
"top_news": Flame,
"mainnet": Globe,
"node": Tv,
"mining": Zap,
"wallet": Wallet,
"browser": Compass,
"roadmap": Map,
"whitepaper": FileText,
"community": Users,
"commerce": ShoppingCart,
"kyc": ShieldCheck,
"developer": Code,
"developers": Code,
"ecosystem": Building,
"real-estate": Building,
"real_estate": Building,
"outlook": TrendingUp,
"price-outlook": TrendingUp,
"price_outlook": TrendingUp,
"price": DollarSign,
"security": Shield,
"legal": Scale,
"regulations": Scale,
"calendar": Calendar,

// 한글 명칭 완벽 대응 (직접 일치 보장)
"주요 뉴스": Flame,
"주요뉴스": Flame,
"메인넷": Globe,
"노드": Tv,
"채광": Zap,
"지갑": Wallet,
"브라우저": Compass,
"로드맵": Map,
"백서": FileText,
"지역 사회": Users,
"커뮤니티": Users,
"상업": ShoppingCart,
"KYC": ShieldCheck,
"개발자": Code,
"생태계": Building,
"부동산": Building,
"가격 전망": TrendingUp,
"가격전망": TrendingUp,
"가격": DollarSign,
"보안": Shield,
"규정": Scale,
"법률": Scale,
"달력": Calendar,

// Lucide 컴포넌트 대응
Flame, Globe, Tv, Zap, Wallet, Compass, Map, FileText,
Users, ShoppingCart, ShieldCheck, Code, Building, TrendingUp,
DollarSign, Shield, Scale, Calendar
};

interface GpnrHeaderProps {
currentCategory?: string;
 onCategoryChange?: (categoryId: string) => void;
currentLanguage?: string;
 }

interface LauncherItem {
id: string;
iconComponent: any;
label: string;
enLabel: string;
rawCategory?: any;
}

export function GpnrHeader({
currentCategory = "top-news",
onCategoryChange,
currentLanguage
}: GpnrHeaderProps) {
const [mounted, setMounted] = useState<boolean>(false);
const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false);
const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
const [currentLang, setCurrentLang] = useState<string>("ko");

const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

const [calendarYear, setCalendarYear] = useState<number>(2026);
const [calendarMonth, setCalendarMonth] = useState<number>(2);

useEffect(() => {
setMounted(true);
const now = new Date();
setCalendarYear(now.getFullYear());
setCalendarMonth(now.getMonth());

const syncLanguage = () => {
try {
if (typeof window !== "undefined") {
const targetLang = currentLanguage || localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
setCurrentLang(targetLang);
}
} catch (e) {
console.error("Language sync error:", e);
}
};

syncLanguage();
window.addEventListener("storage", syncLanguage);
window.addEventListener("languageChange", syncLanguage);
return () => {
window.removeEventListener("storage", syncLanguage);
window.removeEventListener("languageChange", syncLanguage);
};
}, [currentLanguage]);

const { daysArray, startBlankDays } = useMemo(() => {
const firstDayInstance = new Date(calendarYear, calendarMonth, 1);
const startDayOfWeek = firstDayInstance.getDay();
const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
return {
startBlankDays: Array(startDayOfWeek).fill(null),
daysArray: Array.from({ length: totalDaysInMonth }, (_, i) => i + 1)
};
}, [calendarYear, calendarMonth]);

const handlePrevMonth = (): void => {
if (calendarMonth === 0) {
setCalendarYear(calendarYear - 1);
setCalendarMonth(11);
} else {
setCalendarMonth(calendarMonth - 1);
}
};

const handleNextMonth = (): void => {
if (calendarMonth === 11) {
setCalendarYear(calendarYear + 1);
setCalendarMonth(0);
} else {
setCalendarMonth(calendarMonth + 1);
}
};

const handleDonation = useCallback(async () => {
if (typeof window !== "undefined" && (window as any).Pi) {
try {
const origin = window.location.origin;

await (window as any).Pi.createPayment({
amount: 0.01,
memo: currentLang === "ko" ? "GPNR 서비스 후원" : "GPNR Service Donation",
metadata: { type: "one-time-donation", app: "GPNR" }
}, {
onReadyForServerApproval: async (paymentId: string) => {
const res = await fetch(${origin}/api/payments/approve`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ paymentId })
});

if (!res.ok) {
throw new Error("Payment approval failed on server.");
}
},
onReadyForServerCompletion: async (paymentId: string, txid: string) => {
const res = await fetch(``${origin}/api/payments/complete`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ paymentId, txid })
});

if (!res.ok) {
throw new Error("Payment completion failed on server.");
}
alert(currentLang === "ko" ? "0.01 Pi 후원이 완료되었습니다. 감사합니다!" : "0.01 Pi donation completed. Thank you!");
},
onCancel: (paymentId: string) => console.log("[Pi Payment] 취소:", paymentId),
onError: (error: Error) => console.error("[Pi Payment] 에러:", error),
});
} catch (err) {
console.error("Pi SDK payment failed:", err);
}
} else {
alert(currentLang === "ko" ? "Pi Browser에서 접속해 주세요." : "Please access through Pi Browser.");
}
}, [currentLang]);

// 3. ID, Label, Icon을 종합 매핑하여 라우팅 아이템 생성
const FIXED_LAUNCHER_ITEMS: LauncherItem[] = useMemo(() => {
const rawCategories = Array.isArray(NEWS_CATEGORIES) ? NEWS_CATEGORIES : [];
const items: LauncherItem[] = rawCategories.map(cat => {
// ID, Name, Label 중 일치하는 Lucide 컴포넌트 검색
const IconComponent =
ID_TO_ICON_MAP[cat.id] ||
ID_TO_ICON_MAP[cat.name] ||
ID_TO_ICON_MAP[cat.label] ||
(cat.iconName ? ID_TO_ICON_MAP[cat.iconName] : null) ||
(typeof cat.icon === "string" ? ID_TO_ICON_MAP[cat.icon] : null) ||
LayoutGrid;

return {
id: cat.id,
iconComponent: IconComponent,
label: cat.label || cat.name || cat.id,
enLabel: cat.enLabel || cat.enName || cat.id,
rawCategory: cat
};
});

items.push({
id: "calendar",
iconComponent: Calendar,
label: "달력",
enLabel: "Calendar"
});

return items;
}, []);

const displayId = user?.username
? user.username.length > 12
? ${user.username.substring(0, 5)}...${user.username.substring(user.username.length - 4)}
: user.username
: "";

// 아이콘 동적 스마트 렌더링 헬퍼
const renderItemIcon = (item: LauncherItem) => {
const IconComp = item.iconComponent;

// 1. 달력 처리
if (item.id === "calendar") {
return <Calendar className="w-6 h-6 mb-1 text-rose-400 shrink-0 transition-transform group-hover:scale-110" />;
}

// 2. Lucide 컴포넌트 렌더링
if (IconComp && IconComp !== LayoutGrid) {
return <IconComp className="w-6 h-6 mb-1 text-slate-300 shrink-0 transition-transform group-hover:scale-110" />;
}

// 3. 카테고리에 직접 정의된 custom icon/Icon 이 있는 경우
const raw = item.rawCategory;
if (raw) {
if (typeof raw.icon === "function" || typeof raw.Icon === "function") {
const CustomIcon = raw.icon || raw.Icon;
return <CustomIcon className="w-6 h-6 mb-1 text-slate-300 shrink-0 transition-transform group-hover:scale-110" />;
}
if (typeof raw.icon === "string" && (raw.icon.startsWith("http") || raw.icon.startsWith("/"))) {
return <img src={raw.icon} alt={item.label} className="w-6 h-6 mb-1 object-contain shrink-0 transition-transform group-hover:scale-110" />;
}
}

// 4. 폴백 (기본 LayoutGrid)
return <LayoutGrid className="w-6 h-6 mb-1 text-slate-300 shrink-0 transition-transform group-hover:scale-110" />;
};

return (
<>
<header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
<div className="mx-auto max-w-7xl px-3">
<div className="flex h-[44px] items-center justify-between">
{/* 로고 영역 */}
<div className="flex items-center gap-2">
<span
className="font-black text-lg tracking-tighter cursor-pointer"
style={{ animation: 'gpnr-lighting 14s steps(1) infinite' }}
onClick={() => onCategoryChange && onCategoryChange("top-news")}
>
GPNR
<style>{@keyframes gpnr-lighting { 0%, 100% { color: #6b0b8c; text-shadow: 0 0 12px rgba(107, 11, 140, 0.5); } 14.2% { color: #ef4444; text-shadow: none; } 28.4% { color: #f59e0b; text-shadow: none; } 42.6% { color: #eab308; text-shadow: none; } 56.8% { color: #22c55e; text-shadow: none; } 71.0% { color: #3b82f6; text-shadow: none; } 85.2% { color: #a855f7; text-shadow: none; } }}</style>
</span>
</div>

{/* 우측 아이콘 및 지갑 인증 배너 */}
<div className="flex items-center gap-2">
<button
onClick={handleDonation}
className="flex items-center gap-0.5 bg-[#f7a145]/20 text-[#f7a145] px-2 py-0.5 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-[10px] font-bold"
>
<span>π</span>
<span>0.01 후원</span>
</button>

<button
onClick={() => setIsLauncherOpen(!isLauncherOpen)}
className={px-2 py-1 rounded-lg text-lg font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
>
☰
</button>

{mounted && isAuthenticated && user ? (
<div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-lg text-[10px] font-mono text-purple-300 font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
<span>{displayId}</span>
</div>
) : (
<div className="text-[10px] text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded-lg font-medium">
🔑 ID 미인증
</div>
)}
</div>
</div>
</div>
</header>

{/* 카테고리 그리드 런처 메뉴 */}
{isLauncherOpen && (
<div className="fixed top-[49px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
<div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
{FIXED_LAUNCHER_ITEMS.map((item) => {
const isSelected = currentCategory === item.id;

return (
<button
key={item.id}
onClick={() => {
if (item.id === "calendar") {
setIsCalendarOpen(true);
} else {
if (onCategoryChange) onCategoryChange(item.id);
}
setIsLauncherOpen(false);
}}
className={flex flex-col items-center justify-center p-3 rounded-xl border transition-all group${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
>
{/* Lucide SVG 아이콘 동적 출력 */}
{renderItemIcon(item)}

<span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">
{currentLang === "ko" ? item.label : item.enLabel}
</span>
</button>
);
})}
</div>

{isAuthenticated && (
<div className="mt-4 pt-3 border-t border-slate-800">
<button
onClick={() => {
if (logout) logout();
setIsLauncherOpen(false);
}}
className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
>
{currentLang === "ko" ? "KYC ID 해제 및 다시 입력" : "Reset KYC ID"}
</button>
</div>
)}
</div>
)}

{/* 달력 모달 팝업 */}
{isCalendarOpen && (
<div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
<div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
<div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
<h3 className="text-sm font-bold text-white flex items-center gap-2">
<Calendar className="w-4 h-4 text-rose-400" />
<span>{currentLang === "ko" ? "달력 (Calendar)" : "Calendar"}</span>
</h3>
<button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800">✕</button>
</div>
<div className="p-4">
<div className="flex justify-between items-center mb-3">
<div className="text-sm font-black text-[#deff9a] flex items-center gap-1">
{currentLang === "ko" ? (
<><span>{calendarYear}</span>년 <span>{calendarMonth + 1}</span>월</>
) : (
<><span>{new Date(calendarYear, calendarMonth).toLocaleString("en-US", { month: "long" })}</span> <span>{calendarYear}</span></>
)}
</div>
<div className="flex gap-3 text-sm text-slate-400">
<button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
<button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
</div>
</div>
<div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
{currentLang === "ko" ? (
<><div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div></>
) : (
<><div className="text-red-400">SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div className="text-blue-400">SAT</div></>
)}
</div>
<div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
{startBlankDays.map((_, index) => <div key={blank-${index}} className="text-slate-700"&gt;&lt;/div&gt;)} {daysArray.map((day) =&gt; { const today = new Date(); const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear; return ( &lt;div key={day-${day}} className="flex items-center justify-center">
{isToday ? <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md">{day}</div> : <span className="w-6 h-6 flex items-center justify-center">{day}</span>}
</div>
);
})}
</div>
<div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
<div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
<span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
<span>{currentLang === "ko" ? "[안내]" : "[Notice]"}</span>
</div>
<p className="pl-3.5">
{currentLang === "ko"
? "· 파이 네트워크 글로벌 에코시스템 뉴스 카운트다운 연동 중"
: "· Pi Network Global Ecosystem News countdown is in sync"}
</p>
</div>
</div>
</div>
</div>
)}
</>
);
}

