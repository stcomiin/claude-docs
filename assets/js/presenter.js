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
  var textMode = false;    // clicks place typed labels instead of strokes
  var labelEditor = null;  // open contenteditable label editor, null when none
  var labelColor = "#ef4444";   // tool color captured when the editor opened
  var committingLabel = false;  // reentrancy guard: removal fires blur -> commit

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
    overlay.addEventListener("pointerdown", onPointerDown);
    overlay.addEventListener("pointermove", onPointerMove);
    overlay.addEventListener("pointerup", onPointerUp);
    overlay.addEventListener("pointercancel", onPointerUp);
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

  // ── Strokes ──
  // Document coordinates (client + scroll) so ink scrolls with the page.
  function docX(e) { return e.clientX + window.scrollX; }
  function docY(e) { return e.clientY + window.scrollY; }

  var TOOLS = [
    { label: "Red pen", color: "#ef4444", width: 3, opacity: 1 },
    { label: "Blue pen", color: "#3b82f6", width: 3, opacity: 1 },
    { label: "Highlighter", color: "#facc15", width: 14, opacity: 0.4 },
  ];
  var tool = TOOLS[0];

  function onPointerDown(e) {
    if (!drawing || !e.isPrimary) return;
    if (textMode) {
      // preventDefault stops the native focus change, so an open editor
      // does not blur-commit AND explicit-commit from the same click.
      e.preventDefault();
      if (labelEditor) { commitLabel(); } else { placeLabelEditor(docX(e), docY(e)); }
      return;
    }
    // Untrusted (synthetic) events have no active pointer to capture; real
    // input succeeds and keeps the stroke when the pointer leaves the window.
    try { overlay.setPointerCapture(e.pointerId); } catch (err) {}
    currentPath = document.createElementNS(SVG_NS, "path");
    currentPath.setAttribute("d", "M" + docX(e) + " " + docY(e));
    currentPath.setAttribute("stroke", tool.color);
    currentPath.setAttribute("stroke-width", tool.width);
    currentPath.setAttribute("stroke-opacity", tool.opacity);
    currentPath.setAttribute("fill", "none");
    currentPath.setAttribute("stroke-linecap", "round");
    currentPath.setAttribute("stroke-linejoin", "round");
    overlay.appendChild(currentPath);
    e.preventDefault();
  }

  // O(n^2) string growth is fine at presentation stroke lengths (hundreds of
  // points); not worth a points-array rebuild.
  function onPointerMove(e) {
    if (!currentPath) return;
    currentPath.setAttribute("d", currentPath.getAttribute("d") + " L" + docX(e) + " " + docY(e));
  }

  function onPointerUp() { currentPath = null; }

  function undoStroke() {
    if (overlay && overlay.lastElementChild) overlay.removeChild(overlay.lastElementChild);
  }

  function clearInk() {
    if (!overlay) return;
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
  }

  // ── Typed labels (multi-line) ──
  // The editor is an HTML contenteditable at document coordinates; commit
  // converts it to a <foreignObject> overlay child with identical width and
  // typography, so committed wrapping matches the editor exactly. Being an
  // overlay child means undo, clear, scroll anchoring, and ephemerality
  // treat labels and strokes uniformly.
  function placeLabelEditor(x, y) {
    labelEditor = document.createElement("div");
    labelEditor.className = "presenter-label-editor";
    labelEditor.contentEditable = "true";
    labelEditor.style.left = x + "px";
    labelEditor.style.top = y + "px";
    // Clamp so the box stays on the page when placed near the right edge.
    labelEditor.style.width = Math.min(380, document.documentElement.scrollWidth - x - 24) + "px";
    labelColor = tool.color; // full opacity even when the highlighter is active
    labelEditor.style.color = labelColor;
    labelEditor.dataset.x = x;
    labelEditor.dataset.y = y;
    labelEditor.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.stopPropagation(); cancelLabel(); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); commitLabel(); }
    });
    labelEditor.addEventListener("blur", function () { commitLabel(); });
    document.body.appendChild(labelEditor);
    labelEditor.focus();
  }

  function commitLabel() {
    if (!labelEditor || committingLabel) return;
    committingLabel = true;
    var text = labelEditor.innerText;
    if (text.trim()) {
      var fo = document.createElementNS(SVG_NS, "foreignObject");
      fo.setAttribute("class", "presenter-label");
      fo.setAttribute("x", labelEditor.dataset.x);
      fo.setAttribute("y", labelEditor.dataset.y);
      fo.setAttribute("width", labelEditor.offsetWidth);
      fo.setAttribute("height", labelEditor.offsetHeight + 4);
      var block = document.createElement("div");
      block.textContent = text; // pre-wrap CSS preserves the hard breaks
      block.style.color = labelColor;
      fo.appendChild(block);
      overlay.appendChild(fo);
    }
    var ed = labelEditor;
    labelEditor = null; // clear before removal: removal fires a final blur
    ed.remove();
    committingLabel = false;
  }

  function cancelLabel() {
    if (!labelEditor) return;
    var ed = labelEditor;
    labelEditor = null; // the blur fired by removal must find nothing to commit
    ed.remove();
  }

  // Radio-style mode pair: exactly one of Draw/Text is pressed at all
  // times, so the filled chip always shows the current mode. Clicking the
  // active mode is a no-op.
  function setMode(mode) {
    var toText = mode === "text";
    if (!toText && labelEditor) commitLabel();
    textMode = toText;
    drawBtn.setAttribute("aria-pressed", String(!toText));
    textBtn.setAttribute("aria-pressed", String(toText));
    if (overlay) overlay.classList.toggle("is-text", toText);
  }

  function enterDrawMode() {
    if (drawing) return;
    drawing = true;
    ensureOverlay().classList.add("is-drawing");
    penBtn.setAttribute("aria-pressed", "true");
    selectTool(0); // spec: red pen is the default on every activation
    setMode("draw"); // and always back to freehand, not text mode
    toolbar.hidden = false;
  }

  // Exiting keeps ink visible (pointer-events return to none, so links work
  // again). Only Clear, refresh, or navigation removes ink.
  function exitDrawMode() {
    if (!drawing) return;
    if (labelEditor) commitLabel(); // do not lose a half-typed label
    drawing = false;
    currentPath = null;
    if (overlay) overlay.classList.remove("is-drawing");
    penBtn.setAttribute("aria-pressed", "false");
    toolbar.hidden = true;
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
  // data-tip drives a CSS tooltip anchored to the button. Never use the
  // native title attribute here: its tooltip is cursor-anchored, and at
  // this bottom-right corner Windows clamps it directly under the pointer.
  penBtn.setAttribute("data-tip", "Draw on page (Alt+P)");
  penBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z"/></svg>';
  penBtn.addEventListener("click", toggleDrawMode);
  document.body.appendChild(penBtn);

  // ── Toolbar (visible only while drawing) ──
  var toolbar = document.createElement("div");
  toolbar.className = "presenter-toolbar";
  toolbar.hidden = true;

  var toolButtons = [];
  function selectTool(i) {
    tool = TOOLS[i];
    toolButtons.forEach(function (b, j) {
      b.setAttribute("aria-pressed", j === i ? "true" : "false");
    });
  }

  TOOLS.forEach(function (t, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "presenter-tool";
    b.style.setProperty("--tool-color", t.color);
    b.setAttribute("aria-label", t.label);
    b.setAttribute("data-tip", t.label);
    b.addEventListener("click", function () { selectTool(i); });
    toolButtons.push(b);
    toolbar.appendChild(b);
  });

  function addAction(label, handler) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "presenter-action";
    b.textContent = label;
    b.addEventListener("click", handler);
    toolbar.appendChild(b);
    return b;
  }
  var drawBtn = addAction("Draw", function () { setMode("draw"); });
  drawBtn.setAttribute("aria-pressed", "true");
  drawBtn.setAttribute("data-tip", "Freehand ink: drag to draw");

  var textBtn = addAction("Text", function () { setMode("text"); });
  textBtn.setAttribute("aria-pressed", "false");
  textBtn.setAttribute("data-tip", "Type labels: click the page to place");

  addAction("Undo", undoStroke);
  addAction("Clear", clearInk);
  addAction("Exit", exitDrawMode);

  // ── Projector mode ──
  // The single deliberate storage exception in this module: sessionStorage
  // (never localStorage) so the type-size bump survives page navigation
  // during a presentation and dies with the tab. Ink is never stored.
  var PROJECTOR_KEY = "presenter-projector";

  var projBtn = addAction("Projector", function () { toggleProjector(); });
  projBtn.setAttribute("aria-pressed", "false");
  projBtn.setAttribute("data-tip", "Projector type size (Alt+B)");

  function applyProjector(on) {
    document.documentElement.classList.toggle("projector", on);
    projBtn.setAttribute("aria-pressed", String(on));
    try {
      if (on) { sessionStorage.setItem(PROJECTOR_KEY, "1"); }
      else { sessionStorage.removeItem(PROJECTOR_KEY); }
    } catch (err) {} // storage may be blocked; mode still works for this page
  }

  function toggleProjector() {
    applyProjector(!document.documentElement.classList.contains("projector"));
  }

  // The class itself is restored synchronously by an inline head script
  // (see head-end.html) so anchor navigation lays out at the right size;
  // this idempotent re-apply only syncs the toolbar button state.
  try {
    if (sessionStorage.getItem(PROJECTOR_KEY) === "1") applyProjector(true);
  } catch (err) {}

  document.body.appendChild(toolbar);

  // ── Keyboard ──
  function inEditable(el) {
    return el && el.closest && el.closest("input, textarea, select, [contenteditable]");
  }

  // Capture phase: the Esc decision must read lightbox state BEFORE the
  // lightbox's own bubble-phase handler removes .is-open, otherwise
  // Esc-with-lightbox-open would close the lightbox AND exit draw mode.
  document.addEventListener("keydown", function (e) {
    if (inEditable(e.target)) return;
    var key = (e.key || "").toLowerCase();
    // Match the produced character first so shortcuts follow the user's
    // layout (on AZERTY the physical KeyZ types "w"). Alt combos keep a
    // physical-code fallback because macOS Option composes characters
    // (Option+P yields a Greek pi, so only the code matches there).
    if (e.altKey && (key === "p" || e.code === "KeyP")) {
      e.preventDefault();
      toggleDrawMode();
      return;
    }
    if (e.altKey && (key === "b" || e.code === "KeyB")) {
      e.preventDefault();
      toggleProjector();
      return;
    }
    if (!drawing) return;
    if (e.key === "Escape") {
      if (document.querySelector(".lightbox.is-open")) return; // lightbox owns this Esc
      exitDrawMode();
    }
    // Character-only on purpose: a code fallback would let QWERTZ Ctrl+Y
    // (physical KeyZ) false-trigger undo. Ctrl+char-Z is what users mean.
    if ((e.ctrlKey || e.metaKey) && key === "z") {
      e.preventDefault();
      undoStroke();
    }
  }, true);
});
