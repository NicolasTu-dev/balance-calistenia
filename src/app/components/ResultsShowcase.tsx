"use client";

import { useMemo, useState } from "react";

type ResultPerson = {
    id: string;
    name: string;
    subtitle?: string;
    avatarSrc: string; // imagen circular
    heroImageSrc: string;
    story: string;
    videos: { src: string; label?: string }[];
};

export default function ResultsShowcase() {
    const people: ResultPerson[] = useMemo(
        () => [
            {
                id: "ivo",
                name: "Ivo",
                subtitle: "Cambio físico y mental",
                avatarSrc: "/results/ivo2.jpg",
                heroImageSrc: "/results/ivo2.jpg",
                story:
                    "Mi nombre es Ivo y la verdad es que nunca destaqué en los deportes. Hice tenis, natación y también básquet, que fue el deporte que más practiqué y el que más me gustó.\n\n" +
                    "Durante mucho tiempo pensé que hacer deporte no era lo mío, o que no había nacido con esa cualidad que te hace apto o bueno. Cuando arranqué calistenia me di cuenta de que me había mentido durante años y que la realidad era otra.\n\n" +
                    "El esfuerzo, el cariño y los valores que me dejaron —y me dejan— todos los días entrenar en Balance son enormes, y me formaron muchísimo en esta temprana adultez.\n\n" +
                    "Hoy entiendo que cualquier cosa que me proponga implica convivir con el error, aprender, y después el resto viene solo. Mientras uno siga adelante, es imparable, y el límite lo ponemos nosotros.\n\n" +
                    "Tanto física como mentalmente, mi cambio fue abrupto, y pretendo que así siga siendo.",
                videos: [
                    { src: "/results/ivo-1.mp4", label: "Video 1" },
                    { src: "/results/ivo-2.mp4", label: "Video 2" },
                ],
            },
            {
                id: "nicolas",
                name: "Nicolás",
                subtitle: "28 años • constancia y estructura",
                avatarSrc: "/results/nicolas.jpg",
                heroImageSrc: "/results/nicolas.jpg",
                story:
                    "Mi nombre es Nicolás y tengo 28 años. Hace aproximadamente 5 años que estoy en el mundo de la calistenia.\n\n" +
                    "Comencé entrenando en clases grupales en 2022, y en 2023 formé parte de otro grupo, manteniendo ambos durante unos seis meses. Sin embargo, no había una estructura ni una metodología clara que me permitiera progresar y obtener resultados reales.\n\n" +
                    "Terminé abandonando la calistenia durante varios meses. Probé ir al gimnasio, pero duré solo un mes: me di cuenta de que no era mi lugar y también lo dejé.\n\n" +
                    "Pasé mucho tiempo sin entrenar hasta que conocí Balance Calistenia y a su profe, Agustín. Acá encontré todo lo que necesitaba para volver a conectar con la calistenia: estructura, planificación, aprendizaje y disciplina.\n\n" +
                    "Fue un camino de reeducación corporal y mental, con caídas y victorias, pero sobre todo de superación personal. Hoy soy mejor atleta y sigo creciendo día a día.",
                videos: [
                    { src: "/results/nicoFrontViejo.mp4", label: "Video 1" },
                    { src: "/results/nicoFrontNuevo.mp4", label: "Video 2" },
                ],
            },
            {
                id: "santino",
                name: "Santino",
                subtitle: "14 años • de 0 dominadas a skills",
                avatarSrc: "/results/santino2.jpeg",
                heroImageSrc: "/results/santino2.jpeg",
                story:
                    "Mi nombre es Santino y tengo 14 años. Arranqué en el mundo deportivo jugando al fútbol, un deporte que en su momento me gustó, pero con el tiempo dejó de apasionarme.\n\n" +
                    "No me sentía del todo cómodo en el grupo y empecé a buscar algo distinto. Así conocí la calistenia, motivado principalmente por querer un cambio físico.\n\n" +
                    "Empecé literalmente desde cero: no tenía dominadas, ni remo, ni fuerza básica. Arranqué entrenando en casa, paso a paso, aprendiendo y progresando de a poco.\n\n" +
                    "Hoy estoy mucho más fuerte: hago dominadas y fondos con peso, entreno hipertrofia, saco vertical y estoy aprendiendo y mejorando trucos como el back lever.\n\n" +
                    "Logré dominar los básicos de la calistenia y sigo entrenando para ganar masa muscular, fuerza y nuevas habilidades.",
                videos: [
                    { src: "/results/santino1video.mp4", label: "Video 1" },
                    { src: "/results/santino2video.mp4", label: "Video 2" },
                ],
            },
        ],
        []
    );

    const [activeId, setActiveId] = useState<string>(people[0]?.id ?? "");
    const active = people.find((p) => p.id === activeId) ?? people[0];

    return (
        <section className="mt-14">
            <div className="flex items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-semibold">Resultados reales</h2>
                    <p className="mt-2 text-white/70">
                        Historias reales de alumnos: progreso físico, fuerza y confianza. Seleccioná un caso para ver detalles.
                    </p>
                </div>

                {/* CTA opcional */}
                <a
                    href="/tienda"
                    className="hidden md:inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                >
                    Empezar
                </a>
            </div>

            {/* Avatares */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
                {people.map((p) => {
                    const isActive = p.id === activeId;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setActiveId(p.id)}
                            className={[
                                "flex items-center gap-3 rounded-2xl border px-3 py-2 transition",
                                isActive
                                    ? "border-white/30 bg-white/10"
                                    : "border-white/10 bg-white/5 hover:bg-white/10",
                            ].join(" ")}
                        >
                            <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.avatarSrc} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold">{p.name}</div>
                                {p.subtitle && <div className="text-xs text-white/60">{p.subtitle}</div>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Panel activo */}
            {active && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">{active.name}</h3>
                            {active.subtitle && <p className="mt-1 text-sm text-white/60">{active.subtitle}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveId("")}
                            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                        >
                            Cerrar
                        </button>
                    </div>

                    {activeId !== "" && (
                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Texto */}
                            <div>
                                <p className="whitespace-pre-line text-sm text-white/80 leading-relaxed">
                                    {active.story}
                                </p>
                            </div>

                            {/* Imagen */}
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={active.heroImageSrc}
                                    alt={`Progreso de ${active.name}`}
                                    className="h-64 w-full object-cover md:h-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Videos */}
                    {activeId !== "" && active.videos?.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                            {active.videos.slice(0, 2).map((v, idx) => (
                                <div key={`${active.id}-v-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    {v.label && <p className="mb-2 text-xs text-white/60">{v.label}</p>}
                                    <video
                                        controls
                                        preload="metadata"
                                        className="w-full rounded-xl border border-white/10 bg-black/20"
                                    >
                                        <source src={v.src} />
                                    </video>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeId === "" && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                    Seleccioná una persona para ver su historia, fotos y videos.
                </div>
            )}
        </section>
    );
}
