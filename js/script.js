// ═══════════════════ STATE ═══════════════════
let currentDate = new Date();
let selectedDate = null;

let tasks   = JSON.parse(localStorage.getItem("tasks"))   || [];
let habits  = JSON.parse(localStorage.getItem("habits"))  || [];
let stars   = Number(localStorage.getItem("stars"))       || 0;
let rewardGiven = JSON.parse(localStorage.getItem("rewardGiven")) || false;

// ═══════════════════ PERSIST ═══════════════════
function saveTasks()  { localStorage.setItem("tasks",  JSON.stringify(tasks));  }
function saveHabits() { localStorage.setItem("habits", JSON.stringify(habits)); }

// ═══════════════════ ONBOARDING ═══════════════════
function updateDots(number) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === number - 1);
  });
}

function nextScreen(number) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById("screen" + number);
  if (target) target.classList.add("active");

  if (number >= 4) {
    const controls = document.getElementById("onboardingControls");
    if (controls) controls.style.display = "none";
  } else {
    updateDots(number);
  }
}

function saveName() {
  const username = document.getElementById("username").value.trim();
  if (!username) { alert("Please enter your name"); return; }
  localStorage.setItem("username", username);
  nextScreen(5);
}

// Goal card selection
let selectedGoal = "";
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".goal-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".goal-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedGoal = card.dataset.goal;
    });
  });

  // Dark mode init
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme  = localStorage.getItem("darkMode");
  if (savedTheme === "true") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.textContent = "☀️ Light";
  } else {
    if (themeToggle) themeToggle.textContent = "🌙 Dark";
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("darkMode", isDark);
      themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    });
  }
});

function goToDashboard() {
  if (!selectedGoal) { alert("Please select a goal"); return; }
  localStorage.setItem("goal", selectedGoal);
  launchDashboard();
}

function launchDashboard() {
  document.getElementById("onboarding-wrapper").style.display = "none";
  const dl = document.getElementById("dashboardLayout");
  dl.style.display = "flex";
  dl.classList.add("visible");
  loadDashboard();
}

function resetData() {
  if (!confirm("Delete all app data? This cannot be undone.")) return;
  ["tasks","habits","stars","username","goal","darkMode","rewardGiven"].forEach(k => localStorage.removeItem(k));
  location.reload();
}

// ═══════════════════ DASHBOARD ═══════════════════
function loadDashboard() {
  const username = localStorage.getItem("username") || "there";
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  document.getElementById("welcomeUser").textContent = `${greeting}, ${username}! 👋`;

  document.getElementById("starCount").textContent   = stars;
  document.getElementById("streakCount").textContent = getBestStreak();

  showTab("home");
  renderTasks();
  renderReminders();
  renderHabits();
  renderCalendar();
  renderAchievements();
}

function getBestStreak() {
  return habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
}

// ═══════════════════ TABS ═══════════════════
function showTab(tab) {
    document.querySelectorAll(".tab-content").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(tab + "Tab").style.display = "block";
  const tabs = ["homeTab","calendarTab","habitTab","analyticsTab","settingsTab"];
  tabs.forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = "none";
  });

  // Remove active from all nav buttons
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  // Show selected tab
  const map = {
    home:      "homeTab",
    calendar:  "calendarTab",
    habits:    "habitTab",
    analytics: "analyticsTab",
    settings:  "settingsTab",
  };
  const el = document.getElementById(map[tab]);
  if (el) el.style.display = "block";

  // Activate nav button
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (tab === "analytics") renderAnalytics();
  if (tab === "calendar")  renderCalendar();
}

// ═══════════════════ TASKS ═══════════════════
function addTask() {
  document.getElementById("taskModal").classList.add("show");
}
function closeModal() {
  document.getElementById("taskModal").classList.remove("show");
  document.getElementById("taskInput").value = "";
}

