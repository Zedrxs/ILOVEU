(() => {
  window.scrollTo(0, 0);
  document.body.style.overflowX = "hidden";
  let lastScrollY = 0;

  window.addEventListener("scroll", () => {
    window.scrollTo(0, window.scrollY);
  });

  document.body.addEventListener("touchmove", e => {
    e.preventDefault();
  }, { passive: false });

  const rotateOverlay = document.getElementById("rotateOverlay");
  function checkOrientation() {
    if (window.matchMedia("(max-width: 768px) and (orientation: landscape)").matches) {
      rotateOverlay?.classList.remove("hidden");
    } else {
      rotateOverlay?.classList.add("hidden");
    }
  }

  window.addEventListener("orientationchange", () => {
    setTimeout(() => location.reload(), 500);
    setTimeout(checkOrientation, 600);
  });
  window.addEventListener("resize", checkOrientation);

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

  heart.classList.add("heart-pulse");

  window.addEventListener("load", () => {
    checkOrientation();
    headerMain?.classList.add("move-main-up", "heading-shift-right");
    headerSub?.classList.add("show-sub", "heading-shift-right", "calendar-large");
    buttonContainer.classList.replace("fade-out", "fade-in");
    heart.classList.replace("fade-out", "fade-in");
    headings?.classList.replace("fade-out", "fade-in");
    const screen = document.getElementById("whiteScreen");
    screen?.classList.add("fade-out-white");
    setTimeout(() => {
      screen?.remove();
      background?.classList.remove("hidden");
    }, 1500);
  });

  buttons.forEach(button => {
    const btnDate = button.dataset.date;
    const btnText = button.dataset.text?.replace(/\n/g, "<br>");

    if (btnDate <= todayISO) {
      button.addEventListener("click", async () => {
        heart.classList.remove("heart-pulse");
        headerMain?.classList.replace("move-main-up", "move-main-down");
        headerMain?.classList.remove("heading-shift-right");
        headerSub?.classList.replace("show-sub", "hide-sub");
        buttonContainer.classList.replace("fade-in", "fade-out");
        heart.classList.replace("fade-in", "fade-out");
        headings?.classList.replace("fade-in", "fade-out");

        setTimeout(() => {
          buttonContainer.style.display = "none";
          heart.style.display = "none";
          headings && (headings.style.display = "none");

          textboxContent.innerHTML = btnText;
          infoBox.classList.remove("hidden");
          infoBox.style.display = "flex";
          infoBox.style.animation = "openTextbox 0.5s forwards";
        }, 1000);
      });

      const fileName = button.dataset.file;
      if (fileName) {
        button.addEventListener('click', async () => {
          try {
            const res = await fetch(fileName);
            if (!res.ok) throw new Error("Datei nicht gefunden");
            const text = await res.text();
            textboxContent.innerHTML = text.replace(/\n/g, "<br>");
            infoBox.classList.remove("hidden");
          } catch (err) {
            console.error(err);
            textboxContent.textContent = "Text konnte nicht geladen werden.";
            infoBox.classList.remove("hidden");
          }
        });
      }

    } else {
      button.style.opacity = "0.5";
      button.style.cursor = "not-allowed";
    }
  });

  closeBtn.addEventListener("click", () => {
    infoBox.style.animation = "closeTextbox 0.5s forwards";
    setTimeout(() => {
      infoBox.classList.add("hidden");
      infoBox.style.display = "none";

      buttonContainer.style.display = "grid";
      heart.style.display = "block";
      headings && (headings.style.display = "flex");

      headerMain?.classList.replace("move-main-down", "move-main-up");
      headerMain?.classList.add("heading-shift-right");
      headerSub?.classList.replace("hide-sub", "show-sub");
      headerSub?.classList.add("heading-shift-right", "calendar-large");

      buttonContainer.classList.replace("fade-out", "fade-in");
      heart.classList.replace("fade-out", "fade-in");
      headings?.classList.replace("fade-out", "fade-in");

      heart.classList.add("heart-pulse");
      checkOrientation();
    }, 500);
  });
})();
