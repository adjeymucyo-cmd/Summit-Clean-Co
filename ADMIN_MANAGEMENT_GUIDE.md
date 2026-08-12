# Admin Dashboard - Contact Messages & Business Settings

## Overview
This guide covers the two main admin management features: **Contact Messages** and **Business Settings**. Both are fully functional and production-ready.

---

## 1. Contact Messages Management

### Location
- **Admin Page:** `/admin/messages`
- **Component:** [components/admin/admin-messages-manager.tsx](components/admin/admin-messages-manager.tsx)
- **Server Actions:** [lib/supabase/admin-actions.ts](lib/supabase/admin-actions.ts)

### Features

#### 📧 Message Dashboard
- **Split-panel interface** with message list on left, details on right
- **Filter tabs:** All, Unread, Read, Replied (with counts)
- **Message preview** in list showing name, email, message snippet, and timestamp
- **Auto-mark as read** - Messages automatically marked as opened when selected
- **Unread indicator** - Blue dot shows unread messages

#### 📋 Message Details View
When you select a message, you get:

1. **Customer Information**
   - Full name with user icon
   - Email address (clickable mailto link)
   - Phone number (clickable tel link) if provided
   - Received timestamp

2. **Message Content**
   - Full message text in readable box
   - Preserves formatting and line breaks

3. **Reply Management**
   - Shows any existing admin reply
   - "Resend via Email" button to open reply in email client
   - New reply composer with preview
   - Save reply to database or draft in email client

4. **Status Controls**
   - Mark Read/Unread buttons
   - Delete message button with confirmation
   - Status badge showing current state

#### 💬 Reply Workflow
1. Admin types reply in the composer
2. Can preview by opening in email client (Draft in Email Client button)
3. Click "Send Reply" to save to database
4. Message automatically marked as "replied"
5. Reply history is preserved and can be resent anytime

### Usage

#### View Messages
1. Go to `/admin/messages`
2. Messages automatically loaded and sorted by newest first
3. Click any message to view full details

#### Filter Messages
- Use filter tabs at top: **All, Unread, Read, Replied**
- Tab shows count in parentheses
- Active filter highlighted in teal

#### Mark as Read/Unread
1. Open message
2. Click "Mark read" or "Mark unread" button
3. Status updates immediately
4. List refreshes automatically

#### Reply to Customer
1. Open message
2. Type reply in "Answer Message Directly" section
3. (Optional) Click "Draft in Email Client" to open in email
4. Click "Send Reply" to save to database
5. Automatic email opening or manual email setup can be done

#### Delete Message
1. Open message
2. Click "Delete" button
3. Confirm deletion
4. Message removed from list permanently

### Status Values
- **new** - Unread message
- **opened** - Read by admin
- **replied** - Reply has been saved

### Server Functions

```typescript
// Get all messages (ordered newest first)
getContactMessages(): Promise<ContactMessageRow[]>

// Update message status (new, opened, replied)
updateContactMessageStatus(id: string, status: string): Promise<Result>

// Save admin reply and mark as replied
replyToContactMessage(id: string, replyText: string): Promise<Result>

// Delete message permanently
deleteContactMessage(id: string): Promise<Result>
```

---

## 2. Business Settings Management

### Location
- **Admin Page:** `/admin/settings`
- **Component:** [components/admin/admin-settings-manager.tsx](components/admin/admin-settings-manager.tsx)
- **Server Actions:** [lib/supabase/admin-actions.ts](lib/supabase/admin-actions.ts)

### Features

#### 🎨 Organized by Category
Settings are grouped into clear sections:

1. **Company Information**
   - Company Name
   - Business Name
   - Email Address
   - Phone Number
   - Physical Address
   - Business Hours

2. **Hero Section**
   - Hero Section Heading
   - Hero Section Description
   - Tagline

3. **Service Area**
   - Service Area information

4. **About Video**
   - About Video Title
   - About Video Description
   - About Video Thumbnail URL
   - Publish Video (yes/no)

#### 💾 Save Options

**Individual Save**
- Each field has its own "Save" button
- Saves only that field
- Shows success/error message

**Save All Changes**
- When fields are modified, a banner appears at top
- Shows count of modified fields
- "Save All Changes" button saves all at once
- Efficient bulk update

#### ✅ Change Tracking
- Fields that have been edited show "Modified" indicator
- Modified fields are tracked in real-time
- Only modified fields can be saved individually
- Save All button only appears when changes exist

#### 🎯 User-Friendly Labels
Each field displays:
- Clear, readable label (e.g., "Company Name" not "company_name")
- Description: "Editable site content field"
- Appropriate input type (text input or textarea)
- Placeholder text for guidance