function saveTask() {
  const name     = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("taskCategory").value;
  const priority = document.getElementById("taskPriority").value;
  const date     = document.getElementById("taskDate").value;
  const time     = document.getElementById("taskTime").value;

  if (!name) { alert("Please enter a task name"); return; }

  tasks.push({ name, category, priority, date, time, completed: false });
  saveTasks();
  rewardGiven = false;
  localStorage.setItem("rewardGiven", false);

  renderTasks();
  renderReminders();
  closeModal();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p>No tasks yet — add your first one!</p>
      </div>`;
    updateProgress();
    return;
  }

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    div.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
      <div class="task-item-body ${task.completed ? 'completed-task' : ''}">
        <strong>${task.name}</strong>
        <div class="task-tags">
          <span class="category-tag">${task.category}</span>
          <span class="priority-tag priority-tag-${task.priority}">${task.priority}</span>
        </div>
        <div class="task-time">
          ${task.date ? "📅 " + task.date : ""}
          ${task.time ? " ⏰ " + task.time : ""}
        </div>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${index})" title="Edit">✏️</button>
        <button onclick="deleteTask(${index})" title="Delete">🗑️</button>
      </div>`;
    taskList.appendChild(div);
  });

  updateProgress();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  renderReminders();
  renderAchievements();
}

function deleteTask(index) {
  if (!confirm("Delete this task?")) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  renderReminders();
  renderAchievements();
}

function editTask(index) {
  const updated = prompt("Edit task name:", tasks[index].name);
  if (!updated) return;
  tasks[index].name = updated.trim();
  saveTasks();
  renderTasks();
  renderReminders();
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const total     = tasks.length;
  const pct       = total === 0 ? 0 : (completed / total) * 100;

  document.getElementById("progressText").textContent = `${completed}/${total} Completed`;
  document.getElementById("progressFill").style.width = pct + "%";

  // Focus banner
  const left = total - completed;
  document.getElementById("focusTasks").textContent   = `${left} Task${left !== 1 ? "s" : ""} Left`;
  document.getElementById("focusProgressFill").style.width = pct + "%";

  // Habits left
  const habitsLeft = habits.filter(h => !h.completed).length;
  document.getElementById("focusHabits").textContent = `${habitsLeft} Left`;

  // Reward
  if (total > 0 && completed === total && !rewardGiven) {
    rewardGiven = true;
    localStorage.setItem("rewardGiven", true);
    stars++;
    localStorage.setItem("stars", stars);
    document.getElementById("starCount").textContent = stars;
    document.getElementById("rewardModal").classList.add("show");
  }

  renderAchievements();
}

// ═══════════════════ HABITS ═══════════════════
function openHabitModal() {
  document.getElementById("habitModal").classList.add("show");
}
function closeHabitModal() {
  document.getElementById("habitModal").classList.remove("show");
  document.getElementById("habitInput").value = "";
}

function saveHabit() {
  function saveHabit(){

    let habitName = document.getElementById("habitInput").value;
    let habitTime = document.getElementById("habitTime").value;

    if(habitName === ""){
        alert("Enter habit name");
        return;
    }

    let habitList = document.getElementById("habitList");

    habitList.innerHTML += `
        <div class="habit-item">
            <h4>${habitName}</h4>
            <p>⏰ ${habitTime}</p>
        </div>
    `;

    document.getElementById("habitInput").value="";
    document.getElementById("habitTime").value="";

    closeHabitModal();
}
}

