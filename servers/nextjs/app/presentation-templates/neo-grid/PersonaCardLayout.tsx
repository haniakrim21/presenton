import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Customer Persona'),
    persona: z.object({
        name: z.string().max(30).describe('The name of the persona').default('Sarah Mitchell'),
        role: z.string().max(40).describe('The role or job title of the persona').default('Head of Product, Mid-size SaaS Company'),
        bio: z.string().max(200).describe('A short biography describing who this persona is').default('Sarah oversees a team of 12 PMs and is responsible for the entire product lifecycle. She is data-driven, fast-moving, and constantly balancing stakeholder demands with engineering capacity.'),
        image: z.object({
            __image_url__: z.string().describe('URL of the persona image').default(''),
            __image_prompt__: z.string().max(100).describe('Prompt to generate the persona image').default('Professional headshot of a confident woman in her 30s, neutral background, business casual attire'),
        }).describe('Image object for the persona avatar'),
    }).describe('The persona details including name, role, bio, and image'),
    traits: z.array(z.object({
        label: z.string().max(20).describe('The trait label, e.g. Age or Team Size'),
        value: z.string().max(30).describe('The trait value, e.g. 34 or 12 people'),
    })).max(5).describe('Up to 5 key traits shown as label-value pairs').default([
        { label: 'Age', value: '34' },
        { label: 'Team Size', value: '12 people' },
        { label: 'Industry', value: 'SaaS / Tech' },
        { label: 'Experience', value: '10+ years' },
    ]),
    goals: z.array(
        z.string().max(80).describe('A goal or motivation of this persona')
    ).max(4).describe('Up to 4 goals or motivations').default([
        'Reduce time-to-market for new features by 30%',
        'Align cross-functional teams around a shared roadmap',
        'Make data-driven decisions with confidence and speed',
    ]),
});

export const layoutId = 'persona-card-layout';
export const layoutName = 'User Persona Card';
export const layoutDescription = 'User persona card with image, traits, and goals';

const PersonaCardLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, persona, traits, goals } = data;

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <div
                className="relative w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video overflow-hidden z-20 mx-auto"
                style={{
                    fontFamily: 'var(--heading-font-family, Inter)',
                    background: 'var(--background-color, #ffffff)',
                }}
            >
                {/* Grid-dot background pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(var(--primary-color, #6366F1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

                {/* Company branding block */}
                {((data as any)?.__companyName__ || (data as any)?._logo_url__) && (
                    <div className="absolute top-0 left-0 right-0 px-8 pt-4 z-10">
                        <div className="flex items-center gap-1">
                            {(data as any)?._logo_url__ && <img src={(data as any)?._logo_url__} alt="logo" className="w-[60px] object-contain" />}
                            <span style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }} className='w-[2px] h-4'></span>
                            {(data as any)?.__companyName__ && <span className="text-sm font-semibold" style={{ color: 'var(--background-text, #111827)' }}>{(data as any)?.__companyName__}</span>}
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="flex flex-col h-full px-12 py-10">
                    {/* Header */}
                    <div className="mb-5 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight tracking-wide pb-2"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                    display: 'inline-block',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Two equal columns with vertical 1px divider */}
                    <div
                        className="flex-1 flex min-h-0"
                        style={{ border: '1px solid var(--stroke, #E5E7EB)' }}
                    >
                        {/* Left column: persona identity */}
                        <div
                            className="flex flex-col items-center justify-start pt-6 px-8 pb-6"
                            style={{
                                width: '42%',
                                borderRight: '1px solid var(--stroke, #E5E7EB)',
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                            }}
                        >
                            {/* Square image frame */}
                            <div
                                className="flex-shrink-0 mb-4 flex items-center justify-center overflow-hidden"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: 0,
                                    border: '1px solid var(--stroke, #E5E7EB)',
                                    backgroundColor: 'var(--background-color, #ffffff)',
                                }}
                            >
                                {persona?.image?.__image_url__ ? (
                                    <img
                                        src={persona.image.__image_url__}
                                        alt={persona?.name ?? 'Persona'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                                        <rect x="13" y="8" width="18" height="16" fill="currentColor" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.25 }} />
                                        <rect x="6" y="28" width="32" height="12" fill="currentColor" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.15 }} />
                                    </svg>
                                )}
                            </div>

                            {/* Name */}
                            {persona?.name && (
                                <h2
                                    className="text-[18px] font-bold text-center leading-tight mb-1 tracking-wide"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {persona.name}
                                </h2>
                            )}

                            {/* Role — UPPERCASE label */}
                            {persona?.role && (
                                <p
                                    className="text-[10px] font-semibold uppercase text-center mb-4 tracking-widest"
                                    style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--body-font-family, Inter)', letterSpacing: '0.1em' }}
                                >
                                    {persona.role}
                                </p>
                            )}

                            {/* Full-width 1px divider */}
                            <div
                                className="w-full mb-4 flex-shrink-0"
                                style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)' }}
                            />

                            {/* Bio */}
                            {persona?.bio && (
                                <p
                                    className="text-[11.5px] leading-[1.6] text-center"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {persona.bio}
                                </p>
                            )}
                        </div>

                        {/* Right column: traits and goals */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            {/* Key Traits section — 2-column bordered grid */}
                            {traits && traits.length > 0 && (
                                <div className="flex-shrink-0 px-6 pt-5 pb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            style={{
                                                width: '2px',
                                                height: '16px',
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <h3
                                            className="text-[11px] font-bold uppercase tracking-widest"
                                            style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.1em' }}
                                        >
                                            Key Traits
                                        </h3>
                                    </div>
                                    {/* Traits in a 2-column bordered grid */}
                                    <div
                                        className="grid grid-cols-2"
                                        style={{ border: '1px solid var(--stroke, #E5E7EB)' }}
                                    >
                                        {traits.map((trait, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 px-3 py-2"
                                                style={{
                                                    borderRight: index % 2 === 0 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                                    borderBottom: index < traits.length - 2 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                                }}
                                            >
                                                <span
                                                    className="text-[11px] font-medium flex-shrink-0"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.label}:
                                                </span>
                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full-width 1px horizontal divider */}
                            {traits && traits.length > 0 && goals && goals.length > 0 && (
                                <div
                                    className="mx-6 flex-shrink-0"
                                    style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                />
                            )}

                            {/* Goals section */}
                            {goals && goals.length > 0 && (
                                <div className="flex-1 min-h-0 px-6 pt-4 pb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            style={{
                                                width: '2px',
                                                height: '16px',
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <h3
                                            className="text-[11px] font-bold uppercase tracking-widest"
                                            style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.1em' }}
                                        >
                                            Goals
                                        </h3>
                                    </div>
                                    <ul className="flex flex-col gap-[10px]">
                                        {goals.map((goal, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                {/* Square badge */}
                                                <span
                                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-[-2px]"
                                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)', borderRadius: 0 }}
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M2 5L4.2 7.2L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                                    </svg>
                                                </span>
                                                <span
                                                    className="text-[13px] leading-[1.55]"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {goal}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersonaCardLayout;
