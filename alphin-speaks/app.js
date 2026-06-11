// ========== SPA ROUTER ==========

function switchActiveView(viewId) {
  document.querySelectorAll('.view').forEach(function (v) {
    v.classList.remove('active');
  });
  var target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }
  window.scrollTo(0, 0);
}

// ========== MOCK ACCOUNTS ==========

var mockAccounts = [
  { name: 'Alphin Kurian', email: 'alphin.kurian@gmail.com' },
  { name: 'Guest User', email: 'guest.user@gmail.com' }
];

// ========== TOPIC PROMPTS ==========

var topicPrompts = {
  Technology: [
    'Should AI be allowed to make medical diagnoses without human oversight?',
    'Will smartphones become obsolete in the next 20 years?',
    'Is social media doing more harm than good to society?',
    'How will quantum computing change everyday life?',
    'Should coding be a mandatory subject in schools?',
    'Is remote work the future or just a temporary trend?'
  ],
  Business: [
    'What makes a startup succeed where others fail?',
    'Is a 4-day work week realistic for most businesses?',
    'Should companies prioritize profit or purpose?',
    'How important is personal branding in today\'s economy?',
    'What is the biggest mistake first-time entrepreneurs make?',
    'Is the gig economy empowering workers or exploiting them?'
  ],
  Education: [
    'Should universities be free for everyone?',
    'Is the traditional classroom model outdated?',
    'How can we make lifelong learning a habit?',
    'Should exams be replaced with project-based assessments?',
    'What is the most important skill schools don\'t teach?',
    'How has the internet changed the way we learn?'
  ],
  Culture: [
    'Does travel truly broaden the mind?',
    'Is cancel culture a force for good or bad?',
    'Should art be funded by the government?',
    'How does music shape our identity?',
    'What defines a generation — technology or values?',
    'Is it possible to preserve tradition in a globalized world?'
  ]
};

// ========== STATE ==========

var activeDomains = ['Technology', 'Business'];
var currentTopic = '';
var currentCategory = '';

// Recording state
var mediaRecorder = null;
var audioChunks = [];
var timerInterval = null;
var timeRemaining = 60;
var isRecording = false;

// ========== LOCAL STORAGE HELPERS ==========

function saveAuth(name, email) {
  localStorage.setItem('alphin_auth_session_user', name);
  localStorage.setItem('alphin_auth_session_email', email);
}

function getAuthName() {
  return localStorage.getItem('alphin_auth_session_user') || 'User';
}

function updateStreak() {
  var today = new Date().toDateString();
  var lastDate = localStorage.getItem('alphin_last_session_date');
  var streak = parseInt(localStorage.getItem('alphin_streak_count') || '0', 10);

  if (lastDate === today) {
    return streak;
  }

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastDate === yesterday.toDateString()) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem('alphin_streak_count', String(streak));
  localStorage.setItem('alphin_last_session_date', today);
  return streak;
}

function saveLedgerEntry(prompt, category, audioBase64) {
  var ledger = JSON.parse(localStorage.getItem('alphin_vocal_ledger_history') || '[]');
  ledger.push({
    uid: Date.now(),
    prompt: prompt,
    category: category,
    timestamp: new Date().toISOString(),
    audioSourceURI: audioBase64
  });
  localStorage.setItem('alphin_vocal_ledger_history', JSON.stringify(ledger));
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function () {
  // Check if user is already authenticated
  var existingUser = localStorage.getItem('alphin_auth_session_user');
  if (existingUser) {
    setupDashboard();
    switchActiveView('view-dashboard');
  } else {
    switchActiveView('view-landing');
  }

  // Populate mock accounts in the bottom sheet
  var accountList = document.getElementById('account-list');
  mockAccounts.forEach(function (account) {
    var row = document.createElement('div');
    row.className = 'account-row';
    row.innerHTML =
      '<div class="account-avatar">' + account.name.charAt(0) + '</div>' +
      '<div class="account-info">' +
      '  <span class="name">' + account.name + '</span>' +
      '  <span class="email">' + account.email + '</span>' +
      '</div>';
    row.addEventListener('click', function (e) {
      e.preventDefault();
      saveAuth(account.name, account.email);
      closeAuthSheet();
      switchActiveView('view-onboarding-fears');
    });
    accountList.appendChild(row);
  });

  // Landing: Start Training button
  document.getElementById('btn-start-training').addEventListener('click', function (e) {
    e.preventDefault();
    openAuthSheet();
  });

  // Auth sheet close
  document.getElementById('sheet-close-btn').addEventListener('click', function (e) {
    e.preventDefault();
    closeAuthSheet();
  });

  // Backdrop click to close
  document.getElementById('google-sheet-modal-backdrop').addEventListener('click', function (e) {
    if (e.target === this) {
      e.preventDefault();
      closeAuthSheet();
    }
  });

  // Onboarding Step 1 -> Step 2
  document.getElementById('btn-onboard-next1').addEventListener('click', function (e) {
    e.preventDefault();
    switchActiveView('view-onboarding-goals');
  });

  // Onboarding Step 2 -> Dashboard
  document.getElementById('btn-onboard-next2').addEventListener('click', function (e) {
    e.preventDefault();
    setupDashboard();
    switchActiveView('view-dashboard');
  });

  // Goal pills toggle
  document.querySelectorAll('.pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      pill.classList.toggle('pill-selected');
    });
  });

  // Domain cards toggle
  document.querySelectorAll('.domain-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var domain = card.getAttribute('data-domain');
      card.classList.toggle('domain-active');
      var idx = activeDomains.indexOf(domain);
      if (idx > -1) {
        activeDomains.splice(idx, 1);
      } else {
        activeDomains.push(domain);
      }
    });
  });

  // Spin Topic
  document.getElementById('btn-spin-topic').addEventListener('click', function (e) {
    e.preventDefault();
    spinTopic();
  });

  // Start Speaking button
  document.getElementById('btn-start-speaking').addEventListener('click', function (e) {
    e.preventDefault();
    if (!currentTopic) return;
    document.getElementById('rec-topic-text').textContent = currentTopic;
    switchActiveView('view-recording');
    resetTimer();
  });

  // Mic button
  document.getElementById('btn-mic').addEventListener('click', function (e) {
    e.preventDefault();
    toggleRecording();
  });

  // Back to dashboard from recording
  document.getElementById('btn-rec-back').addEventListener('click', function (e) {
    e.preventDefault();
    stopRecording();
    switchActiveView('view-dashboard');
  });

  // Initialize domain active states
  document.querySelectorAll('.domain-card').forEach(function (card) {
    var domain = card.getAttribute('data-domain');
    if (activeDomains.indexOf(domain) > -1) {
      card.classList.add('domain-active');
    }
  });
});

