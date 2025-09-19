//  Navigation menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const openMenu = document.getElementById('openMenu');
  const closeMenu = document.getElementById('closeMenu');
  const navLinks = document.getElementById('navLinks');
  const navLinksList = document.querySelectorAll('.nav-link');
  
  openMenu.addEventListener('click', () => {
    navLinks.classList.add('active');
  });
  
  closeMenu.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
  
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Smooth scrolling for navigation links
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Copy button functionality
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-text');
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon to indicate copied
        this.innerHTML = '<i class="fas fa-check"></i>';
        
        // Revert back after 2 seconds
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      });
    });
  }

  // Intersection Observer for animations
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    element.classList.add('aos-init');
    observer.observe(element);
  });

  // Stats counter animation
  const stats = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.about-section');
  
  let counted = false;
  
  function startCounting() {
    if (counted) return;
    
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-count');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // Update every 16ms (60fps)
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        const roundedValue = target > 100 ? Math.floor(current) : parseFloat(current.toFixed(1));
        stat.textContent = roundedValue;
        
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    });
    
    counted = true;
  }
  
  // Start counting when stats section is in view
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCounting();
      statsObserver.unobserve(statsSection);
    }
  }, { threshold: 0.5 });
  
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Add active class to nav links on scroll
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Fetch Discord server stats
  fetchDiscordInfo();

  // Initialize enhanced animations
  initializeEnhancedAnimations();
});

// Fetch Discord server information
async function fetchDiscordInfo() {
  const memberCountEl = document.getElementById('member-count');
  const onlineCountEl = document.getElementById('online-count');
  
  if (!memberCountEl && !onlineCountEl) return;
  
  try {
    const response = await fetch('https://discord.com/api/guilds/1370059719393415319/widget.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (memberCountEl) {
      memberCountEl.textContent = data.presence_count ? `${data.presence_count}+` : '1.2K+';
    }
    if (onlineCountEl) {
      onlineCountEl.textContent = data.presence_count ? `${Math.floor(data.presence_count * 0.3)}+` : '350+';
    }
  } catch (error) {
    // Fallback to static values on error
    if (memberCountEl) memberCountEl.textContent = '1.2K+';
    if (onlineCountEl) onlineCountEl.textContent = '350+';
  }
}

// Add CSS class for animated elements
document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.feature-card, .about-image, .command-examples, .developer-image, .discord-widget');
  
  elements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add('in-view');
    }
  });
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

// AOS animation classes
class AOS {
  static init() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  }
}

AOS.init();

// Enhanced Vote Page Functionality
if (window.location.pathname.includes('vote.html')) {
  // Animate vote stats on load
  const animateVoteStats = () => {
    const totalVotesEl = document.getElementById('totalVotes');
    const monthlyVotesEl = document.getElementById('monthlyVotes');
    
    if (totalVotesEl && monthlyVotesEl) {
      animateNumber(totalVotesEl, 0, 1247, 2000);
      animateNumber(monthlyVotesEl, 0, 89, 1500);
    }
  };
  
  // Number animation function
  const animateNumber = (element, start, end, duration) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * easeOutCubic(progress));
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };
  
  // Easing function
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  
  // Start animations when page loads
  setTimeout(animateVoteStats, 500);
  
  // Add click effect to vote button
  const voteBtn = document.querySelector('.vote-btn');
  if (voteBtn) {
    voteBtn.addEventListener('click', (e) => {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = voteBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      voteBtn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
}

// Initialize enhanced animations
function initializeEnhancedAnimations() {
  // Scroll indicator functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Hide scroll indicator on scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
      }
    });
  }

  // Enhanced button hover effects
  const magneticBtns = document.querySelectorAll('.primary-btn, .secondary-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      btn.classList.add('magnetic-btn');
    });
    
    btn.addEventListener('mouseleave', (e) => {
      btn.classList.remove('magnetic-btn');
      btn.style.transform = '';
    });
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
    });
  });

  // Enhanced feature card animations
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '1';
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection && scrolled < window.innerHeight) {
      const speed = scrolled * 0.3;
      heroSection.style.transform = `translateY(${speed}px)`;
    }
  });

  // Add stagger animation to feature cards
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200 + 1000);
  });
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);