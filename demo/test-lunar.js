import { lunar2solar } from 'lunar-lite';

console.log('=== 演示为什么需要闰月参数 ===\n');

// 1990年有闰五月
console.log('1990年五月初十(普通月):', lunar2solar('1990-5-10', false).toString());
console.log('1990年五月初十(闰月):', lunar2solar('1990-5-10', true).toString());

console.log('\n');

// 2023年有闰二月
console.log('2023年二月十五(普通月):', lunar2solar('2023-2-15', false).toString());
console.log('2023年二月十五(闰月):', lunar2solar('2023-2-15', true).toString());

console.log('\n结论: 同一个农历日期,根据是否为闰月,会转换为不同的阳历日期!');
