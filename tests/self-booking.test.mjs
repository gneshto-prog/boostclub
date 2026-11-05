// Self-serve booking (boostclub.ro/book, 5 Nov 2026): slot rules + both functions with mocked
// Google bridge, Supabase and Telegram. Run: node --experimental-strip-types --test tests/self-booking.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_RULES, parseRules, offerDates, gridFor, freeSlotsFor, findFreeSlot, instantAt, localDate } from '../netlify/functions/_shared/booking-rules.mts';

const env = {
  SUPABASE_URL: 'https://test.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', WEBSITE_INTAKE_TOKEN: 'tok',
  BOOKING_BRIDGE_URL: 'https://script.google.com/macros/s/test/exec', BOOKING_BRIDGE_SECRET: 'sec',
  MENU_TELEGRAM_BOT_TOKEN: 'bot', MENU_TELEGRAM_CHAT_ID: '1',
};
globalThis.Netlify = { env: { get: (n) => env[n] } };
const { default: slots } = await import('../netlify/functions/booking-slots.mts');
const { default: book, normalizePhone } = await import('../netlify/functions/booking-book.mts');
const { default: me } = await import('../netlify/functions/booking-me.mts');

const R = DEFAULT_RULES;
// the same rules without the 'Mon 9-Thu 12 is full' closure, for tests that need an open weekday week
const RO = structuredClone(DEFAULT_RULES);
for (const d of ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']) delete RO.dates[d];
// Thu 5 Nov 2026 11:47 Bucharest
const NOW = new Date('2026-11-05T09:47:00Z');

test('never today: first offered day is tomorrow, Saturday and the Masterclass trip are skipped', () => {
  const d = offerDates(NOW, R);
  assert.equal(d[0], '2026-11-16', 'this week closed (AS ruling 12) + Mon 9-Thu 12 full: first offered day is Mon 16');
  assert.ok(!d.includes('2026-11-05'));
  assert.ok(!d.includes('2026-11-07'), 'Saturday closed');
  for (const x of ['2026-11-13', '2026-11-14', '2026-11-15']) assert.ok(!d.includes(x), `${x} trip`);
  assert.ok(!d.includes('2026-11-06') && !d.includes('2026-11-08'), 'Fri 6 + Sun 8 closed');
  assert.ok(d.includes('2026-11-26') && !d.includes('2026-11-27'), '3-week window (21 days from tomorrow)');
  assert.ok(d.includes('2026-11-20') && d.includes('2026-11-22'), 'Fri 20 + Sun 22 open');
  assert.ok(d.includes('2026-11-16'));
});

test('training cut-offs: the last sit ENDS by Mon 18:40, Tue 18:10, Thu 19:10; Fri runs to 21:00; Sun 10-16 (Boost Fit after)', () => {
  const last = (date) => gridFor(date, R).at(-1);
  assert.equal(last('2026-11-16').time, '18:00'); // ends 18:30 <= 18:40
  assert.equal(last('2026-11-17').time, '17:30'); // ends 18:00 <= 18:10
  assert.equal(last('2026-11-19').time, '18:30'); // ends 19:00 <= 19:10
  assert.equal(last('2026-11-20').time, '20:30'); // Friday
  assert.equal(gridFor('2026-11-22', R)[0].time, '10:00');
  assert.equal(last('2026-11-22').time, '15:30');
  assert.equal(gridFor('2026-11-16', R)[0].time, '07:00');
});

test('Wed 11 Nov gym block 14:00-15:40 removes 14:00, 14:30, 15:00, 15:30 only', () => {
  const times = gridFor('2026-11-11', RO).map((s) => s.time);
  for (const t of ['14:00', '14:30', '15:00', '15:30']) assert.ok(!times.includes(t), t);
  assert.ok(times.includes('13:30') && times.includes('16:00'));
});

test('Bucharest clock across DST and slot length', () => {
  const s = gridFor('2026-11-09', RO)[0];
  assert.equal(s.startAt, '2026-11-09T05:00:00.000Z'); // 07:00 EET = 05:00Z
  assert.equal(Date.parse(s.endAt) - Date.parse(s.startAt), 30 * 60000);
  assert.equal(instantAt('2026-07-01', '07:00').toISOString(), '2026-07-01T04:00:00.000Z'); // summer EEST
  assert.equal(localDate(new Date('2026-11-05T22:30:00Z')), '2026-11-06');
});

test('busy ranges remove overlapping slots; times next to a CRM sit are flagged for packing', () => {
  const sit = { start: '2026-11-09T08:00:00.000Z', end: '2026-11-09T08:30:00.000Z' }; // 10:00-10:30
  const cal = { start: '2026-11-09T10:15:00.000Z', end: '2026-11-09T11:15:00.000Z' }; // 12:15-13:15 calendar event
  const free = freeSlotsFor('2026-11-09', [sit, cal], [sit], NOW, RO);
  const t = free.map((s) => s.time);
  assert.ok(!t.includes('10:00'));
  for (const x of ['12:00', '12:30', '13:00']) assert.ok(!t.includes(x), x);
  assert.ok(t.includes('13:30'));
  assert.deepEqual(free.filter((s) => s.nextToSit).map((s) => s.time), ['09:30', '10:30']);
});

test('findFreeSlot accepts only an exact free grid start', () => {
  const ok = findFreeSlot('2026-11-09T05:00:00.000Z', [], [], NOW, RO);
  assert.equal(ok?.time, '07:00');
  assert.equal(findFreeSlot('2026-11-09T05:10:00.000Z', [], [], NOW, RO), null, 'off grid');
  assert.equal(findFreeSlot('2026-11-05T14:00:00.000Z', [], [], NOW, RO), null, 'today');
  assert.equal(findFreeSlot('2026-11-07T08:00:00.000Z', [], [], NOW, RO), null, 'Saturday');
  assert.equal(findFreeSlot('2026-11-09T16:30:00.000Z', [], [], NOW, RO), null, 'Mon 18:30 ends after 18:40 cut-off');
  assert.equal(findFreeSlot('nope', [], [], NOW, RO), null);
});

test('maxPerDay hides a full day; rules JSON override validates', () => {
  const rules = parseRules(JSON.stringify({ maxPerDay: 1, dates: { '2026-11-09': { open: '07:00', close: '18:40' }, '2026-11-10': { open: '07:00', close: '18:10' } } }));
  const sit = { start: '2026-11-09T08:00:00.000Z', end: '2026-11-09T08:30:00.000Z' };
  assert.equal(freeSlotsFor('2026-11-09', [sit], [sit], NOW, rules).length, 0);
  assert.ok(freeSlotsFor('2026-11-10', [sit], [sit], NOW, rules).length > 0);
  assert.throws(() => parseRules(JSON.stringify({ week: { '1': { open: '19:00', close: '07:00' } } })));
  assert.throws(() => parseRules(JSON.stringify({ slotMinutes: 15 })));
  assert.equal(parseRules(JSON.stringify({ dates: { '2026-11-10': null } })).dates['2026-11-10'], null);
});

test('phone rules: RO mobiles only 072-079, other countries E.164', () => {
  assert.equal(normalizePhone('0722 123 456'), '+40722123456');
  assert.equal(normalizePhone('+40 799 999 901'), '+40799999901');
  assert.equal(normalizePhone('0212345678'), null);
  assert.equal(normalizePhone('+4072212345'), null);
  assert.equal(normalizePhone('+44 7700 900123'), '+447700900123');
  assert.equal(normalizePhone('abc'), null);
});

// ---------------------------------------------------------------- functions with mocks
let calls, calBusy, crm, bookReply, bridgeCreate, marks, tg, rpcReply, bridgeFail;
const res = (body, status = 200) => new Response(JSON.stringify(body), { status });
function reset() {
  calls = []; calBusy = []; crm = { sits: [], holds: [] }; marks = []; tg = []; rpcReply = {}; bridgeFail = {};
  bookReply = { ok: true, replay: false, person_id: 'p1', consultation_id: 'c1', duplicate_person: false, calendar_event_id: null, full_name: 'TEST Kai', manage: 'MANAGEtoken1234567890ab' };
  bridgeCreate = (ev) => res({ ok: true, id: ev.id, url: 'https://cal/e', replay: false });
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url); const body = init.body ? JSON.parse(init.body) : {};
    calls.push({ u, body });
    if (u.startsWith(env.BOOKING_BRIDGE_URL)) {
      assert.equal(body.secret, 'sec');
      if (body.op === 'freebusy') return res({ ok: true, busy: calBusy });
      if (bridgeFail[body.op]) return res({ ok: false, code: 'BRIDGE_ERROR' });
      if (body.op === 'create') return bridgeCreate(body.event);
      if (body.op === 'move') return res({ ok: true, id: body.id, url: 'https://cal/e' });
      if (body.op === 'cancel') return res({ ok: true, id: body.id });
    }
    if (u.includes('/rpc/')) {
      assert.equal(init.headers.apikey, 'sb_publishable_test');
      assert.equal(body.p_token, 'tok');
      if (u.endsWith('get_website_busy_public')) return res(crm);
      if (u.endsWith('book_website_slot_public')) return typeof bookReply === 'function' ? bookReply(body) : res(bookReply);
      if (u.endsWith('mark_website_booking_calendar_public')) { marks.push(body); return res({ ok: true }); }
      const fn = u.split('/').pop();
      if (rpcReply[fn]) return res(rpcReply[fn]);
    }
    if (u.includes('api.telegram.org')) { tg.push(body.text); return res({ ok: true }); }
    throw new Error('unexpected fetch ' + u);
  };
}
const KEY = '11111111-1111-4111-8111-111111111111';
// a Monday far enough ahead that "never today" never bites, whatever day the test runs
const day = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() + 7 + ((8 - d.getUTCDay()) % 7)); return d.toISOString().slice(0, 10); })();
const at = (clock) => instantAt(day, clock).toISOString();
const post = (b) => book(new Request('https://boostclub.ro/api/booking/book', {
  method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://boostclub.ro' },
  body: JSON.stringify({ key: KEY, name: 'TEST Kai', phone: '0799 999 901', lang: 'en', page: 'https://boostclub.ro/book?utm_source=facebook&utm_medium=paid', ...b }),
}), {});

