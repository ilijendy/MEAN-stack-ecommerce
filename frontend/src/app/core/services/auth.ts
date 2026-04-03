import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api';
  private CurrentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  CurentUser=this.CurrentUserSubject.asObservable();
  constructor(private http:HttpClient){}
}
