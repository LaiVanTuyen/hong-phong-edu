import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '@hong-phong-edu/data-access';

declare var bootstrap: any;
declare var $: any;
declare var feather: any;

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  searchTerm = '';
  userToDelete: number | null = null;
  deleteModal: any;

  // Reset Password State
  userToReset: number | null = null;
  resetModal: any;
  isResetting = false;

  isHeaderCollapsed = false;
  private collapseInitialized = false;

  constructor(public userService: UserService, private el: ElementRef) {}

  ngOnInit() {
    const modalElement = document.getElementById('delete-modal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }

    const resetModalElement = document.getElementById('reset-password-modal');
    if (resetModalElement) {
      this.resetModal = new bootstrap.Modal(resetModalElement);
    }
  }

  datatable: any;

  ngAfterViewInit(): void {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    setTimeout(() => {
      this.initDataTable();
    }, 100);

    setTimeout(() => {
      this.initCollapseHeader();
    }, 500);
  }

  initDataTable() {
    if (typeof $ === 'undefined') return;

    if ($.fn.DataTable.isDataTable('.datatable')) {
      $('.datatable').DataTable().destroy();
    }

    this.datatable = $('.datatable').DataTable({
      bFilter: true,
      sDom: 'lrtip',
      ordering: true,
      language: {
        search: ' ',
        searchPlaceholder: 'Tìm kiếm...',
        sLengthMenu: 'Hiển thị _MENU_ dòng mỗi trang',
        info: 'Hiển thị _START_ - _END_ trong tổng số _TOTAL_ mục',
        paginate: {
          next: ' <i class="fa fa-angle-right"></i>',
          previous: '<i class="fa fa-angle-left"></i>',
        },
        emptyTable: 'Không tìm thấy người dùng',
      },
      columnDefs: [{ orderable: false, targets: [0, 4] }],
    });

    $('#user-list-search').on('keyup', (e: any) => {
      this.datatable.search(e.target.value).draw();
    });
  }

  private initCollapseHeader(): void {
    if (typeof $ === 'undefined' || this.collapseInitialized) return;

    this.collapseInitialized = true;

    // Get elements
    const $appHeader = $('app-header');
    const $pageWrapper = $('.page-wrapper');
    // Scope to this component to avoid selecting elements from other pages during navigation
    const $collapseBtn = $(this.el.nativeElement).find('#user-collapse-header');

    // FORCE reset to expanded state
    $appHeader.finish();
    $appHeader.removeAttr('style');
    $pageWrapper.removeClass('header-collapsed');
    $pageWrapper.css('margin-top', '');
    $pageWrapper.css('padding-top', '');
    this.isHeaderCollapsed = false;

    // Remove collapsed class from button (icon will rotate via CSS)
    $collapseBtn.removeClass('collapsed');

    // Unbind any existing handlers
    $collapseBtn.off('click.collapse');

    // Bind click event with namespace
    $collapseBtn.on('click.collapse', (e: any) => {
      e.preventDefault();

      if (this.isHeaderCollapsed) {
        // Expand: show header
        this.isHeaderCollapsed = false;

        // Remove collapsed class (icon rotates back via CSS)
        $collapseBtn.removeClass('collapsed');

        // Animate
        $pageWrapper.removeClass('header-collapsed');
        $appHeader.stop(true, false).slideDown(300);
      } else {
        // Collapse: hide header
        this.isHeaderCollapsed = true;

        // Add collapsed class (icon rotates via CSS)
        $collapseBtn.addClass('collapsed');

        // Animate
        $appHeader.stop(true, false).slideUp(300, () => {
          $pageWrapper.addClass('header-collapsed');
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Unbind collapse header event with namespace
    if (typeof $ !== 'undefined') {
      $(this.el.nativeElement)
        .find('#user-collapse-header')
        .off('click.collapse');
    }

    // Destroy DataTable instance properly
    if (this.datatable) {
      try {
        this.datatable.destroy(true);
        this.datatable = null;
      } catch (e) {
        console.warn('DataTable destroy error:', e);
      }
    }

    // Dispose Bootstrap modal
    if (this.deleteModal) {
      this.deleteModal.dispose();
    }
    if (this.resetModal) {
      this.resetModal.dispose();
    }

    // Reset collapse flag
    this.collapseInitialized = false;
  }

  get users(): User[] {
    return this.userService.getAll();
  }

  startDelete(id: number): void {
    this.userToDelete = id;
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete(): void {
    if (this.userToDelete !== null) {
      this.userService.delete(this.userToDelete);
      this.userToDelete = null;

      if (this.deleteModal) {
        this.deleteModal.hide();
      }

      setTimeout(() => {
        this.initDataTable();
      }, 100);
    }
  }

  startResetPassword(id: number): void {
    this.userToReset = id;
    if (this.resetModal) {
      this.resetModal.show();
    }
  }

  confirmResetPassword(): void {
    if (this.userToReset !== null) {
      this.isResetting = true;
      this.userService.sendResetPasswordEmail(this.userToReset).subscribe({
        next: (success) => {
          this.isResetting = false;
          if (success) {
            alert('Email đặt lại mật khẩu đã được gửi thành công!');
            if (this.resetModal) {
              this.resetModal.hide();
            }
            this.userToReset = null;
          }
        },
        error: (err) => {
          this.isResetting = false;
          console.error('Error sending reset email:', err);
          alert('Có lỗi xảy ra khi gửi email. Vui lòng thử lại.');
        },
      });
    }
  }
}
