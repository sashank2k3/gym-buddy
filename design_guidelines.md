# Gym Buddy - Design Guidelines

## Design Approach
**Selected Framework:** Design System Approach with Fitness App Patterns
**Reference Apps:** Strong, Strava, Nike Training Club
**Rationale:** Utility-focused workout tracking demands clarity, speed, and data-dense layouts optimized for gym environments (sweaty hands, quick glances between sets).

## Core Design Principles
1. **Glanceable Information:** Large, high-contrast text for reps/sets/weight visible from 2+ feet away
2. **One-Handed Operation:** All primary actions accessible within thumb zone
3. **Progressive Disclosure:** Collapsed exercise cards expand to show details/history
4. **Immediate Feedback:** Instant visual confirmation for completed sets/exercises
5. **Gym-Ready:** High contrast, minimal animations, touch targets 44px minimum

## Typography System
**Font Stack:** System fonts for performance (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)

- **Headings (Day Names):** 24px, bold, uppercase tracking
- **Exercise Names:** 18px, semibold
- **Primary Data (Sets/Reps/Weight):** 32px, bold (large for gym visibility)
- **Secondary Info (Rest/Notes):** 14px, regular
- **Input Fields:** 18px, medium weight

## Layout System
**Spacing Units:** Tailwind spacing - primarily 2, 4, 6, 8, 12, 16 units
**Container:** max-w-2xl centered, px-4 on mobile, px-6 on tablet+

**Day Card Structure:**
- Full-width cards with 4-unit padding
- 6-unit gap between day sections
- 2-unit internal spacing for exercise rows

**Exercise Row Layout:**
- Compact mode: Single row with exercise name + quick action button
- Expanded mode: Multi-row with sets grid, weight input, history display

## Component Library

### Navigation/Top Bar
- Fixed header with app name + user avatar (right aligned)
- Height: 64px (h-16)
- Shadow on scroll for depth
- Logout/menu accessible via avatar tap

### Day Accordion Cards
- Collapsible day sections (Monday-Sunday)
- Header shows: Day name + completion count (e.g., "5/12 exercises")
- Indicator bar showing completion percentage
- Tap anywhere on header to expand/collapse

### Exercise Cards (Expanded State)
**Layout Grid:**
```
[Exercise Name]                    [Edit] [Delete]
Reps: [##]  Sets: [##]  Rest: [##]s
[Weight Input: ___ kg/lbs]
[Previous: 65kg on 1/10]
[Set Completion Grid: □ □ □ □]
Notes: [expandable text]
```

- Set completion grid: Large checkboxes (48px touch target)
- Weight input: Numeric keypad with +/- increment buttons
- Previous weight displayed in muted text above input

### Action Buttons
- Primary CTA: Full-width, 48px height, rounded-lg (8px radius)
- Secondary actions: Icon buttons, 40px square, rounded-md
- Add Exercise: Floating action button (FAB) bottom-right, 56px circle

### User Management Panel
- Modal overlay (admin only)
- User list: Avatar + name cards
- Add user form: Stacked input fields with 4-unit gap
- Export/Import: Secondary buttons in footer

### Form Inputs
- Height: 48px (h-12)
- Border: 2px solid, rounded-md
- Focus state: Thicker border, subtle glow
- Labels: Floating or top-aligned, 14px

## Mobile-First Responsive Breakpoints
- **Mobile (base):** Single column, full-width cards, 16px gutters
- **Tablet (md: 768px):** max-w-2xl container, increased padding
- **Desktop (lg: 1024px):** Side-by-side day comparison view (optional split-screen for workout planning)

## Data Visualization
**Progress Indicators:**
- Circular progress rings for day completion (0-100%)
- Linear bars for weekly overview
- Weight history: Simple line chart (last 5 sessions) using minimal SVG

**Completion States:**
- Empty checkbox: Outline only
- Completed: Filled with checkmark icon
- Exercise complete: Strike-through text + badge

## Images
**No hero images needed** - This is a utility app focused on data entry and tracking.

**Icon System:** Heroicons (via CDN) for:
- Navigation: Menu, user, settings, logout
- Actions: Plus, trash, edit, check, chevrons
- Exercise types: Optional category icons (strength, cardio, yoga, etc.)

## Interaction Patterns
**Swipe Gestures:**
- Swipe left on exercise → Reveal delete button
- Swipe right on exercise → Quick complete

**Tap Targets:**
- Set checkboxes: 48px minimum
- Increment/decrement buttons: 44px
- Icon buttons: 40px with 8px padding

**Loading States:**
- Skeleton screens for workout data fetch
- Inline spinners for save operations
- Optimistic UI updates (mark complete immediately, sync in background)

## Accessibility
- ARIA labels on all icon buttons
- Focus visible states with 2px outline
- Sufficient contrast (WCAG AA minimum)
- Screen reader announcements for completion actions

## Performance Optimizations
- Virtualize long exercise lists (if >20 exercises per day)
- Lazy load exercise history
- Debounce weight input saves (500ms)
- Minimize re-renders with React.memo on exercise rows