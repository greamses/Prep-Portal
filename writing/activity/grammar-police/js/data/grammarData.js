export const WORD_GROUPS = {
  theyre: {
    options: ["they're", "their", "there"],
    label: "they're / their / there",
  },
  were: {
    options: ["we're", "were", "where"],
    label: "we're / were / where",
  },
  youre: {
    options: ["you're", "your"],
    label: "you're / your",
  },
  its: {
    options: ["it's", "its"],
    label: "it's / its",
  },
};

export const EXPLANATIONS = [
  {
    caseNum: "01",
    title: "They're, Their & There",
    focus: "they're · their · there",
    leftHTML: `
      <h2 class="exp-heading">Three words, one sound!</h2>
      <p class="exp-intro">All sound like <em>"thair"</em> — different jobs:</p>
      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word">they're</span>
        <span class="exp-eq">= <strong>they are</strong></span>
        <p class="exp-eg">"<em>They're</em> going to school." (= They <u>are</u> going.)</p>
      </div>
      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word">their</span>
        <span class="exp-eq">= <strong>belongs to them</strong></span>
        <p class="exp-eg">"Pack <em>their</em> bags." (the bags belong to them)</p>
      </div>
      <div class="exp-word-block exp-word-block--green">
        <span class="exp-word">there</span>
        <span class="exp-eq">= <strong>a place</strong></span>
        <p class="exp-eg">"Wait over <em>there</em>." · "<em>There</em> are five birds."</p>
      </div>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Detective's Trick
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Can I say <strong>"they are"</strong> here?<br><span class="exp-yes">Yes →</span> use <strong>they're</strong></li>
          <li class="exp-step">Does it show something belongs to a group?<br><span class="exp-yes">Yes →</span> use <strong>their</strong></li>
          <li class="exp-step">Am I pointing to a place?<br><span class="exp-yes">Yes →</span> use <strong>there</strong></li>
        </ol>
      </div>
      <div class="exp-concept-cards">
        <div class="exp-cc exp-cc--blue">
          <img src="./images/concept-theyre.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>they're</strong>
          <span>= they are</span>
        </div>
        <div class="exp-cc exp-cc--yellow">
          <img src="./images/concept-their.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>their</strong>
          <span>= belongs to them</span>
        </div>
        <div class="exp-cc exp-cc--green">
          <img src="./images/concept-there.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>there</strong>
          <span>= a place</span>
        </div>
      </div>
      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"<u>____</u> going home."</span> → <em>They are</em> going ✓ → <strong>they're</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Pack <u>____</u> bags."</span> → belongs to them → <strong>their</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Wait over <u>____</u>."</span> → points to a place → <strong>there</strong></p>
      </div>`,
  },
  {
    caseNum: "02",
    title: "We're, Were & Where",
    focus: "we're · were · where",
    leftHTML: `
      <h2 class="exp-heading">Another tricky trio!</h2>
      <p class="exp-intro">Sound similar — different jobs:</p>
      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word">we're</span>
        <span class="exp-eq">= <strong>we are</strong></span>
        <p class="exp-eg">"<em>We're</em> excited!" (= We <u>are</u> excited!)</p>
      </div>
      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word">were</span>
        <span class="exp-eq">= <strong>past tense of "to be"</strong></span>
        <p class="exp-eg">"The children <em>were</em> happy." · "We <em>were</em> late."</p>
      </div>
      <div class="exp-word-block exp-word-block--green">
        <span class="exp-word">where</span>
        <span class="exp-eq">= <strong>a place or location</strong></span>
        <p class="exp-eg">"<em>Where</em> is the bus?" · "I know <em>where</em> she went."</p>
      </div>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Detective's Trick
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Can I say <strong>"we are"</strong> here?<br><span class="exp-yes">Yes →</span> use <strong>we're</strong></li>
          <li class="exp-step">Am I talking about something that happened <strong>in the past</strong>?<br><span class="exp-yes">Yes →</span> use <strong>were</strong></li>
          <li class="exp-step">Am I asking about or pointing to a <strong>place</strong>?<br><span class="exp-yes">Yes →</span> use <strong>where</strong></li>
        </ol>
      </div>
      <div class="exp-concept-cards">
        <div class="exp-cc exp-cc--blue">
          <img src="./images/concept-weare.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>we're</strong>
          <span>= we are</span>
        </div>
        <div class="exp-cc exp-cc--yellow">
          <img src="./images/concept-past.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>were</strong>
          <span>= in the past</span>
        </div>
        <div class="exp-cc exp-cc--green">
          <img src="./images/concept-where.svg" width="44" height="32" alt="" aria-hidden="true">
          <strong>where</strong>
          <span>= a place</span>
        </div>
      </div>
      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"<u>____</u> all going home."</span> → We <em>are</em> going ✓ → <strong>we're</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"The bags <u>____</u> heavy."</span> → past tense → <strong>were</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"<u>____</u> did you go?"</span> → asking about a place → <strong>where</strong></p>
      </div>`,
  },
  {
    caseNum: "03",
    title: "The Final Challenge",
    focus: "they're · their · there · you're · your · it's · its",
    leftHTML: `
      <h2 class="exp-heading">The apostrophe secret!</h2>
      <p class="exp-intro">One rule to spot them all:</p>
      <div class="exp-secret-box">
        <p class="exp-secret-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          The Big Secret
        </p>
        <p class="exp-secret-body">When there is an apostrophe&nbsp;(<strong>'</strong>), it means letters have been removed and two words joined together.</p>
      </div>
      <div class="exp-pairs-grid">
        <div class="exp-pair">
          <span class="exp-pair-a">they're</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">they + are</span>
        </div>
        <div class="exp-pair">
          <span class="exp-pair-a">you're</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">you + are</span>
        </div>
        <div class="exp-pair">
          <span class="exp-pair-a">it's</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">it + is</span>
        </div>
        <div class="exp-pair">
          <span class="exp-pair-a">we're</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">we + are</span>
        </div>
      </div>
      <p class="exp-rule-summary">No apostrophe = ownership: <strong>their</strong>, <strong>your</strong>, <strong>its</strong> · place/past: <strong>there</strong>, <strong>were</strong></p>`,
    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Full-Form Test
        </div>
        <p class="exp-trick-desc">Swap the word with the full form. Does the sentence still make sense?</p>
        <div class="exp-test-rows">
          <div class="exp-test-row exp-test-row--pass">
            <span>"<em>It's</em> raining."</span>
            <span>→ "It <u>is</u> raining." ✓ → use <strong>it's</strong></span>
          </div>
          <div class="exp-test-row exp-test-row--fail">
            <span>"The dog wagged <em>its</em> tail."</span>
            <span>→ "…it <u>is</u> tail." ✗ → use <strong>its</strong></span>
          </div>
          <div class="exp-test-row exp-test-row--pass">
            <span>"<em>You're</em> brilliant!"</span>
            <span>→ "You <u>are</u> brilliant!" ✓ → use <strong>you're</strong></span>
          </div>
          <div class="exp-test-row exp-test-row--fail">
            <span>"Do <em>your</em> homework."</span>
            <span>→ "Do you <u>are</u> homework." ✗ → use <strong>your</strong></span>
          </div>
        </div>
      </div>
      <div class="exp-reminder">
        <p><strong>No apostrophe = ownership:</strong></p>
        <p><strong>their</strong> (them) · <strong>your</strong> (you) · <strong>its</strong> (it)</p>
        <p><strong>there</strong> (place) · <strong>were</strong> (past)</p>
      </div>`,
  },
];

export const PASSAGES = [
  {
    id: "pass1",
    title: "The Science Museum Trip",
    focus: "they're / their / there",
    groups: ["theyre"],
    paragraphs: [
      [
        "The students in Class 5B could barely sit still. ",
        { correct: "They're", group: "theyre" },
        " going on a school trip today, and ",
        { correct: "their", group: "theyre" },
        " excitement was impossible to hide. Mrs. Okafor told them to leave ",
        { correct: "their", group: "theyre" },
        " bags by the classroom door. 'We are meeting over ",
        { correct: "there", group: "theyre" },
        " by the gate,' she said. Some children felt nervous because ",
        { correct: "they're", group: "theyre" },
        " not sure what to expect.",
      ],
      [
        "Once on the bus, ",
        { correct: "they're", group: "theyre" },
        " louder than ever. Emeka tells his friend that ",
        { correct: "their", group: "theyre" },
        " seats are near the window. 'Look over ",
        { correct: "there", group: "theyre" },
        "!' shouts Amara, pointing at a herd of goats. ",
        { correct: "They're", group: "theyre" },
        " all laughing now. The teacher checks that ",
        { correct: "their", group: "theyre" },
        " seatbelts are fastened before the bus moves off.",
      ],
      [
        "At the museum, ",
        { correct: "they're", group: "theyre" },
        " amazed by everything ",
        { correct: "they're", group: "theyre" },
        " seeing. ",
        { correct: "There", group: "theyre" },
        " are giant dinosaur bones on display. ",
        { correct: "Their", group: "theyre" },
        " size shocks the whole class. A guide explains that ",
        { correct: "their", group: "theyre" },
        " bones were buried underground for millions of years. 'Amazing — ",
        { correct: "they're", group: "theyre" },
        " still finding new fossils today!'",
      ],
      [
        "By lunchtime, ",
        { correct: "they're", group: "theyre" },
        " tired but happy. The children open ",
        { correct: "their", group: "theyre" },
        " lunchboxes and find shady spots. 'Is ",
        { correct: "there", group: "theyre" },
        " a bin nearby?' asks Temi. Emeka spots one over ",
        { correct: "there", group: "theyre" },
        " by the fountain. ",
        { correct: "They're", group: "theyre" },
        " careful to keep the area tidy before heading back.",
      ],
    ],
  },
  {
    id: "pass2",
    title: "The Beach Weekend",
    focus: "we're / were / where",
    groups: ["were"],
    paragraphs: [
      [
        "'",
        { correct: "We're", group: "were" },
        " going to the beach this Saturday!' Mum announced. The children ",
        { correct: "were", group: "were" },
        " already jumping with joy. 'But ",
        { correct: "where", group: "were" },
        " will we park?' Dad asked. They ",
        { correct: "were", group: "were" },
        " nearly late last time. 'This time ",
        { correct: "we're", group: "were" },
        " leaving at seven sharp,' said Mum.",
      ],
      [
        "The roads ",
        { correct: "were", group: "were" },
        " clear as they drove out of town. 'Do you remember ",
        { correct: "where", group: "were" },
        " we stopped for snacks last year?' asked Sade. The children ",
        { correct: "were", group: "were" },
        " already hungry. '",
        { correct: "We're", group: "were" },
        " stopping at that junction up ahead,' Dad said. Mum spotted the shop ",
        { correct: "where", group: "were" },
        " they always bought cold drinks.",
      ],
      [
        "When they arrived, the beaches ",
        { correct: "were", group: "were" },
        " already full. 'So ",
        { correct: "where", group: "were" },
        " shall we set up?' asked Dad. The children ",
        { correct: "were", group: "were" },
        " pointing in all directions. '",
        { correct: "We're", group: "were" },
        " going near those rocks!' said Tunde. But the rocks ",
        { correct: "were", group: "were" },
        " slippery, so Mum chose a spot ",
        { correct: "where", group: "were" },
        " the sand was dry.",
      ],
      [
        "'",
        { correct: "We're", group: "were" },
        " absolutely starving!' the children shouted at noon. 'I know exactly ",
        { correct: "where", group: "were" },
        " I packed the sandwiches,' said Dad. They ",
        { correct: "were", group: "were" },
        " at the bottom of the cooler bag. Everyone agreed — '",
        { correct: "We're", group: "were" },
        " coming back next month!' As they packed, nobody could recall ",
        { correct: "where", group: "were" },
        " they had parked the car.",
      ],
    ],
  },
  {
    id: "pass3",
    title: "The Good Student",
    focus: "Mixed: they're · their · there · you're · your · it's · its",
    groups: ["theyre", "youre", "its"],
    paragraphs: [
      [
        "As a student, ",
        { correct: "you're", group: "youre" },
        " always learning something new. ",
        { correct: "It's", group: "its" },
        " not just about working hard — ",
        { correct: "it's", group: "its" },
        " also about staying curious. ",
        { correct: "Your", group: "youre" },
        " attitude matters just as much as ",
        { correct: "your", group: "youre" },
        " effort in the classroom.",
      ],
      [
        "When students arrive at school, ",
        { correct: "they're", group: "theyre" },
        " often thinking about ",
        { correct: "their", group: "theyre" },
        " friends. But ",
        { correct: "there", group: "theyre" },
        " are always new things to discover if ",
        { correct: "you're", group: "youre" },
        " paying attention. '",
        { correct: "Their", group: "theyre" },
        " results improved this term,' the teacher noted, 'because ",
        { correct: "they're", group: "theyre" },
        " putting in real effort.'",
      ],
      [
        "'",
        { correct: "You're", group: "youre" },
        " all doing really well,' said Mr. Bello. '",
        { correct: "It's", group: "its" },
        " important to review ",
        { correct: "your", group: "youre" },
        " notes every evening. ",
        { correct: "There", group: "theyre" },
        " will be a test at the end of the week, and ",
        { correct: "it's", group: "its" },
        " always better to prepare as a group.'",
      ],
      [
        "At home, ",
        { correct: "it's", group: "its" },
        " easy to get distracted. '",
        { correct: "You're", group: "youre" },
        " spending too much time on that screen,' Mum warned. '",
        { correct: "Your", group: "youre" },
        " homework comes first.' ",
        { correct: "They're", group: "theyre" },
        " right. Once ",
        { correct: "you're", group: "youre" },
        " done with ",
        { correct: "your", group: "youre" },
        " work, ",
        { correct: "there", group: "theyre" },
        " is always time for fun.",
      ],
    ],
  },
];
