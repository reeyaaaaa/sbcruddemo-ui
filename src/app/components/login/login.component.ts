import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  // 🔹 Admin shortcut
  if (email === 'admin@example.com' && password === 'admin123') {
    localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
    alert('✅ Admin login successful');
    this.router.navigate(['/admin/persons']);
    return;
  }

  // 🔹 Normal user flow
  this.authService.login({ email, password }).subscribe({
    next: (res) => {
      // ✅ Save user in localStorage
      localStorage.setItem('user', JSON.stringify(res));

      alert('✅ Login successful');

      // ✅ Redirect normal users to profile completion
      this.router.navigate(['/complete-profile']);
    },
    error: (err) => {
      console.error('❌ Login failed', err);
      alert('❌ Invalid email or password');
    }
  });
}




}