### Usage

#### Edit a Single Field
1. Go to `/admin/settings`
2. Find the field you want to edit (organized by section)
3. Type new value in the input box
4. Field will show "Modified" indicator
5. Click "Save" button for that field
6. See success message

#### Edit Multiple Fields
1. Go to `/admin/settings`
2. Edit multiple fields across different sections
3. Banner appears showing number of modified fields
4. Click "Save All Changes" button at top
5. All changes saved at once
6. See success message

#### Field Types

**Text Input** (most fields)
```
Company Name, Business Name, Email, Phone, etc.
```

**Textarea** (for longer content)
```
Descriptions, addresses, tagline, etc.
Supports multi-line editing
```

#### Response Messages
- **Success:** Green banner with checkmark "All settings saved successfully!"
- **Error:** Red banner with alert icon and error details
- Messages auto-dismiss after 5 seconds

### Server Functions

```typescript
// Update single setting
updateSiteSetting(key: string, value: string): Promise<Result>

// Update multiple settings at once (NEW)
updateAllSiteSettings(settings: Array<{key: string; value: string | null}>): Promise<Result>
```

### Setting Keys Reference

| Key | Type | Description |
|-----|------|-------------|
| `company_name` | Text | Main company name |
| `business_name` | Text | Display business name |
| `email` | Text | Contact email |
| `phone` | Text | Business phone number |
| `address` | Textarea | Physical address |
| `hours` | Text | Operating hours |
| `hero_heading` | Textarea | Homepage hero title |
| `hero_description` | Textarea | Homepage hero subtitle |
| `tagline` | Textarea | Company tagline/motto |
| `service_area` | Text | Service area description |
| `about_video_title` | Text | Video title |
| `about_video_description` | Textarea | Video description |
| `about_video_thumbnail_url` | Text | Video thumbnail image URL |
| `about_video_is_published` | Text | "true" or "false" |

---

## Design & UX Features

### Color Scheme
- **Primary (Teal):** `#0F5B4F` - Buttons, active tabs, accents
- **Dark Teal:** `#093D35` - Hover states
- **Text:** `#14221F` - Main content
- **Secondary:** `#60716D` - Descriptions, hints
- **Border:** `#DCE5E1` - Dividers
- **Background:** `#F5F7F2` - Light backgrounds

### Interactive Elements
- **Rounded corners** (1.5-2rem) for modern look
- **Smooth transitions** (300ms) on hover
- **Subtle shadows** that elevate on interaction
- **Icon indicators** for status (unread dot, replied badge)
- **Loading states** with disabled buttons during save

### Responsive Design
- **Desktop:** Full split-panel layout for messages
- **Tablet:** Stacked layout with message selection
- **Mobile:** Single column with scroll

---

## Best Practices

### Contact Messages
✅ Always review unread messages regularly
✅ Reply within 24 hours for customer service
✅ Use saved replies as documentation
✅ Organize by status for workflow management
✅ Delete spam/duplicate messages as needed

### Business Settings
✅ Keep company info current and accurate
✅ Update hero copy seasonally or for promotions
✅ Test video thumbnail URL loads properly
✅ Use clear, concise descriptions
✅ Save frequently to avoid losing changes
✅ Use "Save All" for bulk updates

---

## Troubleshooting

### Messages Not Appearing
- Verify admin is authenticated
- Check database `contact_messages` table has data
- Refresh page to reload from server

### Reply Not Saving
- Ensure you clicked "Send Reply" (not just "Draft in Email Client")
- Check error message for database issues
- Try again with shorter reply text

### Settings Not Saving
- Verify all fields are filled correctly
- Check for database connection
- Try saving individual field first
- Clear browser cache if issues persist

### Email Not Opening
- "Draft in Email Client" requires email client installed
- Can manually copy reply text and send via your email
- Check email address is valid

---

## Database Schema

### contact_messages table
```sql
- id: UUID (primary key)
- name: text (customer name)
- email: text (customer email)
- phone: text (optional phone)
- message: text (full message content)
- status: text (new, opened, replied)
- reply_text: text (admin reply, optional)
- created_at: timestamp
- updated_at: timestamp
```

### site_settings table
```sql
- key: text (primary key, setting name)
- value: text (setting value)
- updated_at: timestamp
```

---

## Next Steps

1. **Start managing messages** - Visit `/admin/messages`
2. **Update company info** - Visit `/admin/settings`
3. **Set up email forwarding** - Link admin email to system
4. **Create reply templates** - For common customer questions
5. **Regular maintenance** - Clean up old messages monthly
