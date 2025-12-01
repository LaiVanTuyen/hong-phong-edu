import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '@hong-phong-edu/data-access';

declare var bootstrap: any;
declare var $: any;
declare var feather: any;

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, AfterViewInit, OnDestroy {
  searchTerm = '';
  selectedStatus = '';
  selectedType = '';
  selectedTopic = '';
  resourceToDelete: number | null = null;
  deleteModal: any;
  
  isHeaderCollapsed = false;
  private collapseInitialized = false;

  constructor(public resourceService: ResourceService) {}

  ngOnInit() {
    // Initialize Bootstrap modal
    const modalElement = document.getElementById('delete-modal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
  }

  datatable: any;

  ngAfterViewInit(): void {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    
    setTimeout(() => {
      this.initCollapseHeader();
      this.initDataTable();
    }, 500);
  }

  initDataTable() {
    if (typeof $ === 'undefined') return;
    
    if ($.fn.DataTable.isDataTable('.datatable')) {
      $('.datatable').DataTable().destroy();
    }

    this.datatable = $('.datatable').DataTable({
      bFilter: true,
      sDom: 'lrtip', // Length, Processing, Table, Info, Pagination
      ordering: true,
      language: {
        search: ' ',
        searchPlaceholder: 'Tìm kiếm...',
        sLengthMenu: 'Hiển thị _MENU_ dòng mỗi trang',
        info: 'Hiển thị _START_ - _END_ trong tổng số _TOTAL_ mục',
        paginate: {
            next: ' <i class="fa fa-angle-right"></i>',
            previous: '<i class="fa fa-angle-left"></i>'
        },
        emptyTable: 'Không tìm thấy tài liệu'
      }
    });

    // Wire up custom search
    $('#resource-list-search').on('keyup', (e: any) => {
      this.datatable.search(e.target.value).draw();
    });
  }

  private initCollapseHeader(): void {
    if (typeof $ === 'undefined' || this.collapseInitialized) return;

    this.collapseInitialized = true;

    const $appHeader = $('app-header');
    const $pageWrapper = $('.page-wrapper');
    const $collapseBtn = $('#collapse-header');

    $appHeader.finish();
    $appHeader.removeAttr('style');
    $pageWrapper.removeClass('header-collapsed');
    $pageWrapper.css('margin-top', '');
    $pageWrapper.css('padding-top', '');
    this.isHeaderCollapsed = false;

    $collapseBtn.removeClass('collapsed');

    $collapseBtn.off('click.collapse');

    $collapseBtn.on('click.collapse', (e: any) => {
      e.preventDefault();

      if (this.isHeaderCollapsed) {
        this.isHeaderCollapsed = false;
        $collapseBtn.removeClass('collapsed');
        $pageWrapper.removeClass('header-collapsed');
        $appHeader.stop(true, false).slideDown(300);
      } else {
        this.isHeaderCollapsed = true;
        $collapseBtn.addClass('collapsed');
        $appHeader.stop(true, false).slideUp(300, () => {
          $pageWrapper.addClass('header-collapsed');
        });
      }
    });
  }

  get statuses() {
    return this.resourceService.statuses;
  }

  get types() {
    return this.resourceService.types;
  }

  get topics() {
    return this.resourceService.topics;
  }

  get filteredResources(): Resource[] {
    return this.resourceService.list();
  }

  filterByStatus(statusId: string) {
    this.selectedStatus = statusId;
    if (this.datatable) {
      const label = statusId ? this.resourceService.statusMeta(parseInt(statusId))?.label : '';
      this.datatable.column(3).search(label || '').draw();
    }
  }

  filterByType(typeId: string) {
    this.selectedType = typeId;
    if (this.datatable) {
      const name = typeId ? this.resourceService.typeName(parseInt(typeId)) : '';
      this.datatable.column(4).search(name || '').draw();
    }
  }

  filterByTopic(topicId: string) {
    this.selectedTopic = topicId;
    if (this.datatable) {
      const name = topicId ? this.resourceService.topicName(parseInt(topicId)) : '';
      this.datatable.column(5).search(name || '').draw();
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedTopic = '';
    if (this.datatable) {
      this.datatable.search('').columns().search('').draw();
      $('#resource-list-search').val('');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  startDelete(id: number) {
    this.resourceToDelete = id;
    this.deleteModal?.show();
  }

  confirmDelete() {
    if (this.resourceToDelete !== null) {
      this.resourceService.delete(this.resourceToDelete);
      this.deleteModal?.hide();
      this.resourceToDelete = null;
    }
  }

  ngOnDestroy(): void {
    $('#collapse-header').off('click.collapse');
    this.collapseInitialized = false;
  }
}
