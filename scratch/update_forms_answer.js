const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    secB.Topics.forEach(t => {
      if (t.Questions) {
        t.Questions.forEach(q => {
          if (q.questionText.includes('Illustrate different forms')) {
            console.log(`Updating QID ${q.id}: ${q.questionText}`);
            q.answerText = `Crop association is the simultaneous production of a number of crops at the same time in the same farming area to maximize the synergies and biological interactions among them.

The different forms of intercropping are:
* Parallel Cropping: Two crops are selected which have different growth habits and zero competition, allowing both of them to express their full yield potential.
  * Example: Black gram with maize.
* Companion Cropping: The yield of one crop is affected by the other.
  * Example: Mustard with sugarcane.
* Multistoreyed Cropping: Growing of plants of different heights in the same field at the same time.
  * Example: Mustard, potato etc. with sugarcane.
* Synergetic Cropping: When the yield of both crops grown together are found to be higher than their yield of pure crops on a unit area basis.
  * Example: Sugarcane + potato, or Legume + non-legume etc.`;
          }
        });
      }
    });
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("Successfully updated database.json!");
