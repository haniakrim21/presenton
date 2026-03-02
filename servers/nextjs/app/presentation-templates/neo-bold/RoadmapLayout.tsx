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
                border: '4px solid var(--primary-color, #6366F1)',
                width: '24px',
                height: '24px',
            };
        }
        if (status === 'in-progress') {
            return {
                backgroundColor: 'var(--background-color, #ffffff)',
                border: '4px solid var(--primary-color, #6366F1)',
                width: '24px',
                height: '24px',
            };
        }
        return {
            backgroundColor: 'var(--background-color, #ffffff)',
            border: '4px solid var(--stroke, #E5E7EB)',
            width: '24px',
            height: '24px',
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
                <div className="flex flex-col h-full px-14 pt-10 pb-8">
                    {/* Header */}
                    <div className="mb-5 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[42px] font-extrabold leading-tight"
                                style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Heavy accent bar */}
                        <div
                            className="h-[8px] w-20 rounded-full mt-2 mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[15px] font-medium leading-relaxed max-w-[580px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Timeline area */}
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                        <div className="relative w-full" style={{ height: '320px' }}>
                            {/* Thick horizontal timeline line — 4px double the neo-pulse */}
                            <div
                                className="absolute left-0 right-0"
                                style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    height: '4px',
                                    backgroundColor: 'var(--primary-color, #6366F1)',
                                    opacity: 0.22,
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
                                        {/* Card above the timeline */}
                                        {isAbove && (
                                            <div
                                                className="mb-3 rounded-xl px-4 py-3 text-left shadow-xl"
                                                style={{
                                                    width: `${Math.max(140, Math.floor(820 / count) - 16)}px`,
                                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                                    borderLeft: '6px solid var(--primary-color, #6366F1)',
                                                }}
                                            >
                                                <p
                                                    className="font-extrabold uppercase tracking-widest mb-1"
                                                    style={{
                                                        fontSize: '11px',
                                                        color: 'var(--primary-color, #6366F1)',
                                                        fontFamily: 'var(--heading-font-family, Inter)',
                                                        letterSpacing: '0.1em',
                                                    }}
                                                >
                                                    {milestone.phase}
                                                </p>
                                                <h3
                                                    className="text-[14px] font-bold leading-tight mb-1"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {milestone.title}
                                                </h3>
                                                <p
                                                    className="text-[12px] leading-[1.45]"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Spacer when card is below */}
                                        {!isAbove && <div style={{ height: '125px' }} />}

                                        {/* Large dot on timeline — w-6 h-6 */}
                                        <div
                                            className="rounded-full flex-shrink-0 z-10"
                                            style={getDotStyle(milestone.status)}
                                        />

                                        {/* Card below the timeline */}
                                        {!isAbove && (
                                            <div
                                                className="mt-3 rounded-xl px-4 py-3 text-left shadow-xl"
                                                style={{
                                                    width: `${Math.max(140, Math.floor(820 / count) - 16)}px`,
                                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                                    borderLeft: '6px solid var(--primary-color, #6366F1)',
                                                }}
                                            >
                                                <p
                                                    className="font-extrabold uppercase tracking-widest mb-1"
                                                    style={{
                                                        fontSize: '11px',
                                                        color: 'var(--primary-color, #6366F1)',
                                                        fontFamily: 'var(--heading-font-family, Inter)',
                                                        letterSpacing: '0.1em',
                                                    }}
                                                >
                                                    {milestone.phase}
                                                </p>
                                                <h3
                                                    className="text-[14px] font-bold leading-tight mb-1"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {milestone.title}
                                                </h3>
                                                <p
                                                    className="text-[12px] leading-[1.45]"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Spacer when card is above */}
                                        {isAbove && <div style={{ height: '125px' }} />}
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
