// Slide navigation for the RASCO deck. No dependencies.
(() => {
  const stage = document.getElementById("stage");
  const slides = [...document.querySelectorAll(".slide")];
  const count = document.getElementById("count");
  const bar = document.querySelector("#progress i");
  const notesPanel = document.getElementById("notesPanel");
  const menu = document.getElementById("menu");
  const menuList = menu.querySelector("ol");
  let index = 0;
  const labels = { explode: ["Exploded view", "Assembled view"], guards: ["Show guards", "Hide guards"], blueprint: ["Blueprint", "Solid view"] };

  // Optional "Prepared for" line on the cover
  const client = document.body.dataset.client.trim();
  if (client) {
    const line = document.querySelector(".client-line");
    line.textContent = `Prepared for ${client}`;
    line.hidden = false;
  }

  // Logo and page number on every slide but the cover
  slides.forEach((slide, i) => {
    if (i === 0) return;
    const foot = document.createElement("div");
    foot.className = "foot";
    foot.innerHTML = `<img src="assets/brand/logo.png" alt=""><span style="font:inherit;color:inherit">${i + 1}</span>`;
    slide.appendChild(foot);
  });

  // Slide list
  slides.forEach((slide, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.innerHTML = `<i>${String(i + 1).padStart(2, "0")}</i>`;
    b.append(slide.dataset.title);
    b.addEventListener("click", () => { go(i); menu.hidden = true; });
    li.append(b);
    menuList.append(li);
  });

  function fit() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `scale(${scale}) translate(-50%, -50%)`;
    window.Rig3D?.resize();
  }

  function go(n) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
      if (i !== index) s.querySelector("video")?.pause();
    });
    count.textContent = `${index + 1} / ${slides.length}`;
    bar.style.width = `${((index + 1) / slides.length) * 100}%`;
    notesPanel.textContent = slides[index].querySelector(".notes")?.textContent ?? "";
    menuList.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-current", i === index));
    updateRig();
    history.replaceState(null, "", `#${index + 1}`);
  }

  // The single 3D canvas follows whichever slide has a [data-rig] host
  function updateRig() {
    const rig = window.Rig3D;
    if (!rig) return;
    const host = slides[index].querySelector("[data-rig]");
    if (host) rig.attach(host, host.dataset.rig, host.dataset.model);
    else rig.detach();
    document.querySelectorAll(".rig-btns button").forEach((b) => { b.setAttribute("aria-pressed", "false"); b.textContent = labels[b.dataset.act][0]; });
  }
  addEventListener("rig-ready", updateRig);

  function rigAction(act, btn) {
    const rig = window.Rig3D;
    if (!rig) return;
    const on = { explode: rig.toggleExplode, guards: rig.toggleGuards, blueprint: rig.toggleBlueprint }[act]();
    btn.setAttribute("aria-pressed", on);
    btn.textContent = labels[act][on ? 1 : 0];
  }
  document.querySelectorAll(".rig-btns button").forEach((b) => b.addEventListener("click", () => { rigAction(b.dataset.act, b); b.blur(); }));

  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  const toggleNotes = () => { notesPanel.hidden = !notesPanel.hidden; };
  const toggleMenu = () => { menu.hidden = !menu.hidden; };
  const toggleFull = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

  document.getElementById("prev").onclick = () => go(index - 1);
  document.getElementById("next").onclick = () => go(index + 1);
  document.getElementById("menuBtn").onclick = toggleMenu;
  document.getElementById("notesBtn").onclick = toggleNotes;
  document.getElementById("fsBtn").onclick = toggleFull;

  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const onVideo = document.activeElement?.tagName === "VIDEO";
    switch (e.key) {
      case "ArrowRight": case "PageDown": if (!onVideo) go(index + 1); break;
      case " ":
        if (onVideo || document.activeElement?.tagName === "BUTTON") break;
        e.preventDefault();
        go(index + 1);
        break;
      case "ArrowLeft": case "PageUp": if (!onVideo) go(index - 1); break;
      case "Home": go(0); break;
      case "End": go(slides.length - 1); break;
      case "f": case "F": toggleFull(); break;
      case "n": case "N": toggleNotes(); break;
      case "m": case "M": toggleMenu(); break;
      case "e": case "E": { const b = slides[index].querySelector('[data-act="explode"]'); if (b) rigAction("explode", b); break; }
      case "Escape": menu.hidden = true; notesPanel.hidden = true; break;
    }
  });

  // Swipe on touch screens
  let startX = null;
  addEventListener("touchstart", (e) => { startX = e.target.closest?.(".rig-stage") ? null : e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Controls appear on mouse movement and fade after a moment
  let uiTimer;
  addEventListener("mousemove", () => {
    document.body.classList.add("show-ui");
    clearTimeout(uiTimer);
    uiTimer = setTimeout(() => document.body.classList.remove("show-ui"), 2200);
  });

  addEventListener("resize", fit);
  addEventListener("hashchange", () => go(fromHash()));
  fit();
  go(fromHash());
})();