test('slots: merges calendar busy, CRM sits and holds, never today', async () => {
  reset();
  calBusy = [{ start: at('07:00'), end: at('09:00') }];
  crm = { sits: [{ start: at('10:00'), end: at('10:30') }], holds: [{ start: at('11:00'), end: at('11:30') }] };
  const r = await slots(new Request('https://boostclub.ro/api/booking/slots'), {});
  const j = await r.json();
  assert.equal(r.status, 200); assert.equal(j.ok, true); assert.equal(j.slotMinutes, 30);
  const today = localDate(new Date());
  assert.ok(!j.days.some((d) => d.date <= today));
  const mon = j.days.find((d) => d.date === day);
  const t = mon.slots.map((s) => s.time);
  for (const x of ['07:00', '08:30', '10:00', '11:00']) assert.ok(!t.includes(x), x);
  assert.ok(t.includes('09:00') && t.includes('11:30'));
  assert.deepEqual(mon.slots.filter((s) => s.nextToSit).map((s) => s.time), ['09:30', '10:30']);
  assert.equal(calls.filter((c) => c.body.op === 'freebusy').length, 1, 'one calendar call for the whole range');
});

test('slots: bridge down -> 503, page falls back to WhatsApp', async () => {
  reset();
  globalThis.fetch = async (u) => (String(u).startsWith(env.BOOKING_BRIDGE_URL) ? res({ ok: false, code: 'FORBIDDEN' }) : res({ sits: [], holds: [] }));
  const r = await slots(new Request('https://boostclub.ro/api/booking/slots'), {});
  assert.equal(r.status, 503);
});

