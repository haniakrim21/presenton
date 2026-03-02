import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('SWOT Analysis'),
    quadrants: z.array(z.object({
        label: z.string().max(20).describe('The label for this quadrant, e.g. Strengths'),
        items: z.array(
            z.string().max(80).describe('A bullet point item for this quadrant')
        ).max(4).describe('Up to 4 bullet points for this quadrant'),
    })).length(4).describe('Exactly 4 quadrants for the SWOT grid').default([
        {
            label: 'Strengths',
            items: [
                'Strong brand recognition in target markets',
                'Experienced leadership and technical team',
                'Proprietary technology with defensible IP',
                'High customer retention rate above 90%',
            ],
        },
        {
            label: 'Weaknesses',
            items: [
                'Limited geographic presence outside home market',
                'Dependence on a small number of key accounts',
                'Onboarding process requires significant manual effort',
                'Product roadmap constrained by engineering capacity',
            ],
        },
        {
            label: 'Opportunities',
            items: [
                'Expansion into underserved mid-market segment',
                'Growing demand for automation across verticals',
                'Strategic partnership pipeline with three major integrators',
                'International markets showing early traction',
            ],
        },
        {
            label: 'Threats',
            items: [
                'Increasing competition from well-funded incumbents',
                'Macroeconomic headwinds slowing enterprise spend',
                'Regulatory changes in key data privacy markets',
                'Talent acquisition challenges in core engineering roles',
            ],
        },
    ]),
});

export const layoutId = 'swot-grid-layout';
export const layoutName = 'SWOT Analysis Grid';
export const layoutDescription = 'Four-quadrant analysis grid for SWOT or similar frameworks';

const SWOTGridLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, quadrants } = data;

    // Quadrant accent colors — derived from primary with opacity variants for variety
    const quadrantAccents = [
        { border: 'var(--primary-color, #6366F1)', dot: 'var(--primary-color, #6366F1)' },
        { border: 'var(--primary-color, #6366F1)', dot: 'var(--primary-color, #6366F1)' },
        { border: 'var(--primary-color, #6366F1)', dot: 'var(--primary-color, #6366F1)' },
        { border: 'var(--primary-color, #6366F1)', dot: 'var(--primary-color, #6366F1)' },
    ];

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
                <div className="flex flex-col h-full px-14 pt-12 pb-10">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[34px] font-bold leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Pulse accent bar */}
                        <div
                            className="h-[6px] w-14 rounded-full mt-2"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* 2x2 SWOT Grid */}
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-0">
                        {quadrants?.map((quadrant, index) => (
                            <div
                                key={index}
                                className="rounded-md px-5 py-4 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    borderLeft: `3px solid ${quadrantAccents[index]?.border ?? 'var(--primary-color, #6366F1)'}`,
                                }}
                            >
                                {/* Quadrant label */}
                                <h3
                                    className="text-[15px] font-bold uppercase tracking-widest mb-3 flex-shrink-0"
                                    style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.08em' }}
                                >
                                    {quadrant.label}
                                </h3>

                                {/* Bullet items */}
                                <ul className="flex flex-col gap-[7px] flex-1 overflow-hidden">
                                    {quadrant.items?.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-2">
                                            <span
                                                className="flex-shrink-0 w-[6px] h-[6px] rounded-full mt-[5px]"
                                                style={{ backgroundColor: quadrantAccents[index]?.dot ?? 'var(--primary-color, #6366F1)' }}
                                            />
                                            <span
                                                className="text-[13px] leading-[1.5]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SWOTGridLayout;
