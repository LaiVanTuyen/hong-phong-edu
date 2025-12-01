import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceService, Resource } from '@hong-phong-edu/data-access';

@Component({
  selector: 'app-resource-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.scss']
})
export class ResourceEditComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  isNew = true;
  resourceId?: number;
  filePreviewUrl?: SafeResourceUrl;
  selectedFile?: File;

  form: Partial<Resource> = {
    title: '',
    description: '',
    status_id: 1, // Default to Pending
    file_path: '',
    original_file_name: '',
    file_size: 0,
    youtube_url: '',
    uploader_id: 1, // Default value, should be set from logged-in user
    approver_id: undefined,
    topic_id: 1,
    type_id: 1,
    created_at: new Date(),
    approved_at: undefined
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public resourceService: ResourceService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && idParam !== 'new') {
      this.isNew = false;
      this.resourceId = Number(idParam);
      
      const existing = this.resourceService.get(this.resourceId);
      if (existing) {
        this.form = { ...existing };
      } else {
        // Resource not found, redirect to list
        this.router.navigate(['/resources']);
      }
    }
  }

  handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const acceptedTypes = this.getAcceptedFileTypes();
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;

      let isValid = false;
      if (acceptedTypes.includes(',')) {
        // Handle comma-separated extensions like .jpg,.png
        isValid = acceptedTypes.split(',').some(type => {
          const trimmedType = type.trim();
          if (trimmedType.startsWith('.')) {
            return fileExtension === trimmedType;
          }
          if (trimmedType.endsWith('/*')) {
            return fileType.startsWith(trimmedType.slice(0, -1));
          }
          return fileType === trimmedType;
        });
      } else {
        // Handle single type like 'video/*' or '.pdf'
        if (acceptedTypes.startsWith('.')) {
          isValid = fileExtension === acceptedTypes;
        } else if (acceptedTypes.endsWith('/*')) {
          isValid = fileType.startsWith(acceptedTypes.slice(0, -1));
        } else {
          isValid = fileType === acceptedTypes;
        }
      }

      if (!isValid) {
        alert(`Loại file không hợp lệ. Vui lòng chọn file có định dạng: ${acceptedTypes}`);
        this.clearFile();
        return;
      }

      this.selectedFile = file;
      this.form.original_file_name = file.name;
      this.form.file_size = file.size;
      this.form.file_path = `/uploads/${file.name}`; // Simulated path
      
      const objectUrl = URL.createObjectURL(file);
      this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }
  }

  clearFile() {
    this.form.file_path = '';
    this.form.original_file_name = '';
    this.form.file_size = 0;
    this.selectedFile = undefined;
    this.filePreviewUrl = undefined;
    
    // Reset input file element
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  isImageFile(): boolean {
    if (!this.selectedFile) return false;
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return imageTypes.includes(this.selectedFile.type);
  }

  isVideoFile(): boolean {
    if (!this.selectedFile) return false;
    const videoTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
    return videoTypes.includes(this.selectedFile.type);
  }

  isPdfFile(): boolean {
    if (!this.selectedFile) return false;
    return this.selectedFile.type === 'application/pdf';
  }

  isOfficeFile(): boolean {
    if (!this.selectedFile) return false;
    const officeTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];
    return officeTypes.includes(this.selectedFile.type);
  }

  getOfficeIcon(): string {
    if (!this.selectedFile) return 'file';
    const name = this.selectedFile.name.toLowerCase();
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'file-text';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'grid';
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'monitor';
    return 'file';
  }

  getFileType(): string {
    return this.selectedFile?.type || '';
  }

  getFileTypeName(): string {
    if (!this.selectedFile) return '';
    const extension = this.selectedFile.name.split('.').pop()?.toUpperCase();
    return `File ${extension}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmit() {
    // Auto-set approved_at when status is Approved
    if (this.form.status_id === 2 && !this.form.approved_at) {
      this.form.approved_at = new Date();
    }

    if (this.isNew) {
      this.resourceService.create(this.form as Omit<Resource, 'id'>);
    } else if (this.resourceId) {
      this.resourceService.update(this.resourceId, this.form);
    }

    this.router.navigate(['/resources']);
  }

  currentStatusLabel(): string {
    if (!this.form.status_id) return '';
    const status = this.resourceService.statuses.find(s => s.id === this.form.status_id);
    return status?.label || '';
  }

  onTypeChange() {
    this.clearFile();
  }

  getAcceptedFileTypes(): string {
    const typeId = this.form.type_id;
    if (typeId === 1) { // PDF
      return '.pdf';
    } else if (typeId === 2) { // Video
      return 'video/*';
    } else if (typeId === 3) { // Image
      return 'image/*';
    }
    return '*/*'; // Allow all if no type is selected
  }
}
