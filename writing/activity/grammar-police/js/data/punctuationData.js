export const PP_EXPLANATIONS = [
  {
    caseNum: "01",
    title: "Questions & Statements",
    focus: "? · .",
    leftHTML: `
      <h2 class="exp-heading">Sentence Endings</h2>
      <p class="exp-intro">Every sentence needs an ending mark:</p>
      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">?</span>
        <span class="exp-eq">= <strong>question mark</strong></span>
        <p class="exp-eg">"Are you ready?" &nbsp;·&nbsp; "Where is Kemi?"</p>
      </div>
      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">.</span>
        <span class="exp-eq">= <strong>full stop</strong></span>
        <p class="exp-eg">"She is ready." &nbsp;·&nbsp; "We went home."</p>
      </div>
      <div class="exp-secret-box">
        <p class="exp-secret-title">Question words</p>
        <p class="exp-secret-body">Sentences starting with <strong>Who, What, Where, When, Why, How, Is, Are, Did, Do, Can, Will</strong> are nearly always questions.</p>
      </div>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Test
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Is the sentence <strong>asking</strong> something?<br><span class="exp-yes">Yes →</span> use <strong>?</strong></li>
          <li class="exp-step">Is the sentence <strong>telling</strong> something?<br><span class="exp-yes">Yes →</span> use <strong>.</strong></li>
        </ol>
      </div>
      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Did you eat<u>__</u>"</span> → asking → <strong>?</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"She ate pizza<u>__</u>"</span> → telling → <strong>.</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Where is my bag<u>__</u>"</span> → asking → <strong>?</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"The dog barked<u>__</u>"</span> → telling → <strong>.</strong></p>
      </div>
      <div class="exp-reminder">
        <p><strong>Tip:</strong> Read aloud. If your voice goes <em>up</em> at the end, it is usually a question.</p>
      </div>`,
  },
  {
    caseNum: "02",
    title: "Commas",
    focus: ",",
    leftHTML: `
      <h2 class="exp-heading">The Pause Mark</h2>
      <p class="exp-intro">A comma marks a short pause. Use it in two main ways:</p>
      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>between items in a list</strong></span>
        <p class="exp-eg">"I have a dog, a cat, and a fish."</p>
      </div>
      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>after an opening phrase</strong></span>
        <p class="exp-eg">"After school, we played." · "Before you eat, wash your hands."</p>
      </div>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Comma Test
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Are there <strong>items in a list</strong>?<br><span class="exp-yes">Yes →</span> put commas between them</li>
          <li class="exp-step">Does the sentence <strong>start with a phrase</strong> (time / place / if / after / before)?<br><span class="exp-yes">Yes →</span> put a comma after it</li>
        </ol>
      </div>
      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"I like apples<u>__</u> pears<u>__</u> and mangoes."</span><br>→ list → <strong>, ,</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"After the rain<u>__</u> the sun came out."</span><br>→ opening phrase → <strong>,</strong></p>
      </div>
      <div class="exp-reminder">
        <p><strong>Note:</strong> No comma is needed before "and" when there are only <em>two</em> items.</p>
        <p style="margin-top:0.2rem">"I have a dog and a cat." ← no comma needed</p>
      </div>`,
  },
  {
    caseNum: "03",
    title: "Mixed Punctuation",
    focus: "? · . · ,",
    leftHTML: `
      <h2 class="exp-heading">All Three Together</h2>
      <p class="exp-intro">A quick reminder of all three marks:</p>
      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">?</span>
        <span class="exp-eq">= <strong>asking</strong></span>
        <p class="exp-eg">"Where are you going?"</p>
      </div>
      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">.</span>
        <span class="exp-eq">= <strong>telling / statement</strong></span>
        <p class="exp-eg">"She went to school."</p>
      </div>
      <div class="exp-word-block exp-word-block--green">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>pause (list or opening phrase)</strong></span>
        <p class="exp-eg">"After class, we ate rice, beans, and stew."</p>
      </div>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The 3-Step Check
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Is it a <strong>question</strong>? → <strong>?</strong></li>
          <li class="exp-step">End of a <strong>statement</strong>? → <strong>.</strong></li>
          <li class="exp-step"><strong>List</strong> or <strong>opening phrase</strong>? → <strong>,</strong></li>
        </ol>
      </div>
      <div class="exp-pairs-grid">
        <div class="exp-pair"><span class="exp-pair-a">?</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">question</span></div>
        <div class="exp-pair"><span class="exp-pair-a">.</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">statement</span></div>
        <div class="exp-pair"><span class="exp-pair-a">,</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">list / pause</span></div>
      </div>
      <div class="exp-reminder">
        <p><strong>Top tip:</strong> Read the sentence aloud. A <em>pause inside</em> = comma. Voice <em>goes up at end</em> = question mark. Voice <em>stops at end</em> = full stop.</p>
      </div>`,
  },
];

