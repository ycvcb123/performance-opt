
const pti = require('puppeteer-to-istanbul');
//
module.exports = async function coverageStat(page, url) {
    // 启用 JavaScript 和 CSS 覆盖
    await Promise.all([page.coverage.startCSSCoverage(), page.coverage.startJSCoverage()]);
    await page.goto(url);

    // 禁用 JavaScript 和 CSS 覆盖
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);


    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges)
            usedBytes += range.end - range.start - 1;
    }
    // await pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' })

    return `${(usedBytes / totalBytes * 100).toFixed(2)}%`
}

