// Dated manual snapshot; not a live Google feed.
export const reviewSnapshot = { rating: '5.0', count: 122, date: '2026-10-12', source: 'https://g.page/r/CUSJCWfOpKRSEAE' };
export const consumerCopy = {
  ro: {
    reviews: 'recenzii Google', date: 'Situație la 12 octombrie 2026',
    afterTitle: 'Ce se întâmplă după vizita gratuită?',
    after: 'Pleci cu rezultatele și explicațiile tale. Dacă vrei să continui, îți arătăm opțiunile de sprijin, ce includ și cât costă. Gabriel este distribuitor independent Herbalife.',
  },
  en: {
    reviews: 'Google reviews', date: 'Snapshot from 12 October 2026',
    afterTitle: 'What happens after the free visit?',
    after: 'You leave with your results and explanations. If you want ongoing support, we show you the options, what they include and what they cost. Gabriel is an Independent Herbalife Distributor.',
  },
  ru: {
    reviews: 'отзыва в Google', date: 'Данные на 12 октября 2026 года',
    afterTitle: 'Что будет после бесплатного визита?',
    after: 'Вы уходите с результатами и объяснениями. Если захотите продолжить, покажем варианты поддержки, их содержание и стоимость. Габриел является независимым дистрибьютором Herbalife.',
  },
};
export function reviewSummary(lang) {
  const c=consumerCopy[lang];
  return `<p class="review-summary"><a href="${reviewSnapshot.source}" target="_blank" rel="noopener">${lang==='ro'?'5,0':reviewSnapshot.rating} / 5 · ${reviewSnapshot.count} ${c.reviews}</a><br><span class="small">${c.date}</span></p>`;
}
export function afterVisit(lang) {
  const c=consumerCopy[lang];
  return `<div class="card mt-4 after-visit"><h3>${c.afterTitle}</h3><p>${c.after}</p></div>`;
}
const questions = {
  ro: [
    ['Trebuie să fiu „în formă” ca să vin?', 'Poți începe printr-o discuție despre obiectivele și rutina ta, indiferent de experiența ta cu sportul.'],
    ['Cum se desfășoară evaluarea corporală?', 'Folosim bioimpedanța pentru estimări ale compoziției corporale. Întreabă-ne despre aparatul folosit și recomandările de pregătire înainte de vizită.'],
    ['Rezultatele sunt un diagnostic?', 'Nu. Sunt estimări, explicate ca punct de pornire pentru discuția despre obiceiuri. Evaluarea nu înlocuiește consultația medicală.'],
    ['Pot aduce pe cineva cu mine?', 'Da, poți veni cu un partener, prieten sau membru al familiei. Spune-ne când stabilești vizita.'],
  ],
  en: [
    ['Do I need to be fit before I visit?', 'You can start with a conversation about your goals and routine, whatever your experience with exercise.'],
    ['How does the body assessment work?', 'We use bioimpedance to estimate body composition. Ask us about the device and its preparation instructions before your visit.'],
    ['Are the results a diagnosis?', 'No. They are estimates, explained as a starting point for discussing your habits. The assessment does not replace medical care.'],
    ['Can I bring someone with me?', 'Yes, you can come with a partner, friend or family member. Let us know when arranging your visit.'],
  ],
  ru: [
    ['Нужно ли быть в хорошей форме перед визитом?', 'Начать можно с разговора о целях и распорядке дня, независимо от вашего опыта занятий спортом.'],
    ['Как проходит оценка состава тела?', 'Мы используем биоимпеданс для оценки состава тела. До визита уточните у нас модель аппарата и рекомендации по подготовке.'],
    ['Являются ли результаты диагнозом?', 'Нет. Это ориентировочные показатели, которые служат отправной точкой для разговора о привычках. Оценка не заменяет медицинскую консультацию.'],
    ['Можно ли прийти с кем-то?', 'Да, можно прийти с партнёром, другом или членом семьи. Сообщите нам об этом, когда будете договариваться о визите.'],
  ],
};
export function processFaq(lang) {
  const title={ro:'Întrebări înainte de prima vizită',en:'Questions before your first visit',ru:'Вопросы перед первым визитом'}[lang];
  return `<section class="section"><div class="container-text"><h2>${title}</h2>${questions[lang].map(([q,a])=>`<div class="faq-item"><button class="faq-q" aria-expanded="false">${q}</button><div class="faq-a"><p>${a}</p></div></div>`).join('')}</div></section>`;
}
