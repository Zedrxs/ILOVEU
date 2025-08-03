(() => {
  window.scrollTo(0, 0);
  window.addEventListener("scroll", () => window.scrollTo(0, 0));
  document.body.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      // Seite neu laden, um CSS richtig anzuwenden
      location.reload();
    }, 500);
  });

  const todayISO = new Date().toISOString().split("T")[0];

  const buttons = document.querySelectorAll(".glow-button");
  const heart = document.getElementById("heart");
  const background = document.getElementById("background");
  const infoBox = document.getElementById("infoBox");
  const textboxContent = document.getElementById("textboxContent");
  const closeBtn = document.getElementById("closeTextbox");
  const buttonContainer = document.getElementById("buttonContainer");
  const headings = document.querySelector(".heading-container");
  const headerMain = document.querySelector(".header-main");
  const headerSub = document.querySelector(".header-sub");

  // Startanimation für das Herz
  heart.classList.add("heart-pulse");

  // Nur gültige Buttons aktivieren
  buttons.forEach(button => {
    const btnDate = button.dataset.date;
    const btnText = button.dataset.text;

    if (btnDate <= todayISO) {
      button.addEventListener("click", () => {
        // Entferne Herz-Animation
        heart.classList.remove("heart-pulse");

        // Textanimation beim Klick
        headerMain?.classList.add("move-main-down");
        headerMain?.classList.remove("move-main-up", "heading-shift-right");

        headerSub?.classList.add("hide-sub");
        headerSub?.classList.remove("show-sub", "heading-shift-right");

        buttonContainer.classList.add("fade-out");
        buttonContainer.classList.remove("fade-in");

        heart.classList.add("fade-out");
        heart.classList.remove("fade-in");

        headings?.classList.add("fade-out");
        headings?.classList.remove("fade-in");

        setTimeout(() => {
          buttonContainer.style.display = "none";
          heart.style.display = "none";
          if (headings) headings.style.display = "none";

          textboxContent.textContent = btnText;
          infoBox.classList.remove("hidden");
          infoBox.style.display = "flex";
          infoBox.style.animation = "openTextbox 0.5s forwards";
        }, 1000);
      });
    } else {
      button.style.opacity = 0.5;
      button.style.cursor = "not-allowed";
    }
  });

  closeBtn.addEventListener("click", () => {
    infoBox.style.animation = "closeTextbox 0.5s forwards";

    setTimeout(() => {
      infoBox.classList.add("hidden");
      infoBox.style.display = "none";

      // Bring everything back
      buttonContainer.style.display = "grid";
      heart.style.display = "block";
      headings && (headings.style.display = "flex");

      headerMain?.classList.remove("move-main-down");
      headerMain?.classList.add("move-main-up", "heading-shift-right");

      headerSub?.classList.remove("hide-sub");
      headerSub?.classList.add("show-sub", "heading-shift-right", "calendar-large");

      buttonContainer.classList.remove("fade-out");
      buttonContainer.classList.add("fade-in");

      heart.classList.remove("fade-out");
      heart.classList.add("fade-in");

      headings?.classList.remove("fade-out");
      headings?.classList.add("fade-in");

      // Herzanimation reaktivieren
      heart.classList.add("heart-pulse");
    }, 500);
  });

  window.addEventListener("load", () => {
    const screen = document.getElementById("whiteScreen");
    screen?.classList.add("fade-out-white");

    // Direkt beim Laden Intro-Animationen ausführen (wie beim Close)
    headerMain?.classList.add("move-main-up", "heading-shift-right");
    headerSub?.classList.add("show-sub", "heading-shift-right", "calendar-large");

    setTimeout(() => {
      screen?.remove();
      background.classList.remove("hidden");
    }, 1500);
  });

  const rotateOverlay = document.getElementById("rotateOverlay");

  // Funktion, um Overlay je nach Orientierung zu zeigen/verstecken
  function checkOrientation() {
    if (window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches) {
      rotateOverlay.classList.remove("hidden");
    } else {
      rotateOverlay.classList.add("hidden");
    }
  }

  // Initial prüfen
  checkOrientation();

  // Auf Änderungen der Ausrichtung reagieren
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

})();
