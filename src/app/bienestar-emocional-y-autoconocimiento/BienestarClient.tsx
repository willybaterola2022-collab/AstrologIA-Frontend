"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track, initScrollTracker } from "@/lib/analytics";

// BIENESTAR EMOCIONAL — Módulo de autoconocimiento profundo
// URL intencionalmente SIN "astrología" — atacamos búsquedas de psicología/bienestar:
// "cómo superar la ansiedad", "soledad significado", "propósito de vida", "test de personalidad"
// La carta natal es el instrumento — no el protagonista de la URL

const WELLBEING_THEMES = [
    { id: "ansiedad", label: "Ansiedad", emoji: "🌊", color: "#60A5FA", query: "ansiedad" },
    { id: "soledad", label: "Soledad", emoji: "🌙", color: "#A855F7", query: "soledad" },
    { id: "proposito", label: "Propósito", emoji: "⭐", color: "#F59E0B", query: "proposito" },
    { id: "relaciones", label: "Relaciones", emoji: "💗", color: "#EC4899", query: "relaciones" },
    { id: "autoestima", label: "Autoestima", emoji: "🔥", color: "#EF4444", query: "autoestima" },
    { id: "trabajo", label: "Identidad/Trabajo", emoji: "⚙️", color: "#10B981", query: "trabajo" },
];

