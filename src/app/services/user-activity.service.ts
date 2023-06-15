import { Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { DASHBOARD } from '../app.constants';


@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private inactivityTimeout: number = 7 * 24 * 60 * 60 * 1000; // 7 days (1 week) of inactivity
  private timer: any;

  constructor(private cookieService: CookieService, private router: Router) { }

  startTrackingActivity(): void {
    this.resetTimer();
    this.checkTokenValidity(); // Check token validity when activity tracking starts
  }

  resetTimer(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.logout(), this.inactivityTimeout);
  }

  @HostListener('window:mousemove')
  @HostListener('window:click')
  @HostListener('window:keydown')
  onUserActivity(): void {
    this.resetTimer();
  }

  getToken() {
    return this.cookieService.get("token");
  }

  logout(): void {
    this.cookieService.delete('token');
    this.router.navigate(['/home']); // Redirect to the login page after logout
  }

  login(token: string): void {
    const expirationDate = new Date(Date.now() + this.inactivityTimeout);
    this.cookieService.set('token', token, expirationDate);
    this.resetTimer();
  }

  checkTokenValidity(): void {
    const token =  this.cookieService.get('token');
    if (token) {
      // Check token validity and expiration here
      const isTokenValid = this.isTokenValid(token);
      if (isTokenValid) {
        this.resetTimer();
        this.router.navigate([DASHBOARD]); // Redirect to the dashboard page if token is valid
        return;
      }
    }
    this.logout(); // Token is not valid or expired, logout the user
  }

  isTokenValid(token: string): boolean {
    try {
      const tokenPayload = jwt_decode(token) as { exp: number };
      const currentTimestamp = Math.floor(Date.now() / 1000);
      // Check if the token is expired by comparing the expiration date with the current timestamp
      if (tokenPayload.exp < currentTimestamp) {
        return false;
      }
      this.resetTimer();
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
