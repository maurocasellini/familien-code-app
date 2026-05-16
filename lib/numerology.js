// lib/numerology.js
export const PYTH = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8}
const VOWELS = new Set(['A','E','I','O','U'])
export function reduce(n){if(n===11||n===22||n===33)return n;if(n<10)return n;return reduce([...String(n)].reduce((a,d)=>a+parseInt(d),0))}
export function letterVal(ch){return PYTH[ch.toUpperCase()]||0}
export function lifeNumber(day,month,year){const digits=(String(day)+String(month)+String(year)).split('').map(Number);return reduce(digits.reduce((a,b)=>a+b,0))}
export function soulUrge(name){const l=name.toUpperCase().replace(/[^A-Z]/g,'').split('');return reduce(l.filter(c=>VOWELS.has(c)).map(letterVal).reduce((a,b)=>a+b,0))}
export function personality(name){const l=name.toUpperCase().replace(/[^A-Z]/g,'').split('');return reduce(l.filter(c=>!VOWELS.has(c)).map(letterVal).reduce((a,b)=>a+b,0))}
export function expression(name){return reduce(name.toUpperCase().replace(/[^A-Z]/g,'').split('').map(letterVal).reduce((a,b)=>a+b,0))}
export function personalYear(day,month,targetYear){const y=[...String(targetYear)].reduce((a,d)=>a+parseInt(d),0);return reduce(parseInt(day)+parseInt(month)+y)}
export function dateCode(day,month,year){const digits=(String(day)+String(month)+String(year)).split('').map(Number);return reduce(digits.reduce((a,b)=>a+b,0))}
export function sunSign(day,month){const d=parseInt(day),m=parseInt(month);if((m===3&&d>=21)||(m===4&&d<=19))return'Widder';if((m===4&&d>=20)||(m===5&&d<=20))return'Stier';if((m===5&&d>=21)||(m===6&&d<=20))return'Zwillinge';if((m===6&&d>=21)||(m===7&&d<=22))return'Krebs';if((m===7&&d>=23)||(m===8&&d<=22))return'Löwe';if((m===8&&d>=23)||(m===9&&d<=22))return'Jungfrau';if((m===9&&d>=23)||(m===10&&d<=22))return'Waage';if((m===10&&d>=23)||(m===11&&d<=21))return'Skorpion';if((m===11&&d>=22)||(m===12&&d<=21))return'Schütze';if((m===12&&d>=22)||(m===1&&d<=19))return'Steinbock';if((m===1&&d>=20)||(m===2&&d<=18))return'Wassermann';return'Fische'}
export function calcPerson(p){if(!p.firstName||!p.day)return null;const fullName=p.firstName+' '+p.lastName;return{lz:lifeNumber(p.day,p.month,p.year),soul:soulUrge(fullName),pers:personality(fullName),expr:expression(fullName),py25:personalYear(p.day,p.month,2025),py26:personalYear(p.day,p.month,2026),sun:p.day&&p.month?sunSign(p.day,p.month):null}}
export function isMaster(n){return n===11||n===22||n===33}
export function formatLZ(n){if(n===11)return'11/2';if(n===22)return'22/4';if(n===33)return'33/6';return String(n)}