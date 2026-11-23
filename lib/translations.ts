// @ts-nocheck

export interface TranslationKeys {
  search: string;
  trending: string;
  all: string;
  categories: string;
  more: string;
  login_msg: string;
  verified_error: string;
  support: string;
  ai_assistant: string;
  share: string;
  source: string;
  translating: string;
  no_results: string;
  loading: string;
  launcher: string;
  defi: string;
  defi_title: string;
  wallet_connected: string;
  change_id: string;
  reset_kyc: string;
  top_news: string;
  mainnet: string;
  node: string;
  mining: string;
  wallet: string;
  // 📌 일정/달력 관련 필수 키 추가 (5년 중장기 로드맵 2026-2031 반영)
  schedule: string;
  schedule_title: string;
  schedule_subtitle: string;
  schedule_desc: string;
  schedule_note: string;
}

const rawTranslations: Record<string, TranslationKeys> = {
  ko: {
    search: "GPNR 글로벌 뉴스 검색...",
    trending: "지금 뜨는 소식",
    all: "전체보기",
    categories: "카테고리",
    more: "더보기",
    login_msg: "더 많은 소식을 보려면 로그인이 필요합니다.",
    verified_error: "Pi Browser의 개발자 모드에서 도메인 승인이 필요합니다.",
    support: "0.01 Pi 후원",
    ai_assistant: "GPNR AI 도우미",
    share: "공유하기",
    source: "출처 보기",
    translating: "번역 중...",
    no_results: "검색 결과가 없습니다.",
    loading: "로딩 중...",
    launcher: "메뉴 런처",
    defi: "디파이",
    defi_title: "파이 탈중앙화 금융(DeFi)",
    wallet_connected: "Pi 네트워크 지갑 연동 완료",
    change_id: "ID 변경",
    reset_kyc: "KYC ID 해제 및 다시 입력하기",
    top_news: "헤드라인 뉴스",
    mainnet: "메인넷",
    node: "노드",
    mining: "채굴",
    wallet: "지갑",
    schedule: "일정",
    schedule_title: "Pi 네트워크 이벤트 일정",
    schedule_subtitle: "5년 중장기 로드맵 (2026 – 2031)",
    schedule_desc: "생태계 서밋 및 중장기 전망 기반 5년 주요 일정이 기본 제공되며, 항목을 누르면 상세 내용을 볼 수 있습니다.",
    schedule_note: "※ 2027년 1분기 이후 일정은 테스트넷 진행 및 시장 전망을 반영한 중장기 로드맵입니다."
  },
  en: {
    search: "Search Global Pi news...",
    trending: "TRENDING",
    all: "See All",
    categories: "Categories",
    more: "More",
    login_msg: "Please login to read full details.",
    verified_error: "Domain approval required in Pi Browser developer mode.",
    support: "Donate 0.01 Pi",
    ai_assistant: "AI Assistant",
    share: "Share",
    source: "Source",
    translating: "Translating...",
    no_results: "No results found.",
    loading: "Loading...",
    launcher: "Menu Launcher",
    defi: "DeFi",
    defi_title: "Pi Decentralized Finance",
    wallet_connected: "Pi Network Wallet Connected",
    change_id: "Change ID",
    reset_kyc: "Reset & Re-enter KYC ID",
    top_news: "Top News",
    mainnet: "Mainnet",
    node: "Node",
    mining: "Mining",
    wallet: "Wallet",
    schedule: "Schedule",
    schedule_title: "Pi Network Event Schedule",
    schedule_subtitle: "5-Year Roadmap (2026 – 2031)",
    schedule_desc: "Preloaded with a 5-year ecosystem milestone overview. Tap any item to view details.",
    schedule_note: "※ Post-Q1 2027 milestones reflect medium-term roadmap projections and testnet progress."
  },
  ja: {
    search: "グローバルPiニュースを検索...",
    trending: "急上昇",
    all: "すべて見る",
    categories: "カテゴリー",
    more: "もっと見る",
    login_msg: "詳細はログインしてご覧ください。",
    verified_error: "Pi Browserデベロッパーモードでのドメイン承認が必要です。",
    support: "0.01 Pi 寄付",
    ai_assistant: "AIアシスタント",
    share: "共有",
    source: "出処",
    translating: "翻訳中...",
    no_results: "結果が見つかりません。",
    loading: "読み込み中...",
    launcher: "ランチャー",
    defi: "DeFi",
    defi_title: "Pi 分散型金融(DeFi)",
    wallet_connected: "Piネットワークウォレット連携完了",
    change_id: "ID変更",
    reset_kyc: "KYC ID解除および再入力",
    top_news: "トップニュース",
    mainnet: "メインネット",
    node: "ノード",
    mining: "マイニング",
    wallet: "ウォレット",
    schedule: "スケジュール",
    schedule_title: "Pi ネットワークイベントスケジュール",
    schedule_subtitle: "5年中期ロードマップ (2026 – 2031)",
    schedule_desc: "エコシステムサミットおよび中期見通しに基づく5年間の主要スケジュールが提供されます。タップで詳細を表示できます。",
    schedule_note: "※ 2027年第1四半期以降の予定はテストネット進行および市場見通しを反映した中期ロードマップです。"
  },
  zh: {
    search: "搜索全球派新闻...",
    trending: "热门趋势",
    all: "查看全部",
    categories: "分类",
    more: "更多",
    login_msg: "请登录以查看完整详情。",
    verified_error: "需要在 Pi Browser 开发者模式中获得域名批准。",
    support: "捐赠 0.01 Pi",
    ai_assistant: "AI 助手",
    share: "分享",
    source: "来源",
    translating: "翻译中...",
    no_results: "未找到结果。",
    loading: "加载中...",
    launcher: "应用启动器",
    defi: "去中心化金融",
    defi_title: "Pi 去中心化金融 (DeFi)",
    wallet_connected: "Pi 网络钱包已连接",
    change_id: "更改 ID",
    reset_kyc: "重置并重新输入 KYC ID",
    top_news: "头条新闻",
    mainnet: "主网",
    node: "节点",
    mining: "挖矿",
    wallet: "钱包",
    schedule: "日程",
    schedule_title: "Pi 网络活动日程",
    schedule_subtitle: "5年中长期路线图 (2026 – 2031)",
    schedule_desc: "默认提供基于生态峰会与中长期展望的5年主要日程，点击项目可查看详情。",
    schedule_note: "※ 2027年第一季度之后的时间表为结合测试网进展与市场展望的中长期路线图。"
  },
  es: {
    search: "Buscar noticias globales de Pi...",
    trending: "Tendencias",
    all: "Ver todo",
    categories: "Categorías",
    more: "Más",
    login_msg: "Por favor, inicie sesión para leer los detalles.",
    verified_error: "Se requiere aprobación de dominio en el modo desarrollador de Pi Browser.",
    support: "Donar 0.01 Pi",
    ai_assistant: "Asistente de AI",
    share: "Compartir",
    source: "Fuente",
    translating: "Traduciendo...",
    no_results: "No se encontraron resultados.",
    loading: "Cargando...",
    launcher: "Lanzador",
    defi: "DeFi",
    defi_title: "Finanzas Descentralizadas Pi",
    wallet_connected: "Billetera Pi Network Conectada",
    change_id: "Cambiar ID",
    reset_kyc: "Restablecer y reingresar ID de KYC",
    top_news: "Noticias Principales",
    mainnet: "Red Principal",
    node: "Nodo",
    mining: "Minería",
    wallet: "Billetera",
    schedule: "Calendario",
    schedule_title: "Calendario de Eventos de Pi Network",
    schedule_subtitle: "Hoja de Ruta a 5 Años (2026 – 2031)",
    schedule_desc: "Incluye hitos clave a 5 años basados en la cumbre del ecosistema y perspectivas a mediano plazo. Toca para ver detalles.",
    schedule_note: "※ Los hitos posteriores al primer trimestre de 2027 reflejan proyecciones a mediano plazo y el progreso de testnet."
  },
  vi: {
    search: "Tìm kiếm tin tức Pi toàn cầu...",
    trending: "Xu hướng",
    all: "Xem tất cả",
    categories: "Danh mục",
    more: "Thêm",
    login_msg: "Vui lòng đăng nhập để xem chi tiết.",
    verified_error: "Yêu cầu phê duyệt tên miền trong chế độ nhà phát triển Pi Browser.",
    support: "Ủng hộ 0.01 Pi",
    ai_assistant: "Trợ lý AI",
    share: "Chia sẻ",
    source: "Nguồn",
    translating: "Đang dịch...",
    no_results: "Không tìm thấy kết quả.",
    loading: "Đang tải...",
    launcher: "Trình khởi chạy",
    defi: "DeFi",
    defi_title: "Tài Chính Phi Tập Trung Pi",
    wallet_connected: "Ví Pi Network Đã Kết Nối",
    change_id: "Đổi ID",
    reset_kyc: "Đặt lại & Nhập lại ID KYC",
    top_news: "Tin Nổi Bật",
    mainnet: "Mạng Chính",
    node: "Nút Node",
    mining: "Khai Thác",
    wallet: "Ví",
    schedule: "Lịch trình",
    schedule_title: "Lịch Sự Kiện Pi Network",
    schedule_subtitle: "Lộ Trình 5 Năm (2026 – 2031)",
    schedule_desc: "Tích hợp sẵn các mốc lịch trình chính 5 năm theo hội nghị hệ sinh thái và triển vọng. Nhấn vào mục để xem chi tiết.",
    schedule_note: "※ Các mốc sau quý 1/2027 là lộ trình trung hạn dựa trên tiến độ testnet và triển vọng thị trường."
  }
};

rawTranslations['zh_cn'] = rawTranslations['zh'];
rawTranslations['zh_tw'] = rawTranslations['zh'];

// 어떤 언어 키가 들어와도 undefined로 에러가 나지 않도록 Proxy 처리
export const translations = new Proxy(rawTranslations, {
  get(target, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    return target['en']; // 기본값 영어 반환
  }
});

export default translations;
