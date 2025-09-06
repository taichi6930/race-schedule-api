// JST (Asia/Tokyo) を前提とした日時ユーティリティ
// Date オブジェクトは常に瞬間（UTC epoch）を表すが、入出力を JST の壁時計で扱うための関数を提供する
const pad = (n: number): string => n.toString().padStart(2, '0');

/**
 * 引数を Date に変換する。
 * @param date - Date または文字列（タイムゾーン指示の無い文字列は JST として扱う）
 */
export const parseToDateAssumeJst = (date?: Date | string | null): Date => {
    if (!date) return new Date(Number.NaN);
    if (date instanceof Date) return date;
    const s = date;
    // 既にタイムゾーン/UTC 指定がある場合は通常の Date に委譲
    if (
        /[Zz]|[+-]\d{2}:?\d{2}/.test(s) ||
        (s.includes('T') && s.includes('Z'))
    ) {
        return new Date(s);
    }
    // 想定フォーマット: YYYY-MM-DD[ T]HH:mm:ss もしくは YYYY-MM-DD
    const parts = s.split(/\s+/);
    const [datePart, timePart = '00:00:00'] = parts;
    const [y, m, d] = datePart.split('-').map((v) => Number.parseInt(v, 10));
    const [hh = '00', mm = '00', ss = '00'] = timePart.split(':');
    const year = Number.isNaN(y) ? 0 : y;
    const month = Number.isNaN(m) ? 1 : m;
    const day = Number.isNaN(d) ? 1 : d;
    const hour = Number.parseInt(hh, 10) || 0;
    const minute = Number.parseInt(mm, 10) || 0;
    const second = Number.parseInt(ss, 10) || 0;
    // 入力文字列は JST の壁時計を表す -> その瞬間の UTC ミリ秒を作るには hour - 9 を使う
    return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));
};

/**
 * DB 用の 'YYYY-MM-DD HH:mm:ss' 形式（JST）に変換する
 * @param date - Date または文字列
 */
export const toDbStringJst = (date?: Date | string | null): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? parseToDateAssumeJst(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const y = jst.getUTCFullYear();
    const M = pad(jst.getUTCMonth() + 1);
    const D = pad(jst.getUTCDate());
    const hh = pad(jst.getUTCHours());
    const mm = pad(jst.getUTCMinutes());
    const ss = pad(jst.getUTCSeconds());
    return `${y}-${M}-${D} ${hh}:${mm}:${ss}`;
};

/**
 * DB から取り出した 'YYYY-MM-DD HH:mm:ss'（JST）を Date に変換する
 * @param s - DB 文字列
 */
export const parseDbStringJst = (s?: string | null): Date => {
    if (!s) return new Date(Number.NaN);
    // 期待される形式: YYYY-MM-DD HH:mm:ss
    const trimmed = s.trim();
    const [datePart, timePart = '00:00:00'] = trimmed.split(/\s+/);
    const [y, m, d] = datePart.split('-').map((v) => Number.parseInt(v, 10));
    const [hh = '00', mm = '00', ss = '00'] = timePart.split(':');
    const year = Number.isNaN(y) ? 0 : y;
    const month = Number.isNaN(m) ? 1 : m;
    const day = Number.isNaN(d) ? 1 : d;
    const hour = Number.parseInt(hh, 10) || 0;
    const minute = Number.parseInt(mm, 10) || 0;
    const second = Number.parseInt(ss, 10) || 0;
    // DB は JST の壁時計 -> UTC に変換するには hour - 9
    return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));
};

/**
 * JST オフセット (+09:00) を付けた ISO 形式 (YYYY-MM-DDTHH:mm:ss+09:00)
 * @param date - Date または文字列
 */
export const formatIsoWithOffsetJst = (date?: Date | string | null): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? parseToDateAssumeJst(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const y = jst.getUTCFullYear();
    const M = pad(jst.getUTCMonth() + 1);
    const D = pad(jst.getUTCDate());
    const hh = pad(jst.getUTCHours());
    const mm = pad(jst.getUTCMinutes());
    const ss = pad(jst.getUTCSeconds());
    return `${y}-${M}-${D}T${hh}:${mm}:${ss}+09:00`;
};

export default {
    parseToDateAssumeJst,
    toDbStringJst,
    parseDbStringJst,
    formatIsoWithOffsetJst,
};