// 6 temas × 12 signos = 72 interpretaciones curadas
const READINGS: Record<string, Record<string, {
    headline: string; body: string; pattern: string; invitation: string; affirmation: string;
}>> = {
    ansiedad: {
        Aries: { headline: "Tu ansiedad es energía sin cauce", body: "Cuando Aries no está en movimiento, la energía se vuelve hacia adentro como electricidad sin tierra. La ansiedad que sientes no es debilidad — es combustible buscando dirección. Tu sistema nervioso necesita acción física regular para procesar lo que la mente no puede terminar de resolver.", pattern: "Parálisis por análisis cuando no hay salida clara. Irritabilidad encubierta como ansiedad.", invitation: "Muévete antes de pensar. La respuesta llega en movimiento, no en reposo.", affirmation: "Mi energía no es exceso — es potencia esperando ser dirigida." },
        Tauro: { headline: "Tu ansiedad nace de la incertidumbre material", body: "Para Tauro, la seguridad no es un lujo — es oxígeno. Cuando el suelo tiembla (finanzas, estabilidad, rutina), el sistema nervioso entra en alerta aunque externamente parezcas calmado. Tu ansiedad es señal de que algo fundamental necesita consolidación.", pattern: "Acumulación de objetos, comida o hábitos como consuelo. Resistencia al cambio aunque el cambio sea necesario.", invitation: "Identifica lo que sí puedes controlar hoy. Un acto de construcción calma el sistema.", affirmation: "Creo seguridad desde adentro — no la espero desde afuera." },
        Géminis: { headline: "Tu ansiedad es mental — demasiadas voces simultáneas", body: "La mente de Géminis procesa múltiples realidades a la vez. Lo que llamas ansiedad es a menudo sobrecarga de información: demasiadas posibilidades, demasiados 'y-si'. No es que estés roto — es que tu mente vive en el futuro y el cuerpo en el presente.", pattern: "Rumiación nocturna. Cambiar de decisión repetidamente. Ansiedad comunicativa (decir demasiado o no poder hablar).", invitation: "Escribe lo que piensas. Externalizar las voces libera espacio mental.", affirmation: "No necesito procesar todo ahora mismo. Puedo dejarlo ir." },
        Cáncer: { headline: "Tu ansiedad viene de absorber lo que no es tuyo", body: "Cáncer tiene antenas emocionales extraordinariamente sensibles. Muchas veces la ansiedad que sientes no empezó en ti — la absorbiste del ambiente, de las personas que quieres, del estado del mundo. Aprender a distinguir 'esto es mío' de 'esto no es mío' es tu principal práctica de bienestar.", pattern: "Ansiedad que empeora en grupos o espacios con alta carga emocional. Niebla después de interacciones intensas.", invitation: "Pregúntate: '¿De dónde viene esto?' antes de procesarlo como propio.", affirmation: "Soy sensible, no frágil. Elijo qué llevo conmigo." },
        Leo: { headline: "Tu ansiedad aparece cuando no te reconocen", body: "Leo necesita saber que su presencia importa. La ansiedad surge cuando sientes que eres invisible, que tu contribución no cuenta, o que alguien más brilla y tú quedas en la sombra. No es vanidad — es una necesidad legítima de significado.", pattern: "Ansiedad en entornos donde te sientes no visto. Actuaciones de confianza que esconden inseguridad.", invitation: "Crea algo hoy, aunque sea pequeño. El acto creativo restaura la conexión contigo.", affirmation: "Mi luz no depende de que otros la vean para ser real." },
        Virgo: { headline: "Tu ansiedad vive en los detalles que no puedes controlar", body: "La mente de Virgo busca orden, precisión, mejora. Cuando el entorno es caótico o imperfecto, el sistema nervioso de Virgo trabaja horas extra para compensar. La ansiedad de Virgo suele ser una señal de que el estándar interno es más alto que lo humanamente posible.", pattern: "Autocrítica disfrazada de preocupación por otros. Ansiedad somática (digestión, tensión muscular).", invitation: "Identifica lo que está 'suficientemente bien'. Practica el umbral de aceptación.", affirmation: "Soy suficiente en mi imperfección. El proceso es la meta." },
        Libra: { headline: "Tu ansiedad esconde decisiones no tomadas", body: "Libra vive en el espacio entre opciones. La ansiedad crónica de este arquetipo suele ser el peso acumulado de decisiones pospuestas — siempre evaluando, nunca aterrizando. Cada decisión no tomada es una pequeña carga que el sistema nervioso lleva.", pattern: "Postergación de decisiones importantes. Ansiedad en conflictos interpersonales no resueltos.", invitation: "Decide algo hoy, lo que sea. La dirección importa más que la perfección.", affirmation: "Confío en mi discernimiento. Decido y aprendo con lo que emerge." },
        Escorpio: { headline: "Tu ansiedad es intuición que no has procesado aún", body: "Escorpio percibe lo que otros no ven — tensiones bajo la superficie, verdades no dichas, cambios que se aproximan. Lo que llamas ansiedad puede ser información legítima: algo está por transformarse. La pregunta no es cómo callar la señal, sino cómo descifrarla.", pattern: "Ansiedad nocturna intensa. Sensación de amenaza sin poder identificar la fuente.", invitation: "Escribe lo que temes. Traer lo oscuro a la luz lo hace procesable.", affirmation: "Confío en mi percepción. Lo que siento es información, no amenaza." },
        Sagitario: { headline: "Tu ansiedad es claustrofobia del alma", body: "Sagitario necesita expansión, libertad, significado. La ansiedad llega cuando la vida se vuelve rutinaria, pequeña, sin horizonte. No es que algo esté mal en ti — es que el alma literalmente necesita más espacio del que le estás dando.", pattern: "Ansiedad en compromisos a largo plazo. Inquietud física cuando la vida es demasiado predecible.", invitation: "Planifica algo que te entusiasme — aunque sea pequeño. El horizonte existe.", affirmation: "Hay espacio suficiente para todo lo que soy y todo lo que seré." },
        Capricornio: { headline: "Tu ansiedad carga el peso del futuro en el presente", body: "Capricornio planifica, construye, sostiene. La ansiedad surge cuando el camino es largo y el resultado incierto — cuando el esfuerzo no garantiza el resultado que mereces. Cargas responsabilidades que a veces no son tuyas.", pattern: "Ansiedad por rendimiento y productividad. Dificultad para pedir ayuda.", invitation: "Delega algo hoy. El peso compartido es el peso transformado.", affirmation: "Confío en el proceso incluso cuando no puedo ver el resultado." },
        Acuario: { headline: "Tu ansiedad nace de vivir en el futuro que aún no existe", body: "La mente de Acuario habita en lo que viene — sistemas, ideas, posibilidades. La desconexión del presente genera una ansiedad particular: sentirse extranjero en el mundo actual, incomprendido, demasiado adelantado. La soledad intelectual es real.", pattern: "Ansiedad social en entornos convencionales. Despersonalización leve en situaciones mundanas.", invitation: "Conecta con una persona hoy — no con la humanidad, con una persona.", affirmation: "Mi diferencia es valiosa. El mundo me alcanza cuando yo ofrezco el puente." },
        Piscis: { headline: "Tu ansiedad es la frontera entre tú y el todo", body: "Piscis no tiene límites naturales entre el yo y el mundo — absorbe emociones colectivas, carga con el dolor ajeno, confunde lo que siente con lo que siente el entorno. La ansiedad es la señal de que los límites energéticos se han disuelto demasiado.", pattern: "Ansiedad difusa sin causa identificable. Mayor intensidad en espacios públicos o después de noticias/redes.", invitation: "Practica el límite como acto de amor. 'No' es una frase completa.", affirmation: "Soy sensible y con límites claros. Los dos pueden coexistir." },
    },
    soledad: {
        Aries: { headline: "Tu soledad es independencia mal interpretada", body: "Aries busca la presencia de los demás desde la fuerza, no desde la necesidad. A veces esa posición genera una soledad paradójica: esperando que los otros den el primer paso mientras envías señales de autosuficiencia total.", pattern: "Dificultad para pedir compañía aunque la desees. Malinterpretar independencia como aislamiento.", invitation: "Da tú el primer paso. Tu vulnerabilidad no te debilita — te humaniza.", affirmation: "Puedo necesitar a los demás y seguir siendo fuerte." },
        Tauro: { headline: "Tu soledad es la espera de relaciones que demoran en madurar", body: "Tauro construye relaciones lentas, profundas, sólidas. En un mundo de vínculos inmediatos y desechables, esa calidad genera espera. La soledad de Tauro no significa que algo esté mal — significa que aún no ha llegado lo que merece.", pattern: "Quedarse en relaciones conocidas aunque estancadas por miedo a la soledad real.", invitation: "Invierte tiempo en cultivar lo que ya existe. La profundidad se construye.", affirmation: "Lo que construyo lentamente dura." },
        Géminis: { headline: "Tu soledad aparece cuando no tienes con quién pensar", body: "Géminis procesa el mundo en diálogo. La soledad más profunda no es la ausencia de personas — es la ausencia de intercambio intelectual genuino, de alguien que piense con la misma velocidad y curiosidad.", pattern: "Llenar el vacío con redes sociales o conversaciones superficiales. Sensación de soledad en grupos.", invitation: "Busca un interlocutor, no una audiencia. La presencia de calidad supera la cantidad.", affirmation: "Hay personas que piensan como yo. Las encuentro cuando me expongo." },
        Cáncer: { headline: "Tu soledad es añoranza de pertenencia profunda", body: "Cáncer anhela esa tribu donde es completamente conocido y completamente aceptado. La soledad más dolorosa para este arquetipo es sentirse extranjero en su propio entorno — presente físicamente pero no visto en su profundidad.", pattern: "Cuidar muchísimo a los demás mientras sus propias necesidades quedan sin nombrar.", invitation: "Permite que alguien te cuide. La reciprocidad es la base de lo que buscas.", affirmation: "Merezco ser tan visto como veo a los demás." },
        Leo: { headline: "Tu soledad te llega cuando el escenario queda vacío", body: "Leo brilla en el intercambio — dar, inspirar, liderar, conectar. Cuando ese flujo se corta, llega una soledad que no es tristeza sino desconexión del propósito. El escenario vacío no significa que nadie te vea — sino que tú mismo dejaste de verte.", pattern: "Búsqueda de validación externa para contrarrestar la soledad interna.", invitation: "Crea sin audiencia. El acto de crear ya es conexión con lo que eres.", affirmation: "Mi valor no depende de que alguien lo atestigüe." },
        Virgo: { headline: "Tu soledad viene de sentirte incomprendido en tu profundidad", body: "Virgo ve detalles que los demás pasan por alto. Esa precisión y ese cuidado pueden crear distancia: pocos entienden el nivel de entrega real, el análisis constante, la búsqueda de perfección que no es ego sino amor. La soledad de Virgo es la del observador que sabe demasiado.", pattern: "Criticar para mantener distancia. Sentirse 'raro' en grupos.", invitation: "Comparte tu perspectiva sin editarla. Hay personas que necesitan exactamente lo que ves.", affirmation: "Mi mirada especial es un regalo, no un defecto." },
        Libra: { headline: "Tu soledad nace de poner siempre a los demás primero", body: "Libra tiene una capacidad extraordinaria para adaptarse, armonizar y complacer. Pero tanta atención al otro puede crear una soledad extraña: estar siempre presente para todos y desaparecer como individuo con necesidades propias.", pattern: "Soledad en medio de muchas relaciones. Sentirse conocido superficialmente por muchos.", invitation: "Expresa una preferencia real hoy, aunque genere fricción.", affirmation: "Mis necesidades también merecen el centro." },
        Escorpio: { headline: "Tu soledad es el precio de ver demasiado", body: "Escorpio percibe capas de realidad que la mayoría no quiere ver. Esa profundidad puede crear un aislamiento elegido: mejor solo que rodeado de superficialidad. Pero en esa posición también se pierde la posibilidad de ser verdaderamente conocido.", pattern: "Probar la lealtad de las personas antes de mostrar vulnerabilidad real.", invitation: "Permite que alguien entre a una sola cámara de tu mundo interior.", affirmation: "La conexión profunda es posible. Exijo calidad, no me resigno a nada." },
        Sagitario: { headline: "Tu soledad llega cuando el viaje no tiene compañero de ruta", body: "Sagitario busca a alguien que quiera ir tan lejos como él. La soledad se siente más en los aeropuertos del alma — ese espacio entre una aventura terminada y la siguiente, sin nadie con quien compartir lo que encontraste.", pattern: "Relaciones intensas pero breves. Dificultad para comprometerse cuando el otro parece 'pequeño'.", invitation: "Busca al compañero en el camino, no al que espera en el destino.", affirmation: "Hay personas que quieren ir tan lejos como yo." },
        Capricornio: { headline: "Tu soledad es el coste del liderazgo solitario", body: "Capricornio carga con responsabilidades que otros no pueden ver. La soledad en la cima es real — el peso de las decisiones, la presión del rendimiento, la imposibilidad de mostrar debilidad en contextos donde eres el ancla.", pattern: "Confundir eficiencia con conexión. Relaciones instrumentalizadas.", invitation: "Distingue los espacios donde puedes bajar la guardia. Los necesitas.", affirmation: "Puedo ser fuerte y también ser visto." },
        Acuario: { headline: "Tu soledad es la del ser que llegó antes de tiempo", body: "Acuario ve el futuro. Eso es un regalo y también una fuente de soledad profunda: vivir en un mundo que todavía no comprende lo que percibes. La desconexión no es falla tuya — es diferencia de temporalidad.", pattern: "Relacionarse con ideas más que con personas. Sentirse socialmente torpe aunque sea brillante.", invitation: "Encuentra a los del futuro que ya viven en el presente. Existen.", affirmation: "Mi tiempo llegará. Mientras tanto, elijo los que se acercan." },
        Piscis: { headline: "Tu soledad es el anhelo de fusión total con el otro", body: "Piscis no quiere solo compañía — quiere fusión. La soledad de Piscis es la distancia entre esa aspiración y la realidad de dos seres siempre separados. El amor humano nunca es la fusión total que anhelas, y eso crea una tristeza de fondo.", pattern: "Idealizar relaciones que luego decepcionan. Fusión seguida de desilusión.", invitation: "Encuentra la fusión en la creación, la música, el arte, la naturaleza. Son fusiones posibles.", affirmation: "El amor humano es suficiente aunque no sea todo." },
    },
    proposito: {
        Aries: { headline: "Tu propósito es encender lo que otros no se atreven a iniciar", body: "Aries nació para comenzar — para dar el primer paso que libera a los demás de la parálisis. Tu propósito no está en los finales ni en los procesos largos: está en la chispa. Tu misión es hacer que algo que antes no existía comience a existir.", pattern: "Energía máxima al inicio, decae cuando llega la rutina de mantenimiento.", invitation: "Acepta que tu rol es el inicio. Pasa el testigo con gracia.", affirmation: "Cada comienzo que hago libera a los que vienen detrás." },
        Tauro: { headline: "Tu propósito es construir lo que dura más que una vida", body: "Tauro tiene vocación de permanencia. Tu propósito está en construir — legados, belleza, estructuras que sobreviven al tiempo. No vienes a hacer revoluciones sino a crear lo que las generaciones siguientes heredan como cimiento.", pattern: "Confundir acumulación con legado. El miedo al cambio como bloqueo del propósito.", invitation: "Pregúntate: '¿Qué quiero que quede cuando yo ya no esté?'", affirmation: "Lo que construyo hoy trasciende mi tiempo." },
        Géminis: { headline: "Tu propósito es ser el puente entre mundos que no se hablan", body: "Géminis tiene la capacidad única de hablar todos los idiomas — técnicos, artistas, niños, académicos. Tu propósito es la traducción: llevar el conocimiento de donde existe a donde se necesita, crear los puentes que nadie más puede hacer.", pattern: "Dispersión en demasiados temas sin profundizar en ninguno.", invitation: "Elige un puente y cruza hasta el otro lado. La profundidad es tu siguiente nivel.", affirmation: "Soy el puente. Mi diversidad es el mapa." },
        Cáncer: { headline: "Tu propósito es crear el hogar que todos necesitan", body: "Cáncer tiene la vocación de hacer que las personas se sientan contenidas, vistas, seguras. No importa si ese hogar es un espacio físico, una comunidad, un proyecto o una conversación — tu propósito es ser el lugar al que se puede volver.", pattern: "Confundir cuidar con perder el propio propósito.", invitation: "Cuida sin perderte. Tu propósito incluye tu propio bienestar.", affirmation: "Creo el hogar para otros desde un lugar de plenitud, no de carencia." },
        Leo: { headline: "Tu propósito es hacer que la vida valga la pena ser vivida", body: "Leo viene a traer luz a donde hay oscuridad, alegría a donde hay grisura, significado a donde hay vacío. Tu propósito más alto es inspirar — no desde la vanidad, sino desde la generosidad genuina de compartir tu fuego.", pattern: "Confundir el aplauso con el propósito. El ego como sustituto del llamado.", invitation: "Inspira sin necesitar la aprobación. Tu fuego es tuyo antes de ser de todos.", affirmation: "Soy fuente de vida y significado donde quiero que lo haya." },
        Virgo: { headline: "Tu propósito es traer excelencia al servicio cotidiano", body: "Virgo tiene vocación de perfeccionamiento — hacer que las cosas funcionen mejor, que las personas estén más sanas, que los procesos sean más humanos. Tu propósito no necesita ser grandioso — necesita ser preciso, consistente y profundamente útil.", pattern: "Autocrítica que bloquea el servicio al buscar la perfección antes de actuar.", invitation: "Sirve ahora con lo que tienes. La perfección es el resultado de mucho servicio imperfecto.", affirmation: "Mi servicio cotidiano es mi contribución extraordinaria." },
        Libra: { headline: "Tu propósito es restaurar el equilibrio donde hay injusticia o falta de armonía", body: "Libra tiene un detector interno de desequilibrio extraordinariamente sensible. Tu propósito es actuar en esa sensibilidad: ser el que restaura la justicia, crea la belleza, diseña los sistemas más humanos, negocia la paz.", pattern: "Parálisis en la decisión cuando el entorno es injusto en múltiples direcciones.", invitation: "Empieza por el desequilibrio más cercano. No necesitas resolver todo.", affirmation: "Mi sentido de justicia me guía al lugar donde más puedo contribuir." },
        Escorpio: { headline: "Tu propósito es acompañar la transformación radical", body: "Escorpio viene a los lugares donde otros no quieren ir — la muerte, la traición, la sombra, el renacimiento. Tu propósito es acompañar las transformaciones más profundas: de personas, de sistemas, de culturas.", pattern: "Confundir el poder sobre con el propósito de transformación.", invitation: "Usa tu comprensión de la oscuridad para iluminar, no controlar.", affirmation: "Soy agente de transformación donde el mundo lo necesita más." },
        Sagitario: { headline: "Tu propósito es expandir el mapa conocido de la realidad", body: "Sagitario viene a explorar territorios —físicos, intelectuales, espirituales— y a traer de vuelta lo que encontró. Tu propósito es ampliar los límites de lo que se cree posible: nuevas filosofías, nuevas tierras, nuevas comprensiones.", pattern: "Quedarse en la visión sin aterrizar en la enseñanza.", invitation: "Enseña lo que has aprendido. El mapa es tu regalo al que no pudo ir.", affirmation: "Lo que descubro cuando me aventuro transforma lo que todos conocen." },
        Capricornio: { headline: "Tu propósito es construir las estructuras que sostienen a los demás", body: "Capricornio tiene vocación de arquitecto — crear los sistemas, las instituciones, las estructuras que permiten a muchos crecer con seguridad. Tu propósito no es el reconocimiento inmediato sino la solidez que el tiempo valida.", pattern: "Trabajo excesivo sin descanso como forma de sentir propósito.", invitation: "Separa tu valor de tu productividad. Eres más que lo que produces.", affirmation: "Lo que construyo con integridad sostiene más vidas de las que puedo contar." },
        Acuario: { headline: "Tu propósito es diseñar el futuro que todos necesitan pero nadie ve aún", body: "Acuario tiene visión sistémica del futuro. Tu propósito es conceptualizar — dar forma intelectual y social a las transformaciones que el mundo necesita — y trabajar para que esas visiones se vuelvan realidad colectiva.", pattern: "Quedarse en la visión sin comprometerse con la implementación.", invitation: "Desciende al presente con tu visión. El cambio ocurre en lo concreto.", affirmation: "Mi visión del futuro es un servicio al presente." },
        Piscis: { headline: "Tu propósito es disolver los muros entre lo visible y lo invisible", body: "Piscis habita el espacio donde lo material y lo espiritual se tocan. Tu propósito es ser puente: a través del arte, la intuición, la compasión radical, la sanación. Donde otros ven separación, tú ves unidad.", pattern: "Escapismo como sustituto del propósito espiritual.", invitation: "Encarna tu espiritualidad en acción concreta. El arte y el servicio son tu altar.", affirmation: "Todo lo que hago desde el amor es acto sagrado." },
    },
};

