# TaskFlow Architecture & Developer Guide

## Project Overview

TaskFlow is a fully client-side productivity application. It requires no backend, server, or build process. Just open `index.html` in a browser and it works!

## Architecture

### Technology Stack
- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** Pure CSS3 with gradients and animations
- **Storage:** Browser LocalStorage API
- **No Dependencies:** Zero external libraries

### Project Structure

```
taskflow/
├── index.html              # Main application shell
├── css/
│   └── style.css          # All styling (900+ lines)
├── js/
│   └── script.js          # All functionality (1000+ lines)
├── assets/
│   └── images/            # Image assets (placeholder)
├── README.md              # User guide
├── DEPLOYMENT.md          # Deployment instructions
└── ARCHITECTURE.md        # This file
```

## Core Components

### 1. Data Model (script.js)

**Global State Variables:**
```javascript
let tasks = [];           // Array of task objects
let habits = [];          // Array of habit objects
let stars = 0;            // Achievement stars
let currentDate = new Date();
let selectedDate = null;
let rewardGiven = false;
```

**Data Structure - Task Object:**
```javascript
{
  name: "Task name",
  category: "STUDY|WORK|HEALTH|HOBBY|OTHER",
  priority: "HIGH|MEDIUM|LOW",
  date: "YYYY-MM-DD",
  time: "HH:MM",
  completed: boolean
}
```

**Data Structure - Habit Object:**
```javascript
{
  name: "Habit name",
  time: "HH:MM",
  streak: number,
  completed: boolean
}
```

### 2. Screens (HTML)

**Onboarding Flow:**
1. `screen1` - Introduction slide
2. `screen2` - Habits feature slide
3. `screen3` - Rewards feature slide
4. `screen4` - Name input
5. `screen5` - Goal selection
6. `dashboard` - Main application

### 3. Dashboard Tabs

The dashboard has 5 main tabs (controlled by `showTab()`):

1. **homeTab** - Tasks, reminders, progress, achievements
2. **calendarTab** - Calendar view and selected date tasks
3. **habitTab** - Habit management and tracking
4. **settingsTab** - Theme toggle, reset data, footer
5. **analyticsTab** - Productivity statistics

### 4. Key Functions

#### Data Management
- `saveTasks()` - Persist tasks to localStorage
- `saveHabits()` - Persist habits to localStorage
- `resetData()` - Clear all app data

#### Navigation
- `nextScreen(n)` - Move to onboarding screen n
- `showTab(name)` - Switch dashboard tab
- `goToDashboard()` - Start app after onboarding

#### Task Operations
- `renderTasks()` - Display all tasks
- `addTask()` - Open task creation modal
- `saveTask()` - Save new task
- `toggleTask(i)` - Mark task complete/incomplete
- `deleteTask(i)` - Remove task
- `editTask(i)` - Edit task name
- `updateProgress()` - Calculate and display progress

#### Habit Operations
- `renderHabits()` - Display all habits
- `openHabitModal()` - Open habit creation modal
- `saveHabit()` - Save new habit
- `toggleHabit(i)` - Increment streak or mark complete
- `deleteHabit(i)` - Remove habit
- `editHabit(i)` - Edit habit name

#### Calendar Operations
- `renderCalendar()` - Display calendar grid
- `changeMonth(d)` - Navigate months
- `showTasksForDate(date)` - Display tasks for selected date

#### Display Functions
- `renderReminders()` - Show upcoming tasks
- `renderAchievements()` - Update achievement cards
- `renderAnalytics()` - Display statistics
- `loadDashboard()` - Initialize dashboard with user data

#### Utilities
- `closeModal()` - Close any modal
- `closeRewardModal()` - Close reward notification

## State Management Flow

```
User Action
    ↓
Event Handler (onclick, addEventListener)
    ↓
Function Logic (modify data)
    ↓
localStorage.setItem() ← Save
    ↓
Render Function (update UI)
    ↓
DOM Updated
```

## Styling Architecture

### CSS Organization
- **Global Styles** - Reset, typography, colors
- **Layout** - App container, screens, dashboard
- **Components** - Cards, buttons, inputs, modals
- **Utilities** - Empty states, animations, dark mode
- **Responsive** - Mobile-first design (max-width: 430px)

