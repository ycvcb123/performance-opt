// 指标评分等级
const scoreLevel = ['good', 'needtoimprove', 'poor'];

// 指标区间档位 (lighthouse) 区间数据来源 -- https://web.dev/performance-scoring/
const indicatorInterval = {
    FCP: [1800, 3000],
    SI: [3400, 5800],
    LCP: [2500, 4000],
    TTI: [3900, 7300],
    TBT: [200, 600],
    CLS: [0.1, 0.25],
    FID: [100, 300],
};

// 映射转换关系
const indicatorMap = {
    'first-contentful-paint': 'FCP', 
    'largest-contentful-paint': 'LCP', 
    'speed-index': 'SI', 
    'total-blocking-time': 'TBT', 
    'cumulative-layout-shift': 'CLS', 
    'time-to-interactive': 'TTI', 
    'estimated-input-latency': 'FID',
    '输入延迟（估算值）': 'FID'
}


// lighthouse 性能总评分区间 -- https://web.dev/performance-scoring/
const performanceInterval = [49, 50, 89, 90];


const getIndicatorScore = ( type, data ) => {
    console.log('type', type,'data', data)
    const score = indicatorInterval[type];
    
    for (let i = 0; i < score.length; i++) {
        if (data <= score[i]) return scoreLevel[i];
    }

    return scoreLevel[2];
};


module.exports = {
    scoreLevel,
    indicatorInterval,
    performanceInterval,
    indicatorMap,
    getIndicatorScore
};

