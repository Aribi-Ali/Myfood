# Context Pruning Evaluation (OpenCode)

Status: **benchmark pending — pruning currently DISABLED**

## Research summary

Candidates evaluated (Aug 2026):

| Plugin | Maintained | Docs | Notes |
| --- | --- | --- | --- |
| `@tarquinen/opencode-dcp@latest` | Yes (v3.1.12, May 2026) | Extensive README + JSON schema | Mainstream option, listed in the official OpenCode ecosystem page, ~9K weekly downloads, AGPL-3.0. **Selected.** |
| `opencode-acp` (ranxianglei fork) | Yes (v1.14.5, Jul 2026) | Extensive | Hardened DCP fork (35 bug fixes), ~1.7K weekly downloads, AGPL-3.0. Alternative if DCP underperforms. |
| `@tuanhung303/opencode-acp` | Slowed (last push Feb 2026) | Good | MIT, simpler; less active. Not selected. |

Decision: **DCP** was chosen because it is the most widely used, best documented, and is the plugin referenced by OpenCode's official ecosystem docs. `opencode-acp` (ranxianglei) is the designated fallback — it is a drop-in replacement with the same slash commands.

## How DCP works

- Exposes a `compress` tool that the model calls to replace stale conversation spans with high-fidelity summaries (smarter than OpenCode's built-in compaction, which fires statically at max context).
- Automatic strategies: deduplicates repeated tool calls and prunes inputs of errored tool calls.
- Never mutates session history — pruned content is replaced with placeholders only for requests sent to the LLM.
- Cost: DCP claims the compress tool (a few hundred tokens of schema) plus summaries. Trade-off: prunes LLM prompt-cache prefixes on compression.

## Current install (reversible)

- Plugin: `@tarquinen/opencode-dcp@latest` (v3.1.14 installed) — registered by the OpenCode CLI in `.opencode/opencode.json` and `.opencode/tui.json` (project-local scope), cached under `~/.cache/opencode/packages/@tarquinen/opencode-dcp@latest`.
- Config: `.opencode/dcp.jsonc` with `"enabled": false`.
- Revert: delete `.opencode/dcp.jsonc` and remove the `@tarquinen/opencode-dcp@latest` entry from the `plugin` arrays in `.opencode/opencode.json` and `.opencode/tui.json` (or run `opencode plugin <pkg> --force` to replace).

Why disabled by default: the model is **Qwen3-Coder 30B (local Ollama)**. Local models are more sensitive to losing verbatim context than hosted frontier models, and DCP's default thresholds (50K/100K tokens) assume a large context window. Per project rules, pruning must be benchmarked before it becomes a permanent part of the workflow.

## Benchmark plan

Environment notes first:

- Confirm the Ollama server `192.168.1.48:11434` is reachable and record the real context window (`/api/show` → `model_info["qwen3.context_length"]`, and the Ollama `num_ctx` for `qwen3-coder:latest`). The two can differ; Ollama defaults to 4096 unless overridden.
- Check in-session context with `/dcp context` before each run.

Method — A/B, same model, same tasks, same temperature:

1. Pick 3 representative project tasks:
   - **Cross-file architecture task:** e.g., "Add phone verification to a new store flow end-to-end" (spans migrations, models, controllers, routes, frontend).
   - **Bug-fix + regression task:** a real past bug, e.g., "Fix the ambiguous `store_id` in OwnerDashboardController top-foods query" (requires reading callers and adding a regression test).
   - **Refactor task:** e.g., "Extract `convertTemplateToBlocks` without changing behavior" (requires holding a large file's context).
2. Run each task twice: once with DCP disabled (baseline), once enabled with `.opencode/dcp.jsonc` flipped to `"enabled": true` (and `compaction.auto=false`).
3. Score each run on:
   - **Accuracy:** does the result satisfy the acceptance criteria?
   - **Code quality:** style, reuse, test coverage (use the existing `code-review-and-quality` skill).
   - **Regression rate:** existing PHPUnit suite (`composer test`) + frontend `typecheck` still green.
   - **Context usage:** `/dcp context` / `/dcp stats` token usage per session.
   - **Response speed:** wall-clock time per task.
   - **Cross-file understanding:** did the agent correctly reference related files it had read earlier in the session?
   - **Multi-step completion:** could it finish a multi-step task without re-reading everything?
4. Record results in a table in this file.

## Decision rule

Keep DCP permanently enabled only if it does NOT reduce code quality or lose important architectural context (scores equal or better than baseline on accuracy/code-quality/regressions, with meaningful context savings). If the benchmark shows degradation on the local 30B model, remove the plugin line from `opencode.json` and delete `.opencode/dcp.jsonc`.

Also test the fallback (`opencode-acp` from the ranxianglei repo) if DCP shows promise but has rough edges.

## Known limitation

If the Ollama `num_ctx` is the default 4096, the effective context is tiny and pruning gains are marginal — consider raising `num_ctx` for the model in the Ollama Modelfile before benchmarking, so the comparison is meaningful.
