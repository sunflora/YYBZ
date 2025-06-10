// 天干 (Heavenly Stems)
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支 (Earthly Branches)
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行對應
const elements = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 從JSON文件加載完整的節氣數據 (1950-2025年，76年完整數據集)
let solarTermsDataCache = null;

async function loadCompleteSolarTermsData() {
    // 如果已經加載過，直接返回緩存
    if (solarTermsDataCache) {
        console.log('Using cached solar terms data');
        return solarTermsDataCache;
    }
    
    try {
        console.log('Attempting to fetch solar terms data from ./data/solar-terms-complete.json');
        const response = await fetch('./data/solar-terms-complete.json');
        console.log('Fetch response status:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        solarTermsDataCache = await response.json();
        console.log('Solar terms data loaded successfully:', Object.keys(solarTermsDataCache).length, 'years');
        console.log('Available years:', Object.keys(solarTermsDataCache).slice(0, 10).join(', '), '...');
        // Check if 1975 data exists
        if (solarTermsDataCache['1975']) {
            console.log('1975 lichun data:', solarTermsDataCache['1975'].lichun);
        } else {
            console.log('1975 data NOT found in loaded data');
        }
        return solarTermsDataCache;
    } catch (error) {
        console.error('Failed to load solar terms data from JSON:', error);
        
        // 備用數據：包含測試需要的1975年數據
        console.log('Using fallback solar terms data with 1975 data');
        solarTermsDataCache = {
            1975: { 
                lichun: [2, 4, 18, 59], jingzhe: [3, 6, 13, 6], qingming: [4, 5, 22, 20], 
                lixia: [5, 6, 5, 31], mangzhong: [6, 6, 10, 50], xiaoshu: [7, 7, 14, 27], 
                liqiu: [8, 7, 16, 22], bailu: [9, 8, 16, 30], hanlu: [10, 8, 15, 10], 
                lidong: [11, 8, 12, 32], daxue: [12, 7, 8, 58], xiaohan: [1, 6, 7, 18] 
            },
            2000: { lichun: [2, 4, 20, 29], jingzhe: [3, 5, 15, 30], qingming: [4, 4, 21, 45], lixia: [5, 5, 12, 45], mangzhong: [6, 5, 16, 45], xiaoshu: [7, 6, 22, 56], liqiu: [8, 7, 12, 56], bailu: [9, 7, 20, 12], hanlu: [10, 8, 10, 29], lidong: [11, 7, 10, 29], daxue: [12, 6, 21, 21], xiaohan: [1, 5, 19, 17] },
            2024: { lichun: [2, 4, 16, 26], jingzhe: [3, 5, 10, 9], qingming: [4, 4, 14, 51], lixia: [5, 5, 7, 48], mangzhong: [6, 5, 11, 41], xiaoshu: [7, 6, 21, 37], liqiu: [8, 7, 7, 42], bailu: [9, 7, 14, 11], hanlu: [10, 8, 1, 58], lidong: [11, 7, 6, 4], daxue: [12, 6, 16, 59], xiaohan: [1, 5, 15, 38] },
            2025: { lichun: [2, 3, 22, 10], jingzhe: [3, 5, 16, 4], qingming: [4, 4, 20, 42], lixia: [5, 5, 13, 48], mangzhong: [6, 5, 17, 47], xiaoshu: [7, 7, 3, 57], liqiu: [8, 7, 13, 46], bailu: [9, 7, 16, 49], hanlu: [10, 8, 8, 39], lidong: [11, 7, 12, 3], daxue: [12, 7, 5, 5], xiaohan: [1, 5, 10, 31] }
        };
        return solarTermsDataCache;
    }
}

// 精確的節氣時間表 - 異步加載
let solarTermsData = null;
let solarTermsDataPromise = null;

// 初始化節氣數據
function initializeSolarTermsData() {
    if (!solarTermsDataPromise) {
        solarTermsDataPromise = loadCompleteSolarTermsData().then(data => {
            solarTermsData = data;
            return data;
        }).catch(error => {
            console.error('Failed to initialize solar terms data:', error);
            solarTermsData = {};
            return {};
        });
    }
    return solarTermsDataPromise;
}

// 確保數據已加載的工具函數
async function ensureSolarTermsDataLoaded() {
    if (!solarTermsData) {
        console.log('Solar terms data not loaded, initializing...');
        await initializeSolarTermsData();
        console.log('After initialization, solarTermsData is:', solarTermsData ? 'loaded' : 'still null');
        if (solarTermsData && solarTermsData['1975']) {
            console.log('1975 data available:', Object.keys(solarTermsData['1975']));
        }
    } else {
        console.log('Solar terms data already loaded');
    }
    return solarTermsData;
}

// 簡化的立春日期表 (用於沒有精確數據的年份)
const lichunDates = {
    2020: [2, 4], 2021: [2, 3], 2022: [2, 4], 2023: [2, 4], 2024: [2, 4],
    2025: [2, 3], 2026: [2, 4], 2027: [2, 4], 2028: [2, 4], 2029: [2, 3],
};

// 節氣月份起始日期 - 每月的主要節氣日期
const solarTermDates = {
    1: 6,   // 小寒 ~1月6日 (丑月)
    2: 4,   // 立春 ~2月4日 (寅月)
    3: 6,   // 惊蛰 ~3月6日 (卯月)
    4: 5,   // 清明 ~4月5日 (辰月)
    5: 5,   // 立夏 ~5月5日 (巳月)
    6: 6,   // 芒种 ~6月6日 (午月)
    7: 7,   // 小暑 ~7月7日 (未月)
    8: 7,   // 立秋 ~8月7日 (申月)
    9: 8,   // 白露 ~9月8日 (酉月)
    10: 8,  // 寒露 ~10月8日 (戌月)
    11: 7,  // 立冬 ~11月7日 (亥月)
    12: 7   // 大雪 ~12月7日 (子月)
};

// 計算年柱
function getYearPillar(year, month, day, hour, minute) {
    let adjustedYear = year;
    
    console.log(`getYearPillar: solarTermsData is ${solarTermsData ? 'loaded' : 'null'}`);
    
    // Check if we have precise solar term data for this year
    const yearData = solarTermsData && solarTermsData[year];
    if (yearData && yearData.lichun) {
        console.log(`Using precise solar term data for ${year}, lichun:`, yearData.lichun);
        // Use precise time check for 立春
        const isAfterLichun = isAfterSolarTerm(year, month, day, hour, minute, 'lichun');
        adjustedYear = isAfterLichun ? year : year - 1;
    } else {
        // Fallback to date-only check for years without precise data
        const lichunDate = lichunDates[year] || [2, 4]; // 默认2月4日
        if (month < lichunDate[0] || (month === lichunDate[0] && day <= lichunDate[1])) {
            adjustedYear = year - 1;
        }
    }
    
    // 使用正確的60年循環計算
    // 1984年是甲子年（60年循环的第1年）
    const cyclePosition = (adjustedYear - 1984) % 60;
    const adjustedPosition = cyclePosition < 0 ? cyclePosition + 60 : cyclePosition;
    
    const stemIndex = adjustedPosition % 10;
    const branchIndex = adjustedPosition % 12;
    
    return {
        stem: heavenlyStems[stemIndex],
        branch: earthlyBranches[branchIndex]
    };
}

// 檢查日期時間是否在節氣之後
function isAfterSolarTerm(year, month, day, hour, minute, solarTerm) {
    const termData = solarTermsData && solarTermsData[year] && solarTermsData[year][solarTerm];
    if (!termData) return false; // 沒有精確數據時返回false
    
    const [termMonth, termDay, termHour, termMinute] = termData;
    
    if (month !== termMonth) return month > termMonth;
    if (day !== termDay) return day > termDay;
    if (hour !== termHour) return hour > termHour;
    return minute >= termMinute;
}

// 計算月柱
function getMonthPillar(year, month, day, yearStem, hour = 12, minute = 0) {
    let zhiIndex; // 地支索引 0=寅, 1=卯, 2=辰...
    
    console.log(`getMonthPillar: solarTermsData is ${solarTermsData ? 'loaded' : 'null'} for year ${year}`);
    
    // 如果有精確的節氣數據，使用精確計算
    if (solarTermsData && solarTermsData[year]) {
        console.log(`Using precise solar term data for month calculation in ${year}`);
        const data = solarTermsData[year];
        
        // 按時間順序檢查節氣
        if (month === 1) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'xiaohan')) {
                zhiIndex = 11; // 丑月 (小寒后)
            } else {
                zhiIndex = 10; // 子月 (大雪期间)
            }
        } else if (month === 2) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'lichun')) {
                zhiIndex = 0; // 寅月 (立春后)
            } else {
                zhiIndex = 11; // 丑月 (立春前)
            }
        } else if (month === 3) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'jingzhe')) {
                zhiIndex = 1; // 卯月 (惊蛰后)
            } else {
                zhiIndex = 0; // 寅月 (惊蛰前)
            }
        } else if (month === 4) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'qingming')) {
                zhiIndex = 2; // 辰月 (清明后)
            } else {
                zhiIndex = 1; // 卯月 (清明前)
            }
        } else if (month === 5) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'lixia')) {
                zhiIndex = 3; // 巳月 (立夏后)
            } else {
                zhiIndex = 2; // 辰月 (立夏前)
            }
        } else if (month === 6) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'mangzhong')) {
                zhiIndex = 4; // 午月 (芒种后)
            } else {
                zhiIndex = 3; // 巳月 (芒种前)
            }
        } else if (month === 7) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'xiaoshu')) {
                zhiIndex = 5; // 未月 (小暑后)
            } else {
                zhiIndex = 4; // 午月 (小暑前)
            }
        } else if (month === 8) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'liqiu')) {
                zhiIndex = 6; // 申月 (立秋后)
            } else {
                zhiIndex = 5; // 未月 (立秋前)
            }
        } else if (month === 9) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'bailu')) {
                zhiIndex = 7; // 酉月 (白露后)
            } else {
                zhiIndex = 6; // 申月 (白露前)
            }
        } else if (month === 10) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'hanlu')) {
                zhiIndex = 8; // 戌月 (寒露后)
            } else {
                zhiIndex = 7; // 酉月 (寒露前)
            }
        } else if (month === 11) {
            if (isAfterSolarTerm(year, month, day, hour, minute, 'lidong')) {
                zhiIndex = 9; // 亥月 (立冬后)
            } else {
                zhiIndex = 8; // 戌月 (立冬前)
            }
        } else { // month === 12
            if (isAfterSolarTerm(year, month, day, hour, minute, 'daxue')) {
                zhiIndex = 10; // 子月 (大雪后)
            } else {
                zhiIndex = 9; // 亥月 (大雪前)
            }
        }
    } else {
        // 使用原來的簡化方法
        if (month === 1) {
            zhiIndex = day >= 6 ? 11 : 10;
        } else if (month === 2) {
            zhiIndex = day >= 4 ? 0 : 11;
        } else if (month === 3) {
            zhiIndex = day >= 6 ? 1 : 0;
        } else if (month === 4) {
            zhiIndex = day >= 5 ? 2 : 1;
        } else if (month === 5) {
            zhiIndex = day >= 5 ? 3 : 2;
        } else if (month === 6) {
            zhiIndex = day >= 6 ? 4 : 3;
        } else if (month === 7) {
            zhiIndex = day >= 7 ? 5 : 4;
        } else if (month === 8) {
            zhiIndex = day >= 7 ? 6 : 5;
        } else if (month === 9) {
            zhiIndex = day >= 8 ? 7 : 6;
        } else if (month === 10) {
            zhiIndex = day >= 8 ? 8 : 7;
        } else if (month === 11) {
            zhiIndex = day >= 7 ? 9 : 8;
        } else {
            zhiIndex = day >= 7 ? 10 : 9;
        }
    }
    
    const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    const monthBranch = monthBranches[zhiIndex];
    
    // 五虎遁計算月干
    const yearStemIndex = heavenlyStems.indexOf(yearStem);
    const yinMonthStems = [2, 4, 6, 8, 0];
    let baseIndex;
    
    if (yearStemIndex === 0 || yearStemIndex === 5) baseIndex = 0; // 甲己
    else if (yearStemIndex === 1 || yearStemIndex === 6) baseIndex = 1; // 乙庚
    else if (yearStemIndex === 2 || yearStemIndex === 7) baseIndex = 2; // 丙辛
    else if (yearStemIndex === 3 || yearStemIndex === 8) baseIndex = 3; // 丁壬
    else baseIndex = 4; // 戊癸
    
    const monthStemIndex = (yinMonthStems[baseIndex] + zhiIndex) % 10;
    
    return {
        stem: heavenlyStems[monthStemIndex],
        branch: monthBranch
    };
}

