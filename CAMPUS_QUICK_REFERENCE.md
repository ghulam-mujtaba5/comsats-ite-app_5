# Campus System - Quick Reference Guide

## 🚀 Quick Start

### Add Campus Filtering to Any Page

```typescript
// 1. Import the hook and banner
import { useCampus } from "@/contexts/campus-context"
import { CampusBanner } from "@/components/layout/campus-reminder"

// 2. Use in your component
export default function MyFeaturePage() {
  const { selectedCampus, selectedDepartment } = useCampus()
  
  // 3. Build API URL with filters
  const loadData = async () => {
    const params = new URLSearchParams()
    if (selectedCampus?.id) params.append('campus_id', selectedCampus.id)
    if (selectedDepartment?.id) params.append('department_id', selectedDepartment.id)
    
    const res = await fetch(`/api/my-data?${params}`)
    const { data } = await res.json()
    setMyData(data)
  }
  
  // 4. Reload when campus changes
  useEffect(() => {
    loadData()
  }, [selectedCampus, selectedDepartment])
  
  // 5. Add banner reminder
  return (
    <div>
      <CampusBanner 
        title="Select Your Campus & Department"
        description="Filter content for personalized results"
      />
      {/* Your content here */}
    </div>
  )
}
```

## 📡 Add Campus Filtering to API Routes

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const campusId = searchParams.get('campus_id')
  const departmentId = searchParams.get('department_id')
  
  const supabase = createClient(/* ... */)
  let query = supabase.from('my_table').select('*')
  
  // Apply filters
  if (campusId && campusId !== 'all') {
    query = query.eq('campus_id', campusId)
  }
  if (departmentId && departmentId !== 'all') {
    query = query.eq('department_id', departmentId)
  }
  
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
```

## 🗄️ Add Campus Columns to Database Tables

```sql
-- Add to your content table
ALTER TABLE my_table 
  ADD COLUMN campus_id UUID REFERENCES campuses(id),
  ADD COLUMN department_id UUID REFERENCES departments(id);

-- Add indexes for performance
CREATE INDEX idx_my_table_campus ON my_table(campus_id);
CREATE INDEX idx_my_table_department ON my_table(department_id);
```

## 🎨 UI Components Available

### CampusBanner (Recommended for most pages)
```typescript
import { CampusBanner } from "@/components/layout/campus-reminder"

<CampusBanner 
  title="Select Your Campus"
  description="Filter timetables by your campus and department"
/>
```

### CampusReminder (Auto-shows globally)
```typescript
// Already included in layout.tsx
// Shows automatically after 2 seconds if no selection
// Dismissible per session
```

### CampusSelector (Main selector dialog)
```typescript
import { CampusSelector } from "@/components/layout/campus-selector"

// Already in header
// Can be used anywhere you need campus selection
<CampusSelector />
```

### CampusIndicator (Floating reminder)
```typescript
import { CampusIndicator } from "@/components/layout/campus-reminder"

// Floating pulsing button in bottom-right
<CampusIndicator />
```

## 🎯 Campus Context API

### Available Data
```typescript
const {
  // Current selections
  selectedCampus,      // { id, name, code, city, full_name, is_default } | null
  selectedDepartment,  // { id, campus_id, name, code, full_name } | null
  selectedProgram,     // { id, department_id, name, code, degree_type } | null
  
  // Available options
  campuses,           // Campus[]
  departments,        // Department[]
  programs,           // Program[]
  
  // Actions
  setSelectedCampus,
  setSelectedDepartment,
  setSelectedProgram,
  loadCampuses,
  loadDepartments,
  loadPrograms,
  
  // State
  isLoading           // boolean
} = useCampus()
```

### Example Usage Patterns

#### Pattern 1: Simple Campus Filter
```typescript
const { selectedCampus } = useCampus()

// Use in API call
const url = selectedCampus 
  ? `/api/data?campus_id=${selectedCampus.id}`
  : `/api/data`
```

#### Pattern 2: Campus + Department Filter
```typescript
const { selectedCampus, selectedDepartment } = useCampus()

const params = new URLSearchParams()
if (selectedCampus?.id) params.append('campus_id', selectedCampus.id)
if (selectedDepartment?.id) params.append('department_id', selectedDepartment.id)

