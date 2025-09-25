import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageKey } from '../constants/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private platformId = inject(PLATFORM_ID);

  setItem(key: StorageKey, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    }
  }

  getItem<T = string>(key: StorageKey): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T; // plain string fallback
      }
    }
    return null;
  }

  removeItem(key: StorageKey): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
