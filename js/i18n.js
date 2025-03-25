// 多语言支持模块
class I18n {
    constructor() {
        this.currentLanguage = 'zh';
        this.translations = {};
    }
    
    // 加载语言文件
    async loadLanguage(lang) {
        try {
            const response = await fetch(`locale/${lang}.json`);
            const data = await response.json();
            this.translations[lang] = data;
            return data;
        } catch (error) {
            console.error(`Error loading language: ${lang}`, error);
            return null;
        }
    }
    
    // 切换语言
    async setLanguage(lang) {
        // 已加载过的语言直接使用缓存
        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        }
        
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updatePageText();
            return true;
        }
        
        return false;
    }
    
    // 获取翻译文本
    getText(key) {
        if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }
        
        // 未找到翻译时显示键名
        return key;
    }
    
    // 更新页面上所有需要翻译的文本
    updatePageText() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            
            // 对于占位符替换，格式：{{placeholder}}
            if (translation.includes('{{') && translation.includes('}}')) {
                let finalText = translation;
                const placeholders = translation.match(/\{\{([^}]+)\}\}/g);
                
                if (placeholders) {
                    placeholders.forEach(placeholder => {
                        const placeholderKey = placeholder.replace('{{', '').replace('}}', '');
                        const placeholderValue = element.getAttribute(`data-${placeholderKey}`) || '';
                        finalText = finalText.replace(placeholder, placeholderValue);
                    });
                }
                
                element.textContent = finalText;
            } else {
                element.textContent = translation;
            }
        });
    }
}

// 初始化并导出 I18n 实例
const i18n = new I18n();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['zh', 'en'];
    const defaultLang = 'zh';
    
    // 确定初始语言
    const initialLang = supportedLangs.includes(browserLang) ? browserLang : defaultLang;
    
    // 设置语言
    await i18n.setLanguage(initialLang);
    
    // 设置语言切换按钮状态
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === initialLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', async function() {
            const lang = this.getAttribute('data-lang');
            const success = await i18n.setLanguage(lang);
            
            if (success) {
                langButtons.forEach(button => button.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// 导出 i18n 实例
window.i18n = i18n;

