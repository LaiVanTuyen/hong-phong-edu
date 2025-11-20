# Hướng dẫn migrate template vào Angular

## Bước 1: Copy Assets
Từ template gốc, copy các thư mục sau vào `apps/school-admin/src/assets/`:
```
assets/
├── css/
├── js/
├── img/
└── plugins/
```

## Bước 2: Cấu hình angular.json
Thêm các file CSS và JS vào `apps/school-admin/project.json`:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "apps/school-admin/public"
  },
  {
    "glob": "**/*",
    "input": "apps/school-admin/src/assets"
  }
],
"styles": [
  "apps/school-admin/src/assets/css/bootstrap.min.css",
  "apps/school-admin/src/assets/plugins/tabler-icons/tabler-icons.min.css",
  "apps/school-admin/src/assets/plugins/fontawesome/css/fontawesome.min.css",
  "apps/school-admin/src/assets/plugins/fontawesome/css/all.min.css",
  "apps/school-admin/src/assets/css/style.css",
  "apps/school-admin/src/styles.scss"
],
"scripts": [
  "apps/school-admin/src/assets/js/jquery-3.7.1.min.js",
  "apps/school-admin/src/assets/js/feather.min.js",
  "apps/school-admin/src/assets/js/bootstrap.bundle.min.js",
  "apps/school-admin/src/assets/js/script.js"
]
```

## Bước 3: Update Components

### Header Component
File từ template: Dòng 68-429 (section `.header`)

### Sidebar Component  
File từ template: Dòng 431-1084 (section `.sidebar`)

### Horizontal Sidebar
File từ template: Dòng 1086-1400 (section `.sidebar-horizontal`)

### Two Column Sidebar
File từ template: Dòng 1402-1956 (section `.two-col-sidebar`)

### Home/Dashboard Content
File từ template: Dòng 1960-2887 (section `.page-wrapper > .content`)

## Bước 4: Angular Directives cần thay thế

Trong template HTML, thay thế:
- `href="#"` → `href="javascript:void(0);"`
- `<a href="page.html">` → `<a routerLink="/page">`
- Bootstrap dropdowns cần thêm Angular directives

## Bước 5: Script initialization

Tạo service để init các jQuery plugins sau khi component load:
```typescript
ngAfterViewInit() {
  // Init feather icons
  // Init select2
  // Init daterangepicker
}
```

## Note quan trọng:
Template này sử dụng jQuery và Bootstrap JS. Trong Angular, nên:
1. Sử dụng ng-bootstrap thay vì jQuery Bootstrap
2. Convert jQuery plugins sang Angular directives
3. Sử dụng Angular Router thay vì href links
