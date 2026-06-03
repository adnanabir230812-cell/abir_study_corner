const { marked } = require('marked');

marked.setOptions({
  breaks: true,
  gfm: true
});

const answerText = `## Answer

### Necrotrophs (Facultative parasites) — Biochemical and morphological features:
* Host cell rapidly killed
* Toxins and cytolytic enzymes produced
* No special parasitic structures formed
* Host penetration via wounds or natural openings
### Ecological features:
* Wide host range
* Able to grow saprophytically away from the host
* Attack juvenile, debilitated or senescing tissues`;

const parsed = marked.parse(answerText);
console.log('--- PARSED HTML ---');
console.log(parsed);
