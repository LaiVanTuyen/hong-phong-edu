import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;
declare var feather: any;

interface ResourceType {
  id?: number;
  name: string;
  slug: string;
  created_at?: Date;
}

@Component({
  selector: 'app-resource-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-type.component.html',
  styleUrls: ['./resource-type.component.scss']
})
export class ResourceTypeComponent implements AfterViewInit, OnDestroy {
  title = 'ResourceType';
  private dataTable: any;
  isHeaderCollapsed = false;
  private collapseInitialized = false;

  // Form properties
  resourceTypeForm: ResourceType = {
    name: '',
    slug: ''
  };
  isEditMode = false;
  selectedResourceTypeId?: number;
  isSubmitting = false;

  // Sample data for testing
  sampleResourceTypes: ResourceType[] = [
    { id: 1, name: 'Video', slug: 'video', created_at: new Date('2024-12-24') },
    { id: 2, name: 'PDF', slug: 'pdf', created_at: new Date('2024-12-24') },
    { id: 3, name: 'Audio', slug: 'audio', created_at: new Date('2024-12-24') },
    { id: 4, name: 'Link', slug: 'link', created_at: new Date('2024-12-24') }
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
            { orderable: false, targets: [0, 4] } // checkbox + action column
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
        const $searchInput = $('#resource-type-search');
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
      this.resourceTypeForm.slug = this.vietnameseToSlug(this.resourceTypeForm.name);
    }
  }

  // Open add modal
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedResourceTypeId = undefined;
    this.resourceTypeForm = {
      name: '',
      slug: ''
    };
  }

  // Open edit modal with data
  openEditModal(resourceType: ResourceType): void {
    this.isEditMode = true;
    this.selectedResourceTypeId = resourceType.id;
    this.resourceTypeForm = { ...resourceType };
  }

  // Handle form submit
  handleSubmit(): void {
    if (this.isSubmitting) return;
    
    // Validate
    if (!this.resourceTypeForm.name.trim()) {
      alert('Vui lòng nhập tên loại tài nguyên');
      return;
    }
    
    if (!this.resourceTypeForm.slug.trim()) {
      this.resourceTypeForm.slug = this.vietnameseToSlug(this.resourceTypeForm.name);
    }

    this.isSubmitting = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      if (this.isEditMode) {
        console.log('Updating resource type:', this.selectedResourceTypeId, this.resourceTypeForm);
        // TODO: Call API to update resource type
      } else {
        console.log('Creating resource type:', this.resourceTypeForm);
        // TODO: Call API to create resource type
      }
      
      this.isSubmitting = false;
      
      // Close modal
      $('#add-resource-type').modal('hide');
      $('#edit-resource-type').modal('hide');
      
      // Refresh DataTable
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false);
      }
    }, 1000);
  }

  // Handle delete
  handleDelete(resourceTypeId: number): void {
    if (this.isSubmitting) return;
    
    this.selectedResourceTypeId = resourceTypeId;
    this.isSubmitting = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Deleting resource type:', resourceTypeId);
      // TODO: Call API to delete resource type
      
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
    // Cleanup DataTable
    if (this.dataTable) {
      try {
        this.dataTable.destroy(true);
        this.dataTable = null;
      } catch (error) {
        console.error('Error destroying DataTable:', error);
      }
    }

    // Unbind collapse event
    $('#collapse-header').off('click.collapse');
    
    // Reset flags
    this.collapseInitialized = false;
  }
}
