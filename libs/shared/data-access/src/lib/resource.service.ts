import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ResourceStatus { id: number; label: string; badge: string; }
export interface ResourceType { id: number; name: string; }
export interface Topic { id: number; name: string; }
export interface Resource {
  id: number;
  title: string;
  description?: string;
  status_id: number;
  file_path?: string;
  original_file_name?: string;
  file_size?: number;
  youtube_url?: string;
  uploader_id: number;
  approver_id?: number;
  topic_id: number;
  type_id: number;
  created_at: Date;
  approved_at?: Date;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private resourcesSubject = new BehaviorSubject<Resource[]>([
    {
      id: 1,
      title: 'Bài giảng Giới hạn dãy số',
      description: 'Giới thiệu khái niệm giới hạn và ví dụ minh họa.',
      status_id: 2,
      file_path: '/uploads/lesson-limit.pdf',
      original_file_name: 'lesson-limit.pdf',
      file_size: 524288,
      youtube_url: 'https://youtu.be/example1',
      uploader_id: 5,
      approver_id: 1,
      topic_id: 100,
      type_id: 10,
      created_at: new Date(Date.now() - 86400000),
      approved_at: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      title: 'Tài liệu Phân tích tác phẩm Vợ chồng A Phủ',
      description: 'Phân tích nội dung và nghệ thuật của tác phẩm.',
      status_id: 1,
      uploader_id: 6,
      topic_id: 101,
      type_id: 11,
      created_at: new Date(),
    },
    {
      id: 3,
      title: 'Video Thí nghiệm phản ứng oxi hóa khử',
      description: 'Video minh họa phản ứng oxi hóa khử trong dung dịch.',
      status_id: 3,
      uploader_id: 7,
      topic_id: 102,
      type_id: 12,
      created_at: new Date(Date.now() - 43200000),
      youtube_url: 'https://youtu.be/example2'
    }
  ]);

  readonly resources$ = this.resourcesSubject.asObservable();

  readonly statuses: ResourceStatus[] = [
    { id: 1, label: 'Chờ duyệt', badge: 'bg-warning' },
    { id: 2, label: 'Đã duyệt', badge: 'bg-success' },
    { id: 3, label: 'Từ chối', badge: 'bg-danger' }
  ];
  readonly types: ResourceType[] = [
    { id: 10, name: 'Bài giảng' },
    { id: 11, name: 'Tài liệu' },
    { id: 12, name: 'Video' }
  ];
  readonly topics: Topic[] = [
    { id: 100, name: 'Toán 10' },
    { id: 101, name: 'Văn 10' },
    { id: 102, name: 'Hóa học' }
  ];

  list(): Resource[] { return this.resourcesSubject.getValue(); }
  get(id: number): Resource | undefined { return this.list().find(r => r.id === id); }

  create(payload: Omit<Resource, 'id'|'created_at'>): Resource {
    const list = this.list();
    const newItem: Resource = {
      ...payload,
      id: list.length ? Math.max(...list.map(r => r.id)) + 1 : 1,
      created_at: new Date()
    };
    this.resourcesSubject.next([...list, newItem]);
    return newItem;
  }

  update(id: number, changes: Partial<Resource>): Resource | undefined {
    const list = this.list();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    const updated: Resource = { ...list[idx], ...changes };
    const next = [...list];
    next[idx] = updated;
    this.resourcesSubject.next(next);
    return updated;
  }

  delete(id: number): void {
    this.resourcesSubject.next(this.list().filter(r => r.id !== id));
  }

  statusMeta(id: number) { return this.statuses.find(s => s.id === id); }
  typeName(id: number) { return this.types.find(t => t.id === id)?.name || '-'; }
  topicName(id: number) { return this.topics.find(tp => tp.id === id)?.name || '-'; }
}