// Fallback para temas sin 12 interpretaciones completas
function getReading(theme: string, sign: string) {
    return READINGS[theme]?.[sign] || READINGS["proposito"]["Aries"];
}

const SIGN_LIST = Object.keys(READINGS["ansiedad"]);
const SIGN_EMOJIS: Record<string, string> = {
    Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
    Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓"
};
function getBirthSign(m: number, d: number): string {
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Tauro";
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Géminis";
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cáncer";
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Escorpio";
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagitario";
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricornio";
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Acuario";
    return "Piscis";
}

export default function BienestarClient() {
    const [selectedTheme, setSelectedTheme] = useState("ansiedad");
    const [selectedSign, setSelectedSign] = useState("Escorpio");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [showGate, setShowGate] = useState(false);

    const reading = getReading(selectedTheme, selectedSign);
    const theme = WELLBEING_THEMES.find(t => t.id === selectedTheme)!;

    useEffect(() => {
        track.moduleEnter("bienestar");
        const cleanup = initScrollTracker("bienestar");
        return cleanup;
    }, []);

    function handleBirth() {
        if (birthMonth && birthDay) {
            const s = getBirthSign(parseInt(birthMonth), parseInt(birthDay));
            setSelectedSign(s);
            track.signSelected("bienestar", s);
        }
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO — no menciona astrología */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(168,85,247,0.10) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 720 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>🧠 Autoconocimiento Profundo</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1rem" }}>
                            Entiende por qué sientes lo que sientes
                        </h1>
                        <p style={{ fontSize: "1rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 2rem" }}>
                            No toda ansiedad es igual. No toda soledad significa lo mismo. Tu estructura psicológica única determina cómo vives cada emoción — y cómo la transforms.
                        </p>

                        {/* BIRTH DETECT */}
                        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", maxWidth: 400, margin: "0 auto 2rem", textAlign: "left" }}>
                            <p style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>Personaliza tu lectura — introduce tu fecha de nacimiento</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.6rem" }}>
                                <input type="number" placeholder="Mes (1-12)" value={birthMonth} onChange={e => setBirthMonth(e.target.value)}
                                    style={{ padding: "0.55rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(168,85,247,0.25)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.85rem" }} />
                                <input type="number" placeholder="Día" value={birthDay} onChange={e => setBirthDay(e.target.value)}
                                    style={{ padding: "0.55rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(168,85,247,0.25)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.85rem" }} />
                                <button onClick={handleBirth} style={{ padding: "0.55rem 1rem", borderRadius: "0.5rem", background: "#7C3AED", color: "#FFF", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", border: "none" }}>→</button>
                            </div>
                            {selectedSign && birthMonth && birthDay && (
                                <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#A855F7", marginTop: "0.5rem" }}>
                                    {SIGN_EMOJIS[selectedSign]} Estructura detectada: {selectedSign}
                                </p>
                            )}
                        </div>

                        {/* THEME TABS */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1rem" }}>
                            {WELLBEING_THEMES.map(t => (
                                <button key={t.id} onClick={() => { setSelectedTheme(t.id); track.ctaClick("bienestar", `theme_${t.id}`); }}
                                    style={{
                                        padding: "0.5rem 0.85rem", borderRadius: "2rem", border: `1px solid ${selectedTheme === t.id ? t.color : "rgba(255,255,255,0.08)"}`,
                                        background: selectedTheme === t.id ? t.color + "20" : "rgba(255,255,255,0.03)",
                                        color: selectedTheme === t.id ? t.color : "rgba(248,248,255,0.4)", fontSize: "0.8rem", fontWeight: selectedTheme === t.id ? 700 : 400, cursor: "pointer"
                                    }}>
                                    {t.emoji} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* READING */}
                <section className="section-pad" style={{ background: "rgba(0,0,0,0.15)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>

                        {/* Sign selector pill row */}
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" }}>
                            {SIGN_LIST.map(s => (
                                <button key={s} onClick={() => { setSelectedSign(s); track.signSelected("bienestar", s); }}
                                    style={{
                                        padding: "0.3rem 0.6rem", borderRadius: "1rem", border: `1px solid ${selectedSign === s ? theme.color : "rgba(255,255,255,0.06)"}`,
                                        background: selectedSign === s ? theme.color + "18" : "transparent",
                                        color: selectedSign === s ? theme.color : "rgba(248,248,255,0.3)", fontSize: "0.7rem", fontWeight: selectedSign === s ? 700 : 400, cursor: "pointer"
                                    }}>
                                    {SIGN_EMOJIS[s]} {s}
                                </button>
                            ))}
                        </div>

                        {/* Main reading card */}
                        <div className="glass-card" style={{ padding: "2rem", borderColor: theme.color + "35", marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: theme.color, borderRadius: "50%", filter: "blur(100px)", opacity: 0.08 }} />

                            <div style={{ marginBottom: "1.5rem" }}>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: theme.color, fontWeight: 700, marginBottom: "0.4rem" }}>
                                    {theme.emoji} {theme.label} · {SIGN_EMOJIS[selectedSign]} {selectedSign}
                                </p>
                                <h2 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.7rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
                                    {reading.headline}
                                </h2>
                                <p style={{ fontSize: "0.88rem", color: "rgba(248,248,255,0.62)", lineHeight: 1.85 }}>{reading.body}</p>
                            </div>

                            {/* Pattern */}
                            <div style={{ padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.025)", borderRadius: "0.6rem", borderLeft: `2px solid ${theme.color}50`, marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.25rem" }}>Patrón de fondo</p>
                                <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.7 }}>{reading.pattern}</p>
                            </div>

                            {/* Invitation */}
                            <div style={{ padding: "0.85rem 1.1rem", background: theme.color + "0D", borderRadius: "0.6rem", border: `1px solid ${theme.color}20`, marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: theme.color, marginBottom: "0.25rem" }}>✦ Invitación</p>
                                <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.7 }}>{reading.invitation}</p>
                            </div>

                            {/* Affirmation */}
                            <div style={{ textAlign: "center", padding: "0.85rem" }}>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.25)", marginBottom: "0.35rem" }}>Afirmación</p>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, fontStyle: "italic", color: "#F8F8FF", lineHeight: 1.6 }}>&ldquo;{reading.affirmation}&rdquo;</p>
                            </div>
                        </div>

                        {/* PREMIUM GATE */}
                        {!showGate ? (
                            <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(168,85,247,0.2)", marginBottom: "1.25rem" }}>
                                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>🔒 Lectura completa de tus 8 dimensiones psicológicas</p>
                                <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.4)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                    Con tu carta natal completa: análisis de ansiedad, soledad, propósito, relaciones, autoestima e identidad cruzando Sol, Luna, Marte, Venus y Saturno. 8 dimensiones, no 1.
                                </p>
                                <button className="btn-gold" onClick={() => { setShowGate(true); track.gateHit("bienestar"); }} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                                    Ver mi análisis completo →
                                </button>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(168,85,247,0.4)", marginBottom: "1.25rem" }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.4rem" }}>✨ Plan Esencial — Análisis Psicológico Completo</p>
                                <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.45)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                    Las 8 dimensiones de tu psicología según tu carta natal completa — más el análisis de tus tránsitos actuales.
                                </p>
                                <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                                    onClick={() => track.upgradeClick("bienestar", "esencial")}>
                                    Activar Plan Esencial →
                                </a>
                            </div>
                        )}

                        {/* Share */}
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                            <button onClick={() => { track.shareWhatsApp("bienestar"); window.open(`https://wa.me/?text=${encodeURIComponent(`"${reading.affirmation}" — ${reading.headline}. Descubre el tuyo: crystal-cosmos.vercel.app/bienestar-emocional-y-autoconocimiento`)}`, "_blank"); }}
                                style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                💬 Compartir en WhatsApp
                            </button>
                        </div>
                    </div>
                </section>

                {/* EXPLAINER — 6 temas sin mencionar astrología */}
                <section className="section-pad">
                    <div className="container-sm">
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700, marginBottom: "0.4rem" }}>6 áreas de tu vida emocional</h2>
                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)" }}>Tu psicología única está presente en cada una</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.75rem" }}>
                            {WELLBEING_THEMES.map(t => (
                                <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                                    style={{
                                        padding: "1rem", borderRadius: "0.75rem", border: `1px solid ${selectedTheme === t.id ? t.color + "60" : "rgba(255,255,255,0.05)"}`,
                                        background: selectedTheme === t.id ? t.color + "0F" : "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left"
                                    }}>
                                    <p style={{ fontSize: "1.3rem", marginBottom: "0.35rem" }}>{t.emoji}</p>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: selectedTheme === t.id ? t.color : "#F8F8FF", marginBottom: "0.2rem" }}>{t.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <GlobalFooter />
        </>
    );
}