const url = `/api/data?${params.toString()}`
```

#### Pattern 3: Show Campus Name
```typescript
const { selectedCampus } = useCampus()

return (
  <div>
    {selectedCampus ? (
      <h2>Content for {selectedCampus.name} Campus</h2>
    ) : (
      <h2>All Campuses</h2>
    )}
  </div>
)
```

## 🔄 Auto-Reload on Campus Change

```typescript
// Always include selectedCampus and selectedDepartment in useEffect deps
useEffect(() => {
  loadData()
}, [selectedCampus, selectedDepartment]) // ← Important!
```

## ✅ Checklist for New Campus-Aware Feature

- [ ] Import `useCampus` hook
- [ ] Destructure `selectedCampus` and `selectedDepartment`
- [ ] Add campus_id/department_id query params to API calls
- [ ] Add `[selectedCampus, selectedDepartment]` to useEffect dependencies
- [ ] Add `CampusBanner` to page (optional but recommended)
- [ ] Update API route to filter by campus_id and department_id
- [ ] Add campus_id and department_id columns to database table
- [ ] Test with different campus/department selections
- [ ] Test with no selection (should show all or prompt)

## 🎨 Styling Tips

### Campus Badge
```typescript
{selectedCampus && (
  <Badge variant="outline" className="gap-1">
    <MapPin className="h-3 w-3" />
    {selectedCampus.code}
  </Badge>
)}
```

### Department Badge
```typescript
{selectedDepartment && (
  <Badge variant="secondary" className="gap-1">
    <Building2 className="h-3 w-3" />
    {selectedDepartment.code}
  </Badge>
)}
```

## 🐛 Common Issues & Solutions

### Issue: "useCampus must be used within CampusProvider"
**Solution**: Ensure your component is inside `<CampusProvider>` in layout.tsx

### Issue: Data not filtering by campus
**Solution**: 
1. Check API route accepts `campus_id` param
2. Verify database column exists
3. Check useEffect deps include `selectedCampus`

### Issue: Selection not persisting on refresh
**Solution**: localStorage is used automatically, check browser allows localStorage

### Issue: Campus selector not showing options
**Solution**: 
1. Check `/api/campuses` returns data
2. Verify Supabase connection
3. Check browser console for errors

## 📊 Database Seed Data Example

```sql
-- Insert campuses
INSERT INTO campuses (name, code, city, full_name, is_default) VALUES
  ('Lahore', 'LHR', 'Lahore', 'COMSATS University Islamabad, Lahore Campus', true),
  ('Islamabad', 'ISB', 'Islamabad', 'COMSATS University Islamabad', false),
  ('Attock', 'ATK', 'Attock', 'COMSATS University Islamabad, Attock Campus', false);

-- Insert departments for Lahore campus
INSERT INTO departments (campus_id, name, code, full_name) VALUES
  ((SELECT id FROM campuses WHERE code = 'LHR'), 'Computer Science', 'CS', 'Department of Computer Science'),
  ((SELECT id FROM campuses WHERE code = 'LHR'), 'Software Engineering', 'SE', 'Department of Software Engineering'),
  ((SELECT id FROM campuses WHERE code = 'LHR'), 'Electrical Engineering', 'EE', 'Department of Electrical Engineering');
```

## 🎯 Performance Tips

1. **Use Indexes**: Add indexes on campus_id and department_id columns
2. **Cache Data**: Campus list rarely changes, consider caching
3. **Lazy Load**: Load departments only when campus is selected
4. **Debounce**: If user rapidly changes selection, debounce API calls

## 📱 Mobile Considerations

- Campus selector is fully responsive
- Touch-friendly selection cards
- Compact header display on mobile
- Swipe gestures supported in dialogs

## 🎉 That's It!

You now have everything you need to add campus filtering to any feature. The system is:

✅ **Simple** - Just a few lines of code  
✅ **Automatic** - Filtering handled for you  
✅ **Persistent** - Selection saves across sessions  
✅ **Beautiful** - Professional UI components  
✅ **Fast** - Optimized queries and caching  

Happy coding! 🚀
