const { Question } = require('../models');

(async () => {
  try {
    const q = await Question.findByPk(99);
    if (q) {
      q.answerText = `## Answer

A parasite is not necessarily a pathogen, and a pathogen is not necessarily a parasite. The relationship between parasitism and pathogenicity is not absolute.

### 1. Parasites without Pathogenicity
Some organisms are biological parasites but do not cause disease. For example, **mycorrhizae** or **root nodule bacteria** derive nutrients from the host plant but do not harm it, instead engaging in a highly beneficial mutualistic relationship.

### 2. Pathogens without Parasitism
Conversely, some pathogens can cause severe plant disease without being true active parasites. They may act from the outside through lethal secreted **toxins** or cell-wall degrading enzymes without living on or inside the host tissue.

**Conclusion:**
Therefore, while all pathogens interact with the host in a parasitic manner to extract nutrients, the clinical manifestation of disease (pathogenicity) is not a requirement for all parasitic relationships.`;
      await q.save();
      console.log('Successfully reformatted Question 99 into a high-quality explanation layout!');
    } else {
      console.log('Question 99 not found');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
