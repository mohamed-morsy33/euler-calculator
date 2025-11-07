let runEuler;

Module.onRuntimeInitialized = () => {
  // cwrap signature -> return number, args: number, number, number, number, string
  runEuler = Module.cwrap("run_euler", "number", ["number","number","number","number","string"]);
  document.getElementById("run").addEventListener("click", computeEuler);
  document.getElementById("clear").addEventListener("click", resetForm);
  updateDx();
  // update displayed Δx when x/n changes
  ["x0","x","n"].forEach(id=>document.getElementById(id).addEventListener("input", updateDx));
};

function resetForm() {
  document.getElementById("x0").value = 0;
  document.getElementById("y0").value = 1;
  document.getElementById("x").value = 1.1;
  document.getElementById("n").value = 100;
  document.getElementById("expr").value = "-x*x*y";
  document.getElementById("mathDisplay").textContent = "Enter an expression and press Compute";
  document.getElementById("yValue").textContent = "";
  document.getElementById("xyTable").innerHTML = "";
  document.getElementById("tableCard").style.display = "none";
  updateDx();
}

function updateDx(){
  const x0 = parseFloat(document.getElementById("x0").value) || 0;
  const x = parseFloat(document.getElementById("x").value) || 0;
  const n = parseInt(document.getElementById("n").value) || 1;
  const dx = (x - x0) / n;
  document.getElementById("dx").value = dx;
}

function computeEuler(){
  const x0 = parseFloat(document.getElementById("x0").value);
  const y0 = parseFloat(document.getElementById("y0").value);
  const x = parseFloat(document.getElementById("x").value);
  const n = parseInt(document.getElementById("n").value, 10);
  const exprRaw = document.getElementById("expr").value.trim();

  if (!exprRaw) return alert("Please enter an expression for f(x,y).");

  // For math display only: convert to TeX using math.js to avoid manual fragile replacements.
  let tex;
  try {
    const node = math.parse(exprRaw);
    tex = node ? node.toTex({parenthesis: 'keep'}) : exprRaw;
  } catch (e) {
    // fallback: simple escape of * to \cdot for display
    tex = exprRaw.replace(/\*/g,'\\cdot ');
  }

  // Display the LaTeX (do NOT pass this to C)
  const mathDisplay = document.getElementById("mathDisplay");
  mathDisplay.innerHTML = `\\[ f(x,y) = ${tex} \\]`;
  // Uses modern MathJax promise
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([mathDisplay]).catch((err)=>console.error(err));
  } else {
    MathJax.typeset();
  }

  // ----- IMPORTANT: Call the WASM/C function with the RAW expression,
  // NOT the LaTeXified expr (tinyexpr expects normal ascii operators).
  const y_final = runEuler(x0, y0, x, n, exprRaw);

  document.getElementById("yValue").textContent = `y(${x}) ≈ ${y_final.toFixed(6)}`;

  // Optional: build a table of points by doing Euler steps in JS (safe & simple)
  // This avoids needing a special C function to return the table.
  buildAndShowTable(x0, y0, x, n, exprRaw);
}

function buildAndShowTable(x0, y0, xEnd, n, exprRaw) {
  // Use math.js to evaluate expression step-by-step in JS for table/plotting,
  // while leaving final numerical computation done by C for accuracy comparison.
  const exprCompiled = math.compile(exprRaw);
  const dx = (xEnd - x0) / n;
  const rows = [];
  let x = x0;
  let y = y0;
  rows.push([x.toFixed(6), y.toFixed(6)]);
  for (let i=1;i<=n;i++){
    const fval = exprCompiled.evaluate({x: x, y: y});
    y = y + dx * fval;
    x = x + dx;
    if (i % Math.ceil(n/200) === 0 || i===n) { // sample rows if too many
      rows.push([x.toFixed(6), y.toFixed(6)]);
    }
  }

  const tableDiv = document.getElementById("xyTable");
  let html = "<table style='width:100%; border-collapse:collapse'><thead><tr><th style='text-align:left;padding:4px'>x</th><th style='text-align:left;padding:4px'>y</th></tr></thead><tbody>";
  for (const r of rows) {
    html += `<tr><td style='padding:4px'>${r[0]}</td><td style='padding:4px'>${r[1]}</td></tr>`;
  }
  html += "</tbody></table>";
  tableDiv.innerHTML = html;
  document.getElementById("tableCard").style.display = "block";
}
