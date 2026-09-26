(function () {
  "use strict";
  if (window.BoostBookingSlots) return;

  var copy = {
    ro: {
      loading: "Verificăm calendarul…",
      empty: "Nu mai sunt locuri libere în această zi. Alege altă dată.",
      closed: "În această zi clubul este închis. Alege altă dată.",
      error: "Nu putem încărca orele disponibile acum. Nu ai făcut încă o rezervare. Încearcă din nou sau contactează-ne ca să stabilim ora.",
      choose: "Alege o oră disponibilă.",
      selected: "Ora selectată:",
      retry: "Încearcă din nou",
      whatsapp: "Stabilește ora pe WhatsApp", call: "Sună-ne", message: "Bună! Aș dori să stabilim ora evaluării gratuite.", unknown: "Nu am primit confirmarea. Verifică înainte de a face altă rezervare: reîncearcă fără să schimbi datele sau contactează-ne.",
      slotTaken: "Locul tocmai a fost rezervat de altcineva. Alege altă oră.",
      alreadyBooked: "Există deja o rezervare activă pentru acest număr. Scrie-ne pe WhatsApp dacă vrei să o schimbi.",
      unavailable: "Calendarul nu poate fi verificat acum. Încearcă din nou în câteva momente.",
      submitError: "Nu am putut confirma rezervarea. Încearcă din nou sau sună-ne."
    },
    en: {
      loading: "Checking the live calendar…",
      empty: "There are no free slots left on this date. Choose another date.",
      closed: "The club is closed on this date. Choose another date.",
      error: "We cannot load available times right now. You have not made a booking. Try again or contact us to arrange your visit.",
      choose: "Choose an available time.",
      selected: "Selected time:",
      retry: "Try again",
      whatsapp: "Arrange a time on WhatsApp", call: "Call us", message: "Hello! I would like to arrange my free assessment.", unknown: "We have not received confirmation. Before making another booking, retry without changing your details or contact us to check.",
      slotTaken: "Someone has just booked this slot. Please choose another time.",
      alreadyBooked: "There is already an active booking for this phone number. Message us on WhatsApp if you need to change it.",
      unavailable: "The calendar cannot be checked right now. Please try again in a moment.",
      submitError: "We could not confirm the booking. Please try again or call us."
    },
    ru: {
      loading: "Проверяем календарь…",
      empty: "На эту дату свободных мест нет. Выберите другую дату.",
      closed: "В этот день клуб закрыт. Выберите другую дату.",
      error: "Сейчас не удалось загрузить свободное время. Запись ещё не сделана. Повторите попытку или свяжитесь с нами.",
      choose: "Выберите свободное время.",
      selected: "Выбранное время:",
      retry: "Повторить",
      whatsapp: "Выбрать время в WhatsApp", call: "Позвонить", message: "Здравствуйте! Хочу выбрать время бесплатной оценки состава тела.", unknown: "Подтверждение не получено. Прежде чем записываться снова, повторите попытку без изменения данных или свяжитесь с нами для проверки.",
      slotTaken: "Это время только что забронировали. Выберите другой слот.",
      alreadyBooked: "Для этого номера уже есть активная запись. Напишите нам в WhatsApp, если хотите её изменить.",
      unavailable: "Сейчас календарь недоступен. Попробуйте ещё раз через несколько минут.",
      submitError: "Не удалось подтвердить запись. Попробуйте ещё раз или позвоните нам."
    }
  };

  function language() {
    var lang = (document.documentElement.lang || "ro").toLowerCase();
    return copy[lang] ? lang : "ro";
  }

  function bucharestToday() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Bucharest",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    function value(type) {
      return parts.find(function (part) { return part.type === type; }).value;
    }
    return value("year") + "-" + value("month") + "-" + value("day");
  }

  function init(form) {
    var dateInput = form.querySelector('input[name="booking_date"]');
    var slotsNode = form.querySelector('[data-booking-slots]');
    var statusNode = form.querySelector('[data-booking-status]');
    if (!dateInput || !slotsNode || !statusNode) return null;

    var strings = copy[language()];
    var controller = null;
    var generation = 0;
    var failed = false;
    dateInput.min = bucharestToday();
    if (!dateInput.value) dateInput.value = dateInput.min;

    function status(message, kind) {
      statusNode.className = "booking-slot-status" + (kind ? " is-" + kind : "");
      statusNode.textContent = message;
    }

    function clear() {
      slotsNode.textContent = "";
      form.dataset.bookingReady = "false";
    }

    function render(slots) {
      clear();
      slots.forEach(function (slot, index) {
        var id = "booking-slot-" + index;
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "booking_slot";
        input.id = id;
        input.value = slot.startAt;
        input.required = true;
        input.dataset.label = slot.start + "–" + slot.end;

        var label = document.createElement("label");
        label.className = "booking-slot";
        label.htmlFor = id;
        var strong = document.createElement("strong");
        strong.textContent = slot.start;
        var small = document.createElement("small");
        small.textContent = slot.start + "–" + slot.end;
        label.append(strong, small);
        input.addEventListener("change", function () {
          status(strings.selected + " " + input.dataset.label, "success");
        });
        slotsNode.appendChild(input);
        slotsNode.appendChild(label);
      });
      form.dataset.bookingReady = slots.length ? "true" : "false";
      status(slots.length ? strings.choose : strings.empty, slots.length ? "hint" : "empty");
    }

    function load() {
      var request = ++generation;
      if (controller) controller.abort();
      var active = new AbortController();
      controller = active;
      var date = dateInput.value;
      var timedOut = false;
      clear();
      failed = false;
      if (!date || !dateInput.checkValidity()) {
        status(strings.choose, "hint");
        slotsNode.removeAttribute("aria-busy");
        return Promise.resolve();
      }
      status(strings.loading, "loading");
      slotsNode.setAttribute("aria-busy", "true");
      var timer = setTimeout(function () { timedOut = true; active.abort(); }, 12000);
      return fetch("/api/availability?date=" + encodeURIComponent(date), {
        headers: { Accept: "application/json" }, signal: active.signal
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (request !== generation) return;
          if (!response.ok || !body.ok) {
            var error = new Error(body.code || "AVAILABILITY_UNAVAILABLE");
            error.requestId = body.requestId;
            throw error;
          }
          if (!Array.isArray(body.slots) || body.slots.some(function (slot) {
            return !slot || !/^\d{2}:\d{2}$/.test(slot.start) || !/^\d{2}:\d{2}$/.test(slot.end)
              || !Number.isFinite(Date.parse(slot.startAt));
          })) throw new Error("INVALID_AVAILABILITY_RESPONSE");
          if (!body.hours) { clear(); status(strings.closed, "empty"); return; }
          render(body.slots);
        });
      }).catch(function (error) {
        if (request !== generation || (error.name === "AbortError" && !timedOut)) return;
        failed = true;
        clear();
        status(strings.error + (error.requestId ? " Ref: " + error.requestId : ""), "error");
        var actions = document.createElement("span");
        actions.className = "booking-recovery";
        var retry = document.createElement("button");
        retry.type = "button"; retry.className = "booking-retry"; retry.textContent = strings.retry;
        retry.addEventListener("click", load);
        var whatsapp = document.createElement("a");
        whatsapp.href = "https://wa.me/40726205752?text=" + encodeURIComponent(strings.message);
        whatsapp.textContent = strings.whatsapp;
        var call = document.createElement("a");
        call.href = "tel:+40726205752"; call.textContent = strings.call;
        actions.append(retry, whatsapp, call);
        statusNode.appendChild(actions);
      }).finally(function () {
        clearTimeout(timer);
        if (request === generation) slotsNode.removeAttribute("aria-busy");
      });
    }

    function validate() {
      var picked = form.querySelector('input[name="booking_slot"]:checked');
      if (picked) return true;
      if (!failed) status(strings.choose, "error");
      dateInput.focus();
      return false;
    }

    dateInput.addEventListener("change", load);
    load();
    return { load: load, validate: validate };
  }

  var instances = new WeakMap();
  function instance(form) {
    if (!form) return null;
    if (!instances.has(form)) instances.set(form, init(form));
    return instances.get(form);
  }

  window.BoostBookingSlots = {
    init: instance,
    refresh: function (form) {
      var current = instance(form);
      return current ? current.load() : Promise.resolve();
    },
    validate: function (form) {
      var current = instance(form);
      return current ? current.validate() : true;
    },
    confirm: function (result) {
      if (!result || !result.ok || !result.calendarEventId || !Number.isFinite(Date.parse(result.calendarStartAt)) || !Number.isFinite(Date.parse(result.calendarEndAt))) {
        throw new Error("CONFIRMATION_DATA_MISSING");
      }
      var confirmation = {
        startAt: result.calendarStartAt,
        endAt: result.calendarEndAt,
        savedAt: new Date().toISOString(),
        language: language()
      };
      try { sessionStorage.setItem("boost_booking_confirmation", JSON.stringify(confirmation)); }
      catch (_) { return false; }
      location.assign("multumim");
      return true;
    },
    errorMessage: function (error) {
      var strings = copy[language()];
      var code = error && error.message;
      if (code === "BOOKING_OUTCOME_UNKNOWN" || (error && error.savedToCrm)) return strings.unknown;
      if (code === "BOOKING_SLOT_UNAVAILABLE") return strings.slotTaken;
      if (code === "PERSON_ALREADY_BOOKED") return strings.alreadyBooked;
      if (code === "AVAILABILITY_UNAVAILABLE") return strings.unavailable;
      return strings.submitError + (error && error.requestId ? " Ref: " + error.requestId : "");
    }
  };

  document.querySelectorAll('form[data-real-booking="true"]').forEach(instance);
})();
