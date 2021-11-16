const printer = require('lighthouse/lighthouse-cli/printer');
const Reporter = require('lighthouse/lighthouse-core/report/report-generator');
const dayjs = require('dayjs');
const fs = require('fs-extra');
const path = require('path');
const { scoreLevel, indicatorInterval, performanceInterval, indicatorMap, getIndicatorScore } = require('./evaluationCriterion');

// 获取当前页面的lighthouse报告
function genLighthouseReport(lhr) {
    return Reporter.generateReport(lhr, 'html');
}

module.exports = async function generateReport(lhr, lighthouseFilter, coverage, perCheckUrl, lighthouseScore) {
    const lighthouseReport = genLighthouseReport(lhr);
    await fs.ensureDir(path.resolve(__dirname, '../summary'));
    // 保存lighthouse报告
    const timeStamp = dayjs(new Date()).format('YYYY-MM-DD-HH_mm');
    const fileLighthouseReport = path.resolve(__dirname, `../summary/lighthouse-report@${timeStamp}.html`)
    await printer.write(lighthouseReport, 'html', fileLighthouseReport);
    // 保存json格式文件 （自定义）
    const file = path.resolve(__dirname, './file.json');
    fs.writeFile(file, JSON.stringify(lighthouseFilter), { encoding: 'utf8' }, err => {});

    // 生成自定义的 html 报告 （自定义）
    const template = await fs.readFileSync(path.resolve(__dirname, './template.html'), 'utf-8');
       
    lighthouseFilter = lighthouseFilter.map(item => {
        const type = item.title.replace(/ /g, '-').toLocaleLowerCase();
        return {
            ...item,
            infoScore: getIndicatorScore(indicatorMap[type], item.numericValue)
        }
    })

    const summary = Reporter.replaceStrings(template, [
        // 性能指标
        {
            search: '-INDICATOR',
            replacement: JSON.stringify({
                scoreLevel, 
                indicatorInterval, 
                performanceInterval,
                indicatorMap
            }),
        },
        // 性能总评分
        {
            search: '-SCORE',
            replacement: JSON.stringify(lighthouseScore),
        },
        // 当前页面url
        {
            search: '-CURRENTCHECKURL',
            replacement: JSON.stringify(perCheckUrl),
        },
        // 代码覆盖率
        {
            search: '-COVERAGE',
            replacement: JSON.stringify(coverage),
        },
        // 性能数据
        {
            search: '-PERSCORE',
            replacement: JSON.stringify(lighthouseFilter),
        },
        // lighthouse报告对应的事件戳
        {
            search: '-TIMESTAMP',
            replacement: JSON.stringify(timeStamp),
        },
    ]);
   
    await fs.writeFile( path.resolve(__dirname, `../summary/summary@${timeStamp}.html`), summary); // `./summary@${timeStamp}.html`
};
