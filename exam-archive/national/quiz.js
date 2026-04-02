// --- DYNAMIC DATA LOADER ---

const ExamLoader = {
  // Helper to inject a script tag and wait for it to load
  loadScript: function(path) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`File not found: ${path}`);
      document.head.appendChild(script);
    });
  },
  
  // Generates the folder path based on your screenshot structure
  getFilePath: function(subject, year, type) {
    // e.g., ./WAEC/chemistry/2023/objective.js
    return `./WAEC/${subject.toLowerCase()}/${year}/${type}.js`;
  }
};

beginBtn.onclick = async () => {
  // Show a loading state on the button
  const originalText = beginBtn.innerText;
  beginBtn.innerText = "LOADING DATA...";
  beginBtn.disabled = true;
  
  const paperContent = document.getElementById('paper-content');
  paperContent.innerHTML = ''; // Clear previous content
  
  try {
    // 1. Loop through all selected subjects
    for (const subjectName of state.subjects) {
      
      // 2. Load the requested papers (Objective/Theory) for each subject
      for (const type of state.types) {
        const path = ExamLoader.getFilePath(subjectName, state.year, type);
        
        await ExamLoader.loadScript(path);
        
        // 3. Identify the loaded variable
        // Expectation: chemistry/2023/objective.js defines 'chemistryObjective'
        const varName = `${subjectName.toLowerCase()}${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const data = window[varName];
        
        if (data) {
          renderPaperSection(subjectName, type, data, paperContent);
        } else {
          console.warn(`Variable ${varName} not found in ${path}`);
        }
      }
    }
    
    // 4. Show the UI
    document.getElementById('paper-metadata').innerText = `SESSION: ${state.year} | FULL BATTERY`;
    document.getElementById('exam-paper-view').style.display = 'block';
    
  } catch (error) {
    alert("Exam Data Error: One or more selected subject files are missing from the server.");
    console.error(error);
  } finally {
    beginBtn.innerText = originalText;
    beginBtn.disabled = false;
  }
};

// --- GENERIC RENDERER ---
// This function handles ANY subject data passed to it
function renderPaperSection(subject, type, data, container) {
  const sectionWrapper = document.createElement('div');
  sectionWrapper.className = "paper-section-block";
  
  // Add a Subject-specific Header
  let html = `
        <div class="subject-header-banner" style="background: var(--ink); color: var(--yellow); padding: 15px 40px; margin: 40px 0 20px -40px; width: calc(100% + 80px);">
            <h2 style="font-family: var(--font-display); text-transform: uppercase; font-size: 1.4rem;">
                ${subject} - ${type.toUpperCase()}
            </h2>
        </div>
    `;
  
  if (type === 'objective') {
    // Map through Objective Array
    data.forEach((q, idx) => {
      html += `
            <div class="obj-question" style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <p><strong>Q${idx + 1}.</strong> ${q.question}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
                    ${q.options.map((opt, i) => `
                        <label class="option-label">
                            <input type="radio" name="${subject}_q${idx}" value="${i}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>`;
    });
  } else {
    // Handle Theory Object
    Object.keys(data).forEach((key, idx) => {
      html += `
            <div class="theory-question" style="margin-bottom: 40px; border-left: 5px solid var(--ink); padding-left: 20px;">
                <h4 style="font-family: var(--font-display); font-size: 0.9rem;">QUESTION ${idx + 1}</h4>
                <p style="white-space: pre-line;">${data[key]}</p>
                <textarea placeholder="Write answer..." style="width:100%; height:120px; margin-top:15px; border: 2px solid var(--ink); padding: 10px;"></textarea>
            </div>`;
    });
  }
  
  sectionWrapper.innerHTML = html;
  container.appendChild(sectionWrapper);
}