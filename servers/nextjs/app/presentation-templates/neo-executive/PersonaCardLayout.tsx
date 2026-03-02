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

                {/* Main content */}
                <div className="flex flex-col h-full px-16 pt-14 pb-10">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[30px] font-semibold leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Hairline rule */}
                        <div
                            className="w-full mt-3"
                            style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.15 }}
                        />
                    </div>

                    {/* Two-column layout */}
                    <div className="flex-1 flex gap-10 min-h-0">
                        {/* Left column: persona identity */}
                        <div className="flex flex-col items-center w-[260px] flex-shrink-0 justify-start pt-2">
                            {/* Avatar — 56px, no ring, subtle 1px border */}
                            <div
                                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 mb-4 flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    border: '1px solid var(--stroke, #E5E7EB)',
                                }}
                            >
                                {persona?.image?.__image_url__ ? (
                                    <img
                                        src={persona.image.__image_url__}
                                        alt={persona?.name ?? 'Persona'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
                                        <circle cx="26" cy="20" r="11" fill="currentColor" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.3 }} />
                                        <ellipse cx="26" cy="44" rx="18" ry="10" fill="currentColor" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.2 }} />
                                    </svg>
                                )}
                            </div>

                            {/* Name */}
                            {persona?.name && (
                                <h2
                                    className="text-[20px] font-semibold text-center leading-tight mb-1"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {persona.name}
                                </h2>
                            )}

                            {/* Role */}
                            {persona?.role && (
                                <p
                                    className="text-[13px] font-medium text-center mb-4 px-2"
                                    style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {persona.role}
                                </p>
                            )}

                            {/* Divider */}
                            <div
                                className="w-full mb-4"
                                style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.3 }}
                            />

                            {/* Bio */}
                            {persona?.bio && (
                                <p
                                    className="text-[13px] font-normal leading-[1.7] text-center"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {persona.bio}
                                </p>
                            )}
                        </div>

                        {/* Vertical divider */}
                        <div
                            className="flex-shrink-0 self-stretch"
                            style={{ width: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.3 }}
                        />

                        {/* Right column: traits and goals */}
                        <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
                            {/* Key Traits section */}
                            {traits && traits.length > 0 && (
                                <div className="flex-shrink-0">
                                    <h3
                                        className="text-[12px] font-medium uppercase tracking-widest mb-3"
                                        style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.1em' }}
                                    >
                                        Key Traits
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
                                        {traits.map((trait, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                {/* Em-dash instead of dot */}
                                                <span
                                                    className="text-[14px] font-normal flex-shrink-0"
                                                    style={{ color: 'var(--primary-color, #6366F1)', opacity: 0.5 }}
                                                >
                                                    —
                                                </span>
                                                <span
                                                    className="text-[13px] font-medium flex-shrink-0"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {trait.label}:
                                                </span>
                                                <span
                                                    className="text-[13px] font-normal"
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
                                    className="flex-shrink-0"
                                    style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.3 }}
                                />
                            )}

                            {/* Goals section */}
                            {goals && goals.length > 0 && (
                                <div className="flex-1 min-h-0">
                                    <h3
                                        className="text-[12px] font-medium uppercase tracking-widest mb-3"
                                        style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.1em' }}
                                    >
                                        Goals
                                    </h3>
                                    <ul className="flex flex-col gap-3">
                                        {goals.map((goal, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                {/* Em-dash prefix */}
                                                <span
                                                    className="flex-shrink-0 text-[14px] font-normal leading-none mt-[2px]"
                                                    style={{ color: 'var(--primary-color, #6366F1)', opacity: 0.5 }}
                                                >
                                                    —
                                                </span>
                                                <span
                                                    className="text-[14px] font-normal leading-[1.7]"
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