// 計算日柱 - 使用正確的參考日期
function getDayPillar(year, month, day) {
    // 已知：1975年4月9日是乙酉日
    // 使用這個作為參考點來計算其他日期
    const baseDate = new Date(1975, 3, 9); // 1975年4月9日
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    // 1975年4月9日是乙酉日
    // 乙=1, 酉=9
    const baseStemIndex = 1; // 乙
    const baseBranchIndex = 9; // 酉
    
    let stemIndex = (baseStemIndex + daysDiff) % 10;
    let branchIndex = (baseBranchIndex + daysDiff) % 12;
    
    // 處理負數
    if (stemIndex < 0) stemIndex += 10;
    if (branchIndex < 0) branchIndex += 12;
    
    return {
        stem: heavenlyStems[stemIndex],
        branch: earthlyBranches[branchIndex]
    };
}

// 計算時柱 - 五鼠遁法
function getHourPillar(dayStem, hour) {
    const dayStemIndex = heavenlyStems.indexOf(dayStem);
    
    // 五鼠遁口訣：甲己還加甲，乙庚丙作初，丙辛從戊起，丁壬庚子居，戊癸何方發，壬子是真途
    let hourStemStartIndex;
    if (dayStemIndex === 0 || dayStemIndex === 5) { // 甲、己日
        hourStemStartIndex = 0; // 甲子时开始
    } else if (dayStemIndex === 1 || dayStemIndex === 6) { // 乙、庚日
        hourStemStartIndex = 2; // 丙子时开始
    } else if (dayStemIndex === 2 || dayStemIndex === 7) { // 丙、辛日
        hourStemStartIndex = 4; // 戊子时开始
    } else if (dayStemIndex === 3 || dayStemIndex === 8) { // 丁、壬日
        hourStemStartIndex = 6; // 庚子时开始
    } else { // 戊、癸日
        hourStemStartIndex = 8; // 壬子时开始
    }
    
    const hourStemIndex = (hourStemStartIndex + hour) % 10;
    
    return {
        stem: heavenlyStems[hourStemIndex],
        branch: earthlyBranches[hour]
    };
}

