import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  password?: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@example.com',
      full_name: 'Nguyễn Văn Admin',
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-15'),
    },
    {
      id: 2,
      email: 'teacher1@example.com',
      full_name: 'Trần Thị Giáo Viên',
      created_at: new Date('2024-02-20'),
      updated_at: new Date('2024-02-20'),
    },
    {
      id: 3,
      email: 'student1@example.com',
      full_name: 'Lê Văn Học Sinh',
      created_at: new Date('2024-03-10'),
      updated_at: new Date('2024-03-10'),
    },
    {
      id: 4,
      email: 'teacher2@example.com',
      full_name: 'Phạm Thị Hương',
      created_at: new Date('2024-03-15'),
      updated_at: new Date('2024-03-15'),
    },
    {
      id: 5,
      email: 'student2@example.com',
      full_name: 'Hoàng Văn Nam',
      created_at: new Date('2024-04-01'),
      updated_at: new Date('2024-04-01'),
    },
  ];

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map((u) => u.id), 0) + 1,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, user: Partial<User>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...user,
        updated_at: new Date(),
      };
      return this.users[index];
    }
    return undefined;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  sendResetPasswordEmail(userId: number): Observable<boolean> {
    // Simulate API call delay
    return of(true).pipe(delay(1000));
  }

  resetPassword(token: string, password: string): Observable<boolean> {
    // Simulate API call delay
    // In a real app, you would send the token and new password to the backend
    return of(true).pipe(delay(1000));
  }

  getCurrentUser(): Observable<User> {
    // Mock: Return the first user as the currently logged-in user
    return of(this.users[0]);
  }
}
