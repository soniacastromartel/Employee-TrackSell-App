import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private isMenuVisible = true;
  private isLandscape = false;

  constructor() {}

  public shouldShowMenu(): boolean {
    return this.isMenuVisible;
  }

  public updateMenuVisibility(isVisible: boolean): void {
    this.isMenuVisible = isVisible;
  }

  public setIsLandscape(isLandscape: boolean): void {
    this.isLandscape = isLandscape;
  }

  public getIsLandscape(): boolean {
    return this.isLandscape;
  }
}
