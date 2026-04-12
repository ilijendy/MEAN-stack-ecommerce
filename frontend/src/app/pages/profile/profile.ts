// pages/profile/profile.ts

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { Iuser } from '../../core/interfaces/iuser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  currentUser: Iuser | null = null;
  successMessage: string = '';
  error: string = '';
  loading: boolean = false;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  get f() {
    return this.form.controls;
  }

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    // جيب بيانات المستخدم الحالي
    this.authService.CurentUser.subscribe((user: Iuser) => {
      this.currentUser = user;

      // ملّي الـ form ببيانات المستخدم
      if (user) {
        this.form.patchValue({
          name: user.name,
          email: user.email
        });
        this.cdr.markForCheck();
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.cdr.markForCheck();
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.authService.updateProfile(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Profile updated successfully!';
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Update failed';
        this.cdr.markForCheck();
      }
    });
  }
}