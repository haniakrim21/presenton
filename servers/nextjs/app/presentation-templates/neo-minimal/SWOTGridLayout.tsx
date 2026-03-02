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
                    <div className="mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[28px] font-medium leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Tiny dot accent */}
                        <div
                            className="w-1 h-1 rounded-full mt-3 mb-4"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* 2x2 SWOT Grid — no borders, no backgrounds, just air and text */}
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-8 min-h-0">
                        {quadrants?.map((quadrant, index) => (
                            <div
                                key={index}
                                className="flex flex-col overflow-hidden py-6 px-0"
                            >
                                {/* Quadrant label — uppercase, tracked, small */}
                                <h3
                                    className="text-[14px] uppercase tracking-widest mb-4 flex-shrink-0"
                                    style={{
                                        color: 'var(--background-text, #101828)',
                                        fontFamily: 'var(--heading-font-family, Inter)',
                                        letterSpacing: '0.12em',
                                        opacity: 0.4,
                                        fontWeight: 500,
                                    }}
                                >
                                    {quadrant.label}
                                </h3>

                                {/* Bullet items — plain text, no dots */}
                                <ul className="flex flex-col gap-[9px] flex-1 overflow-hidden">
                                    {quadrant.items?.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-3">
                                            <span
                                                className="flex-shrink-0 text-[13px] font-light leading-none mt-[3px]"
                                                style={{ color: 'var(--primary-color, #6366F1)' }}
                                            >
                                                &ndash;
                                            </span>
                                            <span
                                                className="text-[13px] font-light leading-loose"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
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

                {/* Thin cross hairlines dividing the 4 quadrants */}
                <div
                    className="absolute left-1/2 top-[40%] bottom-[8%] w-px -translate-x-1/2 pointer-events-none"
                    style={{ backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.25 }}
                />
                <div
                    className="absolute left-[8%] right-[8%] h-px top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.25 }}
                />
            </div>
        </>
    );
};

export default SWOTGridLayout;
