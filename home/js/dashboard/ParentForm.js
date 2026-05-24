// ParentForm.js
export function renderParentFields() {
  return `
    <div class="auth-row">
      <div class="auth-field">
        <label>Your Relationship</label>
        <select id="signup-relation" required>
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="Guardian">Guardian</option>
        </select>
      </div>
      <div class="auth-field">
        <label>Contact Phone</label>
        <input type="tel" id="signup-parent-phone" placeholder="+234..." required />
      </div>
    </div>
    <div class="auth-field">
      <label>Child's Full Name</label>
      <input type="text" id="signup-child-name" placeholder="John Doe" required />
    </div>
    <div class="auth-row">
      <div class="auth-field">
        <label>Child's Current Class</label>
        <select id="signup-child-class" required>
          <option value="" disabled selected>Select Class</option>
          <option value="jss1">JSS 1</option>
          <option value="jss2">JSS 2</option>
          <option value="jss3">JSS 3</option>
          <option value="ss1">SS 1</option>
          <option value="ss2">SS 2</option>
          <option value="ss3">SS 3</option>
        </select>
      </div>
      <div class="auth-field">
        <label>Learning Goal</label>
        <select id="signup-goal" required>
          <option value="Daily Practice" selected>Daily Practice</option>
          <option value="Exam Preparation">Exam Prep (WAEC/NECO/JAMB)</option>
          <option value="Remedial Help">Remedial Help</option>
        </select>
      </div>
    </div>
  `;
}
