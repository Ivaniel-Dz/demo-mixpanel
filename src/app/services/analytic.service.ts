import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private initialized = false;

  init(): void {
    if (!environment.mixpanel.enabled || this.initialized) {
      return;
    }
    mixpanel.init(environment.mixpanel.token);
    this.initialized = true;
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.initialized) {
      return;
    }
    mixpanel.track(eventName, properties);
  }
}
