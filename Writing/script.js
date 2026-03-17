        /* ── CONFIGURATION ── */
        const p1 = "gsk_9sz5p";
        const p2 = "0Vrwv8chiknSBrJW";
        const p3 = "Gdyb3FYnQIifcPYSc9";
        const p4 = "Dhi1tMvB8VmAh";
        const GROQ_KEY = p1 + p2 + p3 + p4;
        const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
        
        /* ── TOPICS ── */
        const topics = [
          "Write a story ending with: '...and that was the last time I ever saw the silver key.'",
          "Discuss the advantages and disadvantages of online learning compared to traditional classrooms.",
          "Write a descriptive essay about a crowded bus station on a rainy evening.",
          "Argue for or against the complete ban of mobile phones in secondary schools.",
          "Describe an experience that significantly changed your perspective on life."
        ];
        
        /* ── DOM REFS ── */
        const elTopic = document.getElementById('topic-display');
        const elNewTopicBtn = document.getElementById('new-topic-btn');
        const elTextarea = document.getElementById('writing-area');
        const elWordCount = document.getElementById('word-count-display');
        const elSubmitBtn = document.getElementById('submit-btn');
        const elEditorSection = document.getElementById('editor-section');
        const elResultsSection = document.getElementById('results-section');
        const elLoading = document.getElementById('loading-overlay');
        const elRubricContent = document.getElementById('rubric-content');
        const elAnnotatedText = document.getElementById('annotated-text');
        const elScoreStamp = document.getElementById('score-stamp');
        const elRetryBtn = document.getElementById('retry-btn');
        const elPopover = document.getElementById('sub-popover');
        
        let currentTopic = "";
        let activeSubWord = null; // tracks which word the popover is editing
        
        /* ── INITIALIZATION ── */
        function pickTopic() {
          currentTopic = topics[Math.floor(Math.random() * topics.length)];
          elTopic.innerText = currentTopic;
        }
        
        // Live word counter
        elTextarea.addEventListener('input', () => {
          const text = elTextarea.value.trim();
          const words = text ? text.split(/\s+/).length : 0;
          elWordCount.innerText = words;
          elSubmitBtn.disabled = words < 20; // Require at least 20 words
        });
        
        elNewTopicBtn.addEventListener('click', () => {
          pickTopic();
          elTextarea.value = '';
          elWordCount.innerText = '0';
          elSubmitBtn.disabled = true;
        });
        
        elRetryBtn.addEventListener('click', () => {
          elResultsSection.classList.remove('active');
          elEditorSection.style.display = 'block';
          pickTopic();
          elTextarea.value = '';
          elWordCount.innerText = '0';
          elSubmitBtn.disabled = true;
          elPopover.classList.remove('visible');
        });
        
        /* ── AI PROMPT SYSTEM ── */
        function getSystemPrompt() {
          return `You are a strict but helpful English examiner. Score the student's essay out of 100 based on the provided topic.

You MUST respond strictly in valid JSON format ONLY. Do not write anything outside the JSON.

REQUIRED JSON STRUCTURE:
{
  "totalScore": 85,
  "rubric": [
    { "category": "Grammar", "score": 25, "outOf": 30, "feedback": "Brief feedback here." },
    { "category": "Vocabulary", "score": 15, "outOf": 20, "feedback": "Brief feedback here." },
    { "category": "Structure", "score": 20, "outOf": 25, "feedback": "Brief feedback here." },
    { "category": "Creativity", "score": 25, "outOf": 25, "feedback": "Brief feedback here." }
  ],
  "annotatedText": "The student's essay with special tags injected."
}

ANNOTATION RULES (Use these exact custom tags inside annotatedText):
1. Grammar Blunders: Wrap errors in <err mark='-X' fix='correction'>bad_word</err>.
   Example: She <err mark='-2' fix='went'>goed</err> to the store.
2. Weak Vocabulary: Wrap basic words needing substitutes in <sub opts='word1, word2, word3'>basic_word</sub>.
   Example: The car was very <sub opts='rapid, swift, lightning-fast'>fast</sub>.
3. Preserve the student's paragraphs using HTML <br><br>.

Ensure all JSON quotes are properly escaped. Do not use markdown wrappers like \`\`\`json.`;
        }
        
        /* ── SUBMIT LOGIC ── */
        elSubmitBtn.addEventListener('click', async () => {
          const userText = elTextarea.value.trim();
          if (!userText) return;
          
          elLoading.classList.add('active');
          
          const payloadMessages = [
            { role: "system", content: getSystemPrompt() },
            { role: "user", content: `TOPIC: ${currentTopic}\n\nSTUDENT'S WRITEUP:\n${userText}` }
          ];
          
          try {
            const res = await fetch(GROQ_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_KEY}`
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: payloadMessages,
                temperature: 0.2, // Low for strictly formatted JSON
                max_tokens: 2000
              })
            });
            
            if (!res.ok) throw new Error("API Error");
            
            const data = await res.json();
            let reply = data.choices?.[0]?.message?.content || "";
            
            // Strip markdown code blocks if the AI stubbornly adds them
            reply = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
            
            const parsed = JSON.parse(reply);
            renderResults(parsed, userText);
            
          } catch (err) {
            console.error(err);
            alert("An error occurred while grading. The AI might have returned malformed data. Please try again.");
            elLoading.classList.remove('active');
          }
        });
        
        /* ── RENDER RESULTS ── */
        function renderResults(data, originalText) {
          // 1. Stamp Score
          const score = data.totalScore || 0;
          elScoreStamp.innerText = `${score}%`;
          elScoreStamp.className = `score-stamp ${score >= 70 ? '' : 'low-score'}`;
          
          // 2. Render Rubric
          elRubricContent.innerHTML = '';
          if (data.rubric && data.rubric.length) {
            data.rubric.forEach(item => {
              elRubricContent.innerHTML += `
                        <div class="rubric-row">
                            <h4>${item.category} <span>${item.score} / ${item.outOf}</span></h4>
                            <p>${item.feedback}</p>
                        </div>
                    `;
            });
          }
          
          // 3. Process Annotations via Regex
          let htmlText = data.annotatedText || originalText.replace(/\n/g, '<br><br>');
          
          // Replace <err mark="-X" fix="Y">Z</err> with brutalist elements
          htmlText = htmlText.replace(/<err mark=['"]([^'"]+)['"] fix=['"]([^'"]+)['"]>([^<]+)<\/err>/gi,
            (match, mark, fix, orig) => {
              return `<span class="err-word"><del>${orig}</del><ins>${fix}</ins><span class="deduction">${mark}</span></span>`;
            }
          );
          
          // Replace <sub opts="A, B">C</sub> with interactive clickable span
          htmlText = htmlText.replace(/<sub opts=['"]([^'"]+)['"]>([^<]+)<\/sub>/gi,
            (match, opts, orig) => {
              // store options in data attribute
              return `<span class="sub-word" data-opts="${opts}">${orig}</span>`;
            }
          );
          
          elAnnotatedText.innerHTML = htmlText;
          
          // Attach listeners to newly created substitute words
          document.querySelectorAll('.sub-word').forEach(el => {
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              showPopover(el);
            });
          });
          
          // Transition UI
          elLoading.classList.remove('active');
          elEditorSection.style.display = 'none';
          elResultsSection.classList.add('active');
        }
        
        /* ── POPOVER LOGIC ── */
        function showPopover(wordElement) {
          activeSubWord = wordElement;
          const optsStr = wordElement.getAttribute('data-opts');
          if (!optsStr) return;
          
          const opts = optsStr.split(',').map(s => s.trim());
          
          let html = `<div class="popover-title">Select Substitute</div>`;
          opts.forEach(opt => {
            html += `<button class="pop-opt-btn" onclick="applySubstitute('${opt}')">${opt}</button>`;
          });
          
          elPopover.innerHTML = html;
          elPopover.classList.add('visible');
          
          // Position popover right under the clicked word
          const rect = wordElement.getBoundingClientRect();
          // Need to account for page scrolling
          elPopover.style.top = (rect.bottom + window.scrollY + 5) + 'px';
          elPopover.style.left = (rect.left + window.scrollX) + 'px';
        }
        
        // Called when a substitute button is clicked
        window.applySubstitute = function(chosenWord) {
          if (activeSubWord) {
            // Update the text to the chosen word
            activeSubWord.innerText = chosenWord;
            // Remove the dashed underline and styling since it's "fixed"
            activeSubWord.style.textDecoration = 'none';
            activeSubWord.style.color = 'var(--text-main)';
            activeSubWord.style.background = 'transparent';
            activeSubWord.classList.remove('sub-word');
          }
          elPopover.classList.remove('visible');
        };
        
        // Close popover when clicking anywhere else
        document.addEventListener('click', (e) => {
          if (!elPopover.contains(e.target)) {
            elPopover.classList.remove('visible');
          }
        });
        
        // Init App
        pickTopic();