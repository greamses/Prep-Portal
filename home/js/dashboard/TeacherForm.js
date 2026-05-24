// ParentForm.js
export function renderParentFields() {
  return `
    <div class="auth-row">
      <div class="auth-field">
        <label>Your Relationship</label>
        <div class="custom-select" data-id="signup-relation">
          <button type="button" class="custom-select-trigger">
            <span>Select Relationship</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div class="custom-select-options">
            <div class="custom-select-option" data-value="Mother">Mother</div>
            <div class="custom-select-option" data-value="Father">Father</div>
            <div class="custom-select-option" data-value="Guardian">Guardian</div>
          </div>
          <input type="hidden" id="signup-relation" required />
        </div>
      </div>
      <div class="auth-field">
        <label>Child's Current Class</label>
        <div class="custom-select" data-id="signup-child-class">
          <button type="button" class="custom-select-trigger">
            <span>Select Class</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div class="custom-select-options">
            <div class="custom-select-option" data-value="jss1">JSS 1</div>
            <div class="custom-select-option" data-value="jss2">JSS 2</div>
            <div class="custom-select-option" data-value="jss3">JSS 3</div>
            <div class="custom-select-option" data-value="ss1">SS 1</div>
            <div class="custom-select-option" data-value="ss2">SS 2</div>
            <div class="custom-select-option" data-value="ss3">SS 3</div>
          </div>
          <input type="hidden" id="signup-child-class" required />
        </div>
      </div>
    </div>
    <div class="auth-field">
      <label>Contact Phone</label>
      <input type="tel" id="signup-parent-phone" placeholder="+234..." required />
    </div>
    <div class="auth-field">
      <label>Child's Full Name</label>
      <input type="text" id="signup-child-name" placeholder="John Doe" required />
    </div>
    <div class="auth-field">
      <label>Learning Goal</label>
      <div class="custom-select" data-id="signup-goal">
        <button type="button" class="custom-select-trigger">
          <span>Select Goal</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <div class="custom-select-options">
          <div class="custom-select-option" data-value="Daily Practice">Daily Practice</div>
          <div class="custom-select-option" data-value="Exam Preparation">Exam Prep (WAEC/NECO/JAMB)</div>
          <div class="custom-select-option" data-value="Remedial Help">Remedial Help</div>
        </div>
        <input type="hidden" id="signup-goal" required />
      </div>
    </div>
  `;
}
