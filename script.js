// COUNTDOWN

(function () {
  const targetDate = new Date("2026-07-25T00:00:00+03:00").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    let diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      clearInterval(timerId);
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(secs);
  }

  updateCountdown();
  const timerId = setInterval(updateCountdown, 1000);
})();

// FORM HANDLERS (SubmitForm.com)

function attachFormHandler(formId, statusId) {
  const form = document.getElementById(formId);
  const statusEl = document.getElementById(statusId);

  if (!form || !statusEl) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    statusEl.textContent = "Отправка...";
    statusEl.classList.remove("status--error");
    statusEl.classList.remove("status--success");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        statusEl.textContent = "Спасибо! Ваш ответ отправлен.";
        statusEl.classList.add("status--success");
        form.reset();
      } else {
        statusEl.textContent = "Что-то пошло не так. Попробуйте ещё раз.";
        statusEl.classList.add("status--error");
      }
    } catch (err) {
      statusEl.textContent = "Ошибка сети. Попробуйте чуть позже.";
      statusEl.classList.add("status--error");
    }
  });
}

// подключаем обе формы
attachFormHandler("details-form", "details-status");
attachFormHandler("rsvp-form", "rsvp-status");

// TIMELINE ORDER ON MOBILE (<=902px)
(function () {
  const BREAKPOINT = 902;
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const leftCol = timeline.querySelector(".timeline__col--left");
  const rightCol = timeline.querySelector(".timeline__col--right");
  if (!leftCol || !rightCol) return;

  const itemsOrderDesktop = {
    left: Array.from(leftCol.children),
    right: Array.from(rightCol.children)
  };

  const MOBILE_ORDER = [
    "12:00",
    "15:00",
    "16:30",
    "21:00",
    "23:30"
  ];

  let isMobileApplied = false;

  function applyMobileOrder() {
    if (isMobileApplied) return;
    isMobileApplied = true;

    const allItems = [...itemsOrderDesktop.left, ...itemsOrderDesktop.right];

    const ordered = MOBILE_ORDER.map(time => {
      return allItems.find(item =>
        item
          .querySelector(".timeline__text")
          ?.textContent.trim()
          .startsWith(time)
      );
    }).filter(Boolean);

    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    ordered.forEach(item => {
      leftCol.appendChild(item);
    });
  }

  function restoreDesktopOrder() {
    if (!isMobileApplied) return;
    isMobileApplied = false;

    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    itemsOrderDesktop.left.forEach(item => leftCol.appendChild(item));
    itemsOrderDesktop.right.forEach(item => rightCol.appendChild(item));
  }

  function onResize() {
    if (window.innerWidth <= BREAKPOINT) {
      applyMobileOrder();
    } else {
      restoreDesktopOrder();
    }
  }

  window.addEventListener("resize", onResize);
  onResize();
})();