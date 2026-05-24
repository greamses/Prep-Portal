// TeacherForm.js
export function renderTeacherFields() {
  return `
    <div class="auth-row">
      <div class="auth-field">
        <label>School Name</label>
        <input type="text" id="signup-school" placeholder="e.g. Westside Academy" required />
      </div>
      <div class="auth-field">
        <label>Contact Phone</label>
        <input type="tel" id="signup-teacher-phone" placeholder="+234..." required />
      </div>
    </div>
    <div class="auth-row">
      <div class="auth-field">
        <label>Years of Experience</label>
        <select id="signup-experience" required>
          <option value="0-2">0 - 2 Years</option>
          <option value="3-5">3 - 5 Years</option>
          <option value="5-10">5 - 10 Years</option>
          <option value="10+">10+ Years</option>
        </select>
      </div>
      <div class="auth-field">
        <label>Class Size</label>
        <input type="number" id="signup-students" placeholder="30" min="1" required />
      </div>
    </div>
    <div class="auth-row">
      <div class="auth-field">
        <label>Primary Specialization</label>
        <select id="signup-subject" required>
          <option value="Mathematics" selected>Mathematics</option>
          <option value="English Language">English Language</option>
          <option value="Sciences">Sciences (Physics/Chemistry)</option>
          <option value="General Studies">General Studies</option>
        </select>
      </div>
      <div class="auth-field">
        <label>Job Position</label>
        <input type="text" id="signup-position" placeholder="e.g. Senior Math Lead" required />
      </div>
    </div>
  `;
}
