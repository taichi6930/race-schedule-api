// 中央競馬のNetkeiba競馬場コード
export const NetkeibaJraBabacodeMap: Record<string, string> = {
    札幌: '01',
    函館: '02',
    福島: '03',
    新潟: '04',
    東京: '05',
    中山: '06',
    中京: '07',
    京都: '08',
    阪神: '09',
    小倉: '10',
};

// 地方競馬のNetkeiba競馬場コード
export const NetkeibaNarBabacodeMap: Record<string, string> = {
    門別: '30',
    盛岡: '35',
    水沢: '36',
    浦和: '42',
    船橋: '43',
    大井: '44',
    川崎: '45',
    金沢: '46',
    笠松: '47',
    名古屋: '48',
    園田: '50',
    姫路: '51',
    高知: '54',
    佐賀: '55',
    帯広ば: '65',
};

// 廃止・休止済みのNetkeiba競馬場コード
export const NetkeibaJraBabacodeMapDeprecated: Record<string, string> = {
    北見: '31',
    岩見沢: '32',
    帯広: '33',
    旭川: '34',
    上山: '37',
    三条: '38',
    足利: '39',
    宇都宮: '40',
    高崎: '41',
    紀三井寺: '49',
    益田: '52',
    福山: '53',
    荒尾: '56',
    中津: '57',
    春木: '62',
    北見ば: '63',
    岩見ば: '64',
    旭川ば: '66',
};

// 中央競馬を地方競馬として扱っていた時のNetkeiba競馬場コード
export const NetkeibaBabacodeMapNarFromJra: Record<string, string> = {
    '札幌(地)': '58',
    '函館(地)': '59',
    '新潟(地)': '60',
    '中京(地)': '61',
};

// 中央競馬と地方競馬のバババコードをマージ
export const NetkeibaBabacodeMap: Record<string, string> = {
    ...NetkeibaJraBabacodeMap,
    ...NetkeibaNarBabacodeMap,
    ...NetkeibaJraBabacodeMapDeprecated,
    ...NetkeibaBabacodeMapNarFromJra,
};
