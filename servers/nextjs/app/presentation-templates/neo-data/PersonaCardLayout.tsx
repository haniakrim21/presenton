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
                <div className="flex flex-col h-full px-10 pt-10 pb-8">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-2 flex-shrink-0">
                        <div>
                            {title && (
                                <h1
                                    className="text-[22px] font-semibold tracking-tight leading-tight"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {title}
                                </h1>
                            )}
                        </div>
                        <span
                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-1"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                        >
                            USER PROFILE
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>PERSONA DASHBOARD</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{traits?.length ?? 0} TRAITS</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{goals?.length ?? 0} GOALS</span>
                    </div>

                    {/* Three-column dashboard layout */}
                    <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">

                        {/* Col 1: Identity panel */}
                        <div
                            className="rounded px-3 py-2.5 flex flex-col items-center overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            <span
                                className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2 self-start"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                            >
                                IDENTITY
                            </span>
                            {/* Avatar */}
                            <div
                                className="w-14 h-14 rounded overflow-hidden flex-shrink-0 mb-2 flex items-center justify-center"
                                style={{
                                    border: '1px dashed var(--primary-color, #6366F1)',
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
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <circle cx="14" cy="10" r="6" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.3 }} />
                                        <ellipse cx="14" cy="24" rx="10" ry="6" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.2 }} />
                                    </svg>
                                )}
                            </div>
                            {persona?.name && (
                                <h2
                                    className="text-[13px] font-bold text-center leading-tight mb-1"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {persona.name}
                                </h2>
                            )}
                            {persona?.role && (
                                <span
                                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-center mb-2"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    {persona.role}
                                </span>
                            )}
                            {/* Separator */}
                            <div className="w-full mb-2" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                            {persona?.bio && (
                                <p
                                    className="text-[10px] leading-[1.5] text-center"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {persona.bio}
                                </p>
                            )}
                        </div>

                        {/* Col 2: Traits panel */}
                        <div
                            className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            <span
                                className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                            >
                                KEY TRAITS
                            </span>
                            <div className="w-full mb-2" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                            <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                                {traits?.map((trait, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                        />
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-[0.1em] flex-shrink-0"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace', minWidth: '64px' }}
                                        >
                                            {trait.label}
                                        </span>
                                        <span
                                            className="text-[11px] font-semibold"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            {trait.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cols 3-4: Goals panel — spans 2 columns */}
                        <div
                            className="col-span-2 rounded px-3 py-2.5 flex flex-col overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    GOALS & MOTIVATIONS
                                </span>
                                <span
                                    className="text-[9px] font-bold"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    {goals?.length ?? 0} OBJECTIVES
                                </span>
                            </div>
                            <div className="w-full mb-2" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                            <ul className="flex flex-col gap-2 flex-1 overflow-hidden">
                                {goals?.map((goal, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span
                                            className="inline-flex items-center justify-center flex-shrink-0 rounded text-[9px] font-bold mt-[1px]"
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                color: 'var(--primary-text, #FFFFFF)',
                                                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                            }}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className="text-[11px] leading-[1.5]"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {goal}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersonaCardLayout;
