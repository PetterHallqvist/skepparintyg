# ADR-0002: Original fictional charts only

_2026-07-16 · accepted · continuous record · SPEC M-1 DoD item_

## Decision

All chart material is **original and fictional**. We do not trace,
georeference, redraw, simplify or derive coastlines, depths, fairways, names,
marks, light positions or any other information from Sjöfartsverket charts or
any real chart product (SPEC §20.1, §74.1). Chart artwork is produced by our
own deterministic generator (`/pipeline/chart-gen`, Phase 3) with invented
geography and invented place names.

Every chart surface and export carries the persistent watermark
**"ÖVNINGSKORT — EJ FÖR NAVIGATION"**, and charts are not exportable without
it.

## Rationale

Sjöfartsverket requires permission to publish chart extracts or to create a
map using its chart information as basis or model. A fictional environment
also removes any risk that learners treat training material as navigable.

## Consequences

- A maritime-cartography/domain review of the generated worlds is required
  before launch (tracked in `docs/HUMAN_VERIFY.md` #10).
- If a licensed real-chart mode is ever wanted, it is a separate initiative
  with a written licence first (SPEC §23.2).
