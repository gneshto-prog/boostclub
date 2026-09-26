(function () {
  "use strict";

  var language = (document.documentElement.lang || "ro").toLowerCase();
  var locale = language === "en" ? "en-GB" : language === "ru" ? "ru-RU" : "ro-RO";
  var storageKey = "boost_booking_confirmation";
  var raw = null;
  try { raw = sessionStorage.getItem(storageKey); } catch (_) { /* Storage can be blocked. */ }
  var state = null;
  try { state = raw ? JSON.parse(raw) : null; } catch (error) { state = null; }

  var start = state && new Date(state.startAt);
  var end = state && new Date(state.endAt);
  var saved = state && new Date(state.savedAt);
  var valid = start && end && saved
    && !Number.isNaN(start.getTime())
    && !Number.isNaN(end.getTime())
    && !Number.isNaN(saved.getTime())
    && end > start
    && saved.getTime() <= Date.now()
    && Date.now() - saved.getTime() < 24 * 60 * 60 * 1000;

  if (!valid) {
    return;
  }

  function text(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  var dateText = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Bucharest",
    dateStyle: "full"
  }).format(start);
  var startTime = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Bucharest",
    hour: "2-digit",
    minute: "2-digit"
  }).format(start);
  var endTime = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Bucharest",
    hour: "2-digit",
    minute: "2-digit"
  }).format(end);

  text("booking-date-confirmed", dateText);
  text("booking-time-confirmed", startTime + "–" + endTime);

  var waCopy = {
    ro: "Bună! Am o rezervare la Boost Club pe " + dateText + ", " + startTime + ". Aș vrea să o modific.",
    en: "Hi! I have a Boost Club booking on " + dateText + " at " + startTime + ". I need to change it.",
    ru: "Здравствуйте! У меня запись в Boost Club: " + dateText + ", " + startTime + ". Я хочу её изменить."
  };
  var wa = document.getElementById("change-booking");
  if (wa) wa.href = "https://wa.me/40726205752?text=" + encodeURIComponent(waCopy[language] || waCopy.ro);

  function icsTimestamp(value) {
    return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  var icsCopy = {
    ro: { summary: "Evaluare corporală gratuită — Boost Club", description: "Rezervare confirmată la Boost Club. Dacă ai nevoie să modifici ora, scrie pe WhatsApp la +40 726 205 752." },
    en: { summary: "Free body assessment — Boost Club", description: "Confirmed booking at Boost Club. To change the time, message +40 726 205 752 on WhatsApp." },
    ru: { summary: "Бесплатная оценка состава тела — Boost Club", description: "Подтверждённая запись в Boost Club. Чтобы изменить время, напишите в WhatsApp: +40 726 205 752." }
  };
  var eventCopy = icsCopy[language] || icsCopy.ro;
  var ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Boost Club//Website Booking//RO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + start.getTime() + "-website@boostclub.ro",
    "DTSTAMP:" + icsTimestamp(new Date()),
    "DTSTART:" + icsTimestamp(start),
    "DTEND:" + icsTimestamp(end),
    "SUMMARY:" + eventCopy.summary.replace(/,/g, "\\,"),
    "DESCRIPTION:" + eventCopy.description.replace(/,/g, "\\,"),
    "LOCATION:Strada Sevastopol 24\\, Sector 1\\, București",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  var calendarButton = document.getElementById("download-calendar");
  if (calendarButton) {
    calendarButton.addEventListener("click", function () {
      var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      var anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "boost-club-rezervare.ics";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  var unavailable = document.getElementById("confirmation-unavailable");
  if (unavailable) unavailable.hidden = true;
  text("confirmation-heading", { ro: "Te așteptăm la Boost Club", en: "See you at Boost Club", ru: "Ждём вас в Boost Club" }[language] || "Boost Club");
  var content = document.getElementById("confirmation-content");
  if (content) content.hidden = false;
})();
