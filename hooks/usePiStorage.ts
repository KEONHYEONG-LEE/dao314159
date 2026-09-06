"use client";

import { useState, useEffect } from "react";

/**
 * Pi Browser Local Storage 및 Web LocalStorage 통합 Hook
 * @param key 저장소 키 이름
 * @param initialValue 초기 값
 */
export function usePiStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // 1. 일반 LocalStorage 읽기
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Storage key "${key}" 읽기 실패:`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        // 일반 LocalStorage에 즉시 반영
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Pi Browser 전용 Local Storage 지원 시 추가 동기화 처리
        if ((window as any).Pi && (window as any).Pi.NativeStorage) {
          (window as any).Pi.NativeStorage.setItem(key, JSON.stringify(valueToStore))
            .catch((err: any) => console.warn("Pi NativeStorage 저장 실패:", err));
        }
      }
    } catch (error) {
      console.error(`Storage key "${key}" 쓰기 실패:`, error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}

