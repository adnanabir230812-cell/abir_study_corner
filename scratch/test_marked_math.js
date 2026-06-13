const { marked } = require('marked');

const input1 = 'Red-absorbing $P_r$ and Far-Red-absorbing $P_{fr}$';
const input2 = 'Red-absorbing $P\\_r$ and Far-Red-absorbing $P\\_{fr}$';
const input3 = 'Red-absorbing \\$P_r\\$ and Far-Red-absorbing \\$P_{fr}\\$';
const input4 = 'Red-absorbing `$P_r$` and Far-Red-absorbing `$P_{fr}$`';

console.log('Input 1 (Raw):');
console.log(marked.parse(input1));

console.log('Input 2 (Escaped Underscores):');
console.log(marked.parse(input2));

console.log('Input 3 (Escaped Dollars):');
console.log(marked.parse(input3));

console.log('Input 4 (Code spans):');
console.log(marked.parse(input4));
