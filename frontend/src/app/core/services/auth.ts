import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthResponse, Iuser, UpdateProfile } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;
  private CurrentUserSubject = new BehaviorSubject<any>(
    typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  );
  CurentUser = this.CurrentUserSubject.asObservable();
  constructor(private http: HttpClient) { }

  private setSession(res: AuthResponse) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    this.CurrentUserSubject.next(res.data);
  }

  register(data: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  Logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.CurrentUserSubject.next(null);
  }

  updateProfile(data: UpdateProfile): Observable<{ message: string; user: Iuser }> {
    return this.http.put<{ message: string; user: Iuser }>(`${this.apiUrl}/auth/profile`, data).pipe(
      tap((res: any) => {
        const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
        const updatedUser = { ...user, ...res.user };
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        this.CurrentUserSubject.next(updatedUser);
      })
    );
  }

  isLogIn(): boolean {
    return typeof localStorage !== 'undefined' ? !!localStorage.getItem('token') : false;
  }

  isAdmin(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }
}
