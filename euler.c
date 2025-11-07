#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
double eulerStep(double x, double y, double h, double fxy) {
  return y + h * fxy;
}

