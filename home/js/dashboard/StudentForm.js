// StudentForm.js
export function renderStudentFields() {
  return `
    <div class="auth-row">
      <div class="auth-field">
        <label>Current Class</label>
        <select id="signup-class" required>
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
        <label>School Name</label>
        <input type="text" id="signup-student-school" placeholder="e.g. Grace High School" required />
      </div>
    </div>
    <div class="auth-row">
      <div class="auth-field">
        <label>Primary Focus Subject</label>
        <select id="signup-student-focus" required>
          <option value="Mathematics" selected>Mathematics</option>
          <option value="English Language">English Language</option>
          <option value="Sciences">General Sciences</option>
          <option value="All Subjects">All Subjects</option>
        </select>
      </div>
      <div class="auth-field">
        <label>Parent's Email / Phone</label>
        <input type="text" id="signup-student-parent" placeholder="parent@mail.com" required />
      </div>
    </div>
  `;
}
