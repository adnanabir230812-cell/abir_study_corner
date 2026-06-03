const { Question } = require('../models');

(async () => {
  try {
    const q = await Question.findByPk(123);
    if (q) {
      q.answerText = `## Answer

### Comparison: Disease Triangle, Disease Tetrahedron, and Disease Pyramid

| Concept | Components / Dimensions | Core Description & Meaning |
| :--- | :--- | :--- |
| **Disease Triangle** | 3 Components:<br>1. Susceptible Host<br>2. Virulent Pathogen<br>3. Favorable Environment | Represents the interaction of three essential factors. If any of these three components is zero or absent, no disease can occur. The area of the triangle represents the amount/severity of disease. |
| **Disease Tetrahedron** | 4 Components:<br>1. Host<br>2. Pathogen<br>3. Environment<br>4. **Time** | Adds the fourth dimension of **Time**. Time represents when and for how long the favorable conditions exist, which is critical for epidemic progression (e.g., incubation period, rate of reproduction). |
| **Disease Pyramid** | 5 Components:<br>1. Host<br>2. Pathogen<br>3. Environment<br>4. Time<br>5. **Human Influence** | Adds the fifth component of **Human Influence**. Humans influence the severity of plant disease through cultural practices, breeding resistant varieties, fungicide application, global transport of pathogens, etc. |

### Diagram Guidelines for Drawing:
* **Disease Triangle:** Draw a flat triangle. Label the three corners/sides as **Host (susceptible)**, **Pathogen (virulent)**, and **Environment (favorable)**. Write **Disease** in the center.
* **Disease Tetrahedron:** Draw a three-sided pyramid (tetrahedron) with a triangular base. Label the four vertices as **Host**, **Pathogen**, **Environment**, and **Time**.
* **Disease Pyramid:** Draw a four-sided pyramid (pentahedron) with a square base. Label the five vertices as **Host**, **Pathogen**, **Environment**, **Time**, and **Human**.`;
      await q.save();
      console.log('Successfully updated Question 123 with table and bullet formatting!');
    } else {
      console.log('Question 123 not found in the database.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
