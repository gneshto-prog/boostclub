(function () {
  "use strict";
  if (window.BoostLeadPipeline) return;

  function uuid() {
    if (window.BoostAttribution && window.BoostAttribution.newId) {
      return window.BoostAttribution.newId();
    }
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === "x" ? r : (r & 3 | 8);
      return v.toString(16);
    });
  }

  function languageFor(form) {
    var lang = form.querySelector('input[name="lang"]');
    if (lang && /^(ro|en|ru)$/.test(lang.value)) return lang.value;
    if (location.pathname.indexOf("/en/") === 0) return "en";
    if (location.pathname.indexOf("/ru/") === 0) return "ru";
    return "ro";
  }

  function selected(form, names) {
    for (var i = 0; i < names.length; i += 1) {
      var field = form.querySelector('input[name="' + names[i] + '"]:checked');
      if (field) return field;
    }
    return null;
  }

  function suffixIndex(field) {
    var match = field && field.id ? field.id.match(/p([0-9]+)$/) : null;
    return match ? parseInt(match[1], 10) : -1;
  }

  function goalCategory(field) {
    var source = ((field && field.id) || "") + " " + ((field && field.value) || "");
    source = source.toLowerCase();
    if (/slab|loss|похуд/.test(source)) return "slabire";
    if (/masa|muscle|мыш/.test(source)) return "masa";
    if (/energ|энерг/.test(source)) return "energie";
    if (/tonus|tone|тонус/.test(source)) return "tonus";
    return "altele";
  }

  function hidden(form, name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value || "";
  }

  function canonicalPayload(form) {
    var formName = form.getAttribute("name") || "";
    var language = languageFor(form);
    var isBusiness = formName === "partner-lead";
    var attribution = window.BoostAttribution && window.BoostAttribution.current
      ? window.BoostAttribution.current()
      : {};
    var idempotency = form.dataset.idempotencyKey || uuid();
    form.dataset.idempotencyKey = idempotency;

    var payload = {
      idempotencyKey: idempotency,
      formName: formName,
      language: language,
      leadType: isBusiness ? "business" : "client",
      landingPage: location.pathname,
      pageUrl: location.href.split("#")[0],
      attribution: attribution,
      botField: (form.elements["bot-field"] && form.elements["bot-field"].value) || ""
    };

    if (isBusiness) {
      payload.fullName = (form.elements.name && form.elements.name.value || "").trim();
      payload.contact = (form.elements.contact && form.elements.contact.value || "").trim();
      payload.phone = payload.contact;
      payload.country = (form.elements.country && form.elements.country.value || "").trim();
      payload.message = (form.elements.message && form.elements.message.value || "").trim();
    } else {
      var day = selected(form, ["ziua", "day"]);
      var time = selected(form, ["interval", "time"]);
      var goal = selected(form, ["obiectiv", "goal"]);
      var dayIndex = suffixIndex(day);
      var timeIndex = suffixIndex(time);
      var weekdays = [1, 2, 3, 4, 5, 7];
      var starts = ["07:00", "10:00", "13:00", "16:00"];
      var ends = ["10:00", "13:00", "16:00", dayIndex === 5 ? "18:00" : "20:00"];
      payload.fullName = ((form.elements.prenume && form.elements.prenume.value)
        || (form.elements.firstname && form.elements.firstname.value) || "").trim();
      payload.phone = ((form.elements.telefon && form.elements.telefon.value)
        || (form.elements.phone && form.elements.phone.value) || "").trim();
      payload.contact = payload.phone;
      payload.preferredWeekday = weekdays[dayIndex];
      payload.preferredStart = starts[timeIndex];
      payload.preferredEnd = ends[timeIndex];
      payload.goalCategory = goalCategory(goal);
      payload.message = [day && day.value, time && time.value, goal && goal.value].filter(Boolean).join(" · ");
    }

    hidden(form, "idempotency_key", idempotency);
    hidden(form, "lead_type", payload.leadType);
    hidden(form, "landing_page", payload.landingPage);
    hidden(form, "click_id", attribution.last_whatsapp_click_id || "");
    return payload;
  }

  async function archiveInNetlify(form) {
    var response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!response.ok) throw new Error("Netlify Forms archive failed");
  }

  async function submit(form) {
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      throw new Error("FORM_INVALID");
    }
    var payload = canonicalPayload(form);
    var response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    var result = {};
    try { result = await response.json(); } catch (err) { /* handled below */ }
    if (!response.ok || !result.ok) {
      var error = new Error(result.code || "LEAD_PIPELINE_FAILED");
      error.savedToCrm = !!result.savedToCrm;
      error.requestId = result.requestId || "";
      throw error;
    }

    try { await archiveInNetlify(form); } catch (archiveError) {
      console.warn("Lead reached CRM but the Netlify Forms archive failed.", archiveError);
    }

    if (window.BoostAttribution && window.BoostAttribution.track) {
      window.BoostAttribution.track("generate_lead", payload.formName, {
        lead_type: payload.leadType,
        language: payload.language,
        page_path: location.pathname
      });
    } else if (window.bcTrack) {
      window.bcTrack("generate_lead", payload.formName, {
        lead_type: payload.leadType,
        language: payload.language
      });
    }
    return result;
  }

  window.BoostLeadPipeline = { submit: submit };
})();
