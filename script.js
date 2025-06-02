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
});

// Fetch Discord server information
async function fetchDiscordInfo() {
  try {
    const response = await fetch('https://hooks.jdoodle.net/proxy?url=https://discord.com/api/guilds/1370059719393415319/widget.json');
    const data = await response.json();
    
    // Update the member count and online count
    document.getElementById('member-count').textContent = data.presence_count || 'N/A';
    document.getElementById('online-count').textContent = data.presence_count || 'N/A';
  } catch (error) {
    console.error('Error fetching Discord info:', error);
    document.getElementById('member-count').textContent = 'N/A';
    document.getElementById('online-count').textContent = 'N/A';
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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-aos]').forEach(element => {
    element.classList.add('aos-init');
  });
});

class AOS {
  static init() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        } else {
          // Uncomment below to reset animations when out of view
          // entry.target.classList.remove('aos-animate');
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
  