import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService, User } from '@hong-phong-edu/data-access';

declare var bootstrap: any;

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user?: User;
  deleteModal: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.userService.getById(id);

    if (!this.user) {
      this.router.navigate(['/users']);
    }

    const modalElement = document.getElementById('delete-modal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
  }

  showDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete(): void {
    if (this.user) {
      this.userService.delete(this.user.id);
      if (this.deleteModal) {
        this.deleteModal.hide();
      }
      this.router.navigate(['/users']);
    }
  }
}
