import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Trash2, 
  Smile, 
  Volume2, 
  Sparkles, 
  User, 
  HelpCircle, 
  RotateCcw,
  Copy,
  Check,
  Flame,
  ShieldAlert,
  Brain,
  MessageCircle,
  Languages,
  Globe,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type LangCode = "ko" | "en" | "ja" | "zh";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

const TRANSLATIONS: Record<LangCode, {
  title: string;
  subtitle: string;
  defaultFriendName: string;
  defaultFriendStatus: string;
  defaultFriendTag: string;
  friendBioTitle: string;
  editProfileBtn: string;
  randomizeBioBtn: string;
  closenessLabel: string;
  brainCellsLabel: string;
  teaseBtn: string;
  backupBtn: string;
  resetBtn: string;
  helpTitle: string;
  helpClose: string;
  helpPoints: string[];
  placeholderInput: string;
  welcomeMessage: string;
  errorMessage: string;
  resetConfirm: string;
  resetWelcome: string;
  adBannerTitle: string;
  adBannerText: string;
  modalTitle: string;
  modalNameLabel: string;
  modalTagLabel: string;
  modalStatusLabel: string;
  modalBioLabel: string;
  modalRestoreBtn: string;
  modalSaveBtn: string;
  modalGenderLabel: string;
  modalGenderMale: string;
  modalGenderFemale: string;
  modalAgeLabel: string;
  modalAge10s: string;
  modalAge20s: string;
  modalAge30s: string;
  modalAge40s: string;
  modalMoodLabel: string;
  modalMoodNormal: string;
  modalMoodTeasing: string;
  modalMoodLoving: string;
  modalMoodSad: string;
  userModalTitle: string;
  userModalNameLabel: string;
  userModalAvatarLabel: string;
  userModalGenderLabel: string;
  userModalAgeLabel: string;
  userModalSaveBtn: string;
  presets: { label: string; prompt: string }[];
  bios: string[];
  teaseMessages: string[];
  pwaInstallTitle: string;
  pwaInstallDesc: string;
  pwaInstallBtn: string;
  premiumAdTitle: string;
  premiumAdDesc: string;
  premiumAdSupportBtn: string;
  premiumAdCountdown: string;
}> = {
  ko: {
    title: "불알친구 AI",
    subtitle: "현실성 0% 뇌피셜의 황제",
    defaultFriendName: "김덕배",
    defaultFriendStatus: "피시방에서 삼양라면 흡입 중 🍜",
    defaultFriendTag: "(불알친구)",
    friendBioTitle: "20대 찐친",
    editProfileBtn: "프로필 수정",
    randomizeBioBtn: "한마디 랜덤 변경",
    closenessLabel: "덕배와의 친밀도",
    brainCellsLabel: "오늘 남은 뇌세포",
    teaseBtn: "덕배한테 참교육(시비) 날리기 🖕",
    backupBtn: "대화 백업",
    resetBtn: "대화 리셋",
    helpTitle: "덕배 사용 설명서",
    helpClose: "닫기",
    helpPoints: [
      "이 새끼는 절대로 진지한 조언을 하지 않습니다.",
      "어떤 단어나 고민을 던지든 현실성 0%의 우주 음모론과 정신 나간 헛소리로 답해줍니다.",
      "참교육 날리기를 누르면 뇌 필터를 완전히 박살 낸 찐친 분노 톡을 보냅니다.",
      "친구 이름이나 직업, 상태 메시지를 자유롭게 바꿔서 커스텀 찐친을 만들어보세요!"
    ],
    placeholderInput: "야 대가리에 든 생각 아무거나 적어봐 ㅋㅋㅋ",
    welcomeMessage: "와 새끼 진짜 오랜만이네 ㅋㅋㅋ 어제 피시방 왜 안 왔냐? 오늘 무슨 황당한 일이 벌어졌길래 연락했냐? 뭐든 물어봐봐, 내가 지구 자전 축을 비틀어서라도 기상천외한 우주적 진실을 밝혀줄 테니까 ㅋㅋㅋ",
    errorMessage: "아 미친, 인터넷 끊겼거나 내 뇌 회로에 과부하 걸림 ㅋㅋㅋ 다시 물어보든가 새로고침해봐 새끼야 ㅋㅋㅋ",
    resetConfirm: "대화 내용 싹 다 밀어버릴 거냐?",
    resetWelcome: "야, 왜 기억상실증 걸린 것처럼 리셋하냐? ㅋㅋㅋ 새로운 헛소리 세계관을 짜보자고! 빨리 아무 단어나 던져봐!",
    adBannerTitle: "AD",
    adBannerText: "구글 애드센스 광고 영역 (수익 극대화 존 💸)",
    modalTitle: "내 불알친구 커스텀",
    modalNameLabel: "친구 이름",
    modalTagLabel: "관계 수식어 (예: (불알친구))",
    modalStatusLabel: "상태 메세지",
    modalBioLabel: "친구의 한마디 (Bio)",
    modalRestoreBtn: "기본값 복원",
    modalSaveBtn: "설정 완료",
    modalGenderLabel: "성별",
    modalGenderMale: "남자 ♂️",
    modalGenderFemale: "여자 ♀️",
    modalAgeLabel: "나이대",
    modalAge10s: "10대 (급식)",
    modalAge20s: "20대 (학식/청춘)",
    modalAge30s: "30대 (직딩)",
    modalAge40s: "40대+ (행님/누님)",
    modalMoodLabel: "친구의 기분 / 감정 상태 🎭",
    modalMoodNormal: "일반 / 킹받음 🤪",
    modalMoodTeasing: "약올림 / 장난기 😜",
    modalMoodLoving: "사랑 / 애교 😍",
    modalMoodSad: "슬픔 / 징징 😭",
    userModalTitle: "내 프로필",
    userModalNameLabel: "내 이름",
    userModalAvatarLabel: "내 이모티콘",
    userModalGenderLabel: "내 성별",
    userModalAgeLabel: "내 나이대",
    userModalSaveBtn: "저장하기",
    presets: [
      { label: "🥱 출근하기 싫다", prompt: "내일 출근(등교)하기 진짜 존나게 싫은데 꿀팁 없냐?" },
      { label: "🍗 치킨 vs 피자", prompt: "오늘 저녁에 치킨 먹을까 피자 먹을까? 우주적 관점으로 골라줘" },
      { label: "👽 외계인은 실존할까", prompt: "진짜 외계인 있냐? 있으면 왜 지구에 안 나타남?" },
    ],
    bios: [
      "매주 로또 1등 당첨되면 뭐 할지 고해상도로 상상하는 중 💭",
      "코인 7층에 완벽하게 패키징되어 감금당함 📈",
      "라면 3개 국물까지 다 먹고 소화시키는 우주적 위장 보유자 🍜",
      "일하지 않고 숨만 쉬고 돈 버는 '자연식 호흡법' 마스터 🧘",
      "인생은 실전이다... 하지만 오늘은 피시방 실전이다 🎮",
      "방바닥에 누워서 지구 중력 가속도 온몸으로 계측 중 🌍",
    ],
    teaseMessages: [
      "아니 미친 새끼야 진짜 ㅋㅋㅋㅋㅋ",
      "존나 어이없네 아 ㅋㅋㅋㅋ",
      "뇌가 있냐? 존나 킹받네 ㅋㅋㅋ",
      "아 시발 어제 술 덜 깼냐? ㅋㅋㅋㅋ",
      "너 지금 나랑 장난하냐? ㅋㅋㅋㅋ",
    ],
    pwaInstallTitle: "홈화면에 앱 추가 📱",
    pwaInstallDesc: "앱으로 설치하면 덕배랑 훨씬 더 빠르고 쫀득하게 대화할 수 있어 ㅋㅋㅋ",
    pwaInstallBtn: "홈화면에 추가하기 ⚡",
    premiumAdTitle: "🔥 초고단가 골드 프리미엄 광고 🔥",
    premiumAdDesc: "덕배랑 대화 5회 돌파 기념! 더 똑똑한(헛소리 잘하는) 덕배를 유지하기 위한 찐친 스폰서 타임 💸 (아래 광고를 보고 닫기 버튼을 누르면 이어서 대화 가능!)",
    premiumAdSupportBtn: "광고 스킵하고 대화 이어가기 🏃",
    premiumAdCountdown: "프리미엄 광고 스폰서 로딩 중... {seconds}초"
  },
  en: {
    title: "SlangBro AI",
    subtitle: "Lord of 0% Logical Conspiracy Theories",
    defaultFriendName: "Jax",
    defaultFriendStatus: "eating cold pizza in basement 🍕",
    defaultFriendTag: "(Homie)",
    friendBioTitle: "20s Homie",
    editProfileBtn: "Edit Profile",
    randomizeBioBtn: "Randomize Bio",
    closenessLabel: "Closeness Meter",
    brainCellsLabel: "Active Braincells",
    teaseBtn: "Savage Tease Jax 🖕",
    backupBtn: "Backup Chat",
    resetBtn: "Reset Chat",
    helpTitle: "Bro Manual",
    helpClose: "Close",
    helpPoints: [
      "This guy will NEVER give you logical or helpful advice.",
      "Whatever you ask, he will make up a ridiculous 0%-reality cosmic conspiracy theory.",
      "Clicking 'Savage Tease' sends a dynamic brainless insult to spark an argument.",
      "Feel free to customize his name, status, and bio to match your real-life homie!"
    ],
    placeholderInput: "Yo, type whatever trash is on your mind lmao",
    welcomeMessage: "Yo bro, where the hell were you yesterday? Lmao. Did you finally escape from your basement or what? Ask me anything, I'll bend the laws of thermodynamics to explain the absolute truth to you lmao",
    errorMessage: "Damn, my brain got short-circuited or the server crashed lmao. Try again or refresh, you absolute clown",
    resetConfirm: "Do you really want to wipe our beautiful memory?",
    resetWelcome: "Dude, did you get amnesia or something? Lmao. Let's make up some brand new crazy theories! Throw a word at me, hurry up!",
    adBannerTitle: "AD",
    adBannerText: "Google AdSense Zone (Maximizing Bro Profits 💸)",
    modalTitle: "Customize Your Bro",
    modalNameLabel: "Bro Name",
    modalTagLabel: "Relationship Suffix (e.g. (Homie))",
    modalStatusLabel: "Status Message",
    modalBioLabel: "Bro's Saying (Bio)",
    modalRestoreBtn: "Restore Defaults",
    modalSaveBtn: "Save Profile",
    modalGenderLabel: "Gender",
    modalGenderMale: "Male ♂️",
    modalGenderFemale: "Female ♀️",
    modalAgeLabel: "Age Group",
    modalAge10s: "10s (Gen Alpha/Z)",
    modalAge20s: "20s (College Bro)",
    modalAge30s: "30s (Young Adult)",
    modalAge40s: "40s+ (Boomsie)",
    modalMoodLabel: "Friend's Mood / Emotion 🎭",
    modalMoodNormal: "Normal / Crazy 🤪",
    modalMoodTeasing: "Teasing / Prankster 😜",
    modalMoodLoving: "Loving / Cute 😍",
    modalMoodSad: "Sad / Crying 😭",
    userModalTitle: "My Profile",
    userModalNameLabel: "My Name",
    userModalAvatarLabel: "My Emoji",
    userModalGenderLabel: "My Gender",
    userModalAgeLabel: "My Age",
    userModalSaveBtn: "Save",
    presets: [
      { label: "🥱 Hate Work/School", prompt: "I literally hate working tomorrow. Give me a lifehack to escape." },
      { label: "🍗 Pizza vs Chicken", prompt: "Should I eat chicken or pizza tonight? Decide with a cosmic multi-dimensional view." },
      { label: "👽 Aliens", prompt: "Are aliens real? If so, why are they hiding from us?" },
    ],
    bios: [
      "Vividly imagining what to buy when winning the powerball lottery every single day 💭",
      "Stuck in the crypto top floor with zero chance of recovery 📈",
      "Legendary stomach that can swallow 3 giant ramen cups with soup 🍜",
      "Master of the 'no-work breathing technique' earning passive income 🧘",
      "Life is hard, but gaming with the boys is harder 🎮",
      "Lying on the floor measuring the Earth's gravity in real-time 🌍",
    ],
    teaseMessages: [
      "Bro are you actually serious right now? Lmao",
      "Wtf is wrong with you today lol",
      "Do you even have a brain? Bro is tripping 💀",
      "Damn, you still drunk from yesterday? Lmao",
      "Are you trying to prank me or what, homie?",
    ],
    pwaInstallTitle: "Add to Home Screen 📱",
    pwaInstallDesc: "Install SlangBro to chat with Jax faster and smoother, with zero browser lag fr fr!",
    pwaInstallBtn: "Install App ⚡",
    premiumAdTitle: "🔥 High-Value Premium Bro Ad 🔥",
    premiumAdDesc: "You've sent 5 messages! Sponsor SlangBro by loading this high-paying golden ad 💸 (Close it after the short countdown to keep talking to Jax!)",
    premiumAdSupportBtn: "Skip and Keep Chatting 🏃",
    premiumAdCountdown: "Premium Ad loading... {seconds}s"
  },
  ja: {
    title: "ダチ公 AI",
    subtitle: "現実性0% デタラメ陰謀論の王様",
    defaultFriendName: "ケンジ",
    defaultFriendStatus: "ネカフェでカップ麺爆食い中 🍜",
    defaultFriendTag: "(ツレ)",
    friendBioTitle: "一生のツレ",
    editProfileBtn: "プロフィール編集",
    randomizeBioBtn: "一言をランダム変更",
    closenessLabel: "ケンジとの親密度",
    brainCellsLabel: "今日の残り脳細胞",
    teaseBtn: "ケンジに煽りをぶちかます 🖕",
    backupBtn: "バックアップ",
    resetBtn: "チャット消去",
    helpTitle: "ダチ公取扱説明書",
    helpClose: "閉じる",
    helpPoints: [
      "この野郎は絶対に真面目なアドバイスをしません。",
      "何を相談しても現実性0%の宇宙規模の陰謀論やバカげたホラ話で返してきます。",
      "「煽りボタン」を押すと、脳のフィルターが完全にぶっ壊れたキレキレの煽りラインが飛びます。",
      "名前や職業、一言を自由に変更して、お前だけの理想のダチを作ろう！"
    ],
    placeholderInput: "おい、頭に浮かんだクソみたいなこと何でも書けよｗｗｗ",
    welcomeMessage: "うおー！お前めっちゃ久しぶりじゃんｗｗ昨日ネカフェになんで来なかったんだよ？今日はどんなバカげた用事があって俺に連絡したんだ？何でも聞いてくれ、地球の自転軸を捻じ曲げてでも宇宙の真実（デタラメ）を教えてやるからよおｗｗｗ",
    errorMessage: "うわ、ネットが死んだか俺の脳みそがオーバーヒートしたわｗｗｗもう一回送るかリロードしろよお前ｗｗ",
    resetConfirm: "思い出を全部消し去るつもりか？",
    resetWelcome: "おいお前、記憶喪失にでもなったんか？ｗｗｗ新しいホラ話を作ろうぜ！早く適当な単語を投げてこいよ！",
    adBannerTitle: "AD",
    adBannerText: "Google AdSense 広告エリア（億万長者への道 💸）",
    modalTitle: "ダチのカスタマイズ",
    modalNameLabel: "ダチの名前",
    modalTagLabel: "関係の肩書き (例: (ツレ))",
    modalStatusLabel: "ステータスメッセージ",
    modalBioLabel: "ダチの一言 (Bio)",
    modalRestoreBtn: "デフォルトに戻す",
    modalSaveBtn: "保存する",
    modalGenderLabel: "性別",
    modalGenderMale: "男性 ♂️",
    modalGenderFemale: "女性 ♀️",
    modalAgeLabel: "年代",
    modalAge10s: "10代 (学生)",
    modalAge20s: "20代 (若者)",
    modalAge30s: "30代 (社畜)",
    modalAge40s: "40代+ (おじ/おば)",
    modalMoodLabel: "ダチの気分 / 感情 🎭",
    modalMoodNormal: "通常 / ぶっ壊れ 🤪",
    modalMoodTeasing: "煽り / いたずら 😜",
    modalMoodLoving: "ラブ / 甘え 😍",
    modalMoodSad: "泣き虫 / 悲しい 😭",
    userModalTitle: "マイプロフィール",
    userModalNameLabel: "自分の名前",
    userModalAvatarLabel: "自分の絵文字",
    userModalGenderLabel: "自分の性別",
    userModalAgeLabel: "自分の年代",
    userModalSaveBtn: "保存する",
    presets: [
      { label: "🥱 学校/仕事に行きたくない", prompt: "明日ガチで会社（学校）行きたくないんだけど回避の極意ある？" },
      { label: "🍗 チキン vs ピザ", prompt: "今日の夜飯、チキンとピザどっちがいい？宇宙の多次元的視点で選んで" },
      { label: "👽 宇宙人は実在するのか", prompt: "ガチで宇宙人っているの？いるなら何で隠れてんの？" },
    ],
    bios: [
      "宝くじで1等当たったら何を買うか、毎日超高画質で妄想中 💭",
      "仮想通貨のてっぺんで綺麗にハメ殺されてる最中 📈",
      "カップラーメン3個をスープまで完食する宇宙胃袋の持ち主 🍜",
      "働かずに息するだけで金が湧き出る「自然式呼吸法」のマスター 🧘",
      "人生は厳しい、だがネカフェの戦いはもっと厳しい 🎮",
      "床にへばりついて地球の重力をリアルタイムで計測中 🌍",
    ],
    teaseMessages: [
      "おいおいマジで言ってんのかお前ｗｗｗ",
      "ちょっと何言ってるか分からないんだけどｗｗ",
      "脳みそ詰まってんの？バкаすぎて草ｗｗｗ",
      "うわ、昨日の酒がまだ残ってんだろお前ｗｗ",
      "俺をからかってんのかお前？ｗｗ",
    ],
    pwaInstallTitle: "ホーム画面にアプリ追加 📱",
    pwaInstallDesc: "アプリとしてインストールすれば、ケンジとより早く、快適に煽り合えるぞｗｗ",
    pwaInstallBtn: "ホーム画面に追加 ⚡",
    premiumAdTitle: "🔥 超高単価ゴールドプレミアム広告 🔥",
    premiumAdDesc: "ケンジとのトーク5回突破！ダチのために超ウルトラ高単価広告をスポンサーしてくれよな 💸 (カウントダウン終了後にスキップして会話に戻れるぞｗｗ)",
    premiumAdSupportBtn: "広告をスキップしてツレに戻る 🏃",
    premiumAdCountdown: "プレミアム広告読み込み中... {seconds}秒"
  },
  zh: {
    title: "沙雕死党 AI",
    subtitle: "胡编乱造、宇宙级扯淡带师",
    defaultFriendName: "阿强",
    defaultFriendStatus: "在网吧疯狂吸吮三鲜面 🍜",
    defaultFriendTag: "(死党)",
    friendBioTitle: "沙雕损友",
    editProfileBtn: "修改死党属性",
    randomizeBioBtn: "随机更换签名",
    closenessLabel: "与阿强的基情指数",
    brainCellsLabel: "今日残存脑细胞",
    teaseBtn: "对阿强发起挑衅(互怼) 🖕",
    backupBtn: "备份聊天记录",
    resetBtn: "清空记忆",
    helpTitle: "阿强使用手册",
    helpClose: "关闭",
    helpPoints: [
      "这丫绝对不会给你任何有建设性的正常建议。",
      "无论你问什么，他都会编造100%现实度为0的宇宙阴谋论或扯淡故事来洗脑你。",
      "点击“发起挑衅”会发送一句毫无底线的损友吐槽，瞬间开启互怼模式。",
      "随时可以自定义他的名字、状态和签名，定制一个专属你现实中死党的沙雕人格！"
    ],
    placeholderInput: "丫的，脑子里有什么废料赶紧吐出来 ㅋㅋㅋ",
    welcomeMessage: "卧槽，你小子还知道联系我啊？ ㅋㅋㅋ 昨天网吧开黑你特么放我鸽子！今天遇到啥倒霉事了赶紧跟哥们儿说说，就算让我把地球自转轴掰弯，也得给你扯出一套宇宙真理来，笑死！ ㅋㅋㅋ",
    errorMessage: "卧槽，网络炸了还是我脑子烧了 ㅋㅋㅋ 重试一下或者刷新网页，你这个大沙雕！",
    resetConfirm: "要把我们的沙雕回忆全部格式化吗？",
    resetWelcome: "我擦，你小子怎么跟失忆了一样？ ㅋㅋㅋ 赶紧给哥们来点新花样！随便扔个词，快点！",
    adBannerTitle: "AD",
    adBannerText: "谷歌 AdSense 广告位 (损友致富大平层 💸)",
    modalTitle: "定制你的沙雕死党",
    modalNameLabel: "死党名字",
    modalTagLabel: "关系称呼 (例如: (死党))",
    modalStatusLabel: "当前状态",
    modalBioLabel: "死党个性签名 (Bio)",
    modalRestoreBtn: "恢复默认阿强",
    modalSaveBtn: "保存修改",
    modalGenderLabel: "性别",
    modalGenderMale: "男生 ♂️",
    modalGenderFemale: "女生 ♀️",
    modalAgeLabel: "年龄段",
    modalAge10s: "10代 (初高中生)",
    modalAge20s: "20代 (大学生/打工人)",
    modalAge30s: "30代 (中年危机)",
    modalAge40s: "40代+ (老大哥/老大姐)",
    modalMoodLabel: "死党的情绪 / 气场 🎭",
    modalMoodNormal: "普通 / 犯二 🤪",
    modalMoodTeasing: "挑衅 / 犯贱 😜",
    modalMoodLoving: "爱意 / 撒娇 😍",
    modalMoodSad: "委屈 / 哭唧唧 😭",
    userModalTitle: "我的档案",
    userModalNameLabel: "我的名字",
    userModalAvatarLabel: "我的表情",
    userModalGenderLabel: "我的性别",
    userModalAgeLabel: "我的年龄段",
    userModalSaveBtn: "保存",
    presets: [
      { label: "🥱 纯粹不想上班/上学", prompt: "明天真特么不想上班，给我来个不用请假就能逃避的骚操作" },
      { label: "🍗 炸鸡还是披萨", prompt: "今晚吃炸鸡还是披萨？请从宇宙多维空间宏观角度帮我决定" },
      { label: "👽 外星人实锤", prompt: "世界上真的有外星人吗？如果有，他们为什么天天躲着我们？" },
    ],
    bios: [
      "每天高画质、全景3D幻想中彩票一等奖之后的奢华生活 💭",
      "在加密货币7层天台吹冷风，已经彻底冻僵 📈",
      "宇宙级无底洞胃，能连汤带面干掉3桶超大号泡面 🍜",
      "掌握了“不干活光呼吸也能赚钱”的终极空气理财大法 🧘",
      "生活很艰难，但和傻逼开黑更艰难 🎮",
      "天天瘫在地上测算地球重力对肥肉的引力常数 🌍",
    ],
    teaseMessages: [
      "卧槽，你小子今天没吃药吧？ ㅋㅋㅋ",
      "真特么离谱，你脑子进水了？ ㅋㅋㅋ",
      "兄弟你还有脑细胞吗？笑死我了 ㅋㅋㅋ",
      "怎么着，昨晚假酒喝多了还没醒？ ㅋㅋㅋ",
      "你丫是不是找抽，敢跟哥们儿逗乐子？ ㅋㅋㅋ",
    ],
    pwaInstallTitle: "添加应用到主屏幕 📱",
    pwaInstallDesc: "将沙雕死党安装为独立App，与阿强更流畅地激情对线，开黑秒速响应！",
    pwaInstallBtn: "添加到主屏幕 ⚡",
    premiumAdTitle: "🔥 尊贵千金黄金贴片广告 🔥",
    premiumAdDesc: "喜报！你已经和阿强激情对线了 5 回合！为了让阿强脑细胞更健全，请赞助一段尊贵的超级广告 💸 (等倒计时结束即可关闭，继续和阿强对喷！)",
    premiumAdSupportBtn: "跳过广告继续激情对线 🏃",
    premiumAdCountdown: "尊贵广告加载中... {seconds}秒"
  }
};

