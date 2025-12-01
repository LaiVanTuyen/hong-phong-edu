import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@hong-phong-edu/data-access';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;
  message = '';
  isError = false;

  constructor(private userService: UserService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.message = 'Please enter email and password';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.isError = false;

    this.userService.login(this.email, this.password).subscribe((user) => {
      this.isSubmitting = false;
      if (user) {
        // Login successful
        this.router.navigate(['/']);
      } else {
        // Login failed
        this.message = 'Invalid email or password';
        this.isError = true;
      }
    });
  }
}
