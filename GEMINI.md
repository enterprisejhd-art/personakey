# Project AI & Cost Optimization Rules
1. **Model Routing:** Always default to `gemini-2.5-flash` for API routes, tool selection, and structured JSON extraction. Never switch to Pro models unless explicitly requested.
2. **Minimal Context & Diffs:** When editing code, modify only the specific target function or component. Do not regenerate entire files or pass full repository/conversation histories in API payloads.
3. **Tool & Thinking Discipline:** Keep `thinkingBudget` at `0` for deterministic tasks and tool routing. Attach `googleSearch` or `codeExecution` tools only to endpoints that strictly require live web data or math execution.
