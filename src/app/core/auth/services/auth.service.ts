import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { LocalStorageService } from '../../services/localstorage.service';
import { StorageKey } from '../../constants/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(LocalStorageService);

  saveUserData(data: any) {
    this.storage.setItem(StorageKey.USER, data);
  }

  setToken(token: string) {
    this.storage.setItem(StorageKey.TOKEN, token);
  }

  getToken(): string | null {
    return this.storage.getItem<string>(StorageKey.TOKEN);
  }

  setUsersMe(usersMe: string) {
    this.storage.setItem(StorageKey.USERS_ME, usersMe);
  }

  logout() {
    this.storage.removeItem(StorageKey.USER);
    this.storage.removeItem(StorageKey.TOKEN);
    this.storage.removeItem(StorageKey.USERS_ME);
    this.storage.removeItem(StorageKey.PERMISSIONS);
    this.storage.removeItem(StorageKey.MENU_ITEMS);
  }

  POST(url: string, data: any) {
    return this.http.post(url, data);
  }

  login(data: any) {
    return this.http
      .post(environment.baseUrl + 'api/Authentication/login', data)
      .pipe(map((res: any) => res.data));
  }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
      environment.baseUrl + 'api/Authentication/refresh-token',
      {},
      { headers }
    );
  }
}
