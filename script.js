(() => {
  //window.scrollTo(0, 0);
  //window.addEventListener("scroll", () => window.scrollTo(0, 0));
  //document.body.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

  // Overlay für Landscape-Hinweis

    window.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollY) {
      window.scrollTo(0, lastScrollY);
    } else {
      lastScrollY = window.scrollY;
    }
  });

  let lastScrollY = 0;

  const rotateOverlay = document.getElementById("rotateOverlay");
  function checkOrientation() {
    if (window.matchMedia("(max-width: 768px) and (orientation: landscape)").matches) {
      rotateOverlay?.classList.remove("hidden");
    } else {
      rotateOverlay?.classList.add("hidden");
    }
  }
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      location.reload();
    }, 500);
    setTimeout(checkOrientation, 600);
  });
  window.addEventListener("resize", checkOrientation);

  const todayISO = new Date().toISOString().split("T")[0];

  const buttons         = document.querySelectorAll(".glow-button");
  const heart           = document.getElementById("heart");
  const background      = document.getElementById("background");
  const infoBox         = document.getElementById("infoBox");
  const textboxContent  = document.getElementById("textboxContent");
  const closeBtn        = document.getElementById("closeTextbox");
  const buttonContainer = document.getElementById("buttonContainer");
  const headings        = document.querySelector(".heading-container");
  const headerMain      = document.querySelector(".header-main");
  const headerSub       = document.querySelector(".header-sub");

  // Startanimation für das Herz und Orientierung prüfen
  heart.classList.add("heart-pulse");
  window.addEventListener("load", () => {
    checkOrientation();

    // Intro-Animation wie beim Schließen
    headerMain?.classList.add("move-main-up", "heading-shift-right");
    headerSub?.classList.add("show-sub", "heading-shift-right", "calendar-large");

    buttonContainer.classList.remove("fade-out");
    buttonContainer.classList.add("fade-in");
    heart.classList.remove("fade-out");
    heart.classList.add("fade-in");
    headings?.classList.remove("fade-out");
    headings?.classList.add("fade-in");

    const screen = document.getElementById("whiteScreen");
    screen?.classList.add("fade-out-white");
    setTimeout(() => {
      screen?.remove();
      background?.classList.remove("hidden");
    }, 1500);
  });

  // Button-Handler
  buttons.forEach(button => {
    const btnDate = button.dataset.date;
    const btnText = button.dataset.text;
    if (btnDate <= todayISO) {
      button.addEventListener("click", () => {
        heart.classList.remove("heart-pulse");
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
          heart.style.display           = "none";
          headings && (headings.style.display = "none");

          textboxContent.textContent = btnText;
          infoBox.classList.remove("hidden");
          infoBox.style.display = "flex";
          infoBox.style.animation = "openTextbox 0.5s forwards";
        }, 1000);
      });
    } else {
      button.style.opacity = "0.5";
      button.style.cursor  = "not-allowed";
    }
  });

  // Schließen der Textbox
  closeBtn.addEventListener("click", () => {
    infoBox.style.animation = "closeTextbox 0.5s forwards";
    setTimeout(() => {
      infoBox.classList.add("hidden");
      infoBox.style.display = "none";

      buttonContainer.style.display = "grid";
      heart.style.display           = "block";
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

      heart.classList.add("heart-pulse");
      checkOrientation();
    }, 500);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.glow-button');
    const box  = document.getElementById('infoBox');
    const content = document.getElementById('textboxContent');
    const closeBtn = document.getElementById('closeTextbox');

    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const fileName = btn.dataset.file;         // z.B. "text_day1.txt"
        try {
          const res = await fetch(fileName);
          if (!res.ok) throw new Error('Datei nicht gefunden');
          const text = await res.text();
          content.textContent = text;
          box.classList.remove('hidden');
        } catch (err) {
          console.error(err);
          content.textContent = 'Entschuldigung, der Text konnte nicht geladen werden.';
          box.classList.remove('hidden');
        }
      });
    });

    closeBtn.addEventListener('click', () => {
      box.classList.add('hidden');
      content.textContent = '';
    });
  });
})();
