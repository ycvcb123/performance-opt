const puppeteer = require('puppeteer');

module.exports = class Puppeteer {
    // config 为puppeteer 的启动配置
    constructor(config) {
        // 浏览器实例子
        this.browser;
        // 页面实在
        this.page;
    }

    // 创建无头浏览器
    async createPage(options) {
        const browser = await puppeteer.launch({...options ,headless:false, slowMo: 200});
        const page = await browser.newPage();
        // 模拟手机
        await page.emulate(puppeteer.devices['iPhone 6']);
        this.browser = browser;
        this.page = page;
        return {
            browser,
            page
        }
    }
}