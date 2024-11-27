document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for chapters
    const chapters = document.querySelectorAll('.chapter:not(.locked)');
    
    chapters.forEach(chapter => {
        chapter.addEventListener('click', () => {
            // Add click animation
            chapter.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chapter.style.transform = 'scale(1)';
            }, 200);

            // Simulate chapter navigation
            if (!chapter.classList.contains('completed')) {
                showNotification('Loading chapter content...', 'info');
                // Here you would typically navigate to the chapter content
            }
        });
    });

    // Add hover effects for course cards
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const progress = card.querySelector('.progress');
            progress.style.transform = 'scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            const progress = card.querySelector('.progress');
            progress.style.transform = 'scale(1)';
        });
    });

    // Show warning for locked chapters
    const lockedChapters = document.querySelectorAll('.chapter.locked');
    
    lockedChapters.forEach(chapter => {
        chapter.addEventListener('click', () => {
            showNotification('Complete previous chapters to unlock!', 'warning');
        });
    });
});

// Notification function (reused from previous script)
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `game-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 