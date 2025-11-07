let runEuler;

Module.onRuntimeInitialized = () => {
  runEuler = Module.cwrap("run_euler", "number", ["number", "number", "number", "number", "string"]);
  document.getElementById("run").onclick = computeEuler;
};

function computeEuler() {
  const x0 = parseFloat(document.getElementById("x0").value);
  const y0 = parseFloat(document.getElementById("y0").value);
  const x = parseFloat(document.getElementById("x").value);
  const n = parseInt(document.getElementById("n").value);
  const expr = document.getElementById("expr").value;

  const y_final = runEuler(x0, y0, x, n, expr);

  const output = document.getElementById("output");
  output.innerHTML = `
    \\[
      f(x, y) = ${expr.replace(/\*/g, '\\cdot ')} \\\\
      y(${x}) \\approx ${y_final.toFixed(6)}
    \\]
  `;
  MathJax.typeset();
}
