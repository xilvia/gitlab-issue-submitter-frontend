import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthDto } from '../dto/auth.dto';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string;
  private authStatusListener = new BehaviorSubject(false);
  private authUrl = environment.authUrl;
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  getAccessToken(): string {
    return this.accessToken;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  login(authDto: AuthDto): BehaviorSubject<AuthDto> {
    authDto.grant_type = 'password';
    authDto.client_id = environment.client_id;
    authDto.client_secret = environment.client_secret;
    this.http
      .post<{
        access_token: string;
      }>(this.authUrl, authDto)
      .subscribe(
        (response) => {
          const accessToken = response.access_token;

          if (accessToken) {
            this.accessToken = accessToken;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setCookie('accessToken', accessToken);
            this.saveLoggedUserName(authDto);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
          console.error(error);
        }
      );
    return;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      this.logout();
      return;
    } else {
      this.accessToken = authInfo.accessToken;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  setCookie(name, value) {
    let expires = '';
    const date = new Date();
    const duration: number = 10800000;

    date.setTime(date.getTime() + duration);
    expires = `; expires= ${date.toUTCString()};`;
    return (document.cookie =
      name + '=' + (value || '') + expires + '; path=/');
  }

  getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.deleteCookie('accessToken');
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  saveLoggedUserName(authDto: AuthDto) {
    localStorage.setItem('username', JSON.stringify(authDto.username));
  }

  clearAuthData(): void {
    localStorage.clear();
  }

  getAuthData() {
    const accessToken = this.getCookie('accessToken');
    if (!accessToken) {
      return;
    }
    return { accessToken };
  }
}
