"use client";

import React, { useEffect } from "react";

export function FloatingLanguageSwitcher() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. 모든 도메인 범위의 구글 번역 쿠키(googtrans) 강제 삭제
    const hostname = window.location.hostname;
    const domainParts = hostname.split(".");
    const domains = [
      "",
      hostname,
      `.${hostname}`,
      ...domainParts.map((_, idx) => `.${domainParts.slice(idx).join(".")}`)
    ];

    domains.forEach((domain) => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/html;${domain ? ` domain=${domain};` : ""}`;
    });

    // 2. 구글 번역 배너 및 툴바 숨김 스타일 추가
    const styleId = "gpnr-disable-translate-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame,
        .VIpgJd-yD22b-y03Lfd, .VIpgJd-yD22b-y03Lfd-v922d,
        .goog-te-gadget-icon, .goog-te-gadget, #google_translate_element,
        .skiptranslate, iframe.goog-te-banner-frame { 
          display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;
        }
        body { top: 0 !important; position: static !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 3. 화면에 버튼이나 메뉴를 렌더링하지 않음
  return null;
}