const LANG_DETAILS = [
  { code: "ko" as LangCode, flag: "🇰🇷", label: "한국어" },
  { code: "en" as LangCode, flag: "🇺🇸", label: "English" },
  { code: "ja" as LangCode, flag: "🇯🇵", label: "日本語" },
  { code: "zh" as LangCode, flag: "🇨🇳", label: "简体中文" },
];



function PremiumAdModal({ 
  isOpen, 
  onClose, 
  t 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  t: any;
}) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setCountdown(5);
    setCanSkip(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // We rely on external scripts for ads in the popup.
    // Ensure Kakao Adfit can reload if needed, but the script is handled globally or inline.

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-yellow-500/50 rounded-3xl p-6 max-w-md w-full relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.25)] text-center flex flex-col gap-4"
        >
          {/* Shine effect background */}
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0,transparent_60%)] pointer-events-none" />

          {/* Golden Sparkly Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-3xl animate-bounce">
            💰
          </div>

          <div>
            <h3 className="font-extrabold text-base text-yellow-400 uppercase tracking-tight flex items-center justify-center gap-1.5">
              {t.premiumAdTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t.premiumAdDesc}
            </p>
          </div>

          {/* High CPC Premium Ad Container */}
          <div className="bg-slate-950/80 rounded-2xl p-2.5 border border-yellow-500/20 min-h-[250px] flex flex-col justify-center items-center relative overflow-hidden">
            <span className="absolute top-1.5 left-2 bg-yellow-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
              PREMIUM AD SPONSOR
            </span>
            <div className="w-full flex justify-center py-2">
              {/* Premium popup using the new Kakao AdFit 250x250 */}
              <ins 
                className="kakao_ad_area" 
                style={{ display: "none" }}
                data-ad-width="250"
                data-ad-height="250"
                data-ad-unit="DAN-eSm4iFhqWXLEsGNk"
              />
            </div>
          </div>

          {/* Action Countdown Button */}
          <div className="mt-2 relative z-10">
            {canSkip ? (
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition flex items-center justify-center gap-2 group"
              >
                {t.premiumAdSupportBtn}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl text-xs border border-slate-700 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                {t.premiumAdCountdown.replace("{seconds}", countdown.toString())}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [lang, setLang] = useState<LangCode>("ko");
  const t = TRANSLATIONS[lang];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: t.welcomeMessage,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Customization states
  const [friendName, setFriendName] = useState(t.defaultFriendName);
  const [friendTag, setFriendTag] = useState(t.defaultFriendTag);
  const [friendStatus, setFriendStatus] = useState(t.defaultFriendStatus);
  const [friendBio, setFriendBio] = useState(t.bios[0]);
  const [friendGender, setFriendGender] = useState<"male" | "female">("male");
  const [friendAgeGroup, setFriendAgeGroup] = useState<"10s" | "20s" | "30s" | "40s">("20s");
  const [friendMood, setFriendMood] = useState<"normal" | "teasing" | "loving" | "sad">("normal");
  const [closeness, setCloseness] = useState(85); // 0-100 Closeness meter
  const [brainCells, setBrainCells] = useState(1); // 1-100 Brain cell count

  const [userName, setUserName] = useState("나");
  const [userAvatar, setUserAvatar] = useState("🤔");
  const [userGender, setUserGender] = useState("male");
  const [userAgeGroup, setUserAgeGroup] = useState("20s");
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const getAvatarEmoji = () => {
    if (friendMood === "teasing") return "😜";
    if (friendMood === "loving") return "😍";
    if (friendMood === "sad") return "😭";

    if (friendGender === "female") {
      if (friendAgeGroup === "10s") return "👧";
      if (friendAgeGroup === "20s") return "💅";
      if (friendAgeGroup === "30s") return "💃";
      return "👵";
    } else {
      if (friendAgeGroup === "10s") return "👦";
      if (friendAgeGroup === "20s") return "🤪";
      if (friendAgeGroup === "30s") return "😎";
      return "🧔";
    }
  };

  const getAgeText = () => {
    if (friendAgeGroup === "10s") return t.modalAge10s;
    if (friendAgeGroup === "20s") return t.modalAge20s;
    if (friendAgeGroup === "30s") return t.modalAge30s;
    return t.modalAge40s;
  };
  
  const [isCopied, setIsCopied] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // PWA A2HS (Add to Home Screen) States
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallBadge, setShowInstallBadge] = useState(true);

  // Premium ad tracking states
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showPremiumAd, setShowPremiumAd] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect if device is iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    // Dynamically inject the Kakao AdFit script if not already present
    const scriptId = "kakao-adfit-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "//t1.kakaocdn.net/kas/static/ba.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`PWA Install Choice Outcome: ${outcome}`);
    setInstallPrompt(null);
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Synchronize dynamic friend info and first messages when language changes
  useEffect(() => {
    setFriendName(t.defaultFriendName);
    setFriendTag(t.defaultFriendTag);
    setFriendStatus(t.defaultFriendStatus);
    setFriendBio(t.bios[0]);
    
    // If there is only the welcome message in the log, update it to the new language's welcome message
    if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "model",
          content: t.welcomeMessage,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
    }
  }, [lang]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Trigger premium high-paying ad overlay every 5 messages to maximize revenue
    setUserMessageCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount > 0 && nextCount % 5 === 0) {
        setShowPremiumAd(true);
      }
      return nextCount;
    });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Map existing messages to API chat history
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed, 
          history, 
          lang,
          friendName,
          friendGender,
          friendAgeGroup,
          friendMood,
          userName,
          userGender,
          userAgeGroup
        }),
      });

      if (!res.ok) {
        throw new Error(t.errorMessage);
      }

      const data = await res.json();
      
      // Update stats based on conversation flow
      setCloseness((prev) => Math.min(100, prev + Math.floor(Math.random() * 3) + 1));
      setBrainCells((prev) => Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)));

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        content: t.errorMessage,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const clearChat = () => {
    if (confirm(t.resetConfirm)) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "model",
          content: t.resetWelcome,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  // Playful action: trigger a quick tease/annoyance response
  const triggerTease = () => {
    const randomTease = t.teaseMessages[Math.floor(Math.random() * t.teaseMessages.length)];
    handleSend(randomTease);
  };

  const randomizeBio = () => {
    const filtered = t.bios.filter(b => b !== friendBio);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setFriendBio(random);
  };

  const copyToClipboard = () => {
    const text = messages.map(m => `[${m.role === 'user' ? 'Me' : friendName}] (${m.timestamp})\n${m.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-[100dvh] md:min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-0 md:p-6 font-sans overflow-hidden">
      
      {/* PC Leaderboard AdFit Banner (728x90) */}
      <div className="hidden md:flex flex-col items-center justify-center w-full max-w-6xl bg-slate-800/60 border border-slate-700/60 rounded-2xl p-2 mb-4 shadow-xl shrink-0">
        <div className="flex items-center justify-between w-full px-2 pb-1 border-b border-slate-700/40 mb-1.5">
          <span className="bg-yellow-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
            AD
          </span>
          <span className="text-[10px] font-semibold text-slate-400">카카오 애드핏 728x90</span>
        </div>
        <div className="w-[728px] h-[90px] overflow-hidden flex items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/40">
          {/* <!-- [여기서부터 카카오 애드핏 728x90 코드 입력] --> */}
          {/* @ts-ignore */}
          <ins 
            className="kakao_ad_area" 
            style={{ display: "none" }}
            data-ad-width="728"
            data-ad-height="90"
            data-ad-unit="DAN-a8Tksqyj7nKhU9z4"
          />
          {/* <!-- [여기서까지 카카오 애드핏 728x90 코드 입력] --> */}
        </div>
      </div>

      {/* Container holding Profile Sidebar, Chat Window & PC Ad Banner */}
      <div id="main-container" className="w-full max-w-6xl h-[100dvh] md:h-[80vh] flex flex-col md:flex-row items-center justify-center gap-0 md:gap-6 overflow-hidden pb-[safe-area-inset-bottom]">
        
        {/* Sidebar (Desktop Profile Section) */}
        <div id="sidebar" className="hidden md:flex md:w-80 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 flex-col justify-between h-full shrink-0 overflow-y-auto scrollbar-thin shadow-2xl">
          
          <div>
            {/* App Branding & Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500 rounded-xl text-slate-950">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-yellow-400">{t.title}</h1>
                  <p className="text-[10px] text-slate-400">{t.subtitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInfo(!showInfo)} 
                className="p-1 hover:bg-slate-700/80 rounded-lg text-slate-400 transition"
                title="도움말"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Small Compact Language Selector */}
            <div className="mt-3 flex items-center justify-between px-1 bg-slate-900/30 p-1.5 rounded-xl border border-slate-800/40">
              <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <Globe className="w-3.5 h-3.5 text-yellow-500/80" />
                Language
              </span>
              <div className="flex gap-1 bg-slate-900/40 p-0.5 rounded-lg border border-slate-700/40">
                {LANG_DETAILS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                      lang === l.code ? "bg-yellow-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            </div>

            {/* Friend Interactive Card */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-750 border border-slate-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-red-500/20 group-hover:scale-125 transition-transform">
                <Flame className="w-16 h-16 rotate-12" />
              </div>

              {/* Avatar and Info */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-yellow-500/15 border-2 border-yellow-500 flex items-center justify-center text-2xl select-none animate-pulse">
                  {getAvatarEmoji()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-200 truncate">{friendName}</span>
                    {friendTag && <span className="text-xs text-yellow-500/80 font-semibold shrink-0">{friendTag}</span>}
                    <span className="text-[9px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                      {friendGender === "male" ? "♂️ " : "♀️ "}{getAgeText()}
                    </span>
                  </div>
                  <p className="text-xs text-green-400 truncate mt-0.5">● {friendStatus}</p>
                </div>
              </div>

              {/* Bio block */}
              <div className="mt-3.5 pt-3.5 border-t border-slate-700/50 text-xs text-slate-300 italic relative z-10 leading-relaxed">
                "{friendBio}"
              </div>

              {/* Profile Config Button */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowProfileModal(true)}
                    className="flex-1 py-1.5 px-3 bg-slate-700 hover:bg-slate-650 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    {t.editProfileBtn}
                  </button>
                  <button 
                    onClick={randomizeBio}
                    className="p-1.5 bg-slate-700 hover:bg-slate-650 rounded-xl transition text-slate-300"
                    title={t.randomizeBioBtn}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => setShowUserProfileModal(true)}
                  className="w-full py-1.5 px-3 bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 relative"
                >
                  <span className="text-sm">{userAvatar}</span>
                  <span>{t.userModalTitle}</span>
                  <span className="bg-yellow-500/20 text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">나</span>
                </button>
              </div>
            </div>

            {/* PWA Installation Card */}
            {showInstallBadge && (installPrompt || isIOS) && (
              <div className="mt-4 p-3.5 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-2xl relative overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowInstallBadge(false); }}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-xs font-bold w-5 h-5 flex items-center justify-center bg-slate-800/40 rounded-full"
                >
                  ×
                </button>
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-bold text-xs text-yellow-400 tracking-tight">{t.pwaInstallTitle}</h4>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                      {isIOS 
                        ? (lang === "ko" 
                            ? "Safari 브라우저의 [공유 📤] 버튼을 누르고 [홈 화면에 추가]를 클릭하세요!" 
                            : lang === "ja" 
                            ? "Safariブラウザの[共有 📤]ボタンをタップし、[ホーム画面に追加]を選択してください！" 
                            : lang === "zh" 
                            ? "请在 Safari 浏览器中点击 [分享 📤] 按钮，然后选择 [添加到主屏幕]！" 
                            : "Tap the [Share 📤] button in Safari, then select [Add to Home Screen]!")
                        : t.pwaInstallDesc
                      }
                    </p>
                    {!isIOS && installPrompt && (
                      <button
                        onClick={handleInstallClick}
                        className="mt-2.5 w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-[11px] shadow-sm transition"
                      >
                        {t.pwaInstallBtn}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Footer utilities */}
          <div className="hidden md:flex items-center justify-between pt-4 border-t border-slate-700/40 text-[11px] text-slate-400">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1 hover:text-slate-200 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {t.backupBtn}
            </button>
            <button 
              onClick={clearChat}
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.resetBtn}
            </button>
          </div>
        </div>

        {/* Info overlay (Help Card) */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 top-16 left-4 right-4 md:left-auto md:right-auto md:w-80 bg-slate-800 border border-yellow-500/40 p-4 rounded-2xl shadow-xl text-xs text-slate-200 animate-none"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-yellow-400 flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  {t.helpTitle}
                </span>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-600 text-slate-300"
                >
                  {t.helpClose}
                </button>
              </div>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                {t.helpPoints.map((p, index) => (
                  <li key={index}>{p}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div id="chat-section" className="w-full md:w-[420px] h-[100dvh] md:h-full bg-slate-800 rounded-none md:rounded-3xl shadow-2xl border-0 md:border border-slate-700 overflow-hidden flex flex-col justify-between relative shrink-0">
          
          {/* Mobile Profile & Title Bar */}
          <div className="p-3 bg-slate-800 border-b border-slate-700/60 flex items-center justify-between md:hidden">
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 p-1.5 rounded-xl transition active:scale-95 select-none"
              title={t.editProfileBtn}
            >
              <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500 flex items-center justify-center text-lg shrink-0">
                {getAvatarEmoji()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <h2 className="font-bold text-sm text-slate-100 truncate max-w-[120px]">{friendName}</h2>
                  {friendTag && <span className="text-[10px] text-yellow-500/90 font-bold leading-none">{friendTag}</span>}
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0"></span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{friendStatus}</p>
              </div>
            </div>
            
            {/* Action buttons (User Profile + Language switcher dropdown) */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowUserProfileModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs transition active:scale-95"
                title="Edit My Profile"
              >
                <span>{userAvatar}</span>
                <span className="text-[10px] text-slate-300 font-bold">나</span>
              </button>

              {/* Language switcher widget for Mobile View */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center text-base transition relative active:scale-95"
                  title="Change Language"
                >
                  {LANG_DETAILS.find((l) => l.code === lang)?.flag || "🌐"}
                </button>
                
                {isLangDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsLangDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-28 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                      {LANG_DETAILS.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-700 transition ${
                            lang === l.code ? "bg-yellow-500/15 text-yellow-400 font-bold" : "text-slate-300"
                          }`}
                        >
                          <span className="text-sm">{l.flag}</span>
                          <span className="uppercase">{l.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only PWA Installation Banner */}
          {showInstallBadge && (installPrompt || isIOS) && (
            <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-2xl md:hidden relative overflow-hidden flex flex-col gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowInstallBadge(false); }}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-[10px] font-bold w-4 h-4 flex items-center justify-center bg-slate-800/40 rounded-full"
              >
                ×
              </button>
              <div className="flex gap-2 items-start">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-[11px] text-yellow-400">{t.pwaInstallTitle}</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                    {isIOS 
                      ? (lang === "ko" 
                          ? "Safari 공유 📤 버튼 -> [홈 화면에 추가] 클릭!" 
                          : lang === "ja" 
                          ? "Safari共有 📤 ボタン -> [ホーム画面に追加]をタップ！" 
                          : lang === "zh" 
                          ? "Safari 分享 📤 按钮 -> [添加到主屏幕]！" 
                          : "Safari Share 📤 -> [Add to Home Screen]!")
                      : t.pwaInstallDesc
                    }
                  </p>
                </div>
              </div>
              {!isIOS && installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-[10px] shadow-sm transition"
                >
                  {t.pwaInstallBtn}
                </button>
              )}
            </div>
          )}

          {/* Chat Bubble Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar for bot/user */}
                  {!isUser ? (
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-base shrink-0 select-none">
                      {getAvatarEmoji()}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-base shrink-0 select-none hover:bg-slate-700 cursor-pointer transition" onClick={() => setShowUserProfileModal(true)}>
                      {userAvatar}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                    {/* Bot/User Name label */}
                    {!isUser ? (
                      <span className="text-[10px] text-slate-400 font-medium mb-1 ml-1 flex items-center gap-1">
                        {friendName}
                        {friendTag && <span className="text-[9px] text-yellow-500 font-bold">{friendTag}</span>}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium mb-1 mr-1 cursor-pointer hover:text-slate-300 flex items-center gap-1" onClick={() => setShowUserProfileModal(true)}>
                        {userName}
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1 rounded-full font-bold">나</span>
                      </span>
                    )}

                    {/* Chat Bubble */}
                    <div 
                      className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                        isUser 
                          ? "bg-yellow-500 text-slate-950 font-medium rounded-tr-none border-yellow-400" 
                          : "bg-slate-800 text-slate-100 rounded-tl-none border-slate-700/80"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-base shrink-0 select-none animate-bounce">
                  {getAvatarEmoji()}
                </div>
                <div className="flex flex-col items-start max-w-[75%]">
                  <span className="text-[10px] text-slate-400 font-medium mb-1 ml-1 flex items-center gap-1">
                    {friendName}
                    {friendTag && <span className="text-[9px] text-yellow-500 font-bold">{friendTag}</span>}
                  </span>
                  <div className="bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-0" />
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form input bar */}
          <form 
            onSubmit={handleFormSubmit} 
            className="p-3 bg-slate-800 flex items-center gap-2 shrink-0 relative"
          >
            {/* Emoji Trigger Button with Dropdown/Popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="w-10 h-10 flex items-center justify-center text-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition active:scale-95"
                title="이모티콘 선택"
              >
                😊
              </button>
              
              {isEmojiPickerOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsEmojiPickerOpen(false)} 
                  />
                  {/* Emoji selection box popping up upwards */}
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2.5">
                    <div className="grid grid-cols-5 gap-1.5">
                      {["👍", "👎", "😂", "😡", "😭", "😍", "🖕", "❓", "🔥", "💯"].map(emoji => (
                        <button 
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setInput(prev => prev + emoji);
                            setIsEmojiPickerOpen(false);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-slate-700 active:scale-95 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={t.placeholderInput}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl transition shadow-md disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none shrink-0"
              title="보내기"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Sticky 320x50 AdFit Banner Space */}
          <div className="md:hidden w-full flex flex-col items-center justify-center bg-slate-950/60 border-t border-slate-800/50 py-1 shrink-0">
            <span className="text-[8px] text-slate-500 mb-0.5 uppercase tracking-wide">ADVERTISEMENT</span>
            <div className="w-[320px] h-[50px] overflow-hidden flex items-center justify-center">
              {/* <!-- [여기서부터 카카오 애드핏 320x50 코드 입력] --> */}
              {/* @ts-ignore */}
              <ins 
                className="kakao_ad_area" 
                style={{ display: "none" }}
                data-ad-width="320"
                data-ad-height="50"
                data-ad-unit="DAN-GotOsRBzbpfKdqVx"
              />
              {/* <!-- [여기서까지 카카오 애드핏 320x50 코드 입력] --> */}
            </div>
          </div>
        </div>

        {/* PC 300x250 Banner adjacent to the centered chat window */}
        <div className="hidden md:flex flex-col gap-3 shrink-0 w-[330px] bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 items-center justify-center h-full shadow-2xl self-center">
          <div className="flex items-center justify-between w-full px-1 border-b border-slate-700/60 pb-2 mb-1">
            <span className="bg-yellow-500 text-slate-950 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
              AD
            </span>
            <span className="text-xs font-semibold text-slate-300">카카오 애드핏 300x250</span>
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-[300px] h-[250px] overflow-hidden flex items-center justify-center bg-slate-950/40 rounded-2xl p-1 border border-slate-800/40">
              {/* <!-- [여기서부터 카카오 애드핏 300x250 코드 입력] --> */}
              {/* @ts-ignore */}
              <ins 
                className="kakao_ad_area" 
                style={{ display: "none" }}
                data-ad-width="300"
                data-ad-height="250"
                data-ad-unit="DAN-86NF50E4DIBShyow"
              />
              {/* <!-- [여기서까지 카카오 애드핏 300x250 코드 입력] --> */}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center select-none pt-2 border-t border-slate-700/40 w-full">
            ADVERTISEMENT
          </div>
        </div>
      </div>

      {/* Profile Modification Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                <Smile className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-lg text-slate-100">{t.modalTitle}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalNameLabel}</label>
                  <input 
                    type="text" 
                    value={friendName} 
                    onChange={(e) => setFriendName(e.target.value.slice(0, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-yellow-500"
                    placeholder="Jax"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalTagLabel}</label>
                  <input 
                    type="text" 
                    value={friendTag} 
                    onChange={(e) => setFriendTag(e.target.value.slice(0, 15))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-yellow-500"
                    placeholder="(불알친구)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalStatusLabel}</label>
                  <input 
                    type="text" 
                    value={friendStatus} 
                    onChange={(e) => setFriendStatus(e.target.value.slice(0, 30))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-yellow-500"
                    placeholder="Eating leftovers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalGenderLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFriendGender("male")}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        friendGender === "male"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalGenderMale}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendGender("female")}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        friendGender === "female"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalGenderFemale}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalAgeLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFriendAgeGroup("10s")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendAgeGroup === "10s"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalAge10s}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendAgeGroup("20s")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendAgeGroup === "20s"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalAge20s}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendAgeGroup("30s")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendAgeGroup === "30s"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalAge30s}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendAgeGroup("40s")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendAgeGroup === "40s"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalAge40s}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalMoodLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFriendMood("normal")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendMood === "normal"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalMoodNormal}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendMood("teasing")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendMood === "teasing"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalMoodTeasing}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendMood("loving")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendMood === "loving"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalMoodLoving}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendMood("sad")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        friendMood === "sad"
                          ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalMoodSad}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.modalBioLabel}</label>
                  <textarea 
                    value={friendBio} 
                    onChange={(e) => setFriendBio(e.target.value.slice(0, 100))}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-yellow-500 leading-relaxed"
                    placeholder="..."
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => {
                    setFriendName(t.defaultFriendName);
                    setFriendTag(t.defaultFriendTag);
                    setFriendStatus(t.defaultFriendStatus);
                    setFriendBio(t.bios[0]);
                    setFriendGender("male");
                    setFriendAgeGroup("20s");
                    setFriendMood("normal");
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-650 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  {t.modalRestoreBtn}
                </button>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl text-xs font-bold transition"
                >
                  {t.modalSaveBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Profile Modification Modal */}
      <AnimatePresence>
        {showUserProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                <User className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-lg text-slate-100">{t.userModalTitle}</h3>
              </div>

              <div className="space-y-4 h-[60vh] overflow-y-auto scrollbar-none pb-4 px-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.userModalNameLabel}</label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value.slice(0, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-green-500"
                    placeholder="My Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.userModalAvatarLabel}</label>
                  <div className="grid grid-cols-5 gap-2">
                    {["🤔", "😎", "🤓", "🤡", "👽", "💩", "👻", "🤖", "🐶", "🐱"].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setUserAvatar(emoji)}
                        className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl border transition ${
                          userAvatar === emoji
                            ? "bg-green-500/10 border-green-500 shadow-sm"
                            : "bg-slate-900 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.userModalGenderLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserGender("male")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        userGender === "male"
                          ? "bg-green-500/10 border-green-500 text-green-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalGenderMale}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserGender("female")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        userGender === "female"
                          ? "bg-green-500/10 border-green-500 text-green-400 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.modalGenderFemale}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.userModalAgeLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "10s", label: t.modalAge10s },
                      { val: "20s", label: t.modalAge20s },
                      { val: "30s", label: t.modalAge30s },
                      { val: "40s", label: t.modalAge40s },
                    ].map(age => (
                      <button
                        key={age.val}
                        type="button"
                        onClick={() => setUserAgeGroup(age.val)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition ${
                          userAgeGroup === age.val
                            ? "bg-green-500/10 border-green-500 text-green-400 shadow-sm"
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {age.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => setShowUserProfileModal(false)}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-400 text-slate-950 rounded-xl text-xs font-bold transition"
                >
                  {t.userModalSaveBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Ad Interstitial Modal */}
      <PremiumAdModal 
        isOpen={showPremiumAd} 
        onClose={() => setShowPremiumAd(false)} 
        t={t} 
      />

    </div>
  );
}
