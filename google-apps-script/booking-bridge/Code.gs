/**
 * Boost Club booking bridge (5 Nov 2026).
 *
 * Why this exists: Google refuses to create a service-account key for the club's project
 * (org policy), so the website cannot read or write Gabi's calendar directly. This tiny web app
 * runs AS gneshto@gmail.com and does only this for boostclub.ro/book:
 *   freebusy  -> busy ranges of the primary calendar between two instants
 *   create    -> one "Consultation with <name>" event (idempotent: same id twice = same event)
 *   move      -> new time for an event THIS bridge created (id starts "bcbk")
 *   cancel    -> removes an event THIS bridge created, when the person cancels on the site
 * It can never read titles, touch any other event, or any other calendar.
 *
 * Every call must carry the shared secret stored in Script Properties as BRIDGE_SECRET.
 * Netlify keeps the same value in BOOKING_BRIDGE_SECRET.
 *
 * Setup (Gabi, once): see README.md in this folder.
 */

var CALENDAR_ID = 'primary';
// Gabi's private copy has the secret here; the repo copy stays empty and uses Script Properties.
var EMBEDDED_SECRET = '';
var MAX_RANGE_DAYS = 31;

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return out_({ ok: false, code: 'BAD_JSON' });
  }
  if (!secretOk_(body.secret)) return out_({ ok: false, code: 'FORBIDDEN' });
  try {
    if (body.op === 'freebusy') return out_(freebusy_(body));
    if (body.op === 'create') return out_(create_(body));
    if (body.op === 'move') return out_(move_(body));
    if (body.op === 'cancel') return out_(cancel_(body));
    if (body.op === 'ping') return out_({ ok: true, calendar: Session.getEffectiveUser().getEmail() });
    return out_({ ok: false, code: 'UNKNOWN_OP' });
  } catch (err) {
    console.error(String(err && err.message || err));
    return out_({ ok: false, code: 'BRIDGE_ERROR' });
  }
}

function doGet() {
  return out_({ ok: false, code: 'POST_ONLY' });
}

function secretOk_(given) {
  var want = PropertiesService.getScriptProperties().getProperty('BRIDGE_SECRET') || EMBEDDED_SECRET;
  if (!want || typeof given !== 'string' || given.length !== want.length) return false;
  var diff = 0;
  for (var i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

function instant_(value) {
  var d = new Date(value);
  if (typeof value !== 'string' || isNaN(d.getTime())) throw new Error('BAD_INSTANT');
  return d;
}

function freebusy_(body) {
  var from = instant_(body.timeMin);
  var to = instant_(body.timeMax);
  if (to <= from || to - from > MAX_RANGE_DAYS * 86400000) throw new Error('BAD_RANGE');
  // The FreeBusy API respects "Show as: Free" (transparent) events, so all-day reminders
  // and birthdays do not block the day, while real events and "busy" all-day events do.
  var res = Calendar.Freebusy.query({
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    timeZone: 'Europe/Bucharest',
    items: [{ id: CALENDAR_ID }]
  });
  var cal = res.calendars && res.calendars[CALENDAR_ID];
  if (!cal || (cal.errors && cal.errors.length)) throw new Error('FREEBUSY_FAILED');
  return { ok: true, busy: (cal.busy || []).map(function (b) { return { start: b.start, end: b.end }; }) };
}

function create_(body) {
  var ev = body.event || {};
  var id = String(ev.id || '');
  // Calendar ids: base32hex characters (a-v, 0-9), 5-1024 long.
  if (!/^[a-v0-9]{20,64}$/.test(id)) throw new Error('BAD_EVENT_ID');
  var start = instant_(ev.start);
  var end = instant_(ev.end);
  if (end <= start || end - start > 3 * 3600000) throw new Error('BAD_EVENT_TIME');
  var summary = String(ev.summary || '').slice(0, 200);
  if (!/^Consultation with /.test(summary)) throw new Error('BAD_SUMMARY');

  try {
    var existing = Calendar.Events.get(CALENDAR_ID, id);
    if (existing && existing.status !== 'cancelled') {
      return { ok: true, id: existing.id, url: existing.htmlLink, replay: true };
    }
  } catch (notFound) { /* new event */ }

  var resource = {
    id: id,
    summary: summary,
    location: String(ev.location || '').slice(0, 300),
    description: String(ev.description || '').slice(0, 4000),
    start: { dateTime: start.toISOString(), timeZone: 'Europe/Bucharest' },
    end: { dateTime: end.toISOString(), timeZone: 'Europe/Bucharest' },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 1440 }, { method: 'popup', minutes: 120 }] }
  };
  var email = String(ev.attendeeEmail || '');
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200) {
    resource.attendees = [{ email: email, displayName: summary.replace(/^Consultation with /, '') }];
    resource.guestsCanModify = false;
    resource.guestsCanSeeOtherGuests = false;
  }
  var created = Calendar.Events.insert(resource, CALENDAR_ID, { sendUpdates: resource.attendees ? 'all' : 'none' });
  return { ok: true, id: created.id, url: created.htmlLink, replay: false };
}

function ownId_(value) {
  var id = String(value || '');
  // only events this bridge made (create_ uses ids "bcbk" + 32 hex)
  if (!/^bcbk[a-f0-9]{32}$/.test(id)) throw new Error('NOT_OUR_EVENT');
  return id;
}

function move_(body) {
  var id = ownId_(body.id);
  var start = instant_(body.start);
  var end = instant_(body.end);
  if (end <= start || end - start > 3 * 3600000) throw new Error('BAD_EVENT_TIME');
  var ev = Calendar.Events.get(CALENDAR_ID, id);
  if (!ev || ev.status === 'cancelled') throw new Error('EVENT_GONE');
  var patch = {
    start: { dateTime: start.toISOString(), timeZone: 'Europe/Bucharest' },
    end: { dateTime: end.toISOString(), timeZone: 'Europe/Bucharest' }
  };
  if (body.note) patch.description = String(ev.description || '') + '\n\n' + String(body.note).slice(0, 300);
  var done = Calendar.Events.patch(patch, CALENDAR_ID, id, { sendUpdates: ev.attendees ? 'all' : 'none' });
  return { ok: true, id: done.id, url: done.htmlLink };
}

function cancel_(body) {
  var id = ownId_(body.id);
  var ev;
  try { ev = Calendar.Events.get(CALENDAR_ID, id); } catch (e) { return { ok: true, id: id, gone: true }; }
  if (!ev || ev.status === 'cancelled') return { ok: true, id: id, gone: true };
  Calendar.Events.remove(CALENDAR_ID, id, { sendUpdates: ev.attendees ? 'all' : 'none' });
  return { ok: true, id: id };
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
