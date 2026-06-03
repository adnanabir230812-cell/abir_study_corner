// Theme (Dark Mode) Manager
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // Reusable Dynamic Search Binder
  const setupSearch = (inputId, resultsId) => {
    const searchInput = document.getElementById(inputId);
    const searchResults = document.getElementById(resultsId);

    if (searchInput && searchResults) {
      const handleSearch = async (query) => {
        if (!query.trim()) {
          searchResults.classList.add('hidden');
          searchResults.innerHTML = '';
          return;
        }

        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          searchResults.innerHTML = '';
          searchResults.classList.remove('hidden');

          if (data.courses.length === 0 && data.topics.length === 0 && data.questions.length === 0) {
            searchResults.innerHTML = `
              <div class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                No results found for "${query}"
              </div>
            `;
            return;
          }

          // Render Courses
          if (data.courses.length > 0) {
            const courseHeader = document.createElement('div');
            courseHeader.className = 'px-4 py-1.5 text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800';
            courseHeader.textContent = 'Courses';
            searchResults.appendChild(courseHeader);

            data.courses.forEach(c => {
              const item = document.createElement('a');
              item.href = `/courses/${c.id}`;
              item.className = 'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors';
              item.textContent = c.name;
              searchResults.appendChild(item);
            });
          }

          // Render Topics
          if (data.topics.length > 0) {
            const topicHeader = document.createElement('div');
            topicHeader.className = 'px-4 py-1.5 text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800';
            topicHeader.textContent = 'Topics';
            searchResults.appendChild(topicHeader);

            data.topics.forEach(t => {
              const item = document.createElement('a');
              item.href = `/courses/${t.Section.courseId}/qa#topic-${t.id}`;
              item.className = 'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors';
              item.innerHTML = `<span class="font-medium">${t.name}</span> <span class="text-xs text-slate-400 dark:text-slate-500">(${t.Section.Course.name})</span>`;
              searchResults.appendChild(item);
            });
          }

          // Render Questions
          if (data.questions.length > 0) {
            const questionHeader = document.createElement('div');
            questionHeader.className = 'px-4 py-1.5 text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800';
            questionHeader.textContent = 'Questions & Answers';
            searchResults.appendChild(questionHeader);

            data.questions.forEach(q => {
              const item = document.createElement('a');
              item.href = `/courses/${q.Topic.Section.courseId}/qa?question=${q.id}#question-${q.id}`;
              item.className = 'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate';
              item.innerHTML = `<span class="font-medium">${q.questionText}</span> <br/> <span class="text-xs text-slate-400 dark:text-slate-500">${q.Topic.name} - ${q.Topic.Section.Course.name}</span>`;
              searchResults.appendChild(item);
            });
          }

        } catch (err) {
          console.error('Error fetching search results:', err);
        }
      };

      // Debounced search trigger (300ms)
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleSearch(e.target.value);
        }, 300);
      });

      // Close dropdown on click outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.classList.add('hidden');
        }
      });
    }
  };

  // Setup search for both Desktop and Mobile elements
  setupSearch('global-search-input', 'search-results-dropdown');
  setupSearch('mobile-search-input', 'mobile-search-results-dropdown');

  // Exam Countdown Live Timer Logic
  const countdownContainer = document.getElementById('exam-countdown');
  if (countdownContainer) {
    const examDateStr = countdownContainer.dataset.date;
    const examDate = new Date(examDateStr).getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = examDate - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }

});

