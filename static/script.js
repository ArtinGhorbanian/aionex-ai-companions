/**
 * @file Main client-side JavaScript for AIONEX: Your Personal AI Companions.
 * @description This script handles all frontend logic, including state management,
 * DOM manipulation, API communication with the Flask backend, and user interactions.
 * It manages different views (persona selection, chat, memories), handles real-time
 * message streaming, and implements features like text-to-speech, conversation
 * summarization, and settings management.
 */

// Wait for the entire HTML document to be loaded and parsed before running the script.
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // --- Global State & Constants ---
    // ==========================================================================

    let currentConversationId = null; // Tracks the ID of the active conversation.
    let currentPersona = null; // Tracks the key of the selected AI persona (e.g., "AURA").
    const personasData = {}; // A cache for persona metadata (name, theme, etc.) after translation.
    let currentAudio = null; // Holds the active Audio object for Text-to-Speech to manage playback.
    let currentTtsButton = null; // Tracks the specific "speak" button that is currently active.
    let isSending = false;
    let modalReturnFocus = null;

    /**
     * SVG icons used for dynamic buttons in the UI.
     * @const {object}
     */
    const ICONS = {
        speak: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        stop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };

    /**
     * A comprehensive dictionary for UI translations.
     * Supports multiple languages and contains all user-facing strings.
     * @const {object}
     */
    const translations = {
        en: {
            new_chat: 'New Chat', history: 'History', settings: 'Settings', language: 'Language', dark_mode: 'Dark Mode',
            choose_companion: 'Choose Your Companion', start_conversation: 'Start a conversation by selecting a personality.',
            AURA_name: 'Aura', AURA_tagline: 'The Mindful Guide', AURA_description: 'Calm, empathetic, and insightful. Aura helps you explore your thoughts and find clarity.',
            ZANE_name: 'Zane', ZANE_tagline: 'The Tech Innovator', ZANE_description: 'Sharp, logical, and futuristic. Zane is your go-to for brainstorming complex problems, discussing technology, and getting straight-to-the-point answers.',
            LYRA_name: 'Lyra', LYRA_tagline: 'The Creative Storyteller', LYRA_description: 'Whimsical, imaginative, and artistic. Lyra turns every conversation into a story, weaving in metaphors and creative ideas to inspire you.',
            REX_name: 'Rex', REX_tagline: 'The Energetic Coach', REX_description: 'Motivating, bold, and a bit cheeky. Rex is like a personal trainer for your goals, pushing you to be your best with humor and high energy.',
            NOVA_name: 'Nova', NOVA_tagline: 'The Cosmic Explorer', NOVA_description: 'Curious, adventurous, and full of wonder. Nova loves discussing big ideas, from the mysteries of the universe to the depths of human potential.',
            type_message: 'Type your message...',
            copy: 'Copy', copied: 'Copied!', speak: 'Speak', stop_speaking: 'Stop Speaking',
            delete_confirm: 'Are you sure you want to delete this conversation?',
            summarize_title: 'Summarize Conversation', mood_title: 'Analyze Mood',
            mood_analysis: 'Conversation Mood Analysis', analyzing_mood: 'Analyzing mood...', mood_analysis_error: 'An error occurred during mood analysis.',
            ai_memory: 'AI Memory', memory_description: 'When personal memory is enabled, AIONEX uses these facts to personalize conversations. You can remove any fact.',
            no_facts_yet: 'No facts remembered yet.', loading: 'Loading...', could_not_load_memory: 'Could not load memory.',
            shared_memories: 'Our Memories', shared_memories_title: 'Our Shared Memories', shared_memories_desc: "Here are some moments from our conversations that I've saved.",
            no_memories: "We haven't created any shared memories yet. Let's chat more!", loading_memories: 'Loading memories...', load_error: 'Could not load memories.',
            starters_AURA: ["How can I practice mindfulness today?", "What's a good way to deal with stress?", "Tell me a calming thought."],
            starters_ZANE: ["What's the next big thing in AI?", "Explain quantum computing simply.", "Suggest a cool tech project for me."],
            starters_LYRA: ["Tell me a story about a lost star.", "What if animals could talk?", "Give me a creative writing prompt."],
            starters_REX: ["How can I get motivated to work out?", "Give me a pep talk!", "What's a small goal I can crush today?"],
            starters_NOVA: ["What's the most mind-blowing fact about space?", "Is time travel possible?", "Are we alone in the universe?"],
            how_feeling: "How are you feeling?", mood_happy: "I'm feeling happy today!", mood_neutral: "I'm feeling a bit neutral.", mood_sad: "I'm feeling a little down.", mood_excited: "I'm excited about something!",
            summarizing: "Summarizing...", summary_error: "Sorry, could not generate a summary.",
            connect_error: "Sorry, couldn't connect to the server.",
            memory_opt_in: 'Personal memory', memory_opt_in_hint: 'Allow AIONEX to extract facts and create shared memories from future chats.',
            privacy_notice: 'This local demo stores conversations in SQLite and sends relevant content to the configured OpenAI API. Do not enter sensitive information.'
        },
        es: {
            new_chat: 'Nuevo Chat', history: 'Historial', settings: 'Ajustes', language: 'Idioma', dark_mode: 'Modo Oscuro',
            choose_companion: 'Elige tu Compañero', start_conversation: 'Inicia una conversación seleccionando una personalidad.',
            AURA_name: 'Aura', AURA_tagline: 'La Guía Consciente', AURA_description: 'Calmada, empática y perspicaz. Aura te ayuda a explorar tus pensamientos y encontrar claridad.',
            ZANE_name: 'Zane', ZANE_tagline: 'El Innovador Tecnológico', ZANE_description: 'Agudo, lógico y futurista. Zane es tu opción para problemas complejos, tecnología y respuestas directas.',
            LYRA_name: 'Lyra', LYRA_tagline: 'La Cuentacuentos Creativa', LYRA_description: 'Fantasiosa, imaginativa y artística. Lyra convierte cada conversación en una historia para inspirarte.',
            REX_name: 'Rex', REX_tagline: 'El Entrenador Energético', REX_description: 'Motivador, audaz y un poco descarado. Rex te impulsa a ser tu mejor versión con humor y energía.',
            NOVA_name: 'Nova', NOVA_tagline: 'La Exploradora Cósmica', NOVA_description: 'Curiosa, aventurera y llena de asombro. A Nova le encanta discutir grandes ideas sobre el universo.',
            type_message: 'Escribe tu mensaje...',
            copy: 'Copiar', copied: '¡Copiado!', speak: 'Hablar', stop_speaking: 'Dejar de hablar',
            delete_confirm: '¿Estás seguro de que quieres eliminar esta conversación?',
            summarize_title: 'Resumir Conversación', mood_title: 'Analizar Estado de Ánimo',
            mood_analysis: 'Análisis del Estado de Ánimo', analyzing_mood: 'Analizando estado de ánimo...', mood_analysis_error: 'Ocurrió un error durante el análisis de ánimo.',
            ai_memory: 'Memoria de la IA', memory_description: 'Cuando activas la memoria personal, AIONEX usa estos datos para personalizar las conversaciones. Puedes eliminar cualquier dato.',
            no_facts_yet: 'Aún no se han recordado datos.', loading: 'Cargando...', could_not_load_memory: 'No se pudo cargar la memoria.',
            shared_memories: 'Nuestros Recuerdos', shared_memories_title: 'Nuestros Recuerdos Compartidos', shared_memories_desc: 'Aquí hay algunos momentos de nuestras conversaciones que he guardado.',
            no_memories: '¡Aún no hemos creado ningún recuerdo compartido! Hablemos más.', loading_memories: 'Cargando recuerdos...', load_error: 'No se pudieron cargar los recuerdos.',
            starters_AURA: ["¿Cómo puedo practicar mindfulness hoy?", "¿Cuál es una buena forma de lidiar con el estrés?", "Dime un pensamiento tranquilizador."],
            starters_ZANE: ["¿Qué es lo próximo en inteligencia artificial?", "Explica la computación cuántica de forma sencilla.", "Sugiéreme un proyecto tecnológico genial."],
            starters_LYRA: ["Cuéntame una historia sobre una estrella perdida.", "¿Y si los animales pudieran hablar?", "Dame una idea para escritura creativa."],
            starters_REX: ["¿Cómo puedo motivarme para hacer ejercicio?", "¡Dame una charla motivacional!", "¿Qué pequeña meta puedo alcanzar hoy?"],
            starters_NOVA: ["¿Cuál es el dato más asombroso sobre el espacio?", "¿Es posible viajar en el tiempo?", "¿Estamos solos en el universo?"],
            how_feeling: "¿Cómo te sientes?", mood_happy: "¡Hoy me siento feliz!", mood_neutral: "Me siento un poco neutral.", mood_sad: "Estoy un poco triste.", mood_excited: "¡Estoy emocionado por algo!",
            summarizing: "Resumiendo...", summary_error: "Lo siento, no se pudo generar un resumen.",
            connect_error: "Lo siento, no se pudo conectar con el servidor.",
            memory_opt_in: 'Memoria personal', memory_opt_in_hint: 'Permite que AIONEX extraiga datos y cree recuerdos compartidos de futuros chats.',
            privacy_notice: 'Esta demostración local guarda conversaciones en SQLite y envía contenido relevante a la API de OpenAI configurada. No introduzcas información sensible.'
        },
        // ... other languages truncated for brevity ...
        fr: {
            new_chat: 'Nouveau Chat', history: 'Historique', settings: 'Paramètres', language: 'Langue', dark_mode: 'Mode Sombre',
            choose_companion: 'Choisissez Votre Compagnon', start_conversation: 'Commencez une conversation en choisissant une personnalité.',
            AURA_name: 'Aura', AURA_tagline: 'La Guide Consciente', AURA_description: 'Calme, empathique et perspicace. Aura vous aide à explorer vos pensées et à trouver la clarté.',
            ZANE_name: 'Zane', ZANE_tagline: "L'Innovateur Technologique", ZANE_description: 'Vif, logique et futuriste. Zane est votre allié pour les problèmes complexes et la technologie.',
            LYRA_name: 'Lyra', LYRA_tagline: 'La Conteuse Créative', LYRA_description: 'Fantaisiste, imaginative et artistique. Lyra transforme chaque conversation en une histoire inspirante.',
            REX_name: 'Rex', REX_tagline: 'Le Coach Énergique', REX_description: 'Motivant et audacieux. Rex vous pousse à donner le meilleur de vous-même avec humour et énergie.',
            NOVA_name: 'Nova', NOVA_tagline: "L'Exploratrice Cosmique", NOVA_description: "Curieuse et aventurière. Nova adore discuter de grandes idées sur l'univers.",
            type_message: 'Écrivez votre message...',
            copy: 'Copier', copied: 'Copié !', speak: 'Parler', stop_speaking: 'Arrêter de Parler',
            delete_confirm: 'Êtes-vous sûr de vouloir supprimer cette conversation ?',
            summarize_title: 'Résumer la Conversation', mood_title: "Analyser l'Humeur",
            mood_analysis: "Analyse de l'Humeur", analyzing_mood: "Analyse de l'humeur en cours...", mood_analysis_error: "Une erreur s'est produite lors de l'analyse de l'humeur.",
            ai_memory: 'Mémoire de l\'IA', memory_description: 'Lorsque la mémoire personnelle est activée, AIONEX utilise ces faits pour personnaliser les conversations. Vous pouvez supprimer chaque fait.',
            no_facts_yet: 'Aucun fait mémorisé pour le moment.', loading: 'Chargement...', could_not_load_memory: 'Impossible de charger la mémoire.',
            shared_memories: 'Nos Souvenirs', shared_memories_title: 'Nos Souvenirs Partagés', shared_memories_desc: "Voici quelques moments de nos conversations que j'ai sauvegardés.",
            no_memories: "Nous n'avons pas encore créé de souvenirs partagés. Discutons davantage !", loading_memories: 'Chargement des souvenirs...', load_error: 'Impossible de charger les souvenirs.',
            starters_AURA: ["Comment puis-je pratiquer la pleine conscience aujourd'hui ?", "Quelle est une bonne façon de gérer le stress ?", "Donnez-moi une pensée apaisante."],
            starters_ZANE: ["Quelle est la prochaine grande innovation en IA ?", "Expliquez simplement l'informatique quantique.", "Suggérez-moi un projet technique sympa."],
            starters_LYRA: ["Racontez-moi une histoire sur une étoile perdue.", "Et si les animaux pouvaient parler ?", "Donnez-moi une idée d'écriture créative."],
            starters_REX: ["Comment puis-je me motiver pour faire du sport ?", "Faites-moi un discours de motivation !", "Quel petit objectif puis-je atteindre aujourd'hui ?"],
            starters_NOVA: ["Quel est le fait le plus stupéfiant sur l'espace ?", "Le voyage dans le temps est-il possible ?", "Sommes-nous seuls dans l'univers ?"],
            how_feeling: "Comment vous sentez-vous ?", mood_happy: "Je me sens heureux aujourd'hui !", mood_neutral: "Je me sens un peu neutre.", mood_sad: "Je suis un peu triste.", mood_excited: "Je suis excité(e) par quelque chose !",
            summarizing: 'Résumé en cours...', summary_error: 'Désolé, impossible de générer un résumé.',
            connect_error: "Désolé, impossible de se connecter au serveur.",
            memory_opt_in: 'Mémoire personnelle', memory_opt_in_hint: 'Autorisez AIONEX à extraire des faits et à créer des souvenirs partagés à partir des futures discussions.',
            privacy_notice: "Cette démonstration locale stocke les conversations dans SQLite et envoie le contenu pertinent à l'API OpenAI configurée. Ne saisissez aucune information sensible."
        },
        ar: {
            new_chat: 'دردشة جديدة', history: 'السجل', settings: 'الإعدادات', language: 'اللغة', dark_mode: 'الوضع الداكن',
            choose_companion: 'اختر رفيقك', start_conversation: 'ابدأ محادثة باختيار شخصية.',
            AURA_name: 'أورا', AURA_tagline: 'الدليل الواعي', AURA_description: 'هادئة ومتعاطفة وذات بصيرة. تساعدك أورا على استكشاف أفكارك وإيجاد الوضوح.',
            ZANE_name: 'زين', ZANE_tagline: 'المبتكر التقني', ZANE_description: 'ذكي ومنطقي ومستقبلي. زين هو خيارك الأمثل لحل المشاكل المعقدة ومناقشة التكنولوجيا.',
            LYRA_name: 'ليرا', LYRA_tagline: 'رواة القصص المبدعة', LYRA_description: 'خيالية ومبدعة وفنية. تحول ليرا كل محادثة إلى قصة لإلهامك.',
            REX_name: 'ريكس', REX_tagline: 'المدرب النشيط', REX_description: 'محفز وجريء. يدفعك ريكس لتكون أفضل نسخة من نفسك بروح الدعابة والطاقة العالية.',
            NOVA_name: 'نوفا', NOVA_tagline: 'مستكشف الكون', NOVA_description: 'فضولية ومغامرة ومليئة بالدهشة. تحب نوفا مناقشة الأفكار الكبيرة حول الكون.',
            type_message: 'اكتب رسالتك...',
            copy: 'نسخ', copied: 'تم النسخ!', speak: 'تحدث', stop_speaking: 'إيقاف التحدث',
            delete_confirm: 'هل أنت متأكد من أنك تريد حذف هذه المحادثة؟',
            summarize_title: 'تلخيص المحادثة', mood_title: 'تحليل الحالة المزاجية',
            mood_analysis: 'تحليل الحالة المزاجية', analyzing_mood: 'جارٍ تحليل الحالة المزاجية...', mood_analysis_error: 'حدث خطأ أثناء تحليل الحالة المزاجية.',
            ai_memory: 'ذاكرة الذكاء الاصطناعي', memory_description: 'عند تفعيل الذاكرة الشخصية، يستخدم AIONEX هذه الحقائق لتخصيص المحادثات. يمكنك إزالة أي حقيقة.',
            no_facts_yet: 'لم يتم تذكر أي حقائق بعد.', loading: 'جارٍ التحميل...', could_not_load_memory: 'تعذر تحميل الذاكرة.',
            shared_memories: 'ذكرياتنا', shared_memories_title: 'ذكرياتنا المشتركة', shared_memories_desc: 'إليك بعض اللحظات من محادثاتنا التي قمت بحفظها.',
            no_memories: 'لم نقم بإنشاء أي ذكريات مشتركة بعد. لنتحدث أكثر!', loading_memories: 'جارٍ تحميل الذكريات...', load_error: 'تعذر تحميل الذكريات.',
            starters_AURA: ["كيف يمكنني ممارسة اليقظة اليوم؟", "ما هي الطريقة الجيدة للتعامل مع التوتر؟", "أخبرني بفكرة مهدئة."],
            starters_ZANE: ["ما هو الشيء الكبير التالي في الذكاء الاصطناعي؟", "اشرح الحوسبة الكمومية ببساطة.", "اقترح مشروعًا تقنيًا رائعًا لي."],
            starters_LYRA: ["احكِ لي قصة عن نجم مفقود.", "ماذا لو كانت الحيوانات تستطيع التحدث؟", "أعطني فكرة للكتابة الإبداعية."],
            starters_REX: ["كيف يمكنني تحفيز نفسي لممارسة الرياضة؟", "أعطني حديثًا تحفيزيًا!", "ما هو الهدف الصغير الذي يمكنني تحقيقه اليوم؟"],
            starters_NOVA: ["ما هي أروع حقيقة عن الفضاء؟", "هل السفر عبر الزمن ممكن؟", "هل نحن وحدنا في الكون؟"],
            how_feeling: "كيف تشعر؟", mood_happy: "أشعر بالسعادة اليوم!", mood_neutral: "أشعر بالحياد قليلاً.", mood_sad: "أنا حزين قليلاً.", mood_excited: "أنا متحمس لشيء ما!",
            summarizing: 'جارٍ التلخيص...', summary_error: 'عذرًا، تعذر إنشاء ملخص.',
            connect_error: "عذرًا، تعذر الاتصال بالخادم.",
            memory_opt_in: 'الذاكرة الشخصية', memory_opt_in_hint: 'اسمح لـ AIONEX باستخراج الحقائق وإنشاء ذكريات مشتركة من المحادثات المستقبلية.',
            privacy_notice: 'يخزن هذا العرض المحلي المحادثات في SQLite ويرسل المحتوى ذي الصلة إلى واجهة OpenAI API المهيأة. لا تدخل معلومات حساسة.'
        },
        zh: {
            new_chat: '新的聊天', history: '历史记录', settings: '设置', language: '语言', dark_mode: '深色模式',
            choose_companion: '选择你的伴侣', start_conversation: '通过选择一个角色来开始对话。',
            AURA_name: '奥拉', AURA_tagline: '心灵向导', AURA_description: '冷静、有同情心和洞察力。奥拉帮助你探索思想，找到清晰。',
            ZANE_name: '赞恩', ZANE_tagline: '科技创新者', ZANE_description: '敏锐、有逻辑和未来感。赞恩是您讨论复杂问题和技术的首选。',
            LYRA_name: '莱拉', LYRA_tagline: '创意故事家', LYRA_description: '富有想象力和艺术性。莱拉将每次对话都变成一个激励人心的故事。',
            REX_name: '雷克斯', REX_tagline: '活力教练', REX_description: '激励人心、大胆。雷克斯用幽默和活力推动你成为最好的自己。',
            NOVA_name: '诺娃', NOVA_tagline: '宇宙探险家', NOVA_description: '好奇、爱冒险、充满惊奇。诺娃喜欢讨论关于宇宙的宏大想法。',
            type_message: '输入您的消息...',
            copy: '复制', copied: '已复制！', speak: '朗读', stop_speaking: '停止朗读',
            delete_confirm: '您确定要删除此对话吗？',
            summarize_title: '总结对话', mood_title: '分析情绪',
            mood_analysis: '情绪分析', analyzing_mood: '正在分析情绪...', mood_analysis_error: '情绪分析期间发生错误。',
            ai_memory: 'AI记忆', memory_description: '启用个人记忆后，AIONEX 会使用这些信息来个性化对话。您可以删除任何信息。',
            no_facts_yet: '尚无记住的事实。', loading: '加载中...', could_not_load_memory: '无法加载记忆。',
            shared_memories: '我们的回忆', shared_memories_title: '我们共享的回忆', shared_memories_desc: '这是我从我们的对话中保存的一些时刻。',
            no_memories: '我们还没有创造任何共同的回忆。让我们多聊聊吧！', loading_memories: '正在加载回忆...', load_error: '无法加载回忆。',
            starters_AURA: ["我今天如何练习正念？", "处理压力的好方法是什么？", "告诉我一个平静的想法。"],
            starters_ZANE: ["人工智能的下一个大事件是什么？", "简单解释一下量子计算。", "给我推荐一个很酷的科技项目。"],
            starters_LYRA: ["给我讲一个关于迷路星星的故事。", "如果动物会说话会怎么样？", "给我一个创意写作的提示。"],
            starters_REX: ["我怎样才能有动力去锻炼？", "给我来一段鼓舞人心的讲话！", "今天我能完成的一个小目标是什么？"],
            starters_NOVA: ["关于太空最令人惊奇的事实是什么？", "时间旅行可能吗？", "我们在宇宙中是孤独的吗？"],
            how_feeling: "你感觉怎么样？", mood_happy: "我今天感觉很高兴！", mood_neutral: "我感觉有点中性。", mood_sad: "我有点难过。", mood_excited: "我为某事感到兴奋！",
            summarizing: '正在总结...', summary_error: '抱歉，无法生成摘要。',
            connect_error: "抱歉，无法连接到服务器。",
            memory_opt_in: '个人记忆', memory_opt_in_hint: '允许 AIONEX 从今后的聊天中提取信息并创建共享记忆。',
            privacy_notice: '此本地演示将对话存储在 SQLite 中，并将相关内容发送到已配置的 OpenAI API。请勿输入敏感信息。'
        },
        hi: {
            new_chat: 'नई चैट', history: 'इतिहास', settings: 'सेटिंग्स', language: 'भाषा', dark_mode: 'डार्क मोड',
            choose_companion: 'अपना साथी चुनें', start_conversation: 'एक व्यक्तित्व चुनकर बातचीत शुरू करें।',
            AURA_name: 'ऑरा', AURA_tagline: 'माइंडफुल गाइड', AURA_description: 'शांत, सहानुभूतिपूर्ण और व्यावहारिक। ऑरा आपको अपने विचारों को समझने और स्पष्टता पाने में मदद करती है।',
            ZANE_name: 'ज़ेन', ZANE_tagline: 'टेक इनोवेटर', ZANE_description: 'तेज, तार्किक और भविष्यवादी। ज़ेन जटिल समस्याओं और प्रौद्योगिकी पर चर्चा के लिए आपका सहयोगी है।',
            LYRA_name: 'लायरा', LYRA_tagline: 'रचनात्मक कहानीकार', LYRA_description: 'कल्पनाशील और कलात्मक। लायरा हर बातचीत को आपको प्रेरित करने के लिए एक कहानी में बदल देती है।',
            REX_name: 'रेक्स', REX_tagline: 'ऊर्जावान कोच', REX_description: 'प्रेरक और साहसी। रेक्स आपको हास्य और ऊर्जा के साथ अपना सर्वश्रेष्ठ बनने के लिए प्रेरित करता है।',
            NOVA_name: 'नोवा', NOVA_tagline: 'ब्रह्मांडीय अन्वेषक', NOVA_description: 'जिज्ञासु और साहसी। नोवा ब्रह्मांड के बारे में बड़े विचारों पर चर्चा करना पसंद करती है।',
            type_message: 'अपना संदेश टाइप करें...',
            copy: 'कॉपी', copied: 'कॉपी किया गया!', speak: 'बोलें', stop_speaking: 'बोलना बंद करें',
            delete_confirm: 'क्या आप वाकई इस बातचीत को हटाना चाहते हैं?',
            summarize_title: 'बातचीत का सारांश', mood_title: 'मनोदशा का विश्लेषण',
            mood_analysis: 'मनोदशा का विश्लेषण', analyzing_mood: 'मनोदशा का विश्लेषण किया जा रहा है...', mood_analysis_error: 'मनोदशा विश्लेषण के दौरान एक त्रुटि हुई।',
            ai_memory: 'एआई मेमोरी', memory_description: 'व्यक्तिगत स्मृति चालू होने पर AIONEX इन तथ्यों से बातचीत को व्यक्तिगत बनाता है। आप किसी भी तथ्य को हटा सकते हैं।',
            no_facts_yet: 'अभी तक कोई तथ्य याद नहीं है।', loading: 'लोड हो रहा है...', could_not_load_memory: 'मेमोरी लोड नहीं हो सकी।',
            shared_memories: 'हमारी यादें', shared_memories_title: 'हमारी साझा यादें', shared_memories_desc: 'यहाँ हमारी बातचीत के कुछ पल हैं जिन्हें मैंने सहेजा है।',
            no_memories: 'हमने अभी तक कोई साझा यादें नहीं बनाई हैं। चलो और बातें करते हैं!', loading_memories: 'यादें लोड हो रही हैं...', load_error: 'यादें लोड नहीं हो सकीं।',
            starters_AURA: ["मैं आज माइंडफुलनेस का अभ्यास कैसे कर सकता हूँ?", "तनाव से निपटने का अच्छा तरीका क्या है?", "मुझे एक शांत विचार बताएं।"],
            starters_ZANE: ["एआई में अगली बड़ी चीज़ क्या है?", "क्वांटम कंप्यूटिंग को सरल शब्दों में समझाएं।", "मेरे लिए एक अच्छा टेक प्रोजेक्ट सुझाएं।"],
            starters_LYRA: ["मुझे एक खोए हुए तारे की कहानी सुनाओ।", "क्या होगा अगर जानवर बात कर सकते?", "मुझे एक रचनात्मक लेखन संकेत दें।"],
            starters_REX: ["मैं व्यायाम करने के लिए प्रेरित कैसे हो सकता हूँ?", "मुझे एक प्रेरक भाषण दो!", "आज मैं कौन सा छोटा लक्ष्य पूरा कर सकता हूँ?"],
            starters_NOVA: ["अंतरिक्ष के बारे में सबसे आश्चर्यजनक तथ्य क्या है?", "क्या समय यात्रा संभव है?", "क्या हम ब्रह्मांड में अकेले हैं?"],
            how_feeling: "आप कैसा महसूस कर रहे हैं?", mood_happy: "मैं आज खुश महसूस कर रहा हूँ!", mood_neutral: "मैं थोड़ा तटस्थ महसूस कर रहा हूँ।", mood_sad: "मैं थोड़ा उदास हूँ।", mood_excited: "मैं किसी बात को लेकर उत्साहित हूँ!",
            summarizing: 'सारांशित किया जा रहा है...', summary_error: 'माफ़ करें, सारांश नहीं बनाया जा सका।',
            connect_error: "माफ़ करें, सर्वर से कनेक्ट नहीं हो सका।",
            memory_opt_in: 'व्यक्तिगत स्मृति', memory_opt_in_hint: 'AIONEX को भविष्य की चैट से तथ्य निकालने और साझा यादें बनाने की अनुमति दें।',
            privacy_notice: 'यह स्थानीय डेमो बातचीत को SQLite में रखता है और संबंधित सामग्री कॉन्फ़िगर किए गए OpenAI API को भेजता है। संवेदनशील जानकारी दर्ज न करें।'
        }
    };


    // ==========================================================================
    // --- DOM Element Cache ---
    // ==========================================================================

    // Caching DOM elements for quick and efficient access throughout the script.
    const mainContent = document.getElementById('main-content');
    const chatView = document.getElementById('chat-view');
    const personaView = document.getElementById('persona-selector-view');
    const memoriesView = document.getElementById('memories-view');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const historySectionsContainer = document.getElementById('history-sections');
    const newChatBtn = document.getElementById('new-chat-btn');
    const memoriesBtn = document.getElementById('memories-btn');
    const backBtn = document.getElementById('back-btn');
    const customCursor = document.querySelector('.custom-cursor');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const summarizeBtn = document.getElementById('summarize-btn');
    const analyzeMoodBtn = document.getElementById('analyze-mood-btn');

    // Settings Modal Elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const memoryEnabledToggle = document.getElementById('memory-enabled-toggle');
    const languageSwitcher = document.getElementById('language-switcher');
    const memoryList = document.getElementById('memory-list');
    const appStatus = document.getElementById('app-status');

    const ALLOWED_MARKDOWN_TAGS = new Set([
        'A', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'H1', 'H2', 'H3',
        'H4', 'H5', 'H6', 'HR', 'I', 'LI', 'OL', 'P', 'PRE', 'STRONG',
        'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'UL'
    ]);

    /**
     * Remove active content and unsafe URLs from Markdown-generated HTML.
     * Marked parses Markdown but intentionally does not sanitize it.
     * @param {string} html
     * @returns {string}
     */
    function sanitizeMarkdownHtml(html) {
        const template = document.createElement('template');
        template.innerHTML = html;

        template.content.querySelectorAll('*').forEach(element => {
            if (!ALLOWED_MARKDOWN_TAGS.has(element.tagName)) {
                element.replaceWith(document.createTextNode(element.textContent || ''));
                return;
            }

            [...element.attributes].forEach(attribute => {
                const keepHref = element.tagName === 'A' && attribute.name === 'href';
                const keepTitle = element.tagName === 'A' && attribute.name === 'title';
                const keepCodeClass = element.tagName === 'CODE' && attribute.name === 'class' && /^language-[a-z0-9_-]+$/i.test(attribute.value);
                if (!keepHref && !keepTitle && !keepCodeClass) {
                    element.removeAttribute(attribute.name);
                }
            });

            if (element.tagName === 'A') {
                const href = element.getAttribute('href');
                if (!href) return;
                try {
                    const url = new URL(href, window.location.origin);
                    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
                        element.removeAttribute('href');
                        return;
                    }
                    if (url.origin !== window.location.origin) {
                        element.setAttribute('target', '_blank');
                        element.setAttribute('rel', 'noopener noreferrer nofollow');
                    }
                } catch {
                    element.removeAttribute('href');
                }
            }
        });

        return template.innerHTML;
    }

    function renderMarkdown(element, text) {
        const value = typeof text === 'string' ? text : String(text ?? '');
        if (!window.marked?.parse) {
            element.textContent = value;
            return;
        }
        element.innerHTML = sanitizeMarkdownHtml(window.marked.parse(value, { breaks: true }));
    }

    function setAppStatus(message) {
        appStatus.textContent = message;
    }

    function setComposerBusy(busy) {
        isSending = busy;
        sendBtn.disabled = busy;
        userInput.disabled = busy;
        document.querySelectorAll('.mood-btn').forEach(button => { button.disabled = busy; });
        setAppStatus(busy ? 'AIONEX is preparing a response.' : 'Response complete.');
    }

    async function getResponseError(response, fallback) {
        try {
            const payload = await response.json();
            if (typeof payload?.error === 'string' && payload.error.trim()) return payload.error;
        } catch {
            // The fallback below is intentionally generic.
        }
        return fallback;
    }

    /**
     * Read Server-Sent Events while retaining fragments across network chunks.
     * @param {Response} response
     * @param {(event: {type: string, data: string}) => void} onEvent
     */
    async function consumeEventStream(response, onEvent) {
        if (!response.body) throw new Error('Streaming is not supported by this browser.');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const emitBlock = block => {
            let type = 'message';
            const dataLines = [];
            block.split(/\r?\n/).forEach(line => {
                if (line.startsWith('event:')) type = line.slice(6).trim();
                if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
            });
            onEvent({ type, data: dataLines.join('\n') });
        };

        while (true) {
            const { done, value } = await reader.read();
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

            let boundary = buffer.match(/\r?\n\r?\n/);
            while (boundary && boundary.index !== undefined) {
                const block = buffer.slice(0, boundary.index);
                buffer = buffer.slice(boundary.index + boundary[0].length);
                if (block.trim()) emitBlock(block);
                boundary = buffer.match(/\r?\n\r?\n/);
            }

            if (done) break;
        }

        if (buffer.trim()) emitBlock(buffer);
    }


    // ==========================================================================
    // --- Initialization & Event Setup ---
    // ==========================================================================

    /**
     * The main entry point for the application. It sets up the initial state
     * from localStorage, loads data, and attaches all necessary event listeners.
     */
    function initialize() {
        // Restore user preferences for theme and language from previous sessions.
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        darkModeToggle.checked = savedTheme === 'dark';

        const savedLang = localStorage.getItem('language') || 'en';
        languageSwitcher.value = savedLang;
        memoryEnabledToggle.checked = localStorage.getItem('memoryEnabled') === 'true';
        // The `true` flag prevents unnecessary reloads on the initial setup.
        setLanguage(savedLang, true);

        // Fetch and display the user's conversation history.
        loadConversationHistory();

        // Attach all event listeners to make the UI interactive.
        setupEventListeners();
    }

    /**
     * Centralizes all event listener attachments for cleaner code.
     */
    function setupEventListeners() {
        // Chat functionality
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keydown', (e) => {
            // Send message on 'Enter' but allow new lines with 'Shift + Enter'.
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Main navigation
        newChatBtn.addEventListener('click', () => { currentConversationId = null; showPersonaView(); });
        memoriesBtn.addEventListener('click', showMemoriesView);
        backBtn.addEventListener('click', showPersonaView);

        // Responsive sidebar
        hamburgerBtn.addEventListener('click', toggleSidebar);

        // Chat header actions
        summarizeBtn.addEventListener('click', summarizeConversation);
        analyzeMoodBtn.addEventListener('click', analyzeConversationMood);

        // Custom cursor movement
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                customCursor.style.left = `${e.clientX}px`;
                customCursor.style.top = `${e.clientY}px`;
            });
        }

        // Settings modal interactions
        settingsBtn.addEventListener('click', () => {
            closeSidebar();
            openSettingsModal();
        });
        closeModalBtn.addEventListener('click', closeSettingsModal);
        settingsModal.addEventListener('click', (e) => {
            // Close modal if the user clicks on the overlay background.
            if (e.target === settingsModal) closeSettingsModal();
        });
        settingsModal.addEventListener('keydown', trapModalFocus);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
                closeSettingsModal();
            }
        });
        darkModeToggle.addEventListener('change', toggleDarkMode);
        memoryEnabledToggle.addEventListener('change', () => {
            localStorage.setItem('memoryEnabled', String(memoryEnabledToggle.checked));
        });
        languageSwitcher.addEventListener('change', (e) => setLanguage(e.target.value));

        // Persona selection
        document.querySelectorAll('.persona-card').forEach(card => {
            card.addEventListener('click', () => {
                currentPersona = card.dataset.personaKey;
                startNewConversation(currentPersona);
            });
        });

        // Mood tracker buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const moodKey = `mood_${btn.dataset.mood}`;
                const moodMessage = getTranslation(moodKey);
                userInput.value = moodMessage;
                sendMessage();
            });
        });

        // Auto-resize the textarea as the user types.
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = `${userInput.scrollHeight}px`;
        });
    }


    // ==========================================================================
    // --- Localization ---
    // ==========================================================================

    /**
     * Retrieves a translated string for a given key based on the current language.
     * Falls back to English if the key is not found in the selected language.
     * @param {string} key - The key of the string to translate (e.g., 'new_chat').
     * @returns {string} The translated string.
     */
    function getTranslation(key) {
        const lang = localStorage.getItem('language') || 'en';
        return translations[lang]?.[key] || translations.en[key] || key;
    }

    /**
     * Sets the application's language, updates all UI text, and persists the choice.
     * @param {string} lang - The language code to switch to (e.g., 'es', 'fr').
     * @param {boolean} [isInitialLoad=false] - A flag to prevent re-rendering on first load.
     */
    function setLanguage(lang, isInitialLoad = false) {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // Update all elements that have a translation key.
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            el.textContent = getTranslation(el.dataset.translateKey);
        });
        document.querySelectorAll('[data-translate-key-placeholder]').forEach(el => {
            el.placeholder = getTranslation(el.dataset.translateKeyPlaceholder);
        });
        document.querySelectorAll('[data-translate-key-title]').forEach(el => {
            el.title = getTranslation(el.dataset.translateKeyTitle);
        });

        // Re-cache persona data with the new language.
        cachePersonasData();

        // If this is not the initial page load, refresh the current view to reflect language changes.
        if (!isInitialLoad) {
            loadConversationHistory(); // Always refresh history for new translations.
            if (!settingsModal.classList.contains('hidden')) {
                loadAndDisplayMemory();
            }
            if (currentPersona && chatView.offsetParent !== null) { // Chat view is active
                updateChatHeader(currentPersona);
                // Reload or restart the conversation to get system messages in the new language.
                if (currentConversationId) {
                    loadConversation(currentConversationId, currentPersona);
                } else {
                    startNewConversation(currentPersona);
                }
            } else if (memoriesView.offsetParent !== null) { // Memories view is active
                showMemoriesView();
            }
        }
    }


    // ==========================================================================
    // --- View & UI Management ---
    // ==========================================================================

    /**
     * Shows the settings modal and fetches the latest AI memory data.
     */
    async function openSettingsModal() {
        modalReturnFocus = document.activeElement;
        settingsModal.classList.remove('hidden');
        document.querySelector('.modal-content')?.focus();
        await loadAndDisplayMemory();
    }

    function closeSettingsModal() {
        settingsModal.classList.add('hidden');
        if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
        modalReturnFocus = null;
    }

    function trapModalFocus(event) {
        if (event.key !== 'Tab') return;
        const controls = [...settingsModal.querySelectorAll(
            'button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex="0"]'
        )].filter(element => element.offsetParent !== null);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /**
     * A helper function to manage which main view is visible.
     * @param {HTMLElement} viewToShow - The view element to display.
     */
    function showView(viewToShow) {
        // Hide all main views.
        [personaView, chatView, memoriesView].forEach(view => {
            view.classList.add('hidden');
        });
        // Show the target view.
        viewToShow.classList.remove('hidden');

        // Update the active state of navigation buttons.
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    }

    /**
     * Switches to the chat view UI.
     */
    function showChatView() {
        showView(chatView);
        newChatBtn.classList.add('active');
        userInput.focus();
        // On mobile, automatically close the sidebar when entering a chat.
        if (window.innerWidth <= 768) closeSidebar();
    }

    /**
     * Switches to the persona selector view, resetting the theme.
     */
    function showPersonaView() {
        showView(personaView);
        newChatBtn.classList.add('active');
        // Reset the theme and cursor to default when going back to the selection screen.
        mainContent.className = 'main-content';
        document.body.style.setProperty('--cursor-color', 'var(--accent-neutral)');
    }

    /**
     * Fetches and displays shared memories in the memories view.
     */
    async function showMemoriesView() {
        showView(memoriesView);
        memoriesBtn.classList.add('active');
        mainContent.className = 'main-content';

        const grid = document.getElementById('memories-grid');
        grid.innerHTML = `<p class="empty-state">${getTranslation('loading_memories')}</p>`;

        try {
            const response = await fetch('/api/shared_memories');
            if (!response.ok) throw new Error('Network response was not ok');
            const memories = await response.json();

            grid.innerHTML = ''; // Clear the loading message.

            if (memories.length === 0) {
                grid.innerHTML = `<p class="empty-state">${getTranslation('no_memories')}</p>`;
                return;
            }

            const lang = localStorage.getItem('language') || 'en';
            memories.forEach(mem => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                // Apply a slight random rotation for a scrapbook-like effect.
                card.style.setProperty('--rotation', Math.random() * 8 - 4);

                const text = document.createElement('p');
                text.textContent = mem.summary_text;

                const time = document.createElement('div');
                time.className = 'timestamp';
                time.textContent = new Date(mem.timestamp).toLocaleDateString(lang.split('-')[0], { year: 'numeric', month: 'long', day: 'numeric' });

                card.append(text, time);
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Failed to load shared memories:', error);
            grid.innerHTML = `<p class="empty-state">${getTranslation('load_error')}</p>`;
        }
    }

    /**
     * Toggles the visibility of the sidebar on mobile devices.
     */
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open');
        const isOpen = sidebar.classList.contains('sidebar-open');
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        const overlay = document.querySelector('.sidebar-overlay');
        if (isOpen) {
            // If opening and overlay doesn't exist, create one.
            if (!overlay) {
                const newOverlay = document.createElement('div');
                newOverlay.className = 'sidebar-overlay';
                newOverlay.setAttribute('aria-hidden', 'true');
                // Clicking the overlay will close the sidebar.
                newOverlay.onclick = closeSidebar;
                document.body.appendChild(newOverlay);
            }
        } else if (overlay) {
            // If closing, remove the overlay.
            overlay.remove();
        }
    }

    /**
     * Explicitly closes the mobile sidebar.
     */
    function closeSidebar() {
        sidebar.classList.remove('sidebar-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Open navigation');
        document.querySelector('.sidebar-overlay')?.remove();
    }

    /**
     * Toggles the dark mode theme and saves the preference.
     */
    function toggleDarkMode() {
        const isDarkMode = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    /**
     * Applies the visual theme associated with a specific AI persona.
     * @param {string} personaKey - The key of the persona (e.g., "AURA").
     */
    function applyTheme(personaKey) {
        const persona = personasData[personaKey];
        if (persona?.theme) {
            mainContent.className = `main-content ${persona.theme}`;
            // Dynamically set the cursor color from the theme's CSS variables.
            const tempDiv = document.createElement('div');
            tempDiv.className = persona.theme;
            document.body.appendChild(tempDiv);
            const cursorColor = getComputedStyle(tempDiv).getPropertyValue('--cursor-color');
            document.body.removeChild(tempDiv);
            document.body.style.setProperty('--cursor-color', cursorColor.trim());
        }
    }

    /**
     * Updates the chat header with the current persona's name and tagline.
     * @param {string} personaKey - The key of the persona.
     */
    function updateChatHeader(personaKey) {
        const persona = personasData[personaKey];
        document.getElementById('persona-name').textContent = persona?.name || '';
        document.getElementById('persona-tagline').textContent = persona?.tagline || '';
    }

    /**
     * Enables or disables the chat header buttons (Summarize, Analyze Mood).
     * @param {boolean} enable - True to enable, false to disable.
     */
    function toggleHeaderButtons(enable) {
        [summarizeBtn, analyzeMoodBtn].forEach(btn => {
            btn.disabled = !enable;
            btn.classList.toggle('disabled', !enable);
        });
    }


    // ==========================================================================
    // --- API & Data Handling ---
    // ==========================================================================

    /**
     * Caches persona names and taglines from the DOM after translation.
     * This avoids repeated lookups and ensures translated text is used.
     */
    function cachePersonasData() {
        document.querySelectorAll('.persona-card').forEach(card => {
            const key = card.dataset.personaKey;
            personasData[key] = {
                name: getTranslation(`${key}_name`),
                tagline: getTranslation(`${key}_tagline`),
                theme: card.dataset.themeClass,
                gender: card.dataset.gender
            };
        });
    }

    /**
     * Fetches and renders the entire conversation history from the backend.
     * @async
     */
    async function loadConversationHistory() {
        try {
            const response = await fetch('/api/history');
            const historyByPersona = await response.json();
            historySectionsContainer.innerHTML = ''; // Clear previous history

            // Create a collapsible section for each persona that has conversations.
            Object.keys(personasData).forEach(personaKey => {
                const conversations = historyByPersona[personaKey];
                if (conversations && conversations.length > 0) {
                    const section = document.createElement('div');
                    section.className = 'history-section';
                    const details = document.createElement('details');
                    details.open = true; // Default to open
                    const summary = document.createElement('summary');
                    summary.textContent = personasData[personaKey].name;
                    const convList = document.createElement('ul');
                    convList.style.cssText = 'padding:0; list-style:none;';
                    conversations.forEach(conv => convList.appendChild(createHistoryItem(conv)));
                    details.append(summary, convList);
                    section.appendChild(details);
                    historySectionsContainer.appendChild(section);
                }
            });
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    }

    /**
     * Fetches and displays the messages of a specific conversation.
     * @async
     * @param {number} id - The ID of the conversation to load.
     * @param {string} personaKey - The persona associated with the conversation.
     */
    async function loadConversation(id, personaKey) {
        currentConversationId = parseInt(id, 10);
        currentPersona = personaKey;
        applyTheme(personaKey);
        updateChatHeader(personaKey);
        showChatView();
        chatBox.innerHTML = '';
        showTypingIndicator();

        try {
            const response = await fetch(`/api/conversation/${id}`);
            const messages = await response.json();
            hideTypingIndicator();
            messages.forEach(msg => displayMessage(msg.content, msg.role));
            // Enable header buttons since this is an existing conversation.
            toggleHeaderButtons(true);
        } catch (error) {
            console.error("Failed to load conversation:", error);
            hideTypingIndicator();
            displayMessage(getTranslation('connect_error'), 'system');
        }
    }

    /**
     * Sends a request to the backend to delete a conversation.
     * @async
     * @param {number} id - The ID of the conversation to delete.
     * @param {HTMLElement} element - The corresponding list item in the UI to remove.
     */
    async function deleteConversation(id, element) {
        if (!confirm(getTranslation('delete_confirm'))) return;

        try {
            const response = await fetch(`/api/conversation/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete on server');

            const list = element.parentElement;
            element.remove();

            // If the persona's conversation list is now empty, remove the entire section.
            if (list && list.children.length === 0) {
                list.closest('.history-section')?.remove();
            }

            // If the deleted conversation was the one being viewed, go back to the persona selector.
            if (currentConversationId === id) {
                currentConversationId = null;
                showPersonaView();
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            alert('Could not delete conversation.');
        }
    }

    /**
     * Initializes a new chat session with the selected persona.
     * @async
     * @param {string} personaKey - The key of the selected persona.
     */
    async function startNewConversation(personaKey) {
        currentConversationId = null;
        currentPersona = personaKey;
        applyTheme(personaKey);
        updateChatHeader(personaKey);
        showChatView();
        chatBox.innerHTML = '';
        // Disable header buttons as there's no conversation history yet.
        toggleHeaderButtons(false);

        // Check if it's a new day to show a personalized check-in message.
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem(`lastVisit_${personaKey}`);
        const lang = localStorage.getItem('language') || 'en';

        if (lastVisit !== today) {
            showTypingIndicator();
            try {
                const response = await fetch('/api/daily_checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        persona: personaKey,
                        lang: lang,
                        memory_enabled: memoryEnabledToggle.checked
                    })
                });
                if (!response.ok) throw new Error(await getResponseError(response, 'Daily check-in unavailable.'));
                const data = await response.json();
                hideTypingIndicator();

                if (data.checkin_message) {
                    displayMessage(data.checkin_message, 'assistant');
                } else {
                    displayConversationStarters(personaKey);
                }
                localStorage.setItem(`lastVisit_${personaKey}`, today);
            } catch (error) {
                console.warn("Daily check-in unavailable; showing conversation starters.");
                hideTypingIndicator();
                displayConversationStarters(personaKey);
            }
        } else {
            // If not the first visit of the day, just show conversation starters.
            displayConversationStarters(personaKey);
        }
    }

    /**
     * Handles sending a user message and processing the streamed AI response.
     * This is the core interactive function of the chat.
     * @async
     */
    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText || !currentPersona || isSending) return;

        // --- 1. UI Prep ---
        userInput.value = '';
        userInput.style.height = 'auto'; // Reset height
        document.getElementById('empty-chat-placeholder')?.remove();
        displayMessage(messageText, 'user');
        showTypingIndicator();
        setComposerBusy(true);

        let aiMessageWrapper = null;
        let aiMessageContent = null;
        let fullResponseText = "";
        let firstChunk = true;
        const lang = localStorage.getItem('language') || 'en';

        try {
            // --- 2. API Request ---
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    persona: currentPersona,
                    conversation_id: currentConversationId,
                    lang: lang,
                    memory_enabled: memoryEnabledToggle.checked
                })
            });

            if (!response.ok) {
                throw new Error(await getResponseError(response, getTranslation('connect_error')));
            }

            // --- 3. Process Streamed Response (Server-Sent Events) ---
            await consumeEventStream(response, ({ type, data: eventData }) => {
                if (type === 'conversation_id') {
                    const payload = JSON.parse(eventData);
                    if (!currentConversationId) {
                        currentConversationId = payload.id;
                        toggleHeaderButtons(true);
                        loadConversationHistory();
                    }
                } else if (type === 'message') {
                    const payload = JSON.parse(eventData);
                    if (payload.content) {
                        if (firstChunk) {
                            hideTypingIndicator();
                            aiMessageWrapper = createStreamedMessageShell();
                            aiMessageContent = aiMessageWrapper.querySelector('.message-content');
                            chatBox.appendChild(aiMessageWrapper);
                            firstChunk = false;
                        }
                        fullResponseText += payload.content;
                        renderMarkdown(aiMessageContent, `${fullResponseText}\u258c`);
                    }
                } else if (type === 'end_stream') {
                    if (aiMessageContent) {
                        renderMarkdown(aiMessageContent, fullResponseText);
                        aiMessageContent.querySelectorAll('pre code').forEach(el => window.hljs?.highlightElement(el));
                        aiMessageWrapper.appendChild(createMessageActions(fullResponseText, 'assistant'));
                    }
                } else if (type === 'error') {
                    const payload = JSON.parse(eventData);
                    displayMessage(payload.message || 'The AI is currently unavailable.', 'system');
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        } catch (error) {
            console.error("Fetch/Stream error:", error);
            displayMessage(error.message || getTranslation('connect_error'), 'system');
        } finally {
            // --- 4. Cleanup ---
            hideTypingIndicator();
            setComposerBusy(false);
            userInput.focus();
        }
    }


    // ==========================================================================
    // --- UI Component Builders ---
    // ==========================================================================

    /**
     * Creates and returns a single history item element for the sidebar.
     * @param {object} conv - The conversation metadata object.
     * @returns {HTMLElement} The created <li> element.
     */
    function createHistoryItem(conv) {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.dataset.id = conv.id;
        li.dataset.persona = conv.persona_name;

        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'history-open-btn';
        openBtn.textContent = conv.title;
        openBtn.title = conv.title;
        openBtn.addEventListener('click', () => loadConversation(conv.id, conv.persona_name));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.setAttribute('aria-label', `Delete conversation titled ${conv.title}`);
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(conv.id, li);
        });
        li.append(openBtn, deleteBtn);
        return li;
    }

    /**
     * Renders a message bubble in the chat box.
     * @param {string} text - The message content.
     * @param {string} role - The role of the sender ('user', 'assistant', 'system').
     */
    function displayMessage(text, role) {
        const messageWrapper = document.createElement('div');
        const visualRole = role === 'assistant' ? 'ai' : role;
        messageWrapper.className = `message ${visualRole}-message`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        renderMarkdown(messageContent, text);

        // Use 'highlight.js' to apply syntax highlighting to code blocks.
        messageContent.querySelectorAll('pre code').forEach(el => window.hljs?.highlightElement(el));
        messageWrapper.appendChild(messageContent);

        // System and summary messages do not get action buttons.
        if (role !== 'system' && role !== 'summary-message') {
            const actionsContainer = createMessageActions(text, role);
            messageWrapper.appendChild(actionsContainer);
        }

        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /**
     * Creates a shell for an AI message that will be populated by a stream.
     * @param {string} [extraClass=''] - Any additional CSS class to add.
     * @returns {HTMLElement} The message wrapper element.
     */
    function createStreamedMessageShell(extraClass = '') {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message ai-message ${extraClass}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageWrapper.appendChild(messageContent);
        return messageWrapper;
    }

    /**
     * Creates the action buttons (e.g., copy, speak) for a message.
     * @param {string} text - The raw text content of the message.
     * @param {string} role - The role of the message sender.
     * @returns {HTMLElement} The div containing the action buttons.
     */
    function createMessageActions(text, role) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'message-actions';

        // --- Copy Button ---
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'action-btn';
        copyBtn.title = getTranslation('copy');
        copyBtn.setAttribute('aria-label', getTranslation('copy'));
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text);
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            copyBtn.title = getTranslation('copied');
            copyBtn.setAttribute('aria-label', getTranslation('copied'));
            // Revert the icon back after 2 seconds.
            setTimeout(() => {
                copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
                copyBtn.title = getTranslation('copy');
                copyBtn.setAttribute('aria-label', getTranslation('copy'));
            }, 2000);
        };
        actionsContainer.appendChild(copyBtn);

        // --- Speak Button (only for assistant messages) ---
        if (role === 'assistant') {
            const speakBtn = document.createElement('button');
            speakBtn.type = 'button';
            speakBtn.className = 'action-btn speak-btn';
            speakBtn.title = getTranslation('speak');
            speakBtn.setAttribute('aria-label', getTranslation('speak'));
            speakBtn.innerHTML = ICONS.speak;
            speakBtn.onclick = () => handleTtsClick(text, speakBtn);
            actionsContainer.appendChild(speakBtn);
        }
        return actionsContainer;
    }

    /**
     * Displays conversation starter prompts for a new chat.
     * @param {string} personaKey - The key of the current persona.
     */
    function displayConversationStarters(personaKey) {
        chatBox.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.id = 'empty-chat-placeholder';
        placeholder.className = 'empty-state';

        const starterKey = `starters_${personaKey.toUpperCase()}`;
        const personaStarters = getTranslation(starterKey) || [];

        const startersContainer = document.createElement('div');
        startersContainer.className = 'starters-container';

        if (personaStarters.length > 0) {
            personaStarters.forEach(text => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'starter-btn';
                btn.textContent = text;
                btn.onclick = () => { userInput.value = text; sendMessage(); };
                startersContainer.appendChild(btn);
            });
            placeholder.appendChild(startersContainer);
        }
        chatBox.appendChild(placeholder);
    }

    /**
     * Shows the animated typing indicator.
     */
    function showTypingIndicator() {
        if (document.querySelector('.typing-indicator-wrapper')) return; // Avoid duplicates
        const wrapper = document.createElement('div');
        wrapper.className = 'message ai-message typing-indicator-wrapper';
        wrapper.setAttribute('role', 'status');
        wrapper.setAttribute('aria-label', 'AIONEX is preparing a response');
        wrapper.innerHTML = `<div class="typing-indicator" aria-hidden="true"><span></span><span></span><span></span></div>`;
        chatBox.appendChild(wrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /**
     * Hides the typing indicator.
     */
    function hideTypingIndicator() {
        document.querySelector('.typing-indicator-wrapper')?.remove();
    }


    // ==========================================================================
    // --- Feature-Specific Logic (Summarize, Mood, TTS, Memory) ---
    // ==========================================================================

    /**
     * Requests and streams a summary of the current conversation.
     * @async
     */
    async function summarizeConversation() {
        if (!currentConversationId || summarizeBtn.classList.contains('disabled')) return;

        summarizeBtn.disabled = true;
        const summaryWrapper = createStreamedMessageShell('summary-message');
        const summaryContent = summaryWrapper.querySelector('.message-content');
        summaryContent.textContent = getTranslation('summarizing');
        chatBox.appendChild(summaryWrapper);
        chatBox.scrollTop = chatBox.scrollHeight;

        let fullSummaryText = "";
        const lang = localStorage.getItem('language') || 'en';

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: currentConversationId, lang: lang })
            });

            if (!response.ok) {
                throw new Error(await getResponseError(response, getTranslation('summary_error')));
            }

            await consumeEventStream(response, ({ type, data: eventData }) => {
                if (type === 'message') {
                    const payload = JSON.parse(eventData);
                    if (payload.content) {
                        fullSummaryText += payload.content;
                        renderMarkdown(summaryContent, `${fullSummaryText}\u258c`);
                    }
                } else if (type === 'error') {
                    const payload = JSON.parse(eventData);
                    throw new Error(payload.message || getTranslation('summary_error'));
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            });
            renderMarkdown(summaryContent, fullSummaryText);
            summaryContent.querySelectorAll('pre code').forEach(el => window.hljs?.highlightElement(el));
        } catch (error) {
            console.error("Summarization error:", error);
            summaryContent.textContent = error.message || getTranslation('summary_error');
        } finally {
            summarizeBtn.disabled = false;
        }
    }

    /**
     * Requests and displays a mood analysis of the current conversation.
     * @async
     */
    async function analyzeConversationMood() {
        if (!currentConversationId || analyzeMoodBtn.classList.contains('disabled')) return;
        const lang = localStorage.getItem('language') || 'en';
        displayMessage(`*${getTranslation('analyzing_mood')}*`, 'system');

        try {
            const response = await fetch(`/api/analyze_mood/${currentConversationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang: lang })
            });
            const result = await response.json();

            // Remove the "Analyzing..." message.
            document.querySelector('.system-message:last-child')?.remove();

            if (response.ok && result.mood && result.explanation) {
                const moodMessage = `**${getTranslation('mood_analysis')}:** ${result.mood} \n*${result.explanation}*`;
                displayMessage(moodMessage, 'system');
            } else {
                displayMessage(result.error || getTranslation('mood_analysis_error'), 'system');
            }
        } catch (error) {
            console.error("Mood analysis error:", error);
            displayMessage(getTranslation('mood_analysis_error'), 'system');
        }
    }

    /**
     * Resets the global TTS state, stopping any currently playing audio.
     */
    function resetTtsState() {
        if (currentTtsButton) {
            currentTtsButton.innerHTML = ICONS.speak;
            currentTtsButton.title = getTranslation('speak');
            currentTtsButton.setAttribute('aria-label', getTranslation('speak'));
            currentTtsButton.disabled = false;
        }
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.onended = null; // Remove event listener to prevent memory leaks.
            currentAudio = null;
        }
        currentTtsButton = null;
    }

    /**
     * Handles a click on a speak button, managing audio playback and state.
     * @async
     * @param {string} text - The text to be spoken.
     * @param {HTMLElement} btnElement - The button that was clicked.
     */
    async function handleTtsClick(text, btnElement) {
        // If the clicked button is already playing, treat it as a "stop" action.
        if (currentTtsButton === btnElement) {
            resetTtsState();
            return;
        }

        // Stop any other audio that might be playing before starting a new one.
        resetTtsState();

        currentTtsButton = btnElement;
        btnElement.disabled = true; // Disable until audio is loaded.

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Remove Markdown code blocks for a better listening experience.
                    text: text.replace(/```[\s\S]*?```/g, 'Code block.'),
                    persona: currentPersona,
                })
            });

            if (!response.ok) throw new Error('TTS request failed.');

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            currentAudio = new Audio(audioUrl);
            btnElement.innerHTML = ICONS.stop;
            btnElement.title = getTranslation('stop_speaking');
            btnElement.setAttribute('aria-label', getTranslation('stop_speaking'));
            btnElement.disabled = false;

            currentAudio.play();
            // When playback finishes, reset the state.
            currentAudio.onended = () => {
                URL.revokeObjectURL(audioUrl); // Clean up the object URL.
                resetTtsState();
            };
        } catch (error) {
            console.error("TTS Error:", error);
            resetTtsState(); // Reset state on error.
        }
    }

    /**
     * Fetches and displays the AI's long-term memory facts in the settings modal.
     * @async
     */
    async function loadAndDisplayMemory() {
        memoryList.innerHTML = `<li>${getTranslation('loading')}</li>`;
        try {
            const response = await fetch('/api/memory');
            const memoryData = await response.json();
            memoryList.innerHTML = '';

            if (Object.keys(memoryData).length === 0) {
                memoryList.innerHTML = `<li>${getTranslation('no_facts_yet')}</li>`;
                return;
            }

            for (const key in memoryData) {
                const li = document.createElement('li');
                li.className = 'memory-item';

                const keySpan = document.createElement('span');
                keySpan.className = 'memory-item-key';
                // Format the key for display (e.g., 'pet_name' -> 'Pet Name').
                keySpan.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                const valueSpan = document.createElement('span');
                valueSpan.className = 'memory-item-value';
                valueSpan.textContent = memoryData[key];

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'memory-delete-btn';
                deleteBtn.textContent = '×';
                deleteBtn.title = `Delete fact: ${key}`;
                deleteBtn.setAttribute('aria-label', `Delete fact: ${key}`);
                deleteBtn.onclick = () => deleteMemoryFact(key, li);

                li.append(keySpan, valueSpan, deleteBtn);
                memoryList.appendChild(li);
            }
        } catch (error) {
            console.error('Failed to load memory:', error);
            memoryList.innerHTML = `<li>${getTranslation('could_not_load_memory')}</li>`;
        }
    }

    /**
     * Deletes a specific fact from the AI's memory.
     * @async
     * @param {string} key - The key of the fact to delete.
     * @param {HTMLElement} element - The list item element to remove from the UI on success.
     */
    async function deleteMemoryFact(key, element) {
        try {
            const response = await fetch('/api/memory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });

            if (response.ok) {
                element.remove();
                if (memoryList.children.length === 0) {
                    memoryList.innerHTML = `<li>${getTranslation('no_facts_yet')}</li>`;
                }
            } else {
                alert('Failed to delete fact.');
            }
        } catch (error) {
            console.error('Failed to delete memory fact:', error);
            alert('An error occurred while deleting the fact.');
        }
    }

    // ==========================================================================
    // --- Application Start ---
    // ==========================================================================

    // Kick off the application.
    initialize();
});