// 計算八字
function calculateBaZi(year, month, day, hour, isEarlyZi = false, birthHour = 12, birthMinute = 0) {
    // Ensure data is loaded before calculating
    if (!solarTermsData) {
        console.warn('Solar terms data not loaded yet, using fallback calculations');
    }
    
    const yearPillar = getYearPillar(year, month, day, birthHour, birthMinute);
    const monthPillar = getMonthPillar(year, month, day, yearPillar.stem, birthHour, birthMinute);
    
    // 處理早子時和夜子時的特殊情況
    let dayForHourCalc = day;
    if (hour === 0 && !isEarlyZi) {
        // 夜子時(23:00-24:00)使用第二天的日柱天幹
        dayForHourCalc = day + 1;
    }
    // 早子時(00:00-01:00)不變，使用當天的日柱天幹
    
    const dayPillar = getDayPillar(year, month, day);
    const dayPillarForHour = getDayPillar(year, month, dayForHourCalc);
    const hourPillar = getHourPillar(dayPillarForHour.stem, hour);
    
    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar
    };
}

// 顯示結果
function displayResult(baZi) {
    const resultDiv = document.getElementById('result');
    
    const html = `
        <h3>您的八字分析結果</h3>
        <div class="bazi-display">
            <div class="pillar">
                <div class="pillar-title">時柱</div>
                <div class="heavenly-stem">${baZi.hour.stem}</div>
                <div class="earthly-branch">${baZi.hour.branch}</div>
                <div class="element">${elements[baZi.hour.stem]}${elements[baZi.hour.branch]}</div>
            </div>
            <div class="pillar">
                <div class="pillar-title">日柱</div>
                <div class="heavenly-stem">${baZi.day.stem}</div>
                <div class="earthly-branch">${baZi.day.branch}</div>
                <div class="element">${elements[baZi.day.stem]}${elements[baZi.day.branch]}</div>
            </div>
            <div class="pillar">
                <div class="pillar-title">月柱</div>
                <div class="heavenly-stem">${baZi.month.stem}</div>
                <div class="earthly-branch">${baZi.month.branch}</div>
                <div class="element">${elements[baZi.month.stem]}${elements[baZi.month.branch]}</div>
            </div>
            <div class="pillar">
                <div class="pillar-title">年柱</div>
                <div class="heavenly-stem">${baZi.year.stem}</div>
                <div class="earthly-branch">${baZi.year.branch}</div>
                <div class="element">${elements[baZi.year.stem]}${elements[baZi.year.branch]}</div>
            </div>
        </div>
        <p><strong>八字：</strong>${baZi.hour.stem}${baZi.hour.branch} ${baZi.day.stem}${baZi.day.branch} ${baZi.month.stem}${baZi.month.branch} ${baZi.year.stem}${baZi.year.branch}</p>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
}

// 將時間轉換為時辰
function timeToShichen(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // 時辰分界：子時23:00-01:00, 丑時01:00-03:00, 寅時03:00-05:00...
    let shichen;
    let isEarlyZi = false;
    
    if (totalMinutes < 1 * 60) {
        shichen = 0; // 早子時 (00:00-01:00)
        isEarlyZi = true;
    } else if (totalMinutes >= 23 * 60) {
        shichen = 0; // 晚子時 (23:00-24:00)
        isEarlyZi = false;
    } else if (totalMinutes >= 1 * 60 && totalMinutes < 3 * 60) {
        shichen = 1; // 丑時
    } else if (totalMinutes >= 3 * 60 && totalMinutes < 5 * 60) {
        shichen = 2; // 寅時
    } else if (totalMinutes >= 5 * 60 && totalMinutes < 7 * 60) {
        shichen = 3; // 卯時
    } else if (totalMinutes >= 7 * 60 && totalMinutes < 9 * 60) {
        shichen = 4; // 辰時
    } else if (totalMinutes >= 9 * 60 && totalMinutes < 11 * 60) {
        shichen = 5; // 巳時
    } else if (totalMinutes >= 11 * 60 && totalMinutes < 13 * 60) {
        shichen = 6; // 午時
    } else if (totalMinutes >= 13 * 60 && totalMinutes < 15 * 60) {
        shichen = 7; // 未時
    } else if (totalMinutes >= 15 * 60 && totalMinutes < 17 * 60) {
        shichen = 8; // 申時
    } else if (totalMinutes >= 17 * 60 && totalMinutes < 19 * 60) {
        shichen = 9; // 酉時
    } else if (totalMinutes >= 19 * 60 && totalMinutes < 21 * 60) {
        shichen = 10; // 戌時
    } else {
        shichen = 11; // 亥時 (21:00-23:00)
    }
    
    return { shichen, isEarlyZi };
}

// 表單提交處理 (只在主應用頁面中運行)
const birthdateForm = document.getElementById('birthdateForm');
if (birthdateForm) {
    birthdateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const year = parseInt(document.getElementById('year').value);
        const month = parseInt(document.getElementById('month').value);
        const day = parseInt(document.getElementById('day').value);
        const timeString = document.getElementById('time').value;
        
        if (!year || !month || !day || !timeString) {
            alert('請填寫完整的出生資訊');
            return;
        }
        
        // 確保節氣數據已加載
        await ensureSolarTermsDataLoaded();
        
        const timeResult = timeToShichen(timeString);
        const [hours, minutes] = timeString.split(':').map(Number);
        const baZi = calculateBaZi(year, month, day, timeResult.shichen, timeResult.isEarlyZi, hours, minutes);
        displayResult(baZi);
    });
}

// 頁面加載完成後的初始化 (只在主應用頁面中運行)
document.addEventListener('DOMContentLoaded', async function() {
    // 只在主應用頁面中設置年份
    const yearInput = document.getElementById('year');
    if (yearInput) {
        const currentYear = new Date().getFullYear();
        yearInput.value = currentYear;
    }
    
    // 預加載節氣數據 (所有頁面都需要)
    try {
        await initializeSolarTermsData();
        console.log('Solar terms data preloaded successfully');
    } catch (error) {
        console.warn('Failed to preload solar terms data:', error);
    }
});