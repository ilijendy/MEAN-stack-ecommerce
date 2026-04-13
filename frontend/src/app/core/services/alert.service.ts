import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const Swal: any;

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private get swal(): any {
    if (this.isBrowser && typeof Swal !== 'undefined') {
      return Swal;
    }
    return null;
  }

  confirm(title: string, text: string, confirmButtonText: string = 'Yes'): Promise<any> {
    const swal = this.swal;
    if (!swal) {
      return Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true });
    }
    return swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText
    });
  }

  success(title: string, text: string, timer: number = 1500): Promise<any> {
    const swal = this.swal;
    if (!swal) return Promise.resolve();
    return swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#4f46e5',
      timer,
      showConfirmButton: timer === 0
    });
  }

  error(title: string, text: string): Promise<any> {
    const swal = this.swal;
    if (!swal) return Promise.resolve();
    return swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    });
  }
}