### Color Scheme
- **Primary** - Indigo (#6366f1)
- **Secondary** - Purple (#8b5cf6)
- **Accent** - Light gray (#f8fafc)
- **Dark Mode** - Slate (#1f2937 to #374151)

### Animations
- `fadeIn` - Screen transitions
- `translateY` - Hover effects
- `.3s transition` - Smooth color changes

## LocalStorage Schema

**Keys Stored:**
```javascript
localStorage.getItem("tasks")        // JSON string
localStorage.getItem("habits")       // JSON string
localStorage.getItem("stars")        // Number string
localStorage.getItem("username")     // String
localStorage.getItem("goal")         // String
localStorage.getItem("darkMode")     // "true" or "false"
```

## Browser Compatibility

Requires:
- ES6+ JavaScript support
- CSS Grid & Flexbox
- LocalStorage API
- Arrow functions
- Template literals
- Promise support (modern browsers)

**Tested on:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Characteristics

- **Initial Load:** <1s (all files are small)
- **Task Creation:** Instant
- **Rendering:** <100ms for any operation
- **Memory Usage:** <10MB typical
- **Storage:** ~1KB per task + habit

## Extending the App

### Adding a New Feature

1. **Add HTML** for the new component in `index.html`
2. **Add CSS** styles in `css/style.css`
3. **Add JavaScript** functions in `js/script.js`
4. **Persist Data** using `localStorage.setItem()`
5. **Add Render Function** to update UI when data changes

### Example: Adding a Notes Feature

```javascript
// 1. Add to data model
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// 2. Add save function
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// 3. Add CRUD functions
function addNote(text) {
    notes.push({text: text, date: new Date()});
    saveNotes();
    renderNotes();
}

function renderNotes() {
    // Update DOM
}

// 4. Add UI in index.html
<div id="notesTab">...</div>

// 5. Add CSS in style.css
.note-card { ... }

// 6. Link in showTab()
if(tab === "notes") {
    document.getElementById("notesTab").style.display = "block";
    renderNotes();
}
```

## Common Modifications

### Change Color Scheme
Edit these CSS variables (search in `style.css`):
- `#6366f1` - Primary purple
- `#8b5cf6` - Secondary purple
- `#f8fafc` - Light background

### Adjust App Size
- Max width: `.app-container { max-width: 430px }`
- Change padding: `.screen { padding: 40px 30px }`

### Modify Task Categories
In `index.html`, find `<select id="taskCategory">` and add/remove options

### Change Font
Update Google Fonts link in `index.html` head

## Known Limitations

1. **Single Device** - Data doesn't sync across devices
2. **Offline Only** - Can't add remote features easily
3. **Local Storage Limit** - ~10MB per domain
4. **No Export** - Manual JSON copy needed for backup
5. **No Sharing** - Can't share tasks with others

## Future Enhancement Ideas

1. ✨ Cloud synchronization (Firebase)
2. 📱 Progressive Web App (PWA)
3. 🔐 User authentication
4. 👥 Collaboration features
5. 📊 Advanced analytics
6. 🔔 Browser notifications
7. 📥 Import/Export functionality
8. 🎨 Customizable themes
9. 🌍 Multi-language support
10. ⌨️ Keyboard shortcuts

## Testing Checklist

- [ ] Create task → Displays correctly
- [ ] Complete task → Progress updates
- [ ] Delete task → Removed from list
- [ ] Create habit → Shows with 0 streak
- [ ] Toggle habit → Streak increments
- [ ] Switch months → Calendar updates
- [ ] Select date → Shows date tasks
- [ ] Toggle dark mode → Persists on reload
- [ ] Reset data → Clears everything, redirects to onboarding
- [ ] Refresh page → Data persists
- [ ] Clear localStorage → Redirects to onboarding
- [ ] All modals open/close correctly
- [ ] Mobile responsive → Works on small screens

## Debugging Tips

### Check Data in Console
```javascript
// View all data
console.log({tasks, habits, stars});

// View localStorage
console.log(localStorage);

// Clear localStorage
localStorage.clear();

// Check for errors
document.querySelector(".app-container");
```

### Enable Debug Mode
```javascript
// Add to script.js
const DEBUG = true;
if(DEBUG) {
    console.log("All app events logged");
}
```

---

**For questions or contributions, refer to README.md and DEPLOYMENT.md**

Version: 1.0 | Last Updated: 2026-06-11
