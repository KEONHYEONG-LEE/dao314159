import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 스타일 클래스 병합 함수 (기존 기능)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 1. 하이퍼링크 및 출처 유실 방지를 위한 데이터 추출 함수
 * 번역 구조({ko, en})와 단일 문자열 구조 모두 대응합니다.
 */
export function getTranslation(data: any, lang: 'ko' | 'en' = 'en'): string {
  if (!data) return "";
  if (typeof data === 'string') return data;
  return data[lang] || data['en'] || "";
}

/**
 * 2. 출처 및 시간 표시를 위한 날짜 포맷팅 함수
 * 영어 버전에서 잘 나왔던 시간 표시를 다시 살려냅니다.
 */
export function formatTimeAgo(dateString: string, lang: 'ko' | 'en' = 'en') {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return lang === 'ko' ? "방금 전" : "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return lang === 'ko' ? `${diffInMinutes}분 전` : `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return lang === 'ko' ? `${diffInHours}시간 전` : `${diffInHours}h ago`;
  
  return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US');
}

/**
 * 3. 외부 링크 보안 및 정상 작동 확인 함수
 */
export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 4. [추가] HTML 태그 제거 함수
 * 스크린샷의 <a href...> 태그 등을 깨끗하게 지우고 텍스트만 남깁니다.
 */
export function stripHtml(html: string) {
  if (!html) return "";
  // 태그 제거 및 특수문자(&nbsp; 등) 공백 처리
  return html
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * 5. [신규 추가] Pi Network 최신 SDK 대응 뉴스 공유 유틸리티 함수
 * - Pi Browser 환경일 경우: Pi.shareFile API 우선 사용 (이미지/파일 지원)
 * - 일반 모바일/웹 환경일 경우: navigator.share 또는 클립보드 복사(Fallback) 사용
 */
export interface ShareNewsOptions {
  title: string;
  text?: string;
  url: string;
  file?: File;
}

export async function shareNews(options: ShareNewsOptions): Promise<boolean> {
  const { title, text, url, file } = options;
  const shareText = text ? `${text}\n${url}` : url;

  try {
    // 1. Pi Browser 환경 및 Pi.shareFile API 지원 확인
    if (typeof window !== 'undefined' && (window as any).Pi && typeof (window as any).Pi.shareFile === 'function' && file) {
      await (window as any).Pi.shareFile({
        file: file,
        title: title,
        text: shareText,
      });
      return true;
    }

    // 2. 일반 모바일 브라우저 Web Share API 사용
    if (typeof navigator !== 'undefined' && navigator.share) {
      const shareData: ShareData = {
        title: title,
        text: text,
        url: url,
      };
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }
      await navigator.share(shareData);
      return true;
    }

    // 3. 대체(Fallback): URL 클립보드 복사
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      alert("링크가 클립보드에 복사되었습니다.");
      return true;
    }
  } catch (error) {
    console.error("공유 중 오류가 발생했습니다:", error);
  }

  return false;
}
