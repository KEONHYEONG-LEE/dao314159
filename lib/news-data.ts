
import { NewsItem } from "./types";

export const NEWS_DATA: NewsItem[] = [
  // ===== MAINNET CATEGORY =====
  {
    id: "mainnet-1",
    categoryId: "mainnet",
    date: "2025-04-15",
    author: "GPNR Core Team",
    title: {
      en: "Mainnet Launch Roadmap Announced",
      ko: "메인넷 출시 로드맵 발표",
      zh: "主网启动路线图公布",
      es: "Anuncio del mapa de ruta del lanzamiento de Mainnet",
      vi: "Công bố lộ trình ra mắt Mainnet"
    },
    content: {
      en: "We are excited to announce the official roadmap for our mainnet launch. The transition from testnet to mainnet will occur in three phases: Phase 1 includes final security audits and smart contract verification. Phase 2 involves gradual migration of existing testnet users. Phase 3 marks the full public launch with all features enabled. Stay tuned for more detailed updates.",
      ko: "메인넷 출시를 위한 공식 로드맵을 발표하게 되어 기쁩니다. 테스트넷에서 메인넷으로의 전환은 세 단계로 진행됩니다: 1단계는 최종 보안 감사 및 스마트 컨트랙트 검증을 포함합니다. 2단계는 기존 테스트넷 사용자의 점진적 마이그레이션을 진행합니다. 3단계는 모든 기능이 활성화된 전체 공개 출시입니다. 더 자세한 업데이트를 기대해 주세요.",
      zh: "我们很高兴地宣布主网启动的官方路线图。从测试网到主网的过渡将分三个阶段进行：第一阶段包括最终安全审计和智能合约验证。第二阶段涉及现有测试网用户的逐步迁移。第三阶段标志着所有功能启用的完全公开发布。请继续关注更详细的更新。",
      es: "Nos complace anunciar el mapa de ruta oficial para el lanzamiento de nuestra mainnet. La transición de testnet a mainnet ocurrirá en tres fases: La Fase 1 incluye auditorías de seguridad finales y verificación de contratos inteligentes. La Fase 2 implica la migración gradual de usuarios existentes de testnet. La Fase 3 marca el lanzamiento público completo con todas las funciones habilitadas. Estén atentos para más actualizaciones detalladas.",
      vi: "Chúng tôi vui mừng thông báo lộ trình chính thức cho việc ra mắt mainnet. Quá trình chuyển đổi từ testnet sang mainnet sẽ diễn ra trong ba giai đoạn: Giai đoạn 1 bao gồm kiểm toán bảo mật cuối cùng và xác minh hợp đồng thông minh. Giai đoạn 2 liên quan đến việc di chuyển dần dần người dùng testnet hiện tại. Giai đoạn 3 đánh dấu sự ra mắt công khai đầy đủ với tất cả các tính năng được kích hoạt. Hãy theo dõi để cập nhật chi tiết hơn."
    }
  },
  {
    id: "mainnet-2",
    categoryId: "mainnet",
    date: "2025-04-01",
    author: "GPNR Technical Team",
    title: {
      en: "Security Audit Completed Successfully",
      ko: "보안 감사 성공적으로 완료",
      zh: "安全审计成功完成",
      es: "Auditoría de seguridad completada con éxito",
      vi: "Kiểm toán bảo mật hoàn thành thành công"
    },
    content: {
      en: "We are pleased to announce that our comprehensive security audit has been completed by leading blockchain security firm CertiK. All critical and high-severity issues have been addressed, and the audit report is now available for public review. This milestone brings us one step closer to mainnet launch.",
      ko: "선도적인 블록체인 보안 회사 CertiK에 의해 종합 보안 감사가 완료되었음을 발표하게 되어 기쁩니다. 모든 중요 및 고위험 이슈가 해결되었으며, 감사 보고서가 이제 공개 검토를 위해 제공됩니다. 이 이정표는 메인넷 출시에 한 걸음 더 다가가게 합니다.",
      zh: "我们很高兴地宣布，我们的综合安全审计已由领先的区块链安全公司CertiK完成。所有关键和高严重性问题已得到解决，审计报告现已可供公众查阅。这一里程碑使我们离主网发布更近了一步。",
      es: "Nos complace anunciar que nuestra auditoría de seguridad integral ha sido completada por la firma líder de seguridad blockchain CertiK. Todos los problemas críticos y de alta severidad han sido abordados, y el informe de auditoría está ahora disponible para revisión pública. Este hito nos acerca un paso más al lanzamiento de mainnet.",
      vi: "Chúng tôi vui mừng thông báo rằng cuộc kiểm toán bảo mật toàn diện của chúng tôi đã được hoàn thành bởi công ty bảo mật blockchain hàng đầu CertiK. Tất cả các vấn đề nghiêm trọng và cao đã được giải quyết, và báo cáo kiểm toán hiện đã có sẵn để công chúng xem xét. Cột mốc này đưa chúng tôi đến gần hơn một bước với việc ra mắt mainnet."
    }
  },
  {
    id: "mainnet-3",
    categoryId: "mainnet",
    date: "2025-03-20",
    author: "GPNR Core Team",
    title: {
      en: "Testnet Phase 3 Complete - Final Testing Begins",
      ko: "테스트넷 3단계 완료 - 최종 테스트 시작",
      zh: "测试网第三阶段完成 - 最终测试开始",
      es: "Fase 3 de Testnet Completa - Comienza la Prueba Final",
      vi: "Giai đoạn 3 Testnet Hoàn thành - Bắt đầu Thử nghiệm Cuối cùng"
    },
    content: {
      en: "Testnet Phase 3 has been successfully completed with over 50,000 active participants. We are now entering the final testing phase before mainnet launch. Community members who participated in testing will receive special rewards upon mainnet launch. Thank you for your continued support.",
      ko: "테스트넷 3단계가 50,000명 이상의 활발한 참가자와 함께 성공적으로 완료되었습니다. 이제 메인넷 출시 전 최종 테스트 단계에 진입합니다. 테스트에 참여한 커뮤니티 멤버들은 메인넷 출시 시 특별 보상을 받게 됩니다. 지속적인 지원에 감사드립니다.",
      zh: "测试网第三阶段已成功完成，活跃参与者超过50,000人。我们现在正在进入主网启动前的最终测试阶段。参与测试的社区成员将在主网启动时获得特别奖励。感谢您的持续支持。",
      es: "La Fase 3 de Testnet se ha completado con éxito con más de 50,000 participantes activos. Ahora estamos entrando en la fase de prueba final antes del lanzamiento de mainnet. Los miembros de la comunidad que participaron en las pruebas recibirán recompensas especiales en el lanzamiento de mainnet. Gracias por su apoyo continuo.",
      vi: "Giai đoạn 3 Testnet đã hoàn thành thành công với hơn 50,000 người tham gia tích cực. Chúng tôi hiện đang bước vào giai đoạn thử nghiệm cuối cùng trước khi ra mắt mainnet. Các thành viên cộng đồng tham gia thử nghiệm sẽ nhận được phần thưởng đặc biệt khi mainnet ra mắt. Cảm ơn sự hỗ trợ liên tục của bạn."
    }
  },

  // ===== AIRDROP CATEGORY =====
  {
    id: "airdrop-1",
    categoryId: "airdrop",
    date: "2025-04-10",
    author: "GPNR Marketing Team",
    title: {
      en: "Season 2 Airdrop Campaign Launching Soon",
      ko: "시즌 2 에어드랍 캠페인 곧 시작",
      zh: "第二季空投活动即将启动",
      es: "Campaña de Airdrop Temporada 2 Próximamente",
      vi: "Chiến dịch Airdrop Mùa 2 Sắp Ra mắt"
    },
    content: {
      en: "Get ready for our Season 2 Airdrop Campaign! Building on the success of Season 1, we are introducing new ways to earn GPNR tokens. Eligible activities include staking, governance participation, and community engagement. Early participants will receive bonus multipliers. Stay tuned for the official launch date.",
      ko: "시즌 2 에어드랍 캠페인을 준비하세요! 시즌 1의 성공을 바탕으로 GPNR 토큰을 획득할 수 있는 새로운 방법을 소개합니다. 적격 활동에는 스테이킹, 거버넌스 참여, 커뮤니티 참여가 포함됩니다. 초기 참가자는 보너스 배수를 받게 됩니다. 공식 출시 날짜를 기대해 주세요.",
      zh: "准备好迎接我们的第二季空投活动！在第一季成功的基础上，我们推出了赚取GPNR代币的新方式。符合条件的活动包括质押、治理参与和社区参与。早期参与者将获得奖励加成。敬请期待官方发布日期。",
      es: "¡Prepárate para nuestra Campaña de Airdrop Temporada 2! Basándonos en el éxito de la Temporada 1, estamos introduciendo nuevas formas de ganar tokens GPNR. Las actividades elegibles incluyen staking, participación en gobernanza y compromiso comunitario. Los participantes tempranos recibirán multiplicadores de bonificación. Estén atentos a la fecha de lanzamiento oficial.",
      vi: "Hãy sẵn sàng cho Chiến dịch Airdrop Mùa 2! Dựa trên thành công của Mùa 1, chúng tôi đang giới thiệu các cách mới để kiếm token GPNR. Các hoạt động đủ điều kiện bao gồm staking, tham gia quản trị và tương tác cộng đồng. Những người tham gia sớm sẽ nhận được hệ số thưởng. Hãy theo dõi ngày ra mắt chính thức."
    }
  },
  {
    id: "airdrop-2",
    categoryId: "airdrop",
    date: "2025-03-25",
    author: "GPNR Marketing Team",
    title: {
      en: "Season 1 Airdrop Distribution Complete",
      ko: "시즌 1 에어드랍 배포 완료",
      zh: "第一季空投分配完成",
      es: "Distribución de Airdrop Temporada 1 Completa",
      vi: "Hoàn thành Phân phối Airdrop Mùa 1"
    },
    content: {
      en: "We are happy to announce that Season 1 Airdrop has been successfully distributed to all eligible participants. Over 100,000 wallets received GPNR tokens based on their activity and engagement. If you haven't claimed your tokens yet, please visit your dashboard. Unclaimed tokens will be available for 30 days.",
      ko: "시즌 1 에어드랍이 모든 적격 참가자에게 성공적으로 배포되었음을 발표하게 되어 기쁩니다. 100,000개 이상의 지갑이 활동과 참여에 따라 GPNR 토큰을 받았습니다. 아직 토큰을 청구하지 않았다면 대시보드를 방문해 주세요. 청구되지 않은 토큰은 30일간 이용 가능합니다.",
      zh: "我们很高兴地宣布，第一季空投已成功分配给所有符合条件的参与者。超过100,000个钱包根据其活动和参与度收到了GPNR代币。如果您还没有领取代币，请访问您的仪表板。未领取的代币将在30天内可用。",
      es: "Nos complace anunciar que el Airdrop de la Temporada 1 se ha distribuido exitosamente a todos los participantes elegibles. Más de 100,000 billeteras recibieron tokens GPNR basados en su actividad y compromiso. Si aún no ha reclamado sus tokens, visite su panel de control. Los tokens no reclamados estarán disponibles durante 30 días.",
      vi: "Chúng tôi vui mừng thông báo rằng Airdrop Mùa 1 đã được phân phối thành công cho tất cả những người tham gia đủ điều kiện. Hơn 100,000 ví đã nhận được token GPNR dựa trên hoạt động và sự tham gia của họ. Nếu bạn chưa nhận token, vui lòng truy cập bảng điều khiển của bạn. Các token chưa được nhận sẽ có sẵn trong 30 ngày."
    }
  },
  {
    id: "airdrop-3",
    categoryId: "airdrop",
    date: "2025-03-10",
    author: "GPNR Core Team",
    title: {
      en: "Airdrop Eligibility Criteria Updated",
      ko: "에어드랍 자격 기준 업데이트",
      zh: "空投资格标准更新",
      es: "Criterios de Elegibilidad de Airdrop Actualizados",
      vi: "Cập nhật Tiêu chí Đủ điều kiện Airdrop"
    },
    content: {
      en: "Based on community feedback, we have updated our airdrop eligibility criteria to be more inclusive. The new criteria include: minimum 30 days of wallet activity, at least one successful transaction, and community participation such as social media engagement or forum posts. Check your eligibility status in your dashboard.",
      ko: "커뮤니티 피드백을 바탕으로 에어드랍 자격 기준을 더 포괄적으로 업데이트했습니다. 새로운 기준에는 최소 30일의 지갑 활동, 최소 한 건의 성공적인 거래, 그리고 소셜 미디어 참여 또는 포럼 게시물과 같은 커뮤니티 참여가 포함됩니다. 대시보드에서 자격 상태를 확인하세요.",
      zh: "根据社区反馈，我们已更新空投资格标准，使其更具包容性。新标准包括：至少30天的钱包活动、至少一笔成功交易，以及社交媒体参与或论坛帖子等社区参与。在您的仪表板中检查您的资格状态。",
      es: "Basándonos en los comentarios de la comunidad, hemos actualizado nuestros criterios de elegibilidad de airdrop para ser más inclusivos. Los nuevos criterios incluyen: mínimo 30 días de actividad de billetera, al menos una transacción exitosa, y participación comunitaria como compromiso en redes sociales o publicaciones en foros. Verifique su estado de elegibilidad en su panel de control.",
      vi: "Dựa trên phản hồi của cộng đồng, chúng tôi đã cập nhật tiêu chí đủ điều kiện airdrop để bao gồm nhiều người hơn. Các tiêu chí mới bao gồm: tối thiểu 30 ngày hoạt động ví, ít nhất một giao dịch thành công và tham gia cộng đồng như tương tác trên mạng xã hội hoặc đăng bài trên diễn đàn. Kiểm tra trạng thái đủ điều kiện của bạn trong bảng điều khiển."
    }
  },

  // ===== PARTNERSHIP CATEGORY =====
  {
    id: "partnership-1",
    categoryId: "partnership",
    date: "2025-04-12",
    author: "GPNR Business Team",
    title: {
      en: "Strategic Partnership with Leading DeFi Protocol",
      ko: "선도적 DeFi 프로토콜과 전략적 파트너십 체결",
      zh: "与领先DeFi协议达成战略合作",
      es: "Asociación Estratégica con Protocolo DeFi Líder",
      vi: "Hợp tác Chiến lược với Giao thức DeFi Hàng đầu"
    },
    content: {
      en: "We are thrilled to announce our strategic partnership with Aave, one of the leading DeFi protocols in the industry. This partnership will enable GPNR token holders to access advanced lending and borrowing features. Integration work has already begun, and we expect to launch these features within Q2 2025.",
      ko: "업계 선도적인 DeFi 프로토콜 중 하나인 Aave와의 전략적 파트너십을 발표하게 되어 기쁩니다. 이 파트너십을 통해 GPNR 토큰 보유자들은 고급 대출 및 차입 기능에 접근할 수 있게 됩니다. 통합 작업은 이미 시작되었으며, 2025년 2분기 내에 이러한 기능을 출시할 예정입니다.",
      zh: "我们很高兴地宣布与行业领先的DeFi协议之一Aave达成战略合作。此次合作将使GPNR代币持有者能够访问高级借贷功能。集成工作已经开始，我们预计将在2025年第二季度内推出这些功能。",
      es: "Estamos encantados de anunciar nuestra asociación estratégica con Aave, uno de los protocolos DeFi líderes en la industria. Esta asociación permitirá a los poseedores de tokens GPNR acceder a funciones avanzadas de préstamos. El trabajo de integración ya ha comenzado, y esperamos lanzar estas funciones dentro del segundo trimestre de 2025.",
      vi: "Chúng tôi vui mừng thông báo quan hệ đối tác chiến lược với Aave, một trong những giao thức DeFi hàng đầu trong ngành. Quan hệ đối tác này sẽ cho phép người nắm giữ token GPNR truy cập các tính năng cho vay và vay nâng cao. Công việc tích hợp đã bắt đầu và chúng tôi dự kiến sẽ ra mắt các tính năng này trong Q2 2025."
    }
  },
  {
    id: "partnership-2",
    categoryId: "partnership",
    date: "2025-03-28",
    author: "GPNR Business Team",
    title: {
      en: "Exchange Listing Partnership Announced",
      ko: "거래소 상장 파트너십 발표",
      zh: "交易所上市合作公告",
      es: "Anuncio de Asociación de Listado en Exchange",
      vi: "Thông báo Hợp tác Niêm yết Sàn Giao dịch"
    },
    content: {
      en: "We are excited to share that GPNR has secured listing partnerships with three major cryptocurrency exchanges. The listings will occur in phases, starting with the mainnet launch. Detailed information about trading pairs and launch dates will be shared closer to the listing dates. This marks a significant milestone in our journey.",
      ko: "GPNR이 세 개의 주요 암호화폐 거래소와 상장 파트너십을 확보했음을 공유하게 되어 기쁩니다. 상장은 메인넷 출시부터 단계적으로 진행됩니다. 거래 쌍 및 출시 날짜에 대한 자세한 정보는 상장 날짜에 가까워지면 공유됩니다. 이는 우리의 여정에서 중요한 이정표입니다.",
      zh: "我们很高兴地分享GPNR已与三家主要加密货币交易所确定了上市合作关系。上市将分阶段进行，从主网发布开始。交易对和发布日期的详细信息将在上市日期临近时分享。这标志着我们旅程中的一个重要里程碑。",
      es: "Nos emociona compartir que GPNR ha asegurado asociaciones de listado con tres exchanges de criptomonedas importantes. Los listados ocurrirán en fases, comenzando con el lanzamiento de mainnet. La información detallada sobre pares de trading y fechas de lanzamiento se compartirá más cerca de las fechas de listado. Esto marca un hito significativo en nuestro viaje.",
      vi: "Chúng tôi vui mừng chia sẻ rằng GPNR đã đảm bảo quan hệ đối tác niêm yết với ba sàn giao dịch tiền điện tử lớn. Việc niêm yết sẽ diễn ra theo từng giai đoạn, bắt đầu với việc ra mắt mainnet. Thông tin chi tiết về các cặp giao dịch và ngày ra mắt sẽ được chia sẻ gần ngày niêm yết hơn. Đây là một cột mốc quan trọng trong hành trình của chúng tôi."
    }
  },
  {
    id: "partnership-3",
    categoryId: "partnership",
    date: "2025-03-15",
    author: "GPNR Core Team",
    title: {
      en: "Infrastructure Partnership with Chainlink",
      ko: "Chainlink와 인프라 파트너십",
      zh: "与Chainlink的基础设施合作",
      es: "Asociación de Infraestructura con Chainlink",
      vi: "Hợp tác Cơ sở hạ tầng với Chainlink"
    },
    content: {
      en: "GPNR has partnered with Chainlink to integrate their oracle solutions into our ecosystem. This partnership will provide our users with reliable, tamper-proof price feeds and enable cross-chain functionality. The integration will be completed before mainnet launch, ensuring robust and secure operations from day one.",
      ko: "GPNR은 Chainlink와 파트너십을 맺어 그들의 오라클 솔루션을 우리 생태계에 통합합니다. 이 파트너십은 사용자에게 신뢰할 수 있고 변조 방지된 가격 피드를 제공하고 크로스체인 기능을 가능하게 합니다. 통합은 메인넷 출시 전에 완료되어 첫날부터 강력하고 안전한 운영을 보장합니다.",
      zh: "GPNR与Chainlink建立了合作关系，将他们的预言机解决方案集成到我们的生态系统中。此次合作将为我们的用户提供可靠、防篡改的价格数据，并实现跨链功能。集成将在主网启动前完成，确保从第一天起就能进行稳健和安全的运营。",
      es: "GPNR se ha asociado con Chainlink para integrar sus soluciones de oráculos en nuestro ecosistema. Esta asociación proporcionará a nuestros usuarios feeds de precios confiables y a prueba de manipulaciones, y habilitará la funcionalidad cross-chain. La integración se completará antes del lanzamiento de mainnet, asegurando operaciones robustas y seguras desde el primer día.",
      vi: "GPNR đã hợp tác với Chainlink để tích hợp các giải pháp oracle của họ vào hệ sinh thái của chúng tôi. Quan hệ đối tác này sẽ cung cấp cho người dùng của chúng tôi nguồn cấp dữ liệu giá đáng tin cậy, chống giả mạo và cho phép chức năng cross-chain. Việc tích hợp sẽ hoàn thành trước khi ra mắt mainnet, đảm bảo hoạt động mạnh mẽ và an toàn ngay từ ngày đầu tiên."
    }
  },

  // ===== ECOSYSTEM CATEGORY =====
  {
    id: "ecosystem-1",
    categoryId: "ecosystem",
    date: "2025-04-14",
    author: "GPNR Development Team",
    title: {
      en: "Developer SDK and API Documentation Released",
      ko: "개발자 SDK 및 API 문서 출시",
      zh: "开发者SDK和API文档发布",
      es: "SDK para Desarrolladores y Documentación API Publicados",
      vi: "SDK Nhà phát triển và Tài liệu API Được Phát hành"
    },
    content: {
      en: "We are excited to release our comprehensive Developer SDK and API documentation. The SDK supports JavaScript, Python, and Rust, making it easy for developers to build on GPNR. Documentation includes quickstart guides, code examples, and best practices. Join our developer community on Discord for support.",
      ko: "종합적인 개발자 SDK 및 API 문서를 출시하게 되어 기쁩니다. SDK는 JavaScript, Python, Rust를 지원하여 개발자들이 GPNR에서 쉽게 빌드할 수 있게 합니다. 문서에는 빠른 시작 가이드, 코드 예제, 모범 사례가 포함되어 있습니다. 지원을 받으려면 Discord의 개발자 커뮤니티에 참여하세요.",
      zh: "我们很高兴发布我们全面的开发者SDK和API文档。SDK支持JavaScript、Python和Rust，使开发者能够轻松在GPNR上构建。文档包括快速入门指南、代码示例和最佳实践。加入我们Discord上的开发者社区获取支持。",
      es: "Nos complace publicar nuestro completo SDK para desarrolladores y documentación API. El SDK soporta JavaScript, Python y Rust, facilitando a los desarrolladores construir sobre GPNR. La documentación incluye guías de inicio rápido, ejemplos de código y mejores prácticas. Únete a nuestra comunidad de desarrolladores en Discord para obtener soporte.",
      vi: "Chúng tôi vui mừng phát hành SDK nhà phát triển toàn diện và tài liệu API. SDK hỗ trợ JavaScript, Python và Rust, giúp các nhà phát triển dễ dàng xây dựng trên GPNR. Tài liệu bao gồm hướng dẫn bắt đầu nhanh, ví dụ mã và các phương pháp tốt nhất. Tham gia cộng đồng nhà phát triển của chúng tôi trên Discord để được hỗ trợ."
    }
  },
  {
    id: "ecosystem-2",
    categoryId: "ecosystem",
    date: "2025-04-05",
    author: "GPNR Core Team",
    title: {
      en: "Ecosystem Fund Launch - $50M for Builders",
      ko: "생태계 펀드 출시 - 빌더를 위한 5천만 달러",
      zh: "生态系统基金启动 - 5000万美元支持建设者",
      es: "Lanzamiento del Fondo del Ecosistema - $50M para Constructores",
      vi: "Ra mắt Quỹ Hệ sinh thái - $50M cho Nhà xây dựng"
    },
    content: {
      en: "We are launching a $50 million ecosystem fund to support developers and projects building on GPNR. The fund will provide grants, investments, and resources to accelerate ecosystem growth. Applications are now open for projects in DeFi, NFTs, gaming, and infrastructure. Visit our grants portal to apply.",
      ko: "GPNR에서 빌드하는 개발자와 프로젝트를 지원하기 위해 5천만 달러 규모의 생태계 펀드를 출시합니다. 이 펀드는 생태계 성장을 가속화하기 위해 보조금, 투자 및 리소스를 제공합니다. DeFi, NFT, 게임, 인프라 분야의 프로젝트에 대한 신청이 현재 열려 있습니다. 신청하려면 그랜트 포털을 방문하세요.",
      zh: "我们正在启动一个5000万美元的生态系统基金，以支持在GPNR上构建的开发者和项目。该基金将提供资助、投资和资源，以加速生态系统增长。现已开放DeFi、NFT、游戏和基础设施领域项目的申请。请访问我们的资助门户进行申请。",
      es: "Estamos lanzando un fondo de ecosistema de $50 millones para apoyar a desarrolladores y proyectos que construyen sobre GPNR. El fondo proporcionará subvenciones, inversiones y recursos para acelerar el crecimiento del ecosistema. Las solicitudes están abiertas para proyectos en DeFi, NFTs, gaming e infraestructura. Visita nuestro portal de grants para aplicar.",
      vi: "Chúng tôi đang ra mắt quỹ hệ sinh thái 50 triệu đô la để hỗ trợ các nhà phát triển và dự án xây dựng trên GPNR. Quỹ sẽ cung cấp các khoản tài trợ, đầu tư và tài nguyên để đẩy nhanh tăng trưởng hệ sinh thái. Các ứng dụng hiện đang mở cho các dự án trong DeFi, NFT, gaming và cơ sở hạ tầng. Truy cập cổng tài trợ của chúng tôi để đăng ký."
    }
  },
  {
    id: "ecosystem-3",
    categoryId: "ecosystem",
    date: "2025-03-22",
    author: "GPNR Development Team",
    title: {
      en: "First Ecosystem dApps Now Live on Testnet",
      ko: "첫 번째 생태계 dApp 테스트넷에서 라이브",
      zh: "首批生态系统dApp现已在测试网上线",
      es: "Primeras dApps del Ecosistema Ahora en Vivo en Testnet",
      vi: "Các dApp Hệ sinh thái Đầu tiên Đã Hoạt động trên Testnet"
    },
    content: {
      en: "We are proud to announce that the first batch of ecosystem dApps is now live on testnet. These include a DEX, NFT marketplace, and lending protocol. Community members are encouraged to test these applications and provide feedback. Bug bounties are available for critical issues discovered during testing.",
      ko: "첫 번째 생태계 dApp 배치가 테스트넷에서 라이브되었음을 발표하게 되어 자랑스럽습니다. 여기에는 DEX, NFT 마켓플레이스, 대출 프로토콜이 포함됩니다. 커뮤니티 멤버들은 이러한 애플리케이션을 테스트하고 피드백을 제공하도록 권장됩니다. 테스트 중 발견된 중요한 이슈에 대해 버그 바운티가 제공됩니다.",
      zh: "我们很自豪地宣布，首批生态系统dApp现已在测试网上线。其中包括DEX、NFT市场和借贷协议。鼓励社区成员测试这些应用程序并提供反馈。测试期间发现的关键问题可获得漏洞赏金。",
      es: "Estamos orgullosos de anunciar que el primer lote de dApps del ecosistema está ahora en vivo en testnet. Estos incluyen un DEX, marketplace de NFT y protocolo de préstamos. Se anima a los miembros de la comunidad a probar estas aplicaciones y proporcionar comentarios. Hay recompensas por bugs disponibles para problemas críticos descubiertos durante las pruebas.",
      vi: "Chúng tôi tự hào thông báo rằng đợt dApp hệ sinh thái đầu tiên hiện đã hoạt động trên testnet. Bao gồm DEX, sàn giao dịch NFT và giao thức cho vay. Các thành viên cộng đồng được khuyến khích thử nghiệm các ứng dụng này và cung cấp phản hồi. Tiền thưởng bug bounty có sẵn cho các vấn đề nghiêm trọng được phát hiện trong quá trình thử nghiệm."
    }
  },

  // ===== GOVERNANCE CATEGORY =====
  {
    id: "governance-1",
    categoryId: "governance",
    date: "2025-04-08",
    author: "GPNR Governance Team",
    title: {
      en: "Governance Framework and Voting System Launch",
      ko: "거버넌스 프레임워크 및 투표 시스템 출시",
      zh: "治理框架和投票系统启动",
      es: "Lanzamiento del Marco de Gobernanza y Sistema de Votación",
      vi: "Ra mắt Khung Quản trị và Hệ thống Bỏ phiếu"
    },
    content: {
      en: "The GPNR governance framework is now live! Token holders can participate in protocol decisions through our new voting system. The framework includes proposal submission, discussion periods, and on-chain voting. Staked tokens determine voting power. First governance proposals will be accepted starting next week.",
      ko: "GPNR 거버넌스 프레임워크가 이제 라이브입니다! 토큰 보유자는 새로운 투표 시스템을 통해 프로토콜 결정에 참여할 수 있습니다. 프레임워크에는 제안 제출, 토론 기간, 온체인 투표가 포함됩니다. 스테이킹된 토큰이 투표권을 결정합니다. 첫 번째 거버넌스 제안은 다음 주부터 수락됩니다.",
      zh: "GPNR治理框架现已上线！代币持有者可以通过我们的新投票系统参与协议决策。该框架包括提案提交、讨论期和链上投票。质押的代币决定投票权。第一批治理提案将从下周开始接受。",
      es: "¡El marco de gobernanza de GPNR ya está en vivo! Los poseedores de tokens pueden participar en las decisiones del protocolo a través de nuestro nuevo sistema de votación. El marco incluye envío de propuestas, períodos de discusión y votación on-chain. Los tokens en staking determinan el poder de voto. Las primeras propuestas de gobernanza se aceptarán a partir de la próxima semana.",
      vi: "Khung quản trị GPNR hiện đã hoạt động! Người nắm giữ token có thể tham gia vào các quyết định giao thức thông qua hệ thống bỏ phiếu mới của chúng tôi. Khung bao gồm gửi đề xuất, thời gian thảo luận và bỏ phiếu on-chain. Token đã stake xác định quyền bỏ phiếu. Các đề xuất quản trị đầu tiên sẽ được chấp nhận từ tuần tới."
    }
  },
  {
    id: "governance-2",
    categoryId: "governance",
    date: "2025-03-30",
    author: "GPNR Governance Team",
    title: {
      en: "Community Council Elections Announced",
      ko: "커뮤니티 위원회 선거 발표",
      zh: "社区委员会选举公告",
      es: "Anuncio de Elecciones del Consejo Comunitario",
      vi: "Thông báo Bầu cử Hội đồng Cộng đồng"
    },
    content: {
      en: "We are announcing the first Community Council elections! The council will consist of 7 elected members who will represent community interests in governance decisions. Nominations are open until April 15th, with voting to follow. Council members will serve 6-month terms and receive governance incentives.",
      ko: "첫 번째 커뮤니티 위원회 선거를 발표합니다! 위원회는 거버넌스 결정에서 커뮤니티 이익을 대표하는 7명의 선출된 위원으로 구성됩니다. 후보 지명은 4월 15일까지 열려 있으며, 이후 투표가 진행됩니다. 위원회 위원은 6개월 임기를 수행하며 거버넌스 인센티브를 받습니다.",
      zh: "我们宣布首次社区委员会选举！委员会将由7名当选成员组成，他们将在治理决策中代表社区利益。提名开放至4月15日，随后进行投票。委员会成员任期6个月，并获得治理激励。",
      es: "¡Estamos anunciando las primeras elecciones del Consejo Comunitario! El consejo estará formado por 7 miembros elegidos que representarán los intereses de la comunidad en las decisiones de gobernanza. Las nominaciones están abiertas hasta el 15 de abril, con votación a seguir. Los miembros del consejo servirán términos de 6 meses y recibirán incentivos de gobernanza.",
      vi: "Chúng tôi thông báo cuộc bầu cử Hội đồng Cộng đồng đầu tiên! Hội đồng sẽ bao gồm 7 thành viên được bầu chọn sẽ đại diện cho lợi ích cộng đồng trong các quyết định quản trị. Đề cử mở đến ngày 15 tháng 4, sau đó là bỏ phiếu. Các thành viên hội đồng sẽ phục vụ nhiệm kỳ 6 tháng và nhận các ưu đãi quản trị."
    }
  },
  {
    id: "governance-3",
    categoryId: "governance",
    date: "2025-03-18",
    author: "GPNR Core Team",
    title: {
      en: "Treasury Management Proposal Approved",
      ko: "재무 관리 제안 승인됨",
      zh: "财务管理提案获批",
      es: "Propuesta de Gestión de Tesorería Aprobada",
      vi: "Đề xuất Quản lý Ngân quỹ Được Phê duyệt"
    },
    content: {
      en: "The community has voted to approve the Treasury Management Proposal with 78% support. The proposal establishes guidelines for treasury fund allocation, including 40% for ecosystem development, 30% for marketing, 20% for reserves, and 10% for community initiatives. Implementation begins immediately.",
      ko: "커뮤니티가 78%의 지지로 재무 관리 제안을 승인했습니다. 이 제안은 생태계 개발 40%, 마케팅 30%, 준비금 20%, 커뮤니티 이니셔티브 10%를 포함하는 재무 자금 배분 지침을 수립합니다. 구현은 즉시 시작됩니다.",
      zh: "社区以78%的支持率投票通过了财务管理提案。该提案建立了财务资金分配指南，包括40%用于生态系统发展，30%用于营销，20%用于储备，10%用于社区计划。实施立即开始。",
      es: "La comunidad ha votado para aprobar la Propuesta de Gestión de Tesorería con un 78% de apoyo. La propuesta establece directrices para la asignación de fondos de tesorería, incluyendo 40% para desarrollo del ecosistema, 30% para marketing, 20% para reservas y 10% para iniciativas comunitarias. La implementación comienza inmediatamente.",
      vi: "Cộng đồng đã bỏ phiếu thông qua Đề xuất Quản lý Ngân quỹ với 78% ủng hộ. Đề xuất thiết lập các hướng dẫn phân bổ quỹ ngân quỹ, bao gồm 40% cho phát triển hệ sinh thái, 30% cho marketing, 20% cho dự trữ và 10% cho các sáng kiến cộng đồng. Việc thực hiện bắt đầu ngay lập tức."
    }
  },

  // ===== COMMUNITY CATEGORY =====
  {
    id: "community-1",
    categoryId: "community",
    date: "2025-04-11",
    author: "GPNR Community Team",
    title: {
      en: "Global Community Ambassador Program Launch",
      ko: "글로벌 커뮤니티 앰배서더 프로그램 출시",
      zh: "全球社区大使计划启动",
      es: "Lanzamiento del Programa Global de Embajadores Comunitarios",
      vi: "Ra mắt Chương trình Đại sứ Cộng đồng Toàn cầu"
    },
    content: {
      en: "We are launching our Global Community Ambassador Program! Ambassadors will represent GPNR in their regions, organize local meetups, and help grow our community. Selected ambassadors will receive monthly rewards, exclusive merchandise, and early access to new features. Applications are now open.",
      ko: "글로벌 커뮤니티 앰배서더 프로그램을 출시합니다! 앰배서더는 자신의 지역에서 GPNR을 대표하고, 지역 밋업을 조직하며, 커뮤니티 성장을 돕습니다. 선정된 앰배서더는 월간 보상, 독점 상품, 새로운 기능에 대한 조기 액세스를 받게 됩니다. 신청이 현재 열려 있습니다.",
      zh: "我们正在启动全球社区大使计划！大使将在其地区代表GPNR，组织当地聚会，并帮助发展我们的社区。被选中的大使将获得每月奖励、独家商品和新功能的早期访问权。现已开放申请。",
      es: "¡Estamos lanzando nuestro Programa Global de Embajadores Comunitarios! Los embajadores representarán a GPNR en sus regiones, organizarán meetups locales y ayudarán a hacer crecer nuestra comunidad. Los embajadores seleccionados recibirán recompensas mensuales, merchandising exclusivo y acceso anticipado a nuevas funciones. Las solicitudes ya están abiertas.",
      vi: "Chúng tôi đang ra mắt Chương trình Đại sứ Cộng đồng Toàn cầu! Các đại sứ sẽ đại diện cho GPNR trong khu vực của họ, tổ chức các buổi gặp mặt địa phương và giúp phát triển cộng đồng của chúng tôi. Các đại sứ được chọn sẽ nhận phần thưởng hàng tháng, hàng hóa độc quyền và quyền truy cập sớm vào các tính năng mới. Đơn đăng ký hiện đang mở."
    }
  },
  {
    id: "community-2",
    categoryId: "community",
    date: "2025-04-02",
    author: "GPNR Community Team",
    title: {
      en: "Community Milestone: 500,000 Members!",
      ko: "커뮤니티 이정표: 50만 회원 달성!",
      zh: "社区里程碑：50万会员！",
      es: "Hito Comunitario: ¡500,000 Miembros!",
      vi: "Cột mốc Cộng đồng: 500,000 Thành viên!"
    },
    content: {
      en: "We are thrilled to announce that our community has reached 500,000 members across all platforms! This incredible milestone reflects the dedication and enthusiasm of our community. To celebrate, we are hosting a special AMA with the founding team and giving away exclusive NFTs to active community members.",
      ko: "모든 플랫폼에서 커뮤니티가 50만 회원에 도달했음을 발표하게 되어 기쁩니다! 이 놀라운 이정표는 커뮤니티의 헌신과 열정을 반영합니다. 축하하기 위해 창립 팀과 특별 AMA를 개최하고 활발한 커뮤니티 멤버들에게 독점 NFT를 증정합니다.",
      zh: "我们很高兴地宣布，我们的社区在所有平台上已达到500,000名成员！这一令人难以置信的里程碑反映了我们社区的奉献和热情。为了庆祝，我们将与创始团队举行特别AMA，并向活跃的社区成员赠送独家NFT。",
      es: "¡Estamos encantados de anunciar que nuestra comunidad ha alcanzado los 500,000 miembros en todas las plataformas! Este increíble hito refleja la dedicación y entusiasmo de nuestra comunidad. Para celebrar, estamos organizando un AMA especial con el equipo fundador y regalando NFTs exclusivos a los miembros activos de la comunidad.",
      vi: "Chúng tôi vui mừng thông báo rằng cộng đồng của chúng tôi đã đạt 500,000 thành viên trên tất cả các nền tảng! Cột mốc đáng kinh ngạc này phản ánh sự cống hiến và nhiệt tình của cộng đồng chúng tôi. Để ăn mừng, chúng tôi đang tổ chức một AMA đặc biệt với đội ngũ sáng lập và tặng NFT độc quyền cho các thành viên cộng đồng tích cực."
    }
  },
  {
    id: "community-3",
    categoryId: "community",
    date: "2025-03-12",
    author: "GPNR Events Team",
    title: {
      en: "GPNR Global Hackathon Announcement",
      ko: "GPNR 글로벌 해커톤 발표",
      zh: "GPNR全球黑客马拉松公告",
      es: "Anuncio del Hackathon Global de GPNR",
      vi: "Thông báo Hackathon Toàn cầu GPNR"
    },
    content: {
      en: "Join us for the first GPNR Global Hackathon! Compete for $100,000 in prizes while building innovative applications on GPNR. The hackathon runs from April 1-30, 2025. Categories include DeFi, NFTs, Social, and Infrastructure. Register now to secure your spot and access to exclusive workshops.",
      ko: "첫 번째 GPNR 글로벌 해커톤에 참여하세요! GPNR에서 혁신적인 애플리케이션을 구축하면서 10만 달러의 상금을 놓고 경쟁하세요. 해커톤은 2025년 4월 1일부터 30일까지 진행됩니다. 카테고리에는 DeFi, NFT, 소셜, 인프라가 포함됩니다. 지금 등록하여 자리를 확보하고 독점 워크숍에 액세스하세요.",
      zh: "加入我们的首届GPNR全球黑客马拉松！在GPNR上构建创新应用程序，竞争10万美元的奖金。黑客马拉松将于2025年4月1日至30日举行。类别包括DeFi、NFT、社交和基础设施。立即注册以确保您的名额并获得独家研讨会的访问权。",
      es: "¡Únete al primer Hackathon Global de GPNR! Compite por $100,000 en premios mientras construyes aplicaciones innovadoras en GPNR. El hackathon se lleva a cabo del 1 al 30 de abril de 2025. Las categorías incluyen DeFi, NFTs, Social e Infraestructura. Regístrate ahora para asegurar tu lugar y acceso a talleres exclusivos.",
      vi: "Tham gia Hackathon Toàn cầu GPNR đầu tiên! Cạnh tranh giành 100,000 đô la tiền thưởng trong khi xây dựng các ứng dụng sáng tạo trên GPNR. Hackathon diễn ra từ ngày 1-30 tháng 4 năm 2025. Các hạng mục bao gồm DeFi, NFT, Xã hội và Cơ sở hạ tầng. Đăng ký ngay để đảm bảo chỗ của bạn và truy cập vào các hội thảo độc quyền."
    }
  },

  // ===== TECHNICAL CATEGORY =====
  {
    id: "technical-1",
    categoryId: "technical",
    date: "2025-04-13",
    author: "GPNR Technical Team",
    title: {
      en: "Protocol Upgrade v2.0 Specifications Released",
      ko: "프로토콜 업그레이드 v2.0 사양 발표",
      zh: "协议升级v2.0规格发布",
      es: "Especificaciones de Actualización de Protocolo v2.0 Publicadas",
      vi: "Phát hành Thông số Nâng cấp Giao thức v2.0"
    },
    content: {
      en: "We are releasing the full specifications for Protocol v2.0, which will be implemented at mainnet launch. Key improvements include 10x throughput increase, reduced gas fees by 50%, enhanced smart contract capabilities, and improved cross-chain interoperability. Technical documentation is available on our developer portal.",
      ko: "메인넷 출시 시 구현될 프로토콜 v2.0의 전체 사양을 발표합니다. 주요 개선 사항에는 10배 처리량 증가, 50% 가스 비용 절감, 향상된 스마트 컨트랙트 기능, 개선된 크로스체인 상호운용성이 포함됩니다. 기술 문서는 개발자 포털에서 확인할 수 있습니다.",
      zh: "我们正在发布将在主网启动时实施的协议v2.0的完整规格。主要改进包括吞吐量提高10倍、Gas费用降低50%、增强的智能合约功能和改进的跨链互操作性。技术文档可在我们的开发者门户上获取。",
      es: "Estamos publicando las especificaciones completas del Protocolo v2.0, que se implementará en el lanzamiento de mainnet. Las mejoras clave incluyen un aumento de 10x en el rendimiento, reducción de tarifas de gas en un 50%, capacidades mejoradas de contratos inteligentes y mejor interoperabilidad cross-chain. La documentación técnica está disponible en nuestro portal de desarrolladores.",
      vi: "Chúng tôi đang phát hành các thông số kỹ thuật đầy đủ cho Giao thức v2.0, sẽ được triển khai khi ra mắt mainnet. Các cải tiến chính bao gồm tăng thông lượng 10 lần, giảm phí gas 50%, nâng cao khả năng hợp đồng thông minh và cải thiện khả năng tương tác cross-chain. Tài liệu kỹ thuật có sẵn trên cổng nhà phát triển của chúng tôi."
    }
  },
  {
    id: "technical-2",
    categoryId: "technical",
    date: "2025-03-26",
    author: "GPNR Technical Team",
    title: {
      en: "New Consensus Mechanism: Proof of Contribution",
      ko: "새로운 합의 메커니즘: 기여 증명",
      zh: "新共识机制：贡献证明",
      es: "Nuevo Mecanismo de Consenso: Prueba de Contribución",
      vi: "Cơ chế Đồng thuận Mới: Bằng chứng Đóng góp"
    },
    content: {
      en: "We are introducing our innovative Proof of Contribution (PoC) consensus mechanism. Unlike traditional PoS, PoC rewards users based on their overall contribution to the network, including development, community building, and governance participation. This creates a more inclusive and sustainable ecosystem.",
      ko: "혁신적인 기여 증명(PoC) 합의 메커니즘을 소개합니다. 기존 PoS와 달리 PoC는 개발, 커뮤니티 구축, 거버넌스 참여를 포함한 네트워크에 대한 전반적인 기여도에 따라 사용자에게 보상합니다. 이는 더 포용적이고 지속 가능한 생태계를 만듭니다.",
      zh: "我们正在推出创新的贡献证明（PoC）共识机制。与传统的PoS不同，PoC根据用户对网络的整体贡献来奖励用户，包括开发、社区建设和治理参与。这创造了一个更具包容性和可持续性的生态系统。",
      es: "Estamos introduciendo nuestro innovador mecanismo de consenso Prueba de Contribución (PoC). A diferencia del PoS tradicional, PoC recompensa a los usuarios basándose en su contribución general a la red, incluyendo desarrollo, construcción de comunidad y participación en gobernanza. Esto crea un ecosistema más inclusivo y sostenible.",
      vi: "Chúng tôi đang giới thiệu cơ chế đồng thuận Bằng chứng Đóng góp (PoC) sáng tạo của chúng tôi. Không giống như PoS truyền thống, PoC thưởng cho người dùng dựa trên đóng góp tổng thể của họ cho mạng, bao gồm phát triển, xây dựng cộng đồng và tham gia quản trị. Điều này tạo ra một hệ sinh thái bao gồm hơn và bền vững hơn."
    }
  },
  {
    id: "technical-3",
    categoryId: "technical",
    date: "2025-03-08",
    author: "GPNR Development Team",
    title: {
      en: "Zero-Knowledge Proof Integration Complete",
      ko: "영지식 증명 통합 완료",
      zh: "零知识证明集成完成",
      es: "Integración de Prueba de Conocimiento Cero Completada",
      vi: "Hoàn thành Tích hợp Bằng chứng Zero-Knowledge"
    },
    content: {
      en: "We have successfully integrated zero-knowledge proof technology into our protocol. This enhancement enables private transactions, scalable rollups, and enhanced security features. Users can now choose to make their transactions private while still benefiting from the security of the main chain.",
      ko: "영지식 증명 기술을 프로토콜에 성공적으로 통합했습니다. 이 개선은 프라이빗 트랜잭션, 확장 가능한 롤업, 향상된 보안 기능을 가능하게 합니다. 사용자는 이제 메인 체인의 보안 혜택을 받으면서 트랜잭션을 프라이빗하게 만들 수 있습니다.",
      zh: "我们已成功将零知识证明技术集成到我们的协议中。此增强功能支持私密交易、可扩展的rollup和增强的安全功能。用户现在可以选择使其交易私密化，同时仍然享受主链的安全性。",
      es: "Hemos integrado exitosamente la tecnología de prueba de conocimiento cero en nuestro protocolo. Esta mejora permite transacciones privadas, rollups escalables y características de seguridad mejoradas. Los usuarios ahora pueden elegir hacer sus transacciones privadas mientras se benefician de la seguridad de la cadena principal.",
      vi: "Chúng tôi đã tích hợp thành công công nghệ bằng chứng zero-knowledge vào giao thức của mình. Cải tiến này cho phép giao dịch riêng tư, rollup có thể mở rộng và các tính năng bảo mật nâng cao. Người dùng giờ đây có thể chọn làm cho giao dịch của họ riêng tư trong khi vẫn được hưởng lợi từ bảo mật của chuỗi chính."
    }
  }
];
