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
              <div class="px-3.5 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                No results found for "${query}"
              </div>
            `;
            return;
          }

          if (data.courses.length > 0) {
            const courseHeader = document.createElement('div');
            courseHeader.className = 'px-3.5 py-1.5 text-[10px] font-mono-code uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
            courseHeader.textContent = 'Courses';
            searchResults.appendChild(courseHeader);

            data.courses.forEach(c => {
              const item = document.createElement('a');
              item.href = `/courses/${c.id}`;
              item.className = 'flex items-center justify-between px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors';
              item.innerHTML = `<span class="font-medium">${c.name} (${c.code})</span> <span class="text-[10px] font-mono-code text-slate-400">Term ${c.term || '3-2'}</span>`;
              searchResults.appendChild(item);
            });
          }

          if (data.topics.length > 0) {
            const topicHeader = document.createElement('div');
            topicHeader.className = 'px-3.5 py-1.5 text-[10px] font-mono-code uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
            topicHeader.textContent = 'Topics';
            searchResults.appendChild(topicHeader);

            data.topics.forEach(t => {
              const item = document.createElement('a');
              item.href = `/courses/${t.Section.courseId}/qa?sec=${t.Section.id}#topic-${t.id}`;
              item.className = 'block px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors';
              item.innerHTML = `<span class="font-medium">${t.name}</span> <span class="text-[11px] text-slate-400">(${t.Section.Course.name} • ${t.Section.Course.term || '3-2'})</span>`;
              searchResults.appendChild(item);
            });
          }

          if (data.questions.length > 0) {
            const questionHeader = document.createElement('div');
            questionHeader.className = 'px-3.5 py-1.5 text-[10px] font-mono-code uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
            questionHeader.textContent = 'Questions';
            searchResults.appendChild(questionHeader);

            data.questions.forEach(q => {
              const item = document.createElement('a');
              item.href = `/courses/${q.Topic.Section.courseId}/qa?sec=${q.Topic.Section.id}&question=${q.id}#item-${q.id}`;
              item.className = 'block px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors truncate';
              item.innerHTML = `<span class="font-medium">${q.questionText}</span> <br/> <span class="text-[11px] text-slate-400">${q.Topic.name} — ${q.Topic.Section.Course.name} (${q.Topic.Section.Course.term || '3-2'})</span>`;
              searchResults.appendChild(item);
            });
          }

        } catch (err) {
          console.error('Error fetching search results:', err);
        }
      };

      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleSearch(e.target.value);
        }, 300);
      });

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.classList.add('hidden');
        }
      });
    }
  };

  setupSearch('global-search-input', 'search-results-dropdown');
  setupSearch('mobile-search-input', 'mobile-search-results-dropdown');
});
