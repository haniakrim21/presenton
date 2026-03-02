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

                {/* Decorative floating circle */}
                <div
                    className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full pointer-events-none"
                    style={{ backgroundColor: 'var(--primary-color)', opacity: 0.05 }}
                />

                {/* Main content */}
                <div className="flex flex-col h-full px-14 pt-12 pb-10">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[38px] font-extrabold leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Gradient accent bar */}
                        <div
                            className="h-[6px] w-28 rounded-full mt-2"
                            style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color)44)' }}
                        />
                    </div>

                    {/* Two-column layout */}
                    <div className="flex-1 flex gap-8 min-h-0">
                        {/* Left column: persona identity */}
                        <div
                            className="flex flex-col items-center w-[280px] flex-shrink-0 justify-start pt-4 rounded-2xl overflow-hidden"
                            style={{ backgroundColor: 'var(--card-color, #F3F4F6)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                        >
                            {/* Two-tone header band */}
                            <div
                                className="w-full flex items-center justify-center pt-5 pb-3 px-4 flex-shrink-0"
                                style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                            >
                                {/* Avatar — rounded-2xl square with border */}
                                <div
                                    className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex items-center justify-center"
                                    style={{
                                        border: '3px solid var(--primary-text, #FFFFFF)',
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                    }}
                                >
                                    {persona?.image?.__image_url__ ? (
                                        <img
                                            src={persona.image.__image_url__}
                                            alt={persona?.name ?? 'Persona'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
                                            <circle cx="26" cy="20" r="11" fill="white" opacity="0.5" />
                                            <ellipse cx="26" cy="44" rx="18" ry="10" fill="white" opacity="0.3" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Name & role */}
                            <div className="flex flex-col items-center px-4 pt-3 pb-2">
                                {persona?.name && (
                                    <h2
                                        className="text-[18px] font-bold text-center leading-tight mb-1"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {persona.name}
                                    </h2>
                                )}

                                {/* Role as pill label */}
                                {persona?.role && (
                                    <span
                                        className="text-[11px] font-semibold text-center rounded-full px-3 py-1 mb-3"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            color: 'var(--primary-text, #FFFFFF)',
                                            fontFamily: 'var(--body-font-family, Inter)',
                                            opacity: 0.12,
                                        }}
                                    >
                                        {persona.role}
                                    </span>
                                )}
                                {persona?.role && (
                                    <span
                                        className="text-[11px] font-semibold text-center rounded-full px-3 py-1 mb-3 -mt-[30px]"
                                        style={{
                                            color: 'var(--primary-color, #6366F1)',
                                            fontFamily: 'var(--body-font-family, Inter)',
                                        }}
                                    >
                                        {persona.role}
                                    </span>
                                )}

                                {/* Divider */}
                                <div
                                    className="w-full h-[1px] mb-3"
                                    style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                />

                                {/* Bio */}
                                {persona?.bio && (
                                    <p
                                        className="text-[12px] leading-relaxed text-center"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {persona.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Vertical divider */}
                        <div
                            className="w-[1px] flex-shrink-0 self-stretch"
                            style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                        />

                        {/* Right column: traits and goals */}
                        <div className="flex-1 flex flex-col gap-5 min-h-0 overflow-hidden">
                            {/* Key Traits section */}
                            {traits && traits.length > 0 && (
                                <div className="flex-shrink-0">
                                    {/* Section label as pill */}
                                    <span
                                        className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-3"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            color: 'var(--primary-text, #FFFFFF)',
                                            letterSpacing: '0.1em',
                                            fontFamily: 'var(--heading-font-family, Inter)',
                                        }}
                                    >
                                        Key Traits
                                    </span>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-[10px] mt-1">
                                        {traits.map((trait, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 rounded-2xl px-3 py-2"
                                                style={{ backgroundColor: 'var(--card-color, #F3F4F6)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                                            >
                                                {/* Pill badge dot */}
                                                <span
                                                    className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                                />
                                                <span
                                                    className="text-[12px] font-medium flex-shrink-0"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.label}:
                                                </span>
                                                <span
                                                    className="text-[12px] font-semibold"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Horizontal rule */}
                            {traits && traits.length > 0 && goals && goals.length > 0 && (
                                <div
                                    className="h-[1px] w-full flex-shrink-0"
                                    style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                />
                            )}

                            {/* Goals section */}
                            {goals && goals.length > 0 && (
                                <div className="flex-1 min-h-0">
                                    {/* Section label as pill */}
                                    <span
                                        className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-3"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            color: 'var(--primary-text, #FFFFFF)',
                                            letterSpacing: '0.1em',
                                            fontFamily: 'var(--heading-font-family, Inter)',
                                        }}
                                    >
                                        Goals
                                    </span>
                                    <ul className="flex flex-col gap-3 mt-1">
                                        {goals.map((goal, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 rounded-2xl px-4 py-3"
                                                style={{
                                                    background: `linear-gradient(90deg, var(--primary-color)1a, transparent)`,
                                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                {/* Pill badge checkmark */}
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-[-2px]"
                                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M2 5L4.2 7.2L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                                <span
                                                    className="text-[14px] leading-relaxed"
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
