import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private cdr = inject(ChangeDetectorRef);
  constructor(private auth:Auth,private router:Router ){}
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  get f(){
    return this.form.controls;
  }
  form=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)])
  })
  error='';
  loading=false;
  submit(){
    this.form.markAllAsTouched();
    this.cdr.markForCheck();
    if(this.form.invalid) return;
    this.loading=true;
    this.error='';

    const {email,password}=this.form.value;
    this.auth.login({email:email!,password:password!}).subscribe({
      next:()=>{
        this.loading=false;
        this.router.navigate(['/home']);
      },
      error:(err)=>{
        this.loading=false;
        this.error=err.error?.message || 'Login failed';
        this.cdr.markForCheck();
      }
    })
    
  }
}
