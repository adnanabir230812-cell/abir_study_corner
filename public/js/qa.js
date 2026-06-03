document.addEventListener('DOMContentLoaded', () => {
  // 1. Accordion Toggle Logic (Only one open at a time)
  const accordions = document.querySelectorAll('.accordion-item');

  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');

    header.addEventListener('click', () => {
      const isOpen = content.classList.contains('open');

      // Close all other accordions
      accordions.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.accordion-content');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        otherContent.classList.remove('open');
        otherContent.style.maxHeight = null;
        if (otherIcon) {
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current accordion
      if (!isOpen) {
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) {
          icon.style.transform = 'rotate(180deg)';
        }
      } else {
        content.classList.remove('open');
        content.style.maxHeight = null;
        if (icon) {
          icon.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // Auto-open specific question from URL hash if present
  const hash = window.location.hash;
  if (hash && hash.startsWith('#question-')) {
    const targetId = hash.replace('#question-', '');
    const targetItem = document.getElementById(`item-${targetId}`);
    if (targetItem) {
      const content = targetItem.querySelector('.accordion-content');
      const icon = targetItem.querySelector('.accordion-icon');
      if (content) {
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) {
          icon.style.transform = 'rotate(180deg)';
        }
        targetItem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // 2. AJAX Progress Checkboxes
  const solvedCheckboxes = document.querySelectorAll('.solved-checkbox');
  solvedCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const questionId = e.target.dataset.questionId;
      const sectionId = e.target.dataset.sectionId;
      const solved = e.target.checked;

      try {
        const response = await fetch(`/progress/${questionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ solved }),
        });

        if (!response.ok) {
          throw new Error('Failed to update progress');
        }

        const data = await response.json();
        
        // Update progress UI elements
        updateProgressUI(data.progress);
        
        // Check if section just completed
        if (data.progress.percentage === 100 && solved) {
          showCompletionCelebration(data.progress.count);
        }
      } catch (err) {
        console.error(err);
        // revert checkbox state on error
        e.target.checked = !solved;
        alert('Could not update progress. Please check your connection.');
      }
    });
  });

  function updateProgressUI(progress) {
    // Update progress bars & text
    const progressTextElements = document.querySelectorAll('.progress-text');
    const progressBarElements = document.querySelectorAll('.progress-bar-fill');

    progressTextElements.forEach(el => {
      el.textContent = `${progress.solvedCount}/${progress.totalCount} Solved (${progress.percentage}%)`;
    });

    progressBarElements.forEach(bar => {
      bar.style.width = `${progress.percentage}%`;
    });
  }

  function showCompletionCelebration(totalCount) {
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
    celebration.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm text-center mx-4 border border-indigo-100 dark:border-slate-700 animate-scale-up">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Section Completed!</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Congratulations! You solved all <strong>${totalCount}</strong> questions in this section on ${new Date().toLocaleDateString()}.
        </p>
        <button id="close-celebration" class="w-full py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Awesome, Keep Studying!
        </button>
      </div>
    `;

    document.body.appendChild(celebration);

    // Disable background scroll
    document.body.classList.add('overflow-hidden');

    document.getElementById('close-celebration').addEventListener('click', () => {
      celebration.remove();
      document.body.classList.remove('overflow-hidden');
    });
  }
});