test('book: happy path writes CRM, then calendar, then marks it and pings Telegram', async () => {
  reset();
  const r = await post({ startAt: at('10:00'), goal: 'loss', ready: 'now', email: 'a@b.co' });
  const j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j)); assert.equal(j.ok, true); assert.equal(j.time, '10:00');
  const bk = calls.find((c) => c.u.endsWith('book_website_slot_public')).body;
  assert.equal(bk.p_phone, '+40799999901'); assert.equal(bk.p_goal, 'loss'); assert.equal(bk.p_ready, 'now');
  assert.equal(bk.p_source, 'meta_ads'); assert.equal(bk.p_minutes, 30); assert.equal(bk.p_start, at('10:00'));
  const ev = calls.find((c) => c.body.op === 'create').body.event;
  assert.equal(ev.summary, 'Consultation with TEST Kai');
  assert.equal(ev.id, 'bcbk' + KEY.replace(/-/g, ''));
  assert.equal(ev.attendeeEmail, 'a@b.co');
  assert.match(ev.description, /Goal: Lose weight/);
  assert.equal(marks.length, 1); assert.equal(marks[0].p_event_id, ev.id);
  assert.equal(tg.length, 1); assert.match(tg[0], /New website booking: TEST Kai/); assert.match(tg[0], /Calendar \+ CRM done/);
  const order = calls.map((c) => c.body.op || c.u.split('/').pop());
  assert.ok(order.indexOf('book_website_slot_public') < order.indexOf('create'), 'CRM before calendar');
});

test('book: slot became busy in the calendar -> 409 before any CRM write', async () => {
  reset(); calBusy = [{ start: at('09:45'), end: at('10:15') }];
  const r = await post({ startAt: at('10:00') });
  assert.equal(r.status, 409); assert.equal((await r.json()).code, 'SLOT_TAKEN');
  assert.ok(!calls.some((c) => c.u.endsWith('book_website_slot_public')));
});

