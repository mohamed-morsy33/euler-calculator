#include <stdio.h>
#include "tinyexpr.h"
#include <emscripten/emscripten.h>

float f(double x, double y, const char *expr) {
    te_variable vars[] = {{"x", &x}, {"y", &y}};
    int err;
    te_expr *expression = te_compile(expr, vars, 2, &err);
    if (expression) {
        double result = te_eval(expression);
        te_free(expression);
        return result;
    } else {
        printf("Parse error at %d\n", err);
        return 0.0;
    }
}


EMSCRIPTEN_KEEPALIVE
double run_euler(double x0, double y0, double delta_x, int n, const char *expr)
{
  // printf("Enter the values x0,y0,delta_x,n: \n");
  // scanf("%lf%lf%lf%d", &x0, &y0, &x, &n);

  // printf("Enter f(x, y): ");
  // scanf(" %99[^\n]", expr);

  double x=x0;
  double y=y0;
  double h = (x-x0)/n;

  for (int i=1; i <=n; i++)
  {
    y += h*f(x,y, expr);
    x+=h;
  }

  // printf("Final y result: %f\n", y);
  return y;
}
