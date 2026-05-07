import type { ReactNode } from 'react';

/**
 * Известные заголовки страниц wiki по UUID в пути URL.
 * При необходимости добавляйте сюда новые страницы (полный UUID в нижнем регистре).
 */
const WIKI_PAGE_TITLES: Record<string, string> = {
  'ea548bc5-8f7c-4238-86a5-e1369cec5519': 'Настройка почты на мобильных устройствах',
};

/** Человекочитаемые названия поддоменов alephtrade.com. */
const SUBDOMAIN_LABELS: Record<string, string> = {
  'disk.alephtrade.com':  'Файлообменник АлефТрейд',
  'wiki.alephtrade.com':  'Документация AlephTrade',
  'mail.alephtrade.com':  'Почта АлефТрейд',
  'crm.alephtrade.com':   'CRM АлефТрейд',
  'oauth.alephtrade.com': 'Вход АлефТрейд',
  'alephtrade.com':       'Сайт АлефТрейд',
};

function extractUuid(href: string): string | null {
  const m = href.match(
    /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
  );
  return m ? m[1].toLowerCase() : null;
}

/** Человекочитаемый текст ссылки для URL AlephTrade. */
export function getWikiLinkLabel(url: string): string {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('alephtrade.com')) {
      return '';
    }
    // Конкретная страница wiki по UUID
    const uuid = extractUuid(u.pathname) || extractUuid(u.href);
    if (uuid && WIKI_PAGE_TITLES[uuid]) {
      return WIKI_PAGE_TITLES[uuid];
    }
    // Точный поддомен из словаря
    if (SUBDOMAIN_LABELS[u.hostname]) {
      return SUBDOMAIN_LABELS[u.hostname];
    }
    // Любой другой поддомен wiki
    if (u.hostname.startsWith('wiki.')) {
      return 'Документация AlephTrade';
    }
    // Общий fallback для alephtrade.com
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isUrlString(s: string): boolean {
  return /^https?:\/\//i.test(s.trim());
}

/**
 * Перед рендером Markdown:
 * - `[https://...]` (только URL в квадратных скобках) → `[заголовок](https://...)`
 * - `[https://...](https://...)` где текст = URL → заменить текст на заголовок
 */
export function preprocessMarkdownLinks(text: string): string {
  let out = text;

  out = out.replace(/\[((https?:\/\/[^\]\s]+))\]/g, (_m, url: string) => {
    if (!isUrlString(url)) return _m;
    const label = getWikiLinkLabel(url) || tryHostLabel(url);
    return `[${label}](${url})`;
  });

  return out;
}

function tryHostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Ссылка';
  }
}

/** Для ReactMarkdown: показать заголовок вместо голого URL в тексте ссылки. */
export function getLinkDisplayChildren(
  href: string | undefined,
  children: ReactNode
): ReactNode {
  const hrefStr = href ?? '';
  const childText = String(children ?? '').trim();
  if (!hrefStr || !childText) return children;

  const normalizedChild = childText.replace(/\/$/, '');
  const normalizedHref = hrefStr.replace(/\/$/, '');
  const looksLikeUrlOnly =
    childText === hrefStr ||
    normalizedChild === normalizedHref ||
    (isUrlString(childText) && hrefStr.startsWith('http'));

  if (!looksLikeUrlOnly) return children;

  const wikiLabel = getWikiLinkLabel(hrefStr);
  if (wikiLabel) return wikiLabel;

  try {
    const u = new URL(hrefStr);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return children;
  }
}
