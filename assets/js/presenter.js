/* Presenter Kit — ephemeral ink overlay + projector mode.
   Spec: docs/superpowers/specs/2026-07-21-presenter-kit-design.md (untracked).

   Ink strokes exist only as SVG DOM nodes: no storage, no network. Hugo
   performs a full page load on every navigation, so ink cannot outlive the
   page — ephemerality falls out of the architecture, not cleanup code. */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  // ── Draw-mode state ──
  var drawing = false;     // draw mode active?
  var overlay = null;      // <svg> ink layer; created lazily, lives until navigation
  var currentPath = null;  // <path> being drawn, null between strokes

  // The overlay is absolutely positioned at the document origin and sized to
  // the full document, so stroke coordinates recorded in document space stay
  // anchored to the content they mark while the page scrolls.
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElementNS(SVG_NS, "svg");
    overlay.setAttribute("class", "presenter-overlay");
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    sizeOverlay();
    // Lazy images and projector-mode reflow grow/shrink the page after load.
    new ResizeObserver(sizeOverlay).observe(document.body);
    return overlay;
  }

  function sizeOverlay() {
    if (!overlay) return;
    // Zero own height first so the measurement can shrink: the overlay's own
    // box extends the document's scrollable overflow, so measuring with the
    // old height in place could only ever grow.
    overlay.style.height = "0px";
    overlay.style.height = document.documentElement.scrollHeight + "px";
  }

  function enterDrawMode() {
    if (drawing) return;
    drawing = true;
    ensureOverlay().classList.add("is-drawing");
    penBtn.setAttribute("aria-pressed", "true");
  }

  // Exiting keeps ink visible (pointer-events return to none, so links work
  // again). Only Clear, refresh, or navigation removes ink.
  function exitDrawMode() {
    if (!drawing) return;
    drawing = false;
    currentPath = null;
    if (overlay) overlay.classList.remove("is-drawing");
    penBtn.setAttribute("aria-pressed", "false");
  }

  function toggleDrawMode() {
    if (drawing) { exitDrawMode(); } else { enterDrawMode(); }
  }

  // ── Pen button (always visible, stacks above the scroll-to-top button) ──
  var penBtn = document.createElement("button");
  penBtn.type = "button";
  penBtn.className = "presenter-pen";
  penBtn.setAttribute("aria-label", "Toggle draw mode (Alt+P)");
  penBtn.setAttribute("aria-pressed", "false");
  penBtn.title = "Draw on page (Alt+P)";
  penBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z"/></svg>';
  penBtn.addEventListener("click", toggleDrawMode);
  document.body.appendChild(penBtn);

  // ── Keyboard ──
  function inEditable(el) {
    return el && el.closest && el.closest("input, textarea, select, [contenteditable]");
  }

  // Capture phase: the Esc decision must read lightbox state BEFORE the
  // lightbox's own bubble-phase handler removes .is-open, otherwise
  // Esc-with-lightbox-open would close the lightbox AND exit draw mode.
  document.addEventListener("keydown", function (e) {
    if (inEditable(e.target)) return;
    if (e.altKey && e.code === "KeyP") {
      e.preventDefault();
      toggleDrawMode();
      return;
    }
    if (!drawing) return;
    if (e.key === "Escape") {
      if (document.querySelector(".lightbox.is-open")) return; // lightbox owns this Esc
      exitDrawMode();
    }
  }, true);
});
