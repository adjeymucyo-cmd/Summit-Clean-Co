# Service Management & File Upload Components

## Overview
I've created attractive, modern components for managing and displaying cleaning services with admin edit capabilities and an enhanced file upload experience.

## Components Created

### 1. **FileUpload Component** (`components/site/file-upload.tsx`)
An attractive, user-friendly file upload component with:
- **Drag & drop support** - Users can drag files directly onto the upload area
- **Image preview** - Shows a preview of the selected image
- **Progress indication** - Visual feedback when file is ready
- **File validation** - Checks file size and type
- **Easy file management** - Option to change or remove selected file
- **Responsive design** - Works on all screen sizes

**Features:**
- Drag-and-drop file upload
- Automatic image preview
- File size validation (default 5MB max)
- Visual progress indicator with checkmark
- "Change Photo" button for easy replacement
- Remove button to clear selection
- Beautiful color scheme matching the site theme

**Usage in ServiceManager:**
```tsx
<FileUpload
  onFileSelect={(file) => setFile(file)}
  onPreviewChange={(url) => setPreviewUrl(url)}
  previewUrl={previewUrl}
  maxSizeMB={5}
  accept="image/*"
/>
```

### 2. **ServiceCard Component** (`components/site/service-card.tsx`)
A reusable component for displaying individual services with:
- **Service image** with hover zoom effect
- **Service name and description** with automatic line clamping
- **Admin edit button** - Visible when isAdmin prop is true
- **"Learn more" link** for detailed service pages
- **Responsive design** with beautiful hover effects

**Features:**
- Clean, modern card design
- Edit icon for admins (only shows when isAdmin=true)
- Image zoom effect on hover
- Automatic text truncation for long descriptions
- Flexible slug-based linking
- Fallback image support
- Professional styling with smooth transitions

**Usage:**
```tsx
<ServiceCard
  id={service.id}
  name={service.name}
  description={service.description}
  image_url={imageUrl}
  slug={service.slug}
  isAdmin={true}
  fallbackImage="fallback-url"
/>
```

### 3. **ServiceDisplay Component** (`components/site/service-display.tsx`)
A comprehensive display component showing all cleaning services with:
- **Complete service list** - All 9 main services with descriptions
- **Admin edit buttons** - Each service has an edit icon
- **Call-to-action links** - "Request this service" buttons
- **Professional styling** - Modern, attractive layout

**Features:**
- Pre-populated with all service descriptions
- Edit button on each service card
- Links to quote request page
- Responsive grid layout
- Hover effects for better UX
- Beautiful color scheme

**Included Services:**
1. Residential Cleaning
2. Commercial Cleaning
3. Deep Cleaning
4. Move In / Move Out
5. Window Cleaning
6. Move-In Cleaning
7. Interior Cleaning
8. Custom Cleaning Services
9. Office Cleaning

## Updated Files

### ServiceManager Component (`components/admin/crud-actions.tsx`)
**What changed:**
- Replaced basic file input with the new `FileUpload` component
- Now displays an attractive upload interface with drag-and-drop
- Shows image preview with upload status
- Used in both Service and ServiceArea managers

**Admin Features:**
- Create new services with attractive photo upload
- Edit existing services
- Delete services with undo functionality
- Upload management for service images
- Service area management
- Testimonial management
- Quote management

### Services Page (`app/services/page.tsx`)
**What changed:**
- Now uses the `ServiceCard` component instead of inline markup
- Services display with edit icons
- Cleaner, more maintainable code
- Better component reusability

## How to Use

### 1. **Upload Services Photos (Admin)**
1. Go to `/admin/services`
2. Fill in service details (name, slug, description, etc.)
3. Use the new file upload component to select a photo
   - Click to browse or drag-and-drop
   - Preview appears automatically
   - Click "Change Photo" to select a different image
4. Click "Add service" button

### 2. **Display Services Publicly**
The services are automatically displayed on `/services` page using:
- ServiceCard components for individual services
- Beautiful grid layout
- Edit icons visible only to admins

### 3. **Add Services List to Any Page**
To show all services with edit capability:
```tsx
import { ServiceDisplay } from '@/components/site/service-display'

export default function MyPage() {
  return (
    <div>
      <ServiceDisplay />
    </div>
  )
}
```

## Styling Details

### Color Scheme
- **Primary (Teal):** `#0F5B4F` - Used for buttons and accents
- **Dark:** `#093D35` - Hover states
- **Text:** `#14221F` - Main text
- **Secondary:** `#60716D` - Descriptions
- **Border:** `#DCE5E1` - Light borders
- **Background:** `#F5F7F2` - Light backgrounds

### Design Features
- **Rounded corners:** `1.5rem` for cards, `2rem` for larger elements
- **Transitions:** Smooth 300ms transitions on hover
- **Shadows:** Subtle shadow-sm with hover elevations
- **Spacing:** Consistent padding and gaps throughout
- **Typography:** Professional font weights and sizes

## Benefits

✅ **Better UX** - Attractive file upload with drag-and-drop
✅ **Admin Control** - Edit icons allow quick service management
✅ **Reusable Components** - Can be used across multiple pages
✅ **Professional Design** - Modern, polished appearance
✅ **Responsive** - Works on all device sizes
✅ **Easy Maintenance** - Centralized component management
✅ **Scalable** - Easy to add more services or features

## Next Steps (Optional)

1. **Add service photos** - Upload images for each service
2. **Customize edit behavior** - Update edit icon links to specific edit forms
3. **Add animations** - Enhance with more transitions
4. **Mobile optimization** - Test on various devices
5. **Accessibility** - Add ARIA labels and keyboard navigation enhancements
