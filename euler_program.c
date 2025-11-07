#include <stdio.h>
#include "tinyexpr.h"

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


int main()
{
  double x0,y0,x,y,h;
  int i,n;
  char expr[200];

  printf("Enter the values x0,y0,delta_x,n: \n");
  scanf("%lf%lf%lf%d", &x0, &y0, &x, &n);

  printf("Enter f(x, y): ");
  scanf(" %99[^\n]", expr);

  h = (x-x0)/n;
  x=x0;
  y=y0;

  for (i=1; i <=n; i++)
  {
    y += h*f(x,y, expr);
    x+=h;
  }

  printf("Final y result: %f\n", y);
}
