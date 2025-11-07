let runEuler;

// ensure Module exists before WASM loads
var Module = {
  onRuntimeInitialized() {
    console.log("✅ WASM ready");
    runEuler = Module.cwrap("run_euler", "number", ["number","number","number","number","string"]);
    document.getElementById("run").addEventListener("click", computeEuler);
    document.getElementById("clear").addEventListener("click", resetForm);
    ["x0","x","n"].forEach(id => document.getElementById(id).addEventListener("input", updateDx));
    updateDx();
  }
};

function updateDx() {
  const x0 = parseFloat(document.getElementById("x0").value);
  const x = parseFloat(document.getElementById("x").value);
  const n = parseInt(document.getElementById("n").value);
  const dx = (x - x0) / n;
  document.getElementById("dx").value = isFinite(dx) ? dx.toPrecision(6) : "";
}

function computeEuler() {
  if (!runEuler) {
    alert("WASM not loaded yet!");
    return;
  }

  const x0 = parseFloat(document.getElementById("x0").value);
  const y0 = parseFloat(document.getElementById("y0").value);
  const x = parseFloat(document.getElementById("x").value);
  const n = parseInt(document.getElementById("n").value);
  const expr = document.getElementById("expr").value;

  const result = runEuler(x0, y0, x, n, expr);
  document.getElementById("yValue").textContent = `y(${x}) ≈ ${result.toPrecision(6)}`;

  const latex = `f(x,y) = ${math.parse(expr).toTex()}`;
  document.getElementById("mathDisplay").innerHTML = `$$${latex}$$`;
  MathJax.typesetPromise();
}

function resetForm() {
  document.getElementById("x0").value = 0;
  document.getElementById("y0").value = 1;
  document.getElementById("x").value = 1.1;
  document.getElementById("n").value = 100;
  document.getElementById("expr").value = "-x*x*y";
  document.getElementById("mathDisplay").textContent = "Enter an expression and press Compute";
  document.getElementById("yValue").textContent = "";
  updateDx();
}