// ========== AUTH SHEET ==========

function openAuthSheet() {
  document.getElementById('google-sheet-modal-backdrop').classList.add('active');
}

function closeAuthSheet() {
  document.getElementById('google-sheet-modal-backdrop').classList.remove('active');
}

// ========== DASHBOARD ==========

function setupDashboard() {
  var name = getAuthName().split(' ')[0];
  document.getElementById('dashboard-username').textContent = name;
  var streak = updateStreak();
  document.getElementById('streak-count').textContent = streak + ' day' + (streak !== 1 ? 's' : '');
}

// ========== TOPIC SPINNER ==========

function spinTopic() {
  if (activeDomains.length === 0) return;

  var randomDomain = activeDomains[Math.floor(Math.random() * activeDomains.length)];
  var prompts = topicPrompts[randomDomain];
  var randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  currentTopic = randomPrompt;
  currentCategory = randomDomain;

  document.getElementById('topic-text').textContent = randomPrompt;
  document.getElementById('topic-category').textContent = randomDomain.toUpperCase();
  document.getElementById('topic-reveal').classList.add('visible');
}

// ========== RECORDING ==========

function resetTimer() {
  timeRemaining = 60;
  updateTimerDisplay();
  var display = document.getElementById('timer-display');
  display.classList.remove('timer-warning');
}

function updateTimerDisplay() {
  var secs = timeRemaining;
  var display = document.getElementById('timer-display');
  display.textContent = '0:' + (secs < 10 ? '0' : '') + secs;

  if (secs <= 10) {
    display.classList.add('timer-warning');
  }
}

function startTimer() {
  timerInterval = setInterval(function () {
    timeRemaining -= 1;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      stopRecording();
    }
  }, 1000);
}

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  var micBtn = document.getElementById('btn-mic');
  var waveform = document.getElementById('waveform');
  var micLabel = document.getElementById('mic-label');

  // Try to access microphone
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
          var audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          var reader = new FileReader();
          reader.onloadend = function () {
            saveLedgerEntry(currentTopic, currentCategory, reader.result);
          };
          reader.readAsDataURL(audioBlob);

          stream.getTracks().forEach(function (track) { track.stop(); });
        };

        mediaRecorder.start();
        isRecording = true;
        micBtn.classList.add('recording');
        waveform.classList.add('active');
        micLabel.textContent = 'Tap to stop';
        startTimer();
      })
      .catch(function () {
        // Microphone not available — run timer-only mode
        startTimerOnlyMode();
      });
  } else {
    startTimerOnlyMode();
  }
}

function startTimerOnlyMode() {
  var micBtn = document.getElementById('btn-mic');
  var waveform = document.getElementById('waveform');
  var micLabel = document.getElementById('mic-label');

  isRecording = true;
  micBtn.classList.add('recording');
  waveform.classList.add('active');
  micLabel.textContent = 'Tap to stop (no mic)';
  startTimer();
}

function stopRecording() {
  var micBtn = document.getElementById('btn-mic');
  var waveform = document.getElementById('waveform');
  var micLabel = document.getElementById('mic-label');

  clearInterval(timerInterval);
  timerInterval = null;

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }

  isRecording = false;
  micBtn.classList.remove('recording');
  waveform.classList.remove('active');
  micLabel.textContent = 'Tap to start';
}
