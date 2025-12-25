// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavbar();
    initMobileMenu();
    initDualTabs();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
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
