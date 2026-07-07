const nav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const fadeItems = document.querySelectorAll('.fade-up');
const counters = document.querySelectorAll('.counter');

const setActiveLink = () => {
  const scrollPos = window.scrollY + 140;
  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`));
    }
  });
};

navToggle?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => mobileMenu?.classList.remove('open'));
});

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
  backToTop?.classList.toggle('visible', window.scrollY > 500);
  setActiveLink();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('counter')) {
        const target = Number(entry.target.dataset.target || 0);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const counterTimer = setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target + (entry.target.dataset.suffix || '');
            clearInterval(counterTimer);
          } else {
            entry.target.textContent = current;
          }
        }, 30);
      }
    }
  });
}, { threshold: 0.2 });

fadeItems.forEach(item => revealObserver.observe(item));
counters.forEach(counter => revealObserver.observe(counter));

const handleSmoothAnchor = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

handleSmoothAnchor();
setActiveLink();

let selectedRating = 0;
const labels = ['', 'Bohat Bura', 'Theek Hai', 'Acha', 'Bohat Acha', 'Zabardast!'];
const stars = document.querySelectorAll('.star');
const reviewLabel = document.getElementById('rating-label');
const reviewName = document.getElementById('reviewer-name');
const reviewText = document.getElementById('reviewer-text');
const submitButton = document.getElementById('submit-review');
const reviewsList = document.getElementById('reviews-list');

const renderStars = (value) => {
  stars.forEach(star => {
    const starValue = Number(star.dataset.val);
    star.classList.toggle('active', starValue <= value);
  });
};

const updateAverage = () => {
  const storedReviews = JSON.parse(localStorage.getItem('hkas_reviews') || '[]');
  const baseReviews = [{ rating: 5 }];
  const combined = [...baseReviews, ...storedReviews];
  const average = combined.reduce((sum, item) => sum + item.rating, 0) / combined.length;
  document.getElementById('avg-rating-num').textContent = average.toFixed(1);
  document.getElementById('avg-stars-display').textContent = '?'.repeat(Math.round(average)) + '?'.repeat(5 - Math.round(average));
  document.getElementById('total-reviews').textContent = `${combined.length} review ke mutabiq`;
};

const renderSavedReviews = () => {
  const saved = JSON.parse(localStorage.getItem('hkas_reviews') || '[]');
  reviewsList.innerHTML = '';
  saved.forEach(item => {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `
      <div>${'?'.repeat(item.rating)}${'?'.repeat(5 - item.rating)}</div>
      ${item.text ? `<p>“${item.text}”</p>` : ''}
      <strong>${item.name || 'Anonymous'}</strong>
    `;
    reviewsList.appendChild(card);
  });
};

stars.forEach(star => {
  star.addEventListener('mouseover', () => renderStars(Number(star.dataset.val)));
  star.addEventListener('mouseout', () => renderStars(selectedRating));
  star.addEventListener('click', () => {
    selectedRating = Number(star.dataset.val);
    renderStars(selectedRating);
    if (reviewLabel) {
      reviewLabel.textContent = labels[selectedRating];
      reviewLabel.style.color = '#e67e22';
    }
  });
});

submitButton?.addEventListener('click', () => {
  if (!selectedRating) {
    alert('Pehle stars select karein!');
    return;
  }
  const name = reviewName?.value.trim() || 'Anonymous';
  const text = reviewText?.value.trim() || '';
  const stored = JSON.parse(localStorage.getItem('hkas_reviews') || '[]');
  stored.push({ rating: selectedRating, name, text });
  localStorage.setItem('hkas_reviews', JSON.stringify(stored));
  renderSavedReviews();
  updateAverage();
  reviewName.value = '';
  reviewText.value = '';
  selectedRating = 0;
  renderStars(0);
  if (reviewLabel) {
    reviewLabel.textContent = 'Shukriya! Aapka review submit ho gaya ?';
    reviewLabel.style.color = '#25a56a';
  }
  submitButton.textContent = 'Review Submitted';
  setTimeout(() => {
    submitButton.textContent = 'Submit Review';
    if (reviewLabel) {
      reviewLabel.textContent = 'Koi star select karein';
      reviewLabel.style.color = '';
    }
  }, 2500);
});

updateAverage();
renderSavedReviews();