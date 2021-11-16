const lighthouse = require('lighthouse');

module.exports = class Lighthouse {
    constructor(puppeteerIns) {
       this.puppeteerIns = puppeteerIns;
    }

    async getIndicator(url) {
        const { browser } = this.puppeteerIns;
        const res = await lighthouse(
            url, 
            {
                port: new URL(browser.wsEndpoint()).port,
                output: 'json',
                logLevel: 'info',
                onlyCategories: ['performance'], 
            },
            {
            extends: 'lighthouse:default',
            settings: {
                locale: 'zh',
            }
        }
            // {
            //     settings: {
            //         extends: 'lighthouse:default',
            //         locale: 'zh',
            //     }
            // }
        );

        return res;
    }

}