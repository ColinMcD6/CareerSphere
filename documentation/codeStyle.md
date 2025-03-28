# Coding Style Guide

This document outlines the coding conventions and best practices for the project. Following these guidelines ensures consistency, readability, and maintainability of the codebase.

---

## General Guidelines
- Write clean, readable, and self-documenting code.
- Use meaningful and descriptive names for variables, functions, and classes.
- Avoid hardcoding values; use constants or configuration files where applicable.
- Write comments to explain **why** something is done, not **what** is done.
- Follow the DRY (Don't Repeat Yourself) principle to avoid code duplication.

---

## Naming Conventions
- **Variables**: Use `camelCase` for variable names (e.g., `userName`, `totalAmount`).
- **Functions**: Use `camelCase` for function names (e.g., `getUserData`, `calculateTotal`).
- **Constants**: Use `UPPER_SNAKE_CASE` for constants (e.g., `MAX_RETRIES`, `API_URL`).
- **Files**: Use `camelCase` and `dot.notation` for file names (e.g, `jobPosting.controller.ts`, `user.controller.ts`)
- **Table Fields**: Use `camelCase` for table fields (e.g, `compensationType`, `jobType`)

---

## Language-Specific Guidelines

### JavaScript/TypeScript Specific
- Use `const` for variables that do not change and `let` for variables that do.
- Use arrow functions (`() => {}`) for anonymous functions.
- Prefer `async/await` over `.then()` for handling promises.
- Use TypeScript for type safety and define interfaces or types for objects.
- Add a newline at the end of each file.

### Bracketing
- For methods and loops, the opening bracket will be on the first line and the closing bracket on its own line.

```typescript
function calculateTotal(){
    //do something
}
```

```typescript
for (int i = 0; i < numSize; i++) {
// do stuff
}
```

For logical statements, next statement should start in the next line

```typescript
if (condition) {

} 
else if (condition) {

} 
else if (condition) {

} 
else {

}
```
This also goes for exceptions.

---

## Commenting
- Use single-line comments (`//`) for brief explanations.
- Use multi-line comments (`/* */` or `/** */`) for detailed documentation.
- Document all public functions, classes, and modules with JSDoc or similar tools.

Example:
```typescript
/**
 * Calculates the total price of items in the cart.
 * @param items - Array of items with price and quantity.
 * @returns Total price as a number.
 */
function calculateTotal(items: { price: number; quantity: number }[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}