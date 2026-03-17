// script.js

// 1. Import the HTML template generator from our new file
import { renderQuestionsHTML } from './templates.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 2. Fetch all external SVGs (Updated to 20 files for Q1-Q28)
    const svgFiles = Array.from({ length: 20 }, (_, i) => `svg${i+1}.svg`);
    let svgs = {};
    
    try {
        const responses = await Promise.all(svgFiles.map(file => fetch(file)));
        for (let res of responses) {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        }
        const texts = await Promise.all(responses.map(res => res.text()));
        texts.forEach((text, i) => { svgs[`svg${i+1}`] = text; });
    } catch (error) {
        document.body.innerHTML = `
            <div style="padding:40px; text-align:center; font-family:sans-serif; color:#dc2626;">
                <h2>⚠️ Error loading SVG files</h2>
                <p>Could not fetch external files. Because this project uses JavaScript <code>fetch()</code> to load SVGs, <strong>you must run it through a local web server</strong>.</p>
            </div>
        `;
        console.error("SVG Loading Error:", error);
        return;
    }
    
    // 3. Render the HTML grid
    const grid = document.getElementById('questions-grid');
    grid.innerHTML = renderQuestionsHTML(svgs);
    
    // ==========================================
    // Trigger Math Library Rendering (MathJax / KaTeX)
    // ==========================================
    if (window.MathJax) {
        // For MathJax 3.x
        MathJax.typesetPromise([grid]).catch((err) => console.error('MathJax error:', err));
    } else if (window.renderMathInElement) {
        // For KaTeX (requires auto-render extension)
        renderMathInElement(grid, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
        });
    }
    
    // 4. INTERACTIVE LOGIC
    
    // Q1b: Tap to Add Pictogram
    const btnFull = document.getElementById('add-full');
    const btnHalf = document.getElementById('add-half');
    const dropZone = document.getElementById('peaches-dropzone');
    const dropTarget = document.getElementById('peaches-icons');
    const clearBtn = document.getElementById('clear-peaches');
    
    const addIconToDropZone = (type) => {
        dropZone.classList.remove('correct-zone', 'incorrect-zone');
        const wrapper = document.createElement('div');
        wrapper.dataset.value = (type === 'full') ? '10' : '5';
        wrapper.innerHTML = (type === 'full') ? svgs.svg1 : svgs.svg2;
        dropTarget.appendChild(wrapper);
    };
    
    // Add event listeners for the tap buttons
    if (btnFull) btnFull.addEventListener('click', () => addIconToDropZone('full'));
    if (btnHalf) btnHalf.addEventListener('click', () => addIconToDropZone('half'));
    
    // Keep clear button logic
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            dropTarget.innerHTML = '';
            dropZone.classList.remove('correct-zone', 'incorrect-zone');
        });
    }
    
    // Q3b: Interactive Number Line
    const svg3 = document.getElementById('interactive-svg');
    const marker3 = document.getElementById('dynamic-marker');
    const hiddenVal3 = document.getElementById('q3b-val');
    
    if (svg3) {
        svg3.addEventListener('click', function(e) {
            const pt = svg3.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const cursorPt = pt.matrixTransform(svg3.getScreenCTM().inverse());
            let clickX = cursorPt.x;
            if (clickX < 60) clickX = 60;
            if (clickX > 540) clickX = 540;
            hiddenVal3.value = Math.round(((clickX - 60) / 480) * 1000);
            
            marker3.innerHTML = `<g transform="translate(${clickX}, 60)"><line x1="0" y1="30" x2="0" y2="0" stroke="var(--danger)" stroke-width="2.5"/><polygon points="-6,10 6,10 0,0" fill="var(--danger)"/><rect x="-20" y="35" width="40" height="20" fill="var(--danger)" rx="4"/><text x="0" y="50" text-anchor="middle" font-size="12" fill="white" font-weight="bold">You</text></g>`;
        });
    }
    
    // Q8: Matching (Tap to connect)
    let q8ActiveLeft = null;
    let q8Connections = [];
    const q8SvgLines = document.getElementById('q8-lines-svg');
    const q8Container = document.getElementById('q8-container');
    
    const drawQ8Line = (leftBtn, rightBtn) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const rectContainer = q8Container.getBoundingClientRect();
        const rectL = leftBtn.getBoundingClientRect();
        const rectR = rightBtn.getBoundingClientRect();
        
        const x1 = rectL.right - rectContainer.left;
        const y1 = rectL.top + (rectL.height / 2) - rectContainer.top;
        const x2 = rectR.left - rectContainer.left;
        const y2 = rectR.top + (rectR.height / 2) - rectContainer.top;
        
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#2563eb');
        line.setAttribute('stroke-width', '3');
        
        q8SvgLines.appendChild(line);
        return line;
    };
    
    document.querySelectorAll('.q8-item-l:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.q8-item-l').forEach(b => b.classList.remove('match-active'));
            if (q8ActiveLeft === btn) {
                q8ActiveLeft = null;
            } else {
                q8ActiveLeft = btn;
                btn.classList.add('match-active');
            }
        });
    });
    
    document.querySelectorAll('.q8-item-r:not([disabled])').forEach(rightBtn => {
        rightBtn.addEventListener('click', () => {
            if (q8ActiveLeft) {
                const existingIdx = q8Connections.findIndex(c => c.leftEl === q8ActiveLeft);
                if (existingIdx !== -1) {
                    q8SvgLines.removeChild(q8Connections[existingIdx].lineEl);
                    q8Connections[existingIdx].rightEl.classList.remove('match-connected');
                    q8Connections.splice(existingIdx, 1);
                }
                
                const line = drawQ8Line(q8ActiveLeft, rightBtn);
                q8ActiveLeft.classList.remove('match-active');
                q8ActiveLeft.classList.add('match-connected');
                rightBtn.classList.add('match-connected');
                
                q8Connections.push({
                    leftVal: q8ActiveLeft.dataset.val,
                    rightVal: rightBtn.dataset.val,
                    leftEl: q8ActiveLeft,
                    rightEl: rightBtn,
                    lineEl: line
                });
                q8ActiveLeft = null;
            }
        });
    });
    
    document.getElementById('q8-clear').addEventListener('click', () => {
        q8SvgLines.innerHTML = '';
        q8Connections = [];
        q8ActiveLeft = null;
        document.querySelectorAll('.match-item').forEach(btn => btn.classList.remove('match-active', 'match-connected'));
    });
    
    
    // Q12: Interactive Drawing Grid
    const q12Grid = document.getElementById('q12-grid');
    const q12PtsGroup = document.getElementById('q12-user-pts');
    const q12Poly = document.getElementById('q12-user-poly');
    let q12PointsArray = [];
    
    const renderQ12Points = () => {
        q12PtsGroup.innerHTML = '';
        q12PointsArray.forEach((pt, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pt.x);
            circle.setAttribute('cy', pt.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#ef4444');
            circle.style.cursor = 'pointer';
            
            circle.addEventListener('click', (e) => {
                e.stopPropagation();
                q12PointsArray.splice(index, 1);
                renderQ12Points();
            });
            q12PtsGroup.appendChild(circle);
        });
    };
    
    if (q12Grid) {
        q12Grid.addEventListener('click', (e) => {
            const pt = q12Grid.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const cursorPt = pt.matrixTransform(q12Grid.getScreenCTM().inverse());
            
            const snapX = Math.round(cursorPt.x / 20) * 20;
            const snapY = Math.round(cursorPt.y / 20) * 20;
            
            const exists = q12PointsArray.some(p => p.x === snapX && p.y === snapY);
            if (!exists && q12PointsArray.length < 3) {
                q12PointsArray.push({ x: snapX, y: snapY });
                renderQ12Points();
            }
        });
    }
    
    document.getElementById('q12-join').addEventListener('click', () => {
        if (q12PointsArray.length > 1) {
            const ptsStr = q12PointsArray.map(p => `${p.x},${p.y}`).join(' ');
            q12Poly.setAttribute('points', ptsStr);
        } else {
            alert('Please tap at least 3 points on the grid to form a triangle.');
        }
    });
    
    document.getElementById('q12-clear').addEventListener('click', () => {
        q12PointsArray = [];
        q12Poly.setAttribute('points', '');
        renderQ12Points();
    });
    
    
    // Q13: Interactive Number Line (Breadcrumbs Tap & Draw)
    const q13Svg = document.getElementById('q13-line-svg');
    const q13Markers = document.getElementById('q13-markers');
    const q13ClearBtn = document.getElementById('q13-clear');
    let q13ActiveVal = null;
    let q13ActiveLabel = "";
    
    document.querySelectorAll('.q13-crumb').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.q13-crumb').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            q13ActiveVal = btn.dataset.val;
            q13ActiveLabel = btn.innerHTML;
        });
    });
    
    if (q13Svg) {
        q13Svg.addEventListener('click', (e) => {
            if (!q13ActiveVal) return;
            
            const pt = q13Svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const cursorPt = pt.matrixTransform(q13Svg.getScreenCTM().inverse());
            
            let clickX = cursorPt.x;
            if (clickX < 80) clickX = 80;
            if (clickX > 520) clickX = 520;
            
            const markerId = 'q13-marker-' + q13ActiveVal.replace('.', '_');
            let existing = document.getElementById(markerId);
            if (existing) existing.remove();
            
            const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            markerGroup.setAttribute('id', markerId);
            markerGroup.setAttribute('transform', `translate(${clickX}, 75)`);
            
            markerGroup.innerHTML = `
                <line x1="0" y1="-45" x2="0" y2="-5" stroke="#2563eb" stroke-width="2.5" marker-end="url(#q13-arrow-blue)"/>
                <text x="0" y="-55" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">${q13ActiveLabel}</text>
            `;
            q13Markers.appendChild(markerGroup);
            
            const hiddenInput = document.getElementById('q13_ans_' + q13ActiveVal.replace('.', '_'));
            if (hiddenInput) hiddenInput.value = clickX;
            
            document.querySelectorAll('.q13-crumb').forEach(b => b.classList.remove('selected'));
            q13ActiveVal = null;
        });
    }
    
    if (q13ClearBtn) {
        q13ClearBtn.addEventListener('click', () => {
            q13Markers.innerHTML = '';
            document.getElementById('q13_ans_5_25').value = '';
            document.getElementById('q13_ans_6_875').value = '';
        });
    }
    
    // Q14: Toggle Buttons
    document.querySelectorAll('#q14-toggles .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#q14-toggles .toggle-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('q14_choice').value = btn.dataset.val;
        });
    });
    
    
    // --- Q20: Digit Cards Interactivity ---
    const q20Inputs = document.querySelectorAll('.q20-card');
    const validCards = ['0', '2', '4', '5', '8'];
    q20Inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const val = e.target.value;
            if (!val) return;
            if (!validCards.includes(val)) {
                alert('Please use only the cards: 0, 2, 4, 5, 8');
                e.target.value = '';
                return;
            }
            let count = 0;
            q20Inputs.forEach(other => { if (other.value === val) count++; });
            if (count > 1) {
                alert('No card can be used twice!');
                e.target.value = '';
            }
        });
    });
    
    // --- Q22: Liquid Volumes Interactivity ---
    const q22Container = document.getElementById('q22-container');
    const q22Ans = document.getElementById('q22_ans');
    if (q22Container) {
        q22Container.addEventListener('click', (e) => {
            const bottleElement = e.target.closest('.bottle');
            if (bottleElement) {
                // Clear others
                q22Container.querySelectorAll('.bottle').forEach(b => {
                    if (b !== bottleElement) {
                        b.classList.remove('selected');
                        const cross = b.parentNode.querySelector('.selected-cross');
                        if (cross) cross.style.display = 'none';
                    }
                });
                // Toggle clicked
                bottleElement.classList.toggle('selected');
                const isSel = bottleElement.classList.contains('selected');
                const cross = bottleElement.parentNode.querySelector('.selected-cross');
                if (cross) cross.style.display = isSel ? 'block' : 'none';
                
                // Set hidden input value
                const bottles = Array.from(q22Container.querySelectorAll('.bottle'));
                const selectedIndex = bottles.findIndex(b => b.classList.contains('selected'));
                let values = ["1.5l", "150ml", "1500ml"];
                q22Ans.value = selectedIndex !== -1 ? values[selectedIndex] : "";
            }
        });
    }
    
    // --- Q24: Interactive Dial Scale ---
    const scaleSVG = document.getElementById('scale-svg');
    const hitArea = document.getElementById('scale-hit-area');
    const arrowContainer = document.getElementById('scale-arrow-container');
    const q24AnsInput = document.getElementById('q24_ans');
    const q24ClearBtn = document.getElementById('q24-clear');
    
    if (scaleSVG && hitArea) {
        hitArea.addEventListener('click', (e) => {
            const pt = scaleSVG.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const svgP = pt.matrixTransform(scaleSVG.getScreenCTM().inverse());
            
            const dx = svgP.x - 150;
            const dy = svgP.y - 180;
            let angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
            if (angleDeg < 0) angleDeg += 360;
            
            // Map degrees to nearest 10 grams (360 deg = 1000g)
            let grams = Math.round(((angleDeg / 360) * 1000) / 10) * 10;
            
            // Recalculate radians for a perfectly snapped arrow
            let drawRad = ((grams / 1000) * 360 - 90) * Math.PI / 180;
            
            const tipX = 150 + 95 * Math.cos(drawRad);
            const tipY = 180 + 95 * Math.sin(drawRad);
            const baseRadX = 150 + 125 * Math.cos(drawRad);
            const baseRadY = 180 + 125 * Math.sin(drawRad);
            
            const head1X = 150 + 115 * Math.cos(drawRad + 0.08);
            const head1Y = 180 + 115 * Math.sin(drawRad + 0.08);
            const head2X = 150 + 115 * Math.cos(drawRad - 0.08);
            const head2Y = 180 + 115 * Math.sin(drawRad - 0.08);
            
            arrowContainer.innerHTML = `<polygon points="${tipX},${tipY} ${head1X},${head1Y} ${baseRadX},${baseRadY} ${head2X},${head2Y}" fill="#ef4444" stroke="#ef4444" stroke-width="3" pointer-events="none" />`;
            q24AnsInput.value = grams;
        });
        
        if (q24ClearBtn) {
            q24ClearBtn.addEventListener('click', () => {
                arrowContainer.innerHTML = '';
                q24AnsInput.value = '';
            });
        }
    }
    
    // 5. EXACT GRADING LOGIC
    const form = document.getElementById('quiz-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;
        const total = 50; // Updated total for Q1 - Q28
        
        const setFeedback = (id, isCorrect) => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('correct', 'incorrect');
                el.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            return isCorrect;
        };
        
        // Q1 (2 pts)
        if (setFeedback('q1a', document.getElementById('q1a').value === "20")) score++;
        
        let peachSum = Array.from(dropTarget.children).reduce((sum, el) => sum + parseInt(el.dataset.value), 0);
        dropZone.classList.remove('correct-zone', 'incorrect-zone');
        if (peachSum === 15) { score++;
            dropZone.classList.add('correct-zone'); }
        else { dropZone.classList.add('incorrect-zone'); }
        
        // Q2 (2 pts)
        let v2a = document.getElementById('q2a').value.replace(/\s+/g, '').toLowerCase();
        if (setFeedback('q2a', v2a.includes("6:50") || v2a.includes("06:50"))) score++;
        
        let v2b = document.getElementById('q2b').value.replace(/\s+/g, '').toLowerCase();
        if (setFeedback('q2b', v2b.includes("1:15") || v2b.includes("13:15") || v2b.includes("01:15"))) score++;
        
        // Q3 (3 pts)
        if (setFeedback('q3a_A', document.getElementById('q3a_A').value === "50")) score++;
        if (setFeedback('q3a_B', document.getElementById('q3a_B').value === "250")) score++;
        
        let val3b = parseInt(hiddenVal3.value);
        if (val3b >= 310 && val3b <= 390) {
            score++;
            svg3.style.borderColor = "var(--success)";
        } else {
            svg3.style.borderColor = "var(--danger)";
        }
        
        // Q4 (2 pts)
        if (setFeedback('q4a', document.getElementById('q4a').value === "3")) score++;
        if (setFeedback('q4b', document.getElementById('q4b').value === "3")) score++;
        
        // Q5 (2 pts)
        if (setFeedback('q5a', document.getElementById('q5a').value === "10")) score++;
        if (setFeedback('q5b', document.getElementById('q5b').value === "10")) score++;
        
        // Q6 (2 pts)
        let q6ax = setFeedback('q6a_x', document.getElementById('q6a_x').value.trim() === "-6");
        let q6ay = setFeedback('q6a_y', document.getElementById('q6a_y').value.trim() === "-6");
        if (q6ax && q6ay) score++;
        
        let q6bx = setFeedback('q6b_x', document.getElementById('q6b_x').value.trim() === "-3");
        let q6by = setFeedback('q6b_y', document.getElementById('q6b_y').value.trim() === "-1");
        if (q6bx && q6by) score++;
        
        // Q7 (1 pt)
        let q7_1 = setFeedback('q7_1', document.getElementById('q7_1').value === "9");
        let q7_2 = setFeedback('q7_2', document.getElementById('q7_2').value === "6");
        let q7_3 = setFeedback('q7_3', document.getElementById('q7_3').value === "8");
        if (q7_1 && q7_2 && q7_3) score++;
        
        // Q8 (3 pts)
        const getMatchedVal = (leftVal) => {
            const match = q8Connections.find(c => c.leftVal === leftVal);
            return match ? match.rightVal : null;
        };
        
        let q8_score = 0;
        if (getMatchedVal("3/4") === "0.75") q8_score++;
        if (getMatchedVal("2/5") === "0.4") q8_score++;
        if (getMatchedVal("3/10") === "0.3") q8_score++;
        score += q8_score;
        
        if (q8_score === 3) q8Container.style.border = "2px solid var(--success)";
        else q8Container.style.border = "2px dashed var(--danger)";
        
        // Q9 (3 pts)
        let sl = parseFloat(document.getElementById('q9_sl').value);
        let cr = parseFloat(document.getElementById('q9_cr').value);
        let sb = parseFloat(document.getElementById('q9_sb').value);
        if (setFeedback('q9_sl', sl === 6.5)) score++;
        if (setFeedback('q9_cr', cr === 4.5)) score++;
        if (setFeedback('q9_sb', sb === 8.4)) score++;
        
        // Q10 (3 pts)
        let q10v1 = parseFloat(document.getElementById('q10_1').value);
        let q10v2 = parseFloat(document.getElementById('q10_2').value);
        let q10v3 = parseFloat(document.getElementById('q10_3').value);
        if (setFeedback('q10_1', q10v1 === -0.2)) score++;
        if (setFeedback('q10_2', q10v2 === 0.3)) score++;
        if (setFeedback('q10_3', q10v3 === 2.3)) score++;
        
        // Q11 (2 pts)
        if (setFeedback('q11a', document.getElementById('q11a').value === "75")) score++;
        if (setFeedback('q11b', document.getElementById('q11b').value === "100")) score++;
        
        // Q12 (1 pt)
        let q12_correct = false;
        if (q12PointsArray.length === 3) {
            const has140_80 = q12PointsArray.some(p => p.x === 140 && p.y === 80);
            const has80_80 = q12PointsArray.some(p => p.x === 80 && p.y === 80);
            const has80_20 = q12PointsArray.some(p => p.x === 80 && p.y === 20);
            if (has140_80 && has80_80 && has80_20) q12_correct = true;
        }
        if (q12_correct) {
            score++;
            q12Poly.setAttribute('stroke', 'var(--success)');
            q12Poly.setAttribute('fill', 'rgba(34, 197, 94, 0.2)');
        } else {
            q12Poly.setAttribute('stroke', 'var(--danger)');
        }
        
        // Q13 (2 pts)
        let q13_1_ans = parseFloat(document.getElementById('q13_ans_5_25').value);
        let q13_2_ans = parseFloat(document.getElementById('q13_ans_6_875').value);
        let q13_1_correct = !isNaN(q13_1_ans) && Math.abs(q13_1_ans - 150) <= 15;
        let q13_2_correct = !isNaN(q13_2_ans) && Math.abs(q13_2_ans - 475) <= 15;
        
        const updateQ13Marker = (id, isCorrect) => {
            const m = document.getElementById(id);
            if (m) {
                const color = isCorrect ? 'var(--success)' : 'var(--danger)';
                const markerUrl = isCorrect ? 'url(#q13-arrow-green)' : 'url(#q13-arrow-red)';
                m.querySelector('line').setAttribute('stroke', color);
                m.querySelector('line').setAttribute('marker-end', markerUrl);
                m.querySelector('text').setAttribute('fill', color);
            }
        };
        updateQ13Marker('q13-marker-5_25', q13_1_correct);
        updateQ13Marker('q13-marker-6_875', q13_2_correct);
        if (q13_1_correct) score++;
        if (q13_2_correct) score++;
        
        // Q14 (3 pts)
        if (setFeedback('q14_rect', document.getElementById('q14_rect').value === "32")) score++;
        if (setFeedback('q14_L', document.getElementById('q14_L').value === "34")) score++;
        
        const q14Choice = document.getElementById('q14_choice').value;
        const toggleGroup = document.getElementById('q14-toggles');
        if (q14Choice === "lshape") {
            score++;
            toggleGroup.style.borderBottom = "3px solid var(--success)";
        } else {
            toggleGroup.style.borderBottom = "3px solid var(--danger)";
        }
        
        // Q15 (2 pts)
        if (setFeedback('q15a', document.getElementById('q15a').value === "36.6")) score++;
        if (setFeedback('q15b', document.getElementById('q15b').value === "22.5")) score++;
        
        // Q16 (2 pts)
        let q16_1_val = parseInt(document.getElementById('q16_1').value);
        let q16_2_val = parseInt(document.getElementById('q16_2').value);
        let q16_correct = ((q16_1_val === 60 && q16_2_val === 90) || (q16_1_val === 90 && q16_2_val === 60));
        setFeedback('q16_1', q16_correct);
        setFeedback('q16_2', q16_correct);
        if (q16_correct) score += 2;
        
        // Q17 (1 pt)
        if (setFeedback('q17_correct', document.getElementById('q17_correct').value === "no")) score++;
        
        // --- NEW GRADING LOGIC (Q18 - Q28) ---
        
        // Q18 (1 pt)
        if (setFeedback('q18', document.getElementById('q18').value === "52")) score++;
        
        // Q19 (2 pts)
        if (setFeedback('q19a', parseFloat(document.getElementById('q19a').value) === 3.47)) score++;
        if (setFeedback('q19b', parseFloat(document.getElementById('q19b').value) === 6.53)) score++;
        
        // Q20 (1 pt) - Validate digit cards
        let t = document.getElementById('q20_top').value;
        let b = document.getElementById('q20_bot').value;
        let i = document.getElementById('q20_int').value;
        let d = document.getElementById('q20_dec').value;
        let q20_correct = false;
        
        if (t && b && i && d) {
            let usedArr = [t, b, i, d];
            let uniqueSet = new Set(usedArr);
            let validAllowed = ['0', '2', '4', '5', '8'];
            let allAreValid = usedArr.every(val => validAllowed.includes(val));
            
            // Check if 4 distinct allowed cards were used and the math evaluates correctly
            if (uniqueSet.size === 4 && allAreValid) {
                let divResult = parseInt(t) / parseInt(b);
                let decResult = parseFloat(`${i}.${d}`);
                if (divResult === decResult) {
                    q20_correct = true;
                }
            }
        }
        setFeedback('q20_top', q20_correct);
        setFeedback('q20_bot', q20_correct);
        setFeedback('q20_int', q20_correct);
        setFeedback('q20_dec', q20_correct);
        if (q20_correct) score++;
        
        // Q21 (2 pts)
        if (setFeedback('q21a', document.getElementById('q21a').value === "9")) score++;
        let modeAns = document.getElementById('q21b').value.trim();
        // Allow just 11, just 12, or both
        if (setFeedback('q21b', modeAns === "11" || modeAns === "12" || (modeAns.includes("11") && modeAns.includes("12")))) score++;
        
        // Q22 (1 pt)
        let q22_ans = document.getElementById('q22_ans').value;
        if (q22_ans === "150ml") {
            score++;
            q22Container.style.border = "2px solid var(--success)";
        } else {
            q22Container.style.border = "2px dashed var(--danger)";
        }
        
        // Q23 (1 pt)
        if (setFeedback('q23', parseFloat(document.getElementById('q23').value) === 2.74)) score++;
        
        // Q24 (1 pt)
        let q24Val = parseInt(document.getElementById('q24_ans').value);
        if (q24Val === 650) {
            score++;
            document.getElementById('scale-svg').style.border = "2px solid var(--success)";
        } else {
            document.getElementById('scale-svg').style.border = "2px dashed var(--danger)";
        }
        
        // Q25 (1 pt)
        if (setFeedback('q25', document.getElementById('q25').value === "900")) score++;
        
        // Q26 (1 pt)
        if (setFeedback('q26', document.getElementById('q26').value === "40")) score++;
        
        // Q27 (1 pt)
        if (setFeedback('q27', document.getElementById('q27').value === "966")) score++;
        
        // Q28 (1 pt)
        if (setFeedback('q28', parseFloat(document.getElementById('q28').value) === 69.2)) score++;
        
        
        // --- Display Final Total ---
        const display = document.getElementById('score-display');
        display.innerHTML = `You scored ${score} out of ${total}!`;
        display.style.color = score === total ? "var(--success)" : "var(--primary)";
        display.scrollIntoView({ behavior: 'smooth' });
    });
});