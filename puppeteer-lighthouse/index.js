const Lighthouse = require('./performanceplugin/lighthouse');
const Puppeteer = require('./performanceplugin/puppeteer');
const coverage = require('./performanceplugin/coverage');
const loginStat = require('./loginHandle/wechatLogin');
const generateReport = require('./report/reportInfo');

class PerformanceDetect {
    constructor(puppeteerOptions = {}) {
        this.puppeteerIns;
        this.puppeteerOptions = puppeteerOptions;
        this.init();
        // lighthouse 指标
        this.lighthouseIndicator = ['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'interactive', 'estimated-input-latency'];
        // lighthouse 报告信息
        this.lhr;
        // 当前测试页面链接
        this.perCheckUrl = 'https://www.baidu.com';
    }

    async init() {
        // 创建无头浏览器
        const puppeteerIns = await new Puppeteer().createPage(this.puppeteerOptions);
        this.puppeteerIns = puppeteerIns;
        // 种登录态
        // await loginStat(this.puppeteerIns.page);
        // 指标获取(自定义筛选)
        const { lighthouseIndicatorRes, lighthouseScore } = await this.getLighthouseIndicator(this.perCheckUrl);
        // 代码覆盖率
        const coverageVal = await coverage(this.puppeteerIns.page, this.perCheckUrl);
        // 性能报告获取
        await generateReport(this.lhr, lighthouseIndicatorRes, coverageVal, this.perCheckUrl, lighthouseScore);
        // 分析完成关闭浏览器
        this.puppeteerIns.browser.close();
    }

    // 获取当前页面的报告
    genReport() {
        return Reporter.generateReport(this.lhr, 'html');
    }

    // lighthouse 性能数据获取
    async getLighthouseIndicator(url) {
        if (!url) return;
        const lighthouseIns = new Lighthouse(this.puppeteerIns);
        const { lhr, artifacts, report } = await lighthouseIns.getIndicator(url);
        const lhrAuditsKeys = Object.keys(lhr.audits);
        const lighthouseIndicatorRes = [];
        this.lhr = lhr;
        // 获取lighthouse各个指标评分数据
        for (let i = 0; i < lhrAuditsKeys.length; i++) {
            const auditKey = lhrAuditsKeys[i];
            if (this.lighthouseIndicator.includes(auditKey)) {
                lhr.audits[lhrAuditsKeys[i]]
                lighthouseIndicatorRes.push({
                    score: lhr.audits[auditKey].score,
                    numericValue: lhr.audits[auditKey].numericValue,
                    title: lhr.audits[auditKey].title,
                    description: lhr.audits[auditKey].description,
                    displayValue: lhr.audits[auditKey].displayValue
                })
            }
        }

        // 获取lighthouse performance的总评分
        const lighthousePerformance = lhr.categories.performance;

        return {
            lighthouseScore: lighthousePerformance.score,
            lighthouseIndicatorRes
        }
    }
}

module.exports = PerformanceDetect;
