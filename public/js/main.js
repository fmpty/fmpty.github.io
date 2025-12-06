// 技术博客自定义脚本
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 2. 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 3. 返回顶部按钮
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(10px)';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 4. 代码块行号
    document.querySelectorAll('pre code').forEach((block) => {
        const lines = block.innerHTML.split('\n').length - 1;
        if (lines > 1) {
            const lineNumbers = Array.from({length: lines}, (_, i) => i + 1)
                .join('\n');
            const lineNumbersElement = document.createElement('div');
            lineNumbersElement.className = 'line-numbers';
            lineNumbersElement.innerHTML = lineNumbers;
            lineNumbersElement.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                padding: 1em;
                background: #272822;
                color: #888;
                font-family: monospace;
                text-align: right;
                user-select: none;
                border-right: 1px solid #444;
            `;
            block.parentNode.style.position = 'relative';
            block.parentNode.style.paddingLeft = '3.5em';
            block.parentNode.appendChild(lineNumbersElement);
        }
    });
    
    // 5. 主题切换动画
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        });
    }
    
    // 添加过渡类
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition * {
            transition: background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
});
