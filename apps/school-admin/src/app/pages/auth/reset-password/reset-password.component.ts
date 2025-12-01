import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '@hong-phong-edu/data-access';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  isSubmitting = false;
  message = '';
  isSuccess = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  onSubmit(): void {
    if (!this.token) {
      this.message = 'Token không hợp lệ.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    if (this.password.length < 6) {
      this.message = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.userService.resetPassword(this.token, this.password).subscribe({
      next: (success) => {
        this.isSubmitting = false;
        if (success) {
          this.isSuccess = true;
          this.message =
            'Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.';
          // Redirect after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']); // Redirect to home/login
          }, 3000);
        } else {
          this.message = 'Đổi mật khẩu thất bại. Token có thể đã hết hạn.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        this.message = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      },
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
