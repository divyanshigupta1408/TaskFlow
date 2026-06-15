# TaskFlow - Productivity App

A modern, mobile-first task and habit management application built with vanilla JavaScript, HTML, and CSS.

## Features

✨ **Core Features:**
- 📝 **Task Management** - Create, edit, and track tasks with categories and priorities
- 🎯 **Habit Tracking** - Build and maintain daily habits with streak tracking
- 📅 **Calendar View** - Visual calendar to manage tasks by date
- ⭐ **Achievement System** - Track stars earned, streaks, completed tasks, and success rate
- 🌙 **Dark Mode** - Easy on the eyes with automatic theme persistence
- 📊 **Analytics** - View your productivity metrics and completion rates

## Getting Started

### Installation

1. **Clone or Download** the repository
2. **No installation required** - it's a static website that works in any modern browser
3. **Open** `index.html` in your web browser

### First Time Setup

1. On the first launch, you'll see the onboarding slides
2. Follow the 3 onboarding steps to understand the app features
3. Enter your name when prompted
4. Select your main goal (Study, Health, Productivity, or Habits)
5. You'll be taken to the dashboard

## How to Use

### Tasks
- **Create Task:** Click the "+" button or "Create your first task"
- **Edit Task:** Click the pencil icon on any task
- **Complete Task:** Check the checkbox next to a task
- **Delete Task:** Click the trash icon
- **Categories:** Study, Work, Health, Hobby, or Other
- **Priorities:** High, Medium, Low

### Habits
- **Create Habit:** Go to Habits tab → Click "+"
- **Track Habit:** Check the habit daily to increase streak
- **Edit/Delete:** Use the pencil and trash icons

### Calendar
- **View Calendar:** Go to Calendar tab
- **Select Date:** Click any date to see tasks for that day
- **Navigation:** Use ← → buttons to change months
- **Indicators:** 
  - **Blue background** = Today
  - **Blue border** = Has tasks

### Achievements
- **Stars Earned:** Awarded when completing all tasks in a day
- **Streak:** Your longest habit streak
- **Completed:** Total tasks completed
- **Success Rate:** Percentage of completed tasks

### Settings
- **Dark Mode:** Toggle between light and dark themes
- **Reset Data:** Clear all tasks, habits, and settings (⚠️ Cannot be undone)

## Technical Details

### Structure
```
todowebsite/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   └── script.js       # All functionality
├── assets/
│   └── images/         # Image placeholder folder
└── README.md           # This file
```

### Storage
- **LocalStorage:** All data is saved locally in your browser
- **No Server Required:** Works completely offline
- **Data Persistence:** Your data persists between sessions

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Detail

### Responsive Design
- Optimized for mobile-first experience
- Works on tablets and desktops
- Smooth animations and transitions

### Data Management
- Automatic saving after each action
- Complete data reset option available
- Dark mode preference saved

### User Experience
- Intuitive onboarding flow
- Clear empty states with guidance
- Real-time achievement updates
- Active navigation indicators
- Confirmation dialogs for destructive actions

## Tips & Tricks

1. **Daily Routine:** Set habits for your daily activities
2. **Planning:** Use the calendar to plan tasks ahead
3. **Productivity Streaks:** Complete all tasks daily to earn stars
4. **Categories:** Organize tasks by category for better management
5. **Priorities:** Focus on high-priority tasks first

## Troubleshooting

**Q: My data disappeared**
- Check if localStorage is enabled in your browser
- Try clearing browser cache if data seems corrupted

**Q: Dark mode isn't saving**
- Make sure localStorage is enabled
- Try a different browser if the issue persists

**Q: Tasks not appearing on calendar**
- Ensure you've set a date when creating the task
- Check that the date format is correct

## Browser Storage

This app uses browser LocalStorage to save your data. Here's what's stored:
- Tasks (with dates, times, categories, priorities, completion status)
- Habits (with times and streaks)
- User settings (theme preference, username, goal)
- Achievement data (stars earned)

**Important:** Clearing browser data/cache will delete all app data.

## Privacy

- **No server** - Your data never leaves your device
- **No tracking** - No analytics or user tracking
- **No accounts** - No login required
- **Completely private** - All data stored locally

## Tips for Best Experience

1. ✅ Create tasks the night before for next day
2. 🎯 Start with 3-5 daily tasks (avoid overwhelm)
3. 🔥 Build habits gradually (consistency > perfection)
4. 📱 Check the app daily for best results
5. 🌙 Use dark mode in the evening to reduce eye strain

## Feedback

Found a bug or have a feature request? Feel free to report it!

---

**Made with ❤️ by Divyanshi**

Version: 1.0
