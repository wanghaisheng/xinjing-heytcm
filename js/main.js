document.addEventListener('DOMContentLoaded', function() {
    // 初始化多语言支持
    initLanguage();
    
    // FAQ 交互
    initFAQ();
    
    // 标签页切换
    initTabs();
    
    // 轮播图
    initSlider();
    
    // 返回顶部按钮
    initBackToTop();
    
    // 平滑滚动
    initSmoothScroll();
});

// 多语言支持初始化
function initLanguage() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // 更新按钮激活状态
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 默认加载中文
    setLanguage('zh');
}

// 设置语言
function setLanguage(lang) {
    fetch(`locale/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (data[key]) {
                    element.textContent = data[key];
                }
            });
        })
        .catch(error => console.error('Error loading language file:', error));
}

// FAQ 交互初始化
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 切换当前项的激活状态
            item.classList.toggle('active');
            
            // 关闭其他项
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// 标签页切换初始化
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新按钮激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 更新内容区域
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 轮播图初始化
function initSlider() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    // 设置初始激活状态
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    
    // 点击圆点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // 自动轮播
    setInterval(function() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }, 5000);
    
    // 更新轮播状态
    function updateSlider() {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
}

// 返回顶部按钮初始化
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 平滑滚动初始化
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

