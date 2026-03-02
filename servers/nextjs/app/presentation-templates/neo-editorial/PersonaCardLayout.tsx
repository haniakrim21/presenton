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

                {/* Main content — asymmetric 3fr/2fr magazine split */}
                <div className="flex flex-col h-full px-0 pt-0 pb-0">
                    {/* Full-width header bar */}
                    <div className="px-16 pt-14 pb-0 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            USER PROFILE
                        </span>
                        {title && (
                            <h1
                                className="text-[48px] font-black leading-[1.1] tracking-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Thick editorial rule */}
                        <div
                            className="h-1 w-full mb-0"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* Asymmetric two-column content */}
                    <div className="flex-1 grid grid-cols-[3fr_2fr] min-h-0">
                        {/* Left column (3fr): large photo area + bio */}
                        <div
                            className="flex flex-col px-16 py-6 overflow-hidden"
                            style={{ borderRight: '1px solid var(--stroke, #E5E7EB)' }}
                        >
                            <div className="flex items-start gap-7 flex-1 min-h-0">
                                {/* Large photo block */}
                                <div
                                    className="w-[160px] h-[160px] flex-shrink-0 overflow-hidden flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--card-color, #F3F4F6)' }}
                                >
                                    {persona?.image?.__image_url__ ? (
                                        <img
                                            src={persona.image.__image_url__}
                                            alt={persona?.name ?? 'Persona'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                            <circle cx="32" cy="24" r="14" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.25 }} />
                                            <ellipse cx="32" cy="54" rx="22" ry="12" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.15 }} />
                                        </svg>
                                    )}
                                </div>

                                {/* Identity + bio */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    {persona?.name && (
                                        <h2
                                            className="text-[32px] font-black leading-[1.1] tracking-tight mb-1"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {persona.name}
                                        </h2>
                                    )}
                                    {persona?.role && (
                                        <span
                                            className="text-[13px] font-medium uppercase tracking-[0.2em] mb-4 block"
                                            style={{ color: 'var(--primary-color, #6366F1)' }}
                                        >
                                            {persona.role}
                                        </span>
                                    )}

                                    {/* Thin divider */}
                                    <div
                                        className="h-px w-full mb-4 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />

                                    {persona?.bio && (
                                        <p className="text-[15px] leading-[1.85]" style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}>
                                            {persona.bio.length > 0 ? (
                                                <>
                                                    <span
                                                        className="float-left text-[52px] font-black leading-[0.8] mr-2 mt-1"
                                                        style={{ color: 'var(--primary-color, #6366F1)' }}
                                                    >
                                                        {persona.bio.charAt(0)}
                                                    </span>
                                                    {persona.bio.slice(1)}
                                                </>
                                            ) : persona.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column (2fr): traits + goals */}
                        <div className="flex flex-col px-8 py-6 gap-5 overflow-hidden">
                            {/* Key Traits section */}
                            {traits && traits.length > 0 && (
                                <div className="flex-shrink-0">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                                        style={{ color: 'var(--primary-color, #6366F1)' }}
                                    >
                                        KEY TRAITS
                                    </span>
                                    <div className="flex flex-col gap-[8px]">
                                        {traits.map((trait, index) => (
                                            <div
                                                key={index}
                                                className="flex items-baseline gap-2 pb-2"
                                                style={{ borderBottom: '1px solid var(--stroke, #E5E7EB)' }}
                                            >
                                                <span
                                                    className="text-[13px] font-medium uppercase tracking-[0.1em] flex-shrink-0 w-24"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.label}
                                                </span>
                                                <span
                                                    className="text-[14px] font-black tracking-tight"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {trait.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Goals section */}
                            {goals && goals.length > 0 && (
                                <div className="flex-1 min-h-0">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                                        style={{ color: 'var(--primary-color, #6366F1)' }}
                                    >
                                        GOALS
                                    </span>
                                    <ul className="flex flex-col gap-[10px]">
                                        {goals.map((goal, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 pb-2"
                                                style={{ borderBottom: '1px solid var(--stroke, #E5E7EB)' }}
                                            >
                                                <span
                                                    className="text-[13px] font-medium uppercase tracking-[0.2em] flex-shrink-0 mt-[1px]"
                                                    style={{ color: 'var(--primary-color, #6366F1)' }}
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span
                                                    className="text-[13px] leading-[1.85]"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
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
