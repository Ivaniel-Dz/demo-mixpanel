import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
// prettier-ignore
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// prettier-ignore
import { IonButton, IonContent, IonIcon, IonImg, IonInput, IonItem, IonInputPasswordToggle, } from '@ionic/angular/standalone';
import { AnalyticsService } from '../../services/analytic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // prettier-ignore
  imports: [ IonButton, IonIcon, IonInput, IonItem, IonImg, IonContent, IonInputPasswordToggle, CommonModule, ReactiveFormsModule ],
})
export class LoginPage implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  // Formulario
  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    // Check if user is already authenticated
  }

  onSubmit(): void {
    // Evento 1: Login Started
    this.analyticsService.track('Login Started', { method: 'email' });

    if (this.form.invalid) {
      const emailErrors = this.form.get('email')?.errors;
      const passwordErrors = this.form.get('password')?.errors;

      // Determina el motivo específico del fallo
      let errorType = 'invalid_form';
      if (passwordErrors?.['minlength']) {
        errorType = 'password_too_short';
      } else if (emailErrors?.['email']) {
        errorType = 'invalid_email_format';
      } else if (emailErrors?.['required'] || passwordErrors?.['required']) {
        errorType = 'empty_fields';
      }

      // Evento 3: Login Failed
      this.analyticsService.track('Login Failed', {
        method: 'email',
        error_type: errorType,
      });

      this.form.markAllAsTouched();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // Evento 2: Login Completed
    this.analyticsService.track('Login Completed', { method: 'email' });

    (document.activeElement as HTMLElement)?.blur();
    this.router.navigateByUrl('/tabs/home');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