test('book: held for someone on WhatsApp -> 409', async () => {
  reset(); crm.holds = [{ start: at('10:00'), end: at('10:30') }];
  assert.equal((await post({ startAt: at('10:00') })).status, 409);
});

test('book: the database lock says taken -> 409; already booked -> their time; foreign lead -> nothing booked', async () => {
  reset(); bookReply = { ok: false, code: 'slot_taken' };
  assert.equal((await (await post({ startAt: at('10:00') })).json()).code, 'SLOT_TAKEN');
  reset(); bookReply = { ok: false, code: 'already_booked', scheduled_at: at('12:00') };
  const j = await (await post({ startAt: at('10:00') })).json();
  assert.equal(j.code, 'ALREADY_BOOKED'); assert.equal(j.time, '12:00');
  assert.ok(!calls.some((c) => c.body.op === 'create'));
  reset(); bookReply = { ok: false, code: 'blocked' };
  const b = await post({ startAt: at('10:00') });
  assert.equal((await b.json()).code, 'CONTACT_US');
  assert.ok(!calls.some((c) => c.body.op === 'create'));
  assert.match(tg[0], /NOT made/);
});

test('book: calendar write fails -> booking still stands, error recorded, Telegram warns', async () => {
  reset(); bridgeCreate = () => res({ ok: false, code: 'BRIDGE_ERROR' });
  const r = await post({ startAt: at('10:00') });
  assert.equal(r.status, 200);
  assert.equal(marks.length, 1); assert.equal(marks[0].p_event_id, null); assert.match(marks[0].p_error, /BRIDGE_BRIDGE_ERROR/);
  assert.match(tg[0], /calendar event MISSING/);
});

test('book: replay with a calendar event already saved does not create a second event or ping', async () => {
  reset(); bookReply = { ok: true, replay: true, person_id: 'p1', consultation_id: 'c1', calendar_event_id: 'bcbkx' };
  const r = await post({ startAt: at('10:00') });
  assert.equal(r.status, 200);
  assert.ok(!calls.some((c) => c.body.op === 'create')); assert.equal(tg.length, 0);
});

test('book: input guards (bad phone, bad key, off-grid time, foreign origin, honeypot)', async () => {
  reset();
  assert.equal((await post({ startAt: at('10:00'), phone: '021 234 5678' })).status, 422);
  assert.equal((await post({ startAt: at('10:00'), key: 'x' })).status, 422);
  assert.equal((await post({ startAt: at('10:00'), name: 'A' })).status, 422);
  assert.equal((await post({ startAt: at('10:10') })).status, 409);
  const foreign = await book(new Request('https://boostclub.ro/api/booking/book', { method: 'POST', headers: { origin: 'https://evil.example' }, body: '{}' }), {});
  assert.equal(foreign.status, 403);
  const hp = await post({ startAt: at('10:00'), website: 'http://spam' });
  assert.equal((await hp.json()).honeypot, true);
  assert.ok(!calls.some((c) => c.u.endsWith('book_website_slot_public')));
});

// ---------------------------------------------------------------- v2: personal links, change or cancel
const INV = 'INVITEtoken1234567890ab';
const MAN = 'MANAGEtoken1234567890ab';
const get = (q) => me(new Request(`https://boostclub.ro/api/booking/me?${q}`), {});
const mePost = (b) => me(new Request('https://boostclub.ro/api/booking/me', { method: 'POST', headers: { origin: 'https://boostclub.ro' }, body: JSON.stringify(b) }), {});

test('personal link: first name only, booking without name or phone, attached to the CRM person', async () => {
  reset();
  rpcReply.get_booking_invite_public = { ok: true, first_name: 'Ana', language: 'ro', open_at: null };
  const g = await (await get(`i=${INV}`)).json();
  assert.deepEqual([g.ok, g.firstName, g.openDay], [true, 'Ana', null]);
  bookReply = { ...bookReply, full_name: 'Ana Popescu', duplicate_person: true };
  const r = await post({ startAt: at('10:00'), invite: INV, name: '', phone: '' });
  const j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j));
  const bk = calls.find((c) => c.u.endsWith('book_website_slot_public')).body;
  assert.equal(bk.p_invite, INV); assert.equal(bk.p_phone, null); assert.equal(bk.p_full_name, null);
  const ev = calls.find((c) => c.body.op === 'create').body.event;
  assert.equal(ev.summary, 'Consultation with Ana Popescu');
  assert.match(ev.description, /Change or cancel: https:\/\/boostclub\.ro\/book\?m=MANAGE/);
  assert.match(tg[0], /your personal link/);
  assert.equal(j.firstName, 'Ana');
  assert.match(j.manage, /book\?m=MANAGEtoken/);
});

