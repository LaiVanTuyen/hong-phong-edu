import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;
declare var feather: any;

interface Topic {
  id?: number;
  name: string;
  slug: string;
  description: string;
  created_at?: Date;
  status: boolean;
}

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements AfterViewInit, OnDestroy {
  title = 'Topics';
  private dataTable: any;
  isHeaderCollapsed = false;
  private collapseInitialized = false;

  // Form properties
  topicForm: Topic = {
    name: '',
    slug: '',
    description: '',
    status: true
  };
  isEditMode = false;
  selectedTopicId?: number;
  isSubmitting = false;

  // Sample data for testing
  sampleTopics: Topic[] = [
    { id: 1, name: 'Máy tính', slug: 'may-tinh', description: 'Thiết bị máy tính & phần cứng', status: true, created_at: new Date('2024-12-24') },
    { id: 2, name: 'Tiếng Anh', slug: 'tieng-anh', description: 'Học tiếng Anh giao tiếp', status: true, created_at: new Date('2024-12-24') },
    { id: 3, name: 'Toán học', slug: 'toan-hoc', description: 'Toán học phổ thông', status: true, created_at: new Date('2024-12-24') },
    { id: 4, name: 'Lịch sử', slug: 'lich-su', description: 'Lịch sử Việt Nam & thế giới', status: true, created_at: new Date('2024-12-24') }
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
          language: {
            search: "Tìm kiếm:",
            lengthMenu: "Hiển thị _MENU_ dòng mỗi trang",
            info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
            infoEmpty: "Không có dữ liệu",
            infoFiltered: "(lọc từ _MAX_ dòng)",
            zeroRecords: "Không tìm thấy kết quả phù hợp",
            emptyTable: "Chưa có dữ liệu",
            paginate: {
              first: "Đầu",
              last: "Cuối",
              next: "Sau",
              previous: "Trước"
            }
          }
        });
        // Bind custom search input
        const $searchInput = $('#category-search');
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

  // Convert Vietnamese text to slug
  vietnameseToSlug(text: string): string {
    const vietnameseMap: { [key: string]: string } = {
      'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'đ': 'd',
      'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };

    let slug = text.toLowerCase();
    
    // Replace Vietnamese characters
    for (const [vn, en] of Object.entries(vietnameseMap)) {
      slug = slug.replace(new RegExp(vn, 'g'), en);
    }
    
    // Replace spaces and special characters
    slug = slug
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-')          // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
    
    return slug;
  }

  // Auto-generate slug when name changes
  onNameChange(): void {
    if (!this.isEditMode) {
      this.topicForm.slug = this.vietnameseToSlug(this.topicForm.name);
    }
  }

  // Open add modal
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedTopicId = undefined;
    this.topicForm = {
      name: '',
      slug: '',
      description: '',
      status: true
    };
  }

  // Open edit modal with data
  openEditModal(topic: Topic): void {
    this.isEditMode = true;
    this.selectedTopicId = topic.id;
    this.topicForm = { ...topic };
  }

  // Handle form submit
  handleSubmit(): void {
    if (this.isSubmitting) return;
    
    // Validate
    if (!this.topicForm.name.trim()) {
      alert('Vui lòng nhập tên chủ đề');
      return;
    }
    
    if (!this.topicForm.slug.trim()) {
      this.topicForm.slug = this.vietnameseToSlug(this.topicForm.name);
    }

    this.isSubmitting = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      if (this.isEditMode) {
        console.log('Updating topic:', this.selectedTopicId, this.topicForm);
        // TODO: Call API to update topic
      } else {
        console.log('Creating topic:', this.topicForm);
        // TODO: Call API to create topic
      }
      
      this.isSubmitting = false;
      
      // Close modal
      $('#add-topic').modal('hide');
      $('#edit-category').modal('hide');
      
      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }
    }, 1000);
  }

  // Handle delete
  handleDelete(topicId: number): void {
    if (this.isSubmitting) return;
    
    this.selectedTopicId = topicId;
    this.isSubmitting = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Deleting topic:', topicId);
      // TODO: Call API to delete topic
      
      this.isSubmitting = false;
      
      // Close modal
      $('#delete-modal').modal('hide');
      
      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }
    }, 1000);
  }


  ngOnDestroy(): void {
    // Unbind collapse header event with namespace
    if (typeof $ !== 'undefined') {
      $('#collapse-header').off('click.collapse');
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
}
