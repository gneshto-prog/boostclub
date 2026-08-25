(function () {
  "use strict";
  if (window.BoostBookingSlots) return;

  var copy = {
    ro: {
      loading: "Verificăm calendarul…",
      empty: "Nu mai sunt locuri libere în această zi. Alege altă dată.",
      closed: "În această zi clubul este închis. Alege altă dată.",
      error: "Nu am putut verifica locurile acum. Încearcă din nou.",
      choose: "Alege o oră disponibilă.",
      selected: "Ora selectată:",
      retry: "Reîncearcă",
      slotTaken: "Locul tocmai a fost rezervat de altcineva. Alege altă oră.",
      alreadyBooked: "Există deja o rezervare activă pentru acest număr. Scrie-ne pe WhatsApp dacă vrei să o schimbi.",
      unavailable: "Calendarul nu poate fi verificat acum. Încearcă din nou în câteva momente.",
      submitError: "Nu am putut confirma rezervarea. Încearcă din nou sau sună-ne."
    },
    en: {
      loading: "Checking the live calendar…",
      empty: "There are no free slots left on this date. Choose another date.",
      closed: "The club is closed on this date. Choose another date.",
      error: "We could not check availability right now. Please try again.",
      choose: "Choose an available time.",
      selected: "Selected time:",
      retry: "Try again",
      slotTaken: "Someone has just booked this slot. Please choose another time.",
      alreadyBooked: "There is already an active booking for this phone number. Message us on WhatsApp if you need to change it.",
      unavailable: "The calendar cannot be checked right now. Please try again in a moment.",
      submitError: "We could not confirm the booking. Please try again or call us."
    },
    ru: {
      loading: "Проверяем календарь…",
      empty: "На эту дату свободных мест нет. Выберите другую дату.",
      closed: "В этот день клуб закрыт. Выберите другую дату.",
      error: "Сейчас не удалось проверить свободные места. Попробуйте ещё раз.",
      choose: "Выберите свободное время.",
      selected: "Выбранное время:",
      retry: "Повторить",
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
        label.innerHTML = "<strong>" + slot.start + "</strong><small>" + slot.start + "–" + slot.end + "</small>";
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
      var date = dateInput.value;
      clear();
      if (!date) {
        status(strings.choose, "hint");
        return Promise.resolve();
      }
      if (controller) controller.abort();
      controller = new AbortController();
      status(strings.loading, "loading");
      slotsNode.setAttribute("aria-busy", "true");
      return fetch("/api/availability?date=" + encodeURIComponent(date), {
        headers: { Accept: "application/json" },
        signal: controller.signal
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok || !body.ok) throw new Error(body.code || "AVAILABILITY_UNAVAILABLE");
          if (!body.hours) {
            clear();
            status(strings.closed, "empty");
            return;
          }
          render(Array.isArray(body.slots) ? body.slots : []);
        });
      }).catch(function (error) {
        if (error && error.name === "AbortError") return;
        clear();
        statusNode.className = "booking-slot-status is-error";
        statusNode.textContent = strings.error + " ";
        var retry = document.createElement("button");
        retry.type = "button";
        retry.className = "booking-retry";
        retry.textContent = strings.retry;
        retry.addEventListener("click", load);
        statusNode.appendChild(retry);
      }).finally(function () {
        slotsNode.removeAttribute("aria-busy");
      });
    }

    function validate() {
      var picked = form.querySelector('input[name="booking_slot"]:checked');
      if (picked) return true;
      status(strings.choose, "error");
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
      if (!result || !result.calendarStartAt || !result.calendarEndAt) {
        throw new Error("CONFIRMATION_DATA_MISSING");
      }
      sessionStorage.setItem("boost_booking_confirmation", JSON.stringify({
        startAt: result.calendarStartAt,
        endAt: result.calendarEndAt,
        savedAt: new Date().toISOString(),
        language: language()
      }));
      location.assign("multumim");
    },
    errorMessage: function (error) {
      var strings = copy[language()];
      var code = error && error.message;
      if (code === "BOOKING_SLOT_UNAVAILABLE") return strings.slotTaken;
      if (code === "PERSON_ALREADY_BOOKED") return strings.alreadyBooked;
      if (code === "AVAILABILITY_UNAVAILABLE") return strings.unavailable;
      return strings.submitError + (error && error.requestId ? " Ref: " + error.requestId : "");
    }
  };

  document.querySelectorAll('form[data-real-booking="true"]').forEach(instance);
})();