function renderHabits() {
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <p>No habits yet — build your first one!</p>
      </div>`;
    return;
  }

  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.classList.add("habit-card");
    div.innerHTML = `
      <div class="habit-left">
        <input type="checkbox" ${habit.completed ? "checked" : ""} onchange="toggleHabit(${index})">
        <div>
          <strong class="${habit.completed ? 'completed-task' : ''}">${habit.name}</strong>
          ${habit.time ? `<br><small>⏰ ${habit.time}</small>` : ""}
        </div>
      </div>
      <div class="habit-right">
        <span class="streak-badge">🔥 ${habit.streak}</span>
        <button onclick="editHabit(${index})">✏️</button>
        <button onclick="deleteHabit(${index})">🗑️</button>
      </div>`;
    habitList.appendChild(div);
  });
}

function toggleHabit(index) {
  habits[index].completed = !habits[index].completed;
  if (habits[index].completed) habits[index].streak++;
  else if (habits[index].streak > 0) habits[index].streak--;
  saveHabits();
  renderHabits();
  renderAchievements();
  updateProgress();
  document.getElementById("streakCount").textContent = getBestStreak();
}

function deleteHabit(index) {
  if (!confirm("Delete this habit?")) return;
  habits.splice(index, 1);
  saveHabits();
  renderHabits();
}

function editHabit(index) {
  const updated = prompt("Edit habit name:", habits[index].name);
  if (!updated) return;
  habits[index].name = updated.trim();
  saveHabits();
  renderHabits();
}

// ═══════════════════ CALENDAR ═══════════════════
function renderCalendar() {
  const monthYear   = document.getElementById("monthYear");
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const cell    = document.createElement("div");
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    cell.classList.add("calendar-day");
    cell.textContent = day;

    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear())
      cell.classList.add("today");
    if (selectedDate === dateStr) cell.classList.add("selected-day");
    if (tasks.some(t => t.date === dateStr)) cell.classList.add("has-task");

    cell.addEventListener("click", () => {
      selectedDate = dateStr;
      renderCalendar();
      showTasksForDate(dateStr);
    });

    calendarGrid.appendChild(cell);
  }
}

function changeMonth(dir) {
  currentDate.setMonth(currentDate.getMonth() + dir);
  renderCalendar();
}

function showTasksForDate(date) {
  const container = document.getElementById("selectedDateTasks");
  const filtered  = tasks.filter(t => t.date === date);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>No tasks on this date</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(task => `
    <div class="task-item">
      <div class="task-item-body">
        <strong>${task.name}</strong>
        <div class="task-tags">
          <span class="category-tag">${task.category}</span>
          <span class="priority-tag priority-tag-${task.priority}">${task.priority}</span>
        </div>
        ${task.time ? `<div class="task-time">⏰ ${task.time}</div>` : ""}
      </div>
    </div>`).join("");
}

// ═══════════════════ REMINDERS ═══════════════════
function renderReminders() {
  const reminderList = document.getElementById("reminderList");
  reminderList.innerHTML = "";

  const upcoming = tasks
    .filter(t => t.date && t.time && !t.completed)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  if (upcoming.length === 0) {
    reminderList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔔</div>
        <p>No upcoming reminders</p>
      </div>`;
    return;
  }

  upcoming.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    div.innerHTML = `
      <div class="task-item-body">
        <strong>${task.name}</strong>
        <div class="task-time">📅 ${task.date} &nbsp; ⏰ ${task.time}</div>
      </div>`;
    reminderList.appendChild(div);
  });
}

// ═══════════════════ ACHIEVEMENTS ═══════════════════
function renderAchievements() {
  const completedCount = tasks.filter(t => t.completed).length;
  const total          = tasks.length;
  const successRate    = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const bestStreak     = getBestStreak();

  document.getElementById("achievementStars").textContent     = stars;
  document.getElementById("achievementStreak").textContent    = bestStreak;
  document.getElementById("achievementCompleted").textContent = completedCount;
  document.getElementById("achievementSuccess").textContent   = successRate + "%";
}

// ═══════════════════ ANALYTICS ═══════════════════
function renderAnalytics() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const rate      = total === 0 ? 0 : Math.round((completed / total) * 100);
  const bestStreak = getBestStreak();
  const maxPossibleStreak = 10; // visual ceiling

  document.getElementById("totalTasks").textContent     = total;
  document.getElementById("completedTasks").textContent  = completed;
  document.getElementById("completionRate").textContent  = rate + "%";

  document.getElementById("analyticsRateLabel").textContent  = rate + "%";
  document.getElementById("analyticsProgressFill").style.width = rate + "%";

  const streakPct = maxPossibleStreak > 0 ? Math.min((bestStreak / maxPossibleStreak) * 100, 100) : 0;
  document.getElementById("analyticsStreakLabel").textContent  = bestStreak + " days";
  document.getElementById("analyticsStreakFill").style.width   = streakPct + "%";
}

// ═══════════════════ REWARD MODAL ═══════════════════
function closeRewardModal() {
  document.getElementById("rewardModal").classList.remove("show");
}

// ═══════════════════ ON LOAD ═══════════════════
window.onload = () => {
  const username = localStorage.getItem("username");
  if (username) {
    // Already onboarded — go straight to dashboard
    document.getElementById("onboarding-wrapper").style.display = "none";
    const dl = document.getElementById("dashboardLayout");
    dl.style.display = "flex";
    dl.classList.add("visible");

    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") document.body.classList.add("dark");

    loadDashboard();
  }
};