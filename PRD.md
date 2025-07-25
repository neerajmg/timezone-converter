# Timezone Converter Tool

A streamlined tool for managing time across multiple time zones with real-time updates and intuitive conversion capabilities.

**Experience Qualities**:
1. **Effortless** - Converting times should feel instantaneous and require minimal mental overhead
2. **Precise** - Users must trust the accuracy of time conversions for critical scheduling decisions
3. **Comprehensive** - Support for global business needs with extensive timezone coverage

**Complexity Level**: Light Application (multiple features with basic state)
This tool manages timezone data, user preferences, and real-time updates while remaining focused on its core time conversion purpose.

## Essential Features

### Real-time Clock Display
- **Functionality**: Shows current time in multiple selected timezones with live updates
- **Purpose**: Provides instant awareness of time across global locations
- **Trigger**: Automatically on app load and continuously updates
- **Progression**: App loads → Display default timezones → Update every second → Show formatted times
- **Success criteria**: Times update smoothly without lag, accurate to the second

### Timezone Selection
- **Functionality**: Search and add/remove timezones from the display list
- **Purpose**: Customize display to user's specific needs and locations
- **Trigger**: Click add timezone button or search interface
- **Progression**: Click add → Search/browse timezones → Select timezone → Add to display list → Persist selection
- **Success criteria**: Can find any major city/timezone, changes persist between sessions

### Time Conversion
- **Functionality**: Set a specific time in one zone and see equivalent times in all other zones
- **Purpose**: Schedule meetings and events across timezones accurately
- **Trigger**: Click on any displayed time or use conversion input
- **Progression**: Select time picker → Choose date/time → See conversions → Reset to current time option
- **Success criteria**: Conversions are mathematically accurate including DST handling

### Meeting Time Finder
- **Functionality**: Find optimal meeting times that work across selected timezones
- **Purpose**: Identify business hour overlaps for international collaboration
- **Trigger**: Click "Find meeting time" button
- **Progression**: Select → Choose date range → See overlapping business hours → Highlight best times
- **Success criteria**: Accurately identifies overlapping work hours (9AM-5PM) across zones

## Edge Case Handling

- **DST Transitions**: Handle daylight saving time changes automatically with clear indicators
- **Date Line Crossing**: Properly display when timezones are on different calendar dates
- **Invalid Times**: Gracefully handle times that don't exist due to DST transitions
- **Slow Connections**: Show loading states and cache timezone data
- **Empty State**: Guide users to add their first timezone with helpful suggestions

## Design Direction

The design should feel precise and professional like a high-end chronometer, with clean typography and subtle animations that reinforce the passage of time. Minimal interface that prioritizes information density while maintaining clarity.

## Color Selection

Triadic color scheme using deep blue, warm orange, and sage green to create visual distinction between timezone groups while maintaining professional appearance.

- **Primary Color**: Deep Blue (oklch(0.3 0.15 250)) - Communicates trust, precision, and professionalism
- **Secondary Colors**: 
  - Neutral Gray (oklch(0.5 0.02 250)) - For backgrounds and secondary text
  - Light Blue (oklch(0.85 0.08 250)) - For cards and containers
- **Accent Color**: Warm Orange (oklch(0.7 0.15 45)) - For current time indicators and active states
- **Foreground/Background Pairings**:
  - Background (White #FFFFFF): Dark Gray text (oklch(0.2 0.02 250)) - Ratio 8.2:1 ✓
  - Primary (Deep Blue): White text (oklch(0.98 0.02 250)) - Ratio 6.1:1 ✓
  - Accent (Warm Orange): White text (oklch(0.98 0.02 250)) - Ratio 4.8:1 ✓
  - Cards (Light Blue): Dark Gray text (oklch(0.2 0.02 250)) - Ratio 7.1:1 ✓

## Font Selection

Use Inter for its excellent readability at various sizes and strong tabular figures that ensure time displays align perfectly across different timezone cards.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Timezone Names): Inter Semibold/18px/normal spacing
  - Time Display: Inter Bold/24px/tabular numbers for alignment
  - Body Text: Inter Regular/14px/relaxed line height
  - Labels: Inter Medium/12px/wide letter spacing

## Animations

Smooth micro-animations that reinforce time's continuous flow - subtle transitions when times update and gentle hover states that feel responsive without being distracting.

- **Purposeful Meaning**: Time updates slide smoothly to reinforce continuity, timezone cards gently lift on hover to show interactivity
- **Hierarchy of Movement**: Current time indicators pulse subtly, conversion changes cascade from the modified timezone to others

## Component Selection

- **Components**: 
  - Cards for timezone display with subtle shadows
  - Select/Combobox for timezone search with autocomplete
  - Input with time picker for conversion functionality
  - Button variants for add/remove actions
  - Badge components for timezone abbreviations
  - Dialog for meeting time finder interface
- **Customizations**: Custom time picker component with 12/24 hour toggle, timezone card with animated time updates
- **States**: Hover effects on timezone cards, active states for current conversion, disabled states for invalid times
- **Icon Selection**: Globe for timezone selection, Clock for time conversion, Calendar for meeting finder, Plus/X for add/remove
- **Spacing**: Consistent 16px gaps between timezone cards, 8px internal card padding, 24px section margins
- **Mobile**: Stack timezone cards vertically, collapsible controls, touch-friendly time picker interface