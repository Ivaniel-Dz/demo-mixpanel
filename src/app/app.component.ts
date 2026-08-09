import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  AlertController,
} from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';
import { AnalyticsService } from './services/analytic.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private analyticsService = inject(AnalyticsService);

  async ngOnInit() {
    // Mixpanel
    this.analyticsService.init();
    // DarkMode
    await this.themeService.loadUserPreference();
  }
}