test('personal link: unknown or expired token is refused, bad tokens never reach the database', async () => {
  reset(); rpcReply.get_booking_invite_public = { ok: false, code: 'invalid_invite' };
  assert.equal((await (await get(`i=${INV}`)).json()).code, 'INVALID_INVITE');
  reset();
  assert.equal((await (await get('i=../../etc')).json()).code, 'INVALID_INVITE');
  assert.ok(!calls.some((c) => c.u.includes('/rpc/')));
  reset(); bookReply = { ok: false, code: 'invalid_invite' };
  assert.equal((await (await post({ startAt: at('10:00'), invite: INV })).json()).code, 'INVALID_INVITE');
});

test('change link: shows their booking', async () => {
  reset();
  rpcReply.get_my_booking_public = { ok: true, first_name: 'Ana', scheduled_at: at('10:00'), minutes: 30, state: 'booked', can_move: true };
  const g = await (await get(`m=${MAN}`)).json();
  assert.deepEqual([g.ok, g.state, g.time, g.canMove], [true, 'booked', '10:00', true]);
});

test('move: live re-check, CRM move, calendar event moved, Telegram', async () => {
  reset();
  rpcReply.move_my_booking_public = { ok: true, idempotency_key: KEY, full_name: 'Ana Popescu', old_at: at('10:00'), scheduled_at: at('12:00'), minutes: 30, calendar_event_id: 'bcbk' + 'a'.repeat(32) };
  const r = await mePost({ m: MAN, action: 'move', startAt: at('12:00') });
  const j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j)); assert.equal(j.time, '12:00');
  const mv = calls.find((c) => c.body.op === 'move').body;
  assert.equal(mv.id, 'bcbk' + 'a'.repeat(32)); assert.equal(mv.start, at('12:00'));
  assert.equal(marks[0].p_context, 'move'); assert.equal(marks[0].p_error, null);
  assert.match(tg[0], /Ana Popescu moved their visit/); assert.match(tg.join('\n'), /Calendar \+ CRM updated/);
});

test('move: busy time refused before the CRM; calendar failure flagged for a hand fix', async () => {
  reset(); calBusy = [{ start: at('12:00'), end: at('12:30') }];
  assert.equal((await mePost({ m: MAN, action: 'move', startAt: at('12:00') })).status, 409);
  assert.ok(!calls.some((c) => c.u.endsWith('move_my_booking_public')));
  reset(); bridgeFail.move = true;
  rpcReply.move_my_booking_public = { ok: true, idempotency_key: KEY, full_name: 'Ana', old_at: at('10:00'), scheduled_at: at('12:00'), minutes: 30, calendar_event_id: 'bcbk' + 'a'.repeat(32) };
  assert.equal((await mePost({ m: MAN, action: 'move', startAt: at('12:00') })).status, 200);
  assert.equal(marks[0].p_context, 'move'); assert.ok(marks[0].p_error);
  assert.match(tg.join('\n'), /calendar NOT/);
  reset(); rpcReply.move_my_booking_public = { ok: false, code: 'too_many_changes' };
  assert.equal((await (await mePost({ m: MAN, action: 'move', startAt: at('12:00') })).json()).code, 'TOO_MANY_CHANGES');
});

test('cancel: CRM cancel, calendar event removed, Telegram says the slot is free', async () => {
  reset();
  rpcReply.cancel_my_booking_public = { ok: true, idempotency_key: KEY, full_name: 'Ana Popescu', old_at: at('10:00'), calendar_event_id: 'bcbk' + 'b'.repeat(32) };
  const r = await mePost({ m: MAN, action: 'cancel' });
  assert.equal(r.status, 200);
  assert.equal(calls.find((c) => c.body.op === 'cancel').body.id, 'bcbk' + 'b'.repeat(32));
  assert.match(tg[0], /cancelled their visit/); assert.match(tg.join('\n'), /rebook them/);
  reset(); rpcReply.cancel_my_booking_public = { ok: false, code: 'not_movable' };
  assert.equal((await (await mePost({ m: MAN, action: 'cancel' })).json()).code, 'NOT_MOVABLE');
});

test('calendar event ids are valid Google ids (base32hex: 0-9 and a-v only)', async () => {
  const { eventIdFor } = await import('../netlify/functions/_shared/calendar-bridge.mts');
  const id = eventIdFor('30c4f85e-6661-401f-a5ed-f55cb14bfb28');
  assert.match(id, /^[a-v0-9]{5,1024}$/);
});
