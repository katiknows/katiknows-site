/**
 * Cloudflare Worker — Content API
 * Bindings required:
 *   KV namespace : CONTENT_KV
 *   Secret       : ADMIN_PASSWORD
 */

const DEFAULT_CONTENT = {
  "nav": {
    "logo": "Катерина",
    "link_method": "Как работаю",
    "link_cases": "Работы",
    "link_about": "Обо мне",
    "cta": "Написать"
  },
  "hero": {
    "tag": "Разработка сайтов · 15 лет практики",
    "line1": "Сайт, который",
    "line2": "помогает вашим",
    "line3": "клиентам выбрать",
    "accent": "именно вас",
    "sub": "Я создаю сайты, на которых клиент за несколько секунд понимает: вот кто мне нужен.",
    "scroll_hint": "Листайте"
  },
  "method": {
    "label": "Как я работаю",
    "card1_num": "Этап первый",
    "card1_title": "Разбор",
    "card2_num": "Этап второй",
    "card2_title": "Архитектура",
    "card3_num": "Этап третий",
    "card3_title": "Запуск"
  },
  "pricing": {
    "label": "Стоимость",
    "intro_title": "Три формата.\nПод разные задачи.",
    "intro_sub": "Цена зависит не от количества страниц, а от объёма работы с вашей аудиторией и её сомнениями.",
    "card1_format": "Одна страница",
    "card1_price": "$700",
    "card1_from": "фиксированная цена",
    "card1_promise": "Клиент понимает суть за 8 секунд — или я переделываю.",
    "card2_format": "Сайт услуги",
    "card2_price": "$1300",
    "card2_from": "фиксированная цена",
    "card2_promise": "Сайт отвечает на вопросы клиента раньше, чем они появляются.",
    "card3_format": "Приоритет",
    "card3_price": "$2500",
    "card3_from": "фиксированная цена",
    "card3_promise": "Сроки обсуждаем до старта. Они реальные — и я их держу."
  },
  "cases": {
    "label": "Примеры работ",
    "title": "Разные бизнесы.\nОдна задача.",
    "card1_ind": "Стоматология",
    "card1_name": "Клиника «Riva»",
    "card1_desc": "Пациент должен выбрать врача ещё до первого звонка. Сайт снял 80% типичных возражений.",
    "card2_ind": "Фотограф",
    "card2_name": "Мария Вострикова",
    "card2_desc": "Портфолио не продаёт. Продаёт ощущение, что именно этот фотограф вас поймёт.",
    "card3_ind": "Строительство",
    "card3_name": "СК «Территория»",
    "card3_desc": "Клиент ищет не подрядчика — он ищет того, кому можно доверить деньги и нервы.",
    "card4_ind": "Нотариус",
    "card4_name": "Нотариус Соколова",
    "card4_desc": "Строгая профессия — доверие через конкретику. Никакой «юридической воды»."
  },
  "about": {
    "name": "Катерина",
    "p1": "Я не дизайнер и не программист. Я человек, который понимает, как люди воспринимают информацию — и почему одни слова убеждают, а другие нет.",
    "p2": "15 лет в коммуникациях, из них около 10 — в PR и продвижении брендов. Продвигала продукты, репутации, компании. Там и поняла главное: не важно, насколько вы хороши. Важно, насколько быстро это считывает нужный человек.",
    "p3": "Потом применила ту же логику к сайтам. Оказалось, работает точно так же. Клиент выбирает не лучшего — он выбирает того, кого понял раньше остальных.",
    "p4": "Именно это я и делаю: выстраиваю подачу вашего бизнеса так, чтобы нужный человек понял вас с первого взгляда. Без воды, без шаблонов — конкретно и убедительно."
  },
  "contact": {
    "kicker": "Контакт",
    "title": "Напишите мне.",
    "title_em": "Я отвечу сегодня.",
    "sub": "Не менеджер. Я лично."
  },
  "footer": {
    "logo": "Катерина"
  }
};

const ALLOWED_ORIGIN = 'https://katiknows.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  ...CORS_HEADERS,
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: BASE_HEADERS });
}

function flatten(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flatten(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && typeof base[k] === 'object') {
      out[k] = deepMerge(base[k] ?? {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const VALID_KEYS = new Set(Object.keys(flatten(DEFAULT_CONTENT)));

async function handleGet(env) {
  try {
    const stored = await env.CONTENT_KV.get('content');
    if (stored) {
      return new Response(stored, { headers: BASE_HEADERS });
    }
  } catch (_) {}
  return new Response(JSON.stringify(DEFAULT_CONTENT), { headers: BASE_HEADERS });
}

async function handlePost(request, env) {
  const auth = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!auth || auth !== env.ADMIN_PASSWORD) {
    return json({ error: 'Неверный пароль' }, 401);
  }

  let incoming;
  try {
    incoming = await request.json();
  } catch {
    return json({ error: 'Неверный формат JSON' }, 400);
  }

  const flatIncoming = flatten(incoming);
  const unknownKeys = Object.keys(flatIncoming).filter(k => !VALID_KEYS.has(k));
  if (unknownKeys.length > 0) {
    return json({ error: `Недопустимые ключи: ${unknownKeys.join(', ')}` }, 400);
  }

  let current = structuredClone(DEFAULT_CONTENT);
  try {
    const stored = await env.CONTENT_KV.get('content');
    if (stored) current = JSON.parse(stored);
  } catch (_) {}

  const merged = deepMerge(current, incoming);
  try {
    await env.CONTENT_KV.put('content', JSON.stringify(merged));
  } catch (_) {
    return json({ error: 'KV недоступен — проверьте привязку CONTENT_KV' }, 503);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (method === 'GET')  return handleGet(env);
    if (method === 'POST') return handlePost(request, env);

    return json({ error: 'Method Not Allowed' }, 405);
  }
};
