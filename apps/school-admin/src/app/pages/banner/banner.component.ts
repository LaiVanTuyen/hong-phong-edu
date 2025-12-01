import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;
declare var feather: any;

interface Banner {
  id?: number;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  created_at?: Date;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements AfterViewInit, OnDestroy {
  title = 'Banner';
  private dataTable: any;
  isHeaderCollapsed = false;
  private collapseInitialized = false;

  // Form properties
  bannerForm: Banner = {
    title: '',
    image_url: '',
    link_url: null,
    is_active: true
  };
  isEditMode = false;
  selectedBannerId?: number;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Sample data for testing
  sampleBanners: Banner[] = [
    { 
      id: 1, 
      title: 'Banner chào mừng năm học mới', 
      image_url: 'assets/img/banner/banner1.jpg',
      link_url: '/home',
      is_active: true,
      created_at: new Date('2024-12-24') 
    },
    { 
      id: 2, 
      title: 'Khuyến mãi đầu năm', 
      image_url: 'assets/img/banner/banner2.jpg',
      link_url: '/promotion',
      is_active: true,
      created_at: new Date('2024-12-24') 
    },
    { 
      id: 3, 
      title: 'Thông báo tuyển sinh', 
      image_url: 'assets/img/banner/banner3.jpg',
      link_url: '/admission',
      is_active: false,
      created_at: new Date('2024-12-24') 
    }
  ];

  ngAfterViewInit(): void {
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Initialize DataTable
    setTimeout(() => {
      if (typeof $ !== 'undefined' && $.fn.DataTable) {
        // Check if DataTable already exists and destroy it first
        const tableElement = $('.datatable');
        if ($.fn.DataTable.isDataTable(tableElement)) {
          tableElement.DataTable().destroy();
          // Clear the DataTable reference
          this.dataTable = null;
        }
        
        this.dataTable = tableElement.DataTable({
          columnDefs: [
            { orderable: false, targets: [0, 6] } // checkbox + action column
          ],
          bFilter: true,
          sDom: 'lrtip',
          ordering: true,
          language: {
            search: ' ',
            searchPlaceholder: 'Tìm kiếm...',
            sLengthMenu: 'Hiển thị _MENU_ dòng mỗi trang',
            info: 'Hiển thị _START_ - _END_ trong tổng số _TOTAL_ mục',
            emptyTable: 'Không tìm thấy dữ liệu',
            paginate: {
              next: ' <i class="fa fa-angle-right"></i>',
              previous: '<i class="fa fa-angle-left"></i>'
            }
          }
        });
        // Bind custom search input
        const $searchInput = $('#banner-search');
        if ($searchInput.length) {
          $searchInput.on('keyup change', () => {
            this.dataTable.search($searchInput.val()).draw();
          });
        }
        // Move length select into header if desired
        const $length = $(".dataTables_length select");
        if ($length.length) {
          $length.addClass('form-select form-select-sm');
        }
        // Hide default filter container (will use custom input instead)
        $(".dataTables_filter").hide();
      }
    }, 100);

    // Initialize collapse header functionality - run after DataTable
    setTimeout(() => {
      this.initCollapseHeader();
    }, 500); // Increase timeout to ensure DOM is fully ready
  }

  private initCollapseHeader(): void {
    if (typeof $ === 'undefined' || this.collapseInitialized) return;
    
    this.collapseInitialized = true;
    
    // Get elements
    const $appHeader = $('app-header');
    const $pageWrapper = $('.page-wrapper');
    const $collapseBtn = $('#collapse-header');
    
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
      $('#collapse-header').off('click.collapse');
      
      // Reset header to visible state before leaving
      const $appHeader = $('app-header');
      const $pageWrapper = $('.page-wrapper');
      
      $appHeader.finish().removeAttr('style').show();
      $pageWrapper.removeClass('header-collapsed');
      $('#collapse-header').removeClass('collapsed');
    }
    
    // Destroy DataTable instance properly
    if (this.dataTable) {
      try {
        this.dataTable.destroy(true); // true = remove from DOM completely
        this.dataTable = null;
      } catch (e) {
        console.warn('DataTable destroy error:', e);
      }
    }
    
    // Reset collapse flag
    this.collapseInitialized = false;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedBannerId = undefined;
    this.bannerForm = {
      title: '',
      image_url: '',
      link_url: null,
      is_active: true
    };
    this.imagePreview = null;
  }

  openEditModal(banner: Banner): void {
    this.isEditMode = true;
    this.selectedBannerId = banner.id;
    this.bannerForm = { ...banner };
    this.imagePreview = banner.image_url;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  generateSlug(): void {
    if (this.bannerForm.title) {
      this.bannerForm.link_url = '/' + this.bannerForm.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }

  submitForm(): void {
    if (this.isSubmitting) return;

    // Validate form
    if (!this.bannerForm.title.trim()) {
      alert('Vui lòng nhập tiêu đề banner');
      return;
    }

    if (!this.bannerForm.image_url && !this.selectedFile) {
      alert('Vui lòng chọn hình ảnh');
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      if (this.isEditMode && this.selectedBannerId) {
        // Update existing banner
        const index = this.sampleBanners.findIndex(b => b.id === this.selectedBannerId);
        if (index !== -1) {
          this.sampleBanners[index] = {
            ...this.sampleBanners[index],
            ...this.bannerForm,
            image_url: this.imagePreview || this.bannerForm.image_url
          };
        }
        console.log('Updated banner:', this.bannerForm);
      } else {
        // Add new banner
        const newBanner: Banner = {
          ...this.bannerForm,
          id: this.sampleBanners.length + 1,
          image_url: this.imagePreview || this.bannerForm.image_url,
          created_at: new Date()
        };
        this.sampleBanners.push(newBanner);
        console.log('Added new banner:', newBanner);
      }

      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }

      this.isSubmitting = false;
      
      // Close modal
      $('#add-banner').modal('hide');
      $('#edit-banner').modal('hide');
      
      this.resetForm();
    }, 500);
  }

  handleDelete(bannerId: number): void {
    if (this.isSubmitting) return;
    
    this.selectedBannerId = bannerId;
    this.isSubmitting = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Deleting banner:', bannerId);
      this.sampleBanners = this.sampleBanners.filter(b => b.id !== bannerId);
      
      this.isSubmitting = false;
      
      // Close modal
      $('#delete-modal').modal('hide');
      
      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }
    }, 1000);
  }

  deleteBanner(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      this.sampleBanners = this.sampleBanners.filter(b => b.id !== id);
      
      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }
      
      console.log('Deleted banner with id:', id);
    }
  }

  toggleStatus(banner: Banner): void {
    const index = this.sampleBanners.findIndex(b => b.id === banner.id);
    if (index !== -1) {
      this.sampleBanners[index].is_active = !this.sampleBanners[index].is_active;
      console.log('Toggled banner status:', this.sampleBanners[index]);
    }
  }

  private resetForm(): void {
    this.bannerForm = {
      title: '',
      image_url: '',
      link_url: null,
      is_active: true
    };
    this.selectedBannerId = undefined;
    this.selectedFile = null;
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