export const PP_EXERCISES = [
  {
    id: "ex1",
    title: "Questions & Statements",
    focus: "? · .",
    pool: ["?", "."],
    items: [
      ["Is the sky blue", { correct: "?" }],
      ["She packed her school bag", { correct: "." }],
      ["Can you hear that noise", { correct: "?" }],
      ["The mango tree is very tall", { correct: "." }],
      ["Did you finish your supper", { correct: "?" }],
      ["Kemi walked home from school", { correct: "." }],
      ["Where is your homework", { correct: "?" }],
      ["The match started at three o'clock", { correct: "." }],
      ["Are you coming to the party", { correct: "?" }],
      ["We ate rice and stew for lunch", { correct: "." }],
      ["Who left the door open", { correct: "?" }],
      ["The market was very busy today", { correct: "." }],
    ],
  },
  {
    id: "ex2",
    title: "Commas in Lists & Phrases",
    focus: ",",
    pool: [","],
    items: [
      [
        "I like football",
        { correct: "," },
        " basketball",
        { correct: "," },
        " and athletics.",
      ],
      ["After school", { correct: "," }, " we went to the playground."],
      [
        "She is kind",
        { correct: "," },
        " clever",
        { correct: "," },
        " and hardworking.",
      ],
      ["Before you sleep", { correct: "," }, " brush your teeth."],
      [
        "We visited Lagos",
        { correct: "," },
        " Abuja",
        { correct: "," },
        " and Enugu.",
      ],
      [
        "He bought bread",
        { correct: "," },
        " eggs",
        { correct: "," },
        " and milk.",
      ],
      ["On Fridays", { correct: "," }, " we wear our school uniforms."],
      [
        "Her bag had books",
        { correct: "," },
        " pencils",
        { correct: "," },
        " and a ruler.",
      ],
      ["If it rains", { correct: "," }, " we will have class inside."],
      [
        "He ran fast",
        { correct: "," },
        " jumped high",
        { correct: "," },
        " and won the race.",
      ],
    ],
  },
  {
    id: "ex3",
    title: "Mixed Punctuation",
    focus: "? · . · ,",
    pool: ["?", ".", ","],
    items: [
      ["Did you eat breakfast", { correct: "?" }],
      ["The cat sat on the mat", { correct: "." }],
      [
        "I packed my books",
        { correct: "," },
        " my lunch",
        { correct: "," },
        " and my water bottle",
        { correct: "." },
      ],
      ["Where is the library", { correct: "?" }],
      [
        "After the game",
        { correct: "," },
        " we drank cold water",
        { correct: "." },
      ],
      [
        "She reads",
        { correct: "," },
        " writes",
        { correct: "," },
        " and draws every day",
        { correct: "." },
      ],
      ["Can you help me with this", { correct: "?" }],
      ["The sun set behind the hills", { correct: "." }],
      [
        "Before leaving",
        { correct: "," },
        " check that the lights are off",
        { correct: "." },
      ],
      ["Who is your favourite teacher", { correct: "?" }],
      [
        "He is funny",
        { correct: "," },
        " kind",
        { correct: "," },
        " and always helpful",
        { correct: "." },
      ],
      ["We finished all our work", { correct: "." }],
    ],
  },
];
