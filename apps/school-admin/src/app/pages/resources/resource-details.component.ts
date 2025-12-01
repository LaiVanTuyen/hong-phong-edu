import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceService, Resource } from '@hong-phong-edu/data-access';

declare var bootstrap: any;

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.scss']
})
export class ResourceDetailsComponent implements OnInit {
  resource: Resource | null = null;
  deleteModal: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public resourceService: ResourceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.resource = this.resourceService.get(id) || null;

    // If resource not found, redirect to list
    if (!this.resource) {
      console.warn('Resource not found, redirecting to list');
      this.router.navigate(['/resources']);
      return;
    }

    // Initialize Bootstrap modal
    const modalElement = document.getElementById('delete-modal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getYouTubeEmbedUrl(url: string): SafeResourceUrl {
    // Convert YouTube URL to embed format
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  confirmDelete() {
    if (this.resource) {
      this.resourceService.delete(this.resource.id);
      this.deleteModal?.hide();
      this.router.navigate(['/resources']);
    }
  }

  showDeleteModal() {
    this.deleteModal?.show();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isImageFile(): boolean {
    if (!this.resource?.original_file_name) return false;
    const name = this.resource.original_file_name.toLowerCase();
    return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif');
  }

  isPdfFile(): boolean {
    if (!this.resource?.original_file_name) return false;
    return this.resource.original_file_name.toLowerCase().endsWith('.pdf');
  }

  isVideoFile(): boolean {
    if (!this.resource?.original_file_name) return false;
    const name = this.resource.original_file_name.toLowerCase();
    return name.endsWith('.mp4') || name.endsWith('.avi') || name.endsWith('.mov') || name.endsWith('.wmv');
  }

  getFileExtension(): string {
    if (!this.resource?.original_file_name) return '';
    const parts = this.resource.original_file_name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  }
}
