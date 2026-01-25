// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavbar();
    initMobileMenu();
    initDualTabs();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initPricingToggle();
    initPricingAnimations();
    initPackageGallery();
});

// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Package Gallery - Simple image slider per plan
function initPackageGallery() {
    const planData = {
        entry: {
            images: ['giris.png'],
            captions: ['Giriş Paketi - Admin Panel']
        },
        silver: {
            images: ['ss2.png', 'ss3.png'],
            captions: ['Silver Paket - Dashboard', 'Silver Paket - Sefer Yönetimi']
        },
        gold: {
            images: ['ss1.png', 'ss4.png', 'ss2.png', 'ss3.png'],
            captions: ['Gold Paket - Müşteri Sitesi Turlar', 'Gold Paket - B2C Ana Sayfa']
        }
    };

    const tabs = document.querySelectorAll('.pg-tab');
    const slideImg = document.getElementById('pg-slide-img');
    const slideCaption = document.getElementById('pg-slide-caption');
    const dotsContainer = document.getElementById('pg-dots');
    const prevBtn = document.querySelector('.pg-prev');
    const nextBtn = document.querySelector('.pg-next');

    if (!slideImg || !tabs.length) return;

    let currentPlan = 'silver';
    let currentIndex = 0;

    function renderDots() {
        const images = planData[currentPlan].images;
        dotsContainer.innerHTML = '';
        images.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'pg-dot' + (idx === currentIndex ? ' pg-dot--active' : '');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    function updateSlide() {
        const data = planData[currentPlan];
        slideImg.style.opacity = '0';
        slideImg.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            slideImg.src = data.images[currentIndex];
            slideCaption.textContent = data.captions[currentIndex] || '';
            slideImg.style.opacity = '1';
            slideImg.style.transform = 'scale(1)';
        }, 150);
        
        renderDots();
    }

    function goToSlide(idx) {
        const images = planData[currentPlan].images;
        currentIndex = (idx + images.length) % images.length;
        updateSlide();
    }

    function switchPlan(plan) {
        currentPlan = plan;
        currentIndex = 0;
        
        tabs.forEach(t => t.classList.remove('pg-tab--active'));
        document.querySelector(`.pg-tab[data-plan="${plan}"]`)?.classList.add('pg-tab--active');
        
        updateSlide();
    }

    // Event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchPlan(tab.dataset.plan));
    });

    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const gallery = document.querySelector('.package-gallery');
        if (!gallery) return;
        
        const rect = gallery.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        }
    });

    // Initialize
    updateSlide();
    lucide.createIcons();
}

// Mobile menu
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    const menuClose = document.getElementById('mobileMenuClose');
    const menuLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !menuOverlay) return;

    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) closeMenu();
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Dual Power tabs
function initDualTabs() {
    const tabBtns = document.querySelectorAll('.dual-tab-btn');
    const tabPanels = document.querySelectorAll('.dual-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }

            // Re-init icons for new tab content
            lucide.createIcons();

            // Trigger reveal animations for newly visible content
            const reveals = panel.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
            reveals.forEach(el => el.classList.add('active'));
        });
    });
}

// Scroll reveal animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// Contact form with Formspree AJAX
function initContactForm() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Gönderiliyor...';
            lucide.createIcons();
        }

        // Collect form data
        const formData = new FormData(form);

        try {
            // Send to Formspree via AJAX
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success modal
                if (modal) {
                    modal.classList.add('active');
                }
                // Reset form
                form.reset();
            } else {
                const data = await response.json();
                alert(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
        } finally {
            // Re-enable button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="send"></i> Sunum Talep Et';
                lucide.createIcons();
            }
        }
    });
}

// Close modal function (global)
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        const menuOverlay = document.getElementById('mobileMenuOverlay');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Pricing Mode Toggle - Standard vs 3-Year Campaign
function initPricingToggle() {
    const toggle = document.getElementById('pricingModeToggle');
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (!toggle) return;
    
    // Set initial state (standard mode is default - unchecked)
    toggle.checked = false;
    
    toggle.addEventListener('change', () => {
        const isCampaign = toggle.checked;
        updatePricingMode(isCampaign);
        
        // Update toggle option active states
        toggleOptions.forEach(opt => {
            const mode = opt.dataset.mode;
            if ((mode === 'campaign' && isCampaign) || (mode === 'standard' && !isCampaign)) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    });
    
    // Click on toggle options
    toggleOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const mode = opt.dataset.mode;
            toggle.checked = mode === 'campaign';
            toggle.dispatchEvent(new Event('change'));
        });
    });
    
    function updatePricingMode(isCampaign) {
        pricingCards.forEach(card => {
            const priceContainer = card.querySelector('.pricing-price');
            const standardPrice = card.querySelector('.price-standard');
            const campaignPrice = card.querySelector('.price-campaign');
            
            if (!standardPrice || !campaignPrice) return;
            
            // Add animation class
            priceContainer.classList.add('animating');
            
            setTimeout(() => {
                if (isCampaign) {
                    standardPrice.style.display = 'none';
                    campaignPrice.style.display = 'block';
                } else {
                    standardPrice.style.display = 'block';
                    campaignPrice.style.display = 'none';
                }
                
                priceContainer.classList.remove('animating');
                
                // Reinitialize icons
                lucide.createIcons();
            }, 200);
        });
    }
}

// Pricing card animations
function initPricingAnimations() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Staggered entrance animation on scroll
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay * 150);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    pricingCards.forEach(card => {
        pricingObserver.observe(card);
    });
    
    // Add hover sound effect simulation (subtle scale)
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Re-initialize icons when hovering to ensure they're rendered
            lucide.createIcons();
        });
    });
    
    // Spotlight effect - mouse tracking for Gold card
    const spotlightCards = document.querySelectorAll('.spotlight');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}
