import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Product Roadmap'),
    subtitle: z.string().max(200).describe('A short subtitle or context description for the roadmap').default('Our strategic plan for delivering value across four key phases this year'),
    milestones: z.array(z.object({
        phase: z.string().max(20).describe('The phase label, e.g. Q1 2024'),
        title: z.string().max(30).describe('The milestone title'),
        description: z.string().max(100).describe('A short description of what this milestone delivers'),
        status: z.enum(['completed', 'in-progress', 'upcoming']).describe('The current status of this milestone'),
    })).max(6).describe('Up to 6 milestones displayed along a horizontal timeline').default([
        {
            phase: 'Q1 2024',
            title: 'Foundation',
            description: 'Core infrastructure setup, team onboarding, and initial architecture decisions finalized.',
            status: 'completed',
        },
        {
            phase: 'Q2 2024',
            title: 'Alpha Release',
            description: 'Feature-complete alpha shipped to internal stakeholders for early validation and feedback.',
            status: 'completed',
        },
        {
            phase: 'Q3 2024',
            title: 'Beta Launch',
            description: 'Closed beta opened to 50 design partners with dedicated onboarding support.',
            status: 'in-progress',
        },
        {
            phase: 'Q4 2024',
            title: 'General Availability',
            description: 'Public launch with full documentation, pricing tiers, and self-serve onboarding.',
            status: 'upcoming',
        },
    ]),
});

export const layoutId = 'roadmap-layout';
export const layoutName = 'Roadmap Timeline';
export const layoutDescription = 'Horizontal timeline with milestones for project roadmaps';

const RoadmapLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, subtitle, milestones } = data;

    const getDotStyle = (status: 'completed' | 'in-progress' | 'upcoming') => {
        if (status === 'completed') {
            return {
                backgroundColor: 'var(--primary-color, #6366F1)',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
            };
        }
        if (status === 'in-progress') {
            return {
                backgroundColor: 'var(--background-color, #ffffff)',
                border: '1px solid var(--primary-color, #6366F1)',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
            };
        }
        return {
            backgroundColor: 'var(--background-color, #ffffff)',
            border: '1px solid var(--stroke, #E5E7EB)',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
        };
    };

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
                <div className="flex flex-col h-full px-20 pt-16 pb-12">
                    {/* Header */}
                    <div className="mb-10 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[28px] font-medium leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        <div
                            className="w-1 h-1 rounded-full mt-3 mb-4"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[13px] font-light leading-loose max-w-[520px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Timeline area */}
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                        <div className="relative w-full" style={{ height: '300px' }}>
                            {/* Horizontal hairline — 1px, opacity-20 */}
                            <div
                                className="absolute left-0 right-0"
                                style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    height: '1px',
                                    backgroundColor: 'var(--stroke, #E5E7EB)',
                                    opacity: 0.2,
                                }}
                            />

                            {/* Milestones */}
                            {milestones?.map((milestone, index) => {
                                const count = milestones.length;
                                const leftPct = count === 1
                                    ? 50
                                    : (index / (count - 1)) * 100;

                                const isAbove = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className="absolute flex flex-col items-center"
                                        style={{
                                            left: `${leftPct}%`,
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        {/* Text above the timeline */}
                                        {isAbove && (
                                            <div
                                                className="mb-4 text-left"
                                                style={{ width: `${Math.max(120, Math.floor(900 / count) - 24)}px` }}
                                            >
                                                <p
                                                    className="text-[10px] uppercase tracking-widest mb-2 font-light"
                                                    style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em' }}
                                                >
                                                    {milestone.phase}
                                                </p>
                                                <h3
                                                    className="text-[13px] font-medium leading-tight mb-1"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {milestone.title}
                                                </h3>
                                                <p
                                                    className="text-[12px] font-light leading-loose"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Spacer when text is below */}
                                        {!isAbove && <div style={{ height: '110px' }} />}

                                        {/* Tiny 3px dot marker */}
                                        <div
                                            className="flex-shrink-0 z-10"
                                            style={getDotStyle(milestone.status)}
                                        />

                                        {/* Text below the timeline */}
                                        {!isAbove && (
                                            <div
                                                className="mt-4 text-left"
                                                style={{ width: `${Math.max(120, Math.floor(900 / count) - 24)}px` }}
                                            >
                                                <p
                                                    className="text-[10px] uppercase tracking-widest mb-2 font-light"
                                                    style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em' }}
                                                >
                                                    {milestone.phase}
                                                </p>
                                                <h3
                                                    className="text-[13px] font-medium leading-tight mb-1"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {milestone.title}
                                                </h3>
                                                <p
                                                    className="text-[12px] font-light leading-loose"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Spacer when text is above */}
                                        {isAbove && <div style={{ height: '110px' }} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoadmapLayout;
