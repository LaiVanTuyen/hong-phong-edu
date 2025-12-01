import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '@hong-phong-edu/data-access';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  firstName = '';
  lastName = '';
  email = '';
  phone = '+17468314286'; // Mock phone
  username = '';
  password = 'password'; // Mock password
  showPassword = false;
  isSaving = false;
  message = '';
  isSuccess = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
        this.email = user.email;
        this.username = user.full_name; // Using full name as username for now

        // Split full name into first and last name
        const names = user.full_name.split(' ');
        if (names.length > 0) {
          this.lastName = names[names.length - 1];
          this.firstName = names.slice(0, names.length - 1).join(' ');
        } else {
          this.firstName = user.full_name;
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  saveChanges(): void {
    if (!this.user) return;

    this.isSaving = true;
    this.message = '';

    const updatedFullName = `${this.firstName} ${this.lastName}`.trim();

    this.userService.update(this.user.id, {
      full_name: updatedFullName,
      email: this.email,
    });

    // Simulate API delay
    setTimeout(() => {
      this.isSaving = false;
      this.isSuccess = true;
      this.message = 'Profile updated successfully!';

      // Hide message after 3 seconds
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }, 1000);
  }
}
