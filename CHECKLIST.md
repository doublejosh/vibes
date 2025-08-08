# Pre-Prompt Checklist

**Check this file before implementing any prompt to ensure consistency and quality.**

## Before Making Changes

### 1. Content Separation ✓
- [ ] Will this change affect slide content? If yes, update `content/slides.json` not HTML/JS
- [ ] Are we maintaining the separation between presentation logic and content?
- [ ] Does the change preserve the ability to easily update slides without touching code?

### 2. Project Structure ✓
- [ ] Are new files being placed in the correct directories (`styles/`, `scripts/`, `content/`, `assets/`)?
- [ ] Is the naming convention consistent (kebab-case for files, camelCase for JS variables)?
- [ ] Will this change break the existing file organization?

### 3. Responsive Design ✓
- [ ] Does this change work on both desktop and mobile?
- [ ] Are touch/swipe gestures still functional?
- [ ] Is keyboard navigation preserved?
- [ ] Does the change maintain accessibility standards?

### 4. Performance ✓
- [ ] Will this change impact presentation loading speed?
- [ ] Are animations using `transform` and `opacity` for smooth performance?
- [ ] Is the change avoiding unnecessary DOM reflows?

### 5. Documentation ✓
- [ ] Does this prompt need to be added to `PROMPTS.md`?
- [ ] Should any guidelines be updated in `GUIDELINES.md`?
- [ ] Is the `README.md` still accurate after changes?

## After Making Changes

### 6. Testing ✓
- [ ] Test navigation: keyboard arrows, space bar, home/end keys
- [ ] Test touch: swipe left/right on mobile
- [ ] Test responsiveness: resize browser window
- [ ] Test all 20 slides load and display correctly
- [ ] Verify slide counter and progress bar work

### 7. Code Quality ✓
- [ ] Are error messages helpful and user-friendly?
- [ ] Is error handling in place for async operations?
- [ ] Does the code follow the established patterns in `GUIDELINES.md`?

### 8. Content Integrity ✓
- [ ] Are all 20 slides still present and accessible?
- [ ] Is the slide numbering sequential (1-20)?
- [ ] Do slide types (`title`, `content`, `end`) still work correctly?

---

**Remember: This presentation exists solely for 20 slides. Every change should support that core purpose.**
