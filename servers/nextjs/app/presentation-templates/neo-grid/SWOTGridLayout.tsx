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
                                className="text-[32px] font-bold leading-tight"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                    display: 'inline-block',
                                    paddingBottom: '6px',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Sharp 2x2 grid with visible 1px grid lines between quadrants */}
                    <div
                        className="flex-1 grid grid-cols-2 grid-rows-2 min-h-0"
                        style={{ border: '1px solid var(--stroke, #E5E7EB)' }}
                    >
                        {quadrants?.map((quadrant, index) => (
                            <div
                                key={index}
                                className="flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    borderRight: index % 2 === 0 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                    borderBottom: index < 2 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                }}
                            >
                                {/* Label row with square colored indicator in top-left corner */}
                                <div
                                    className="flex items-center gap-3 px-5 py-2 flex-shrink-0"
                                    style={{ borderBottom: '1px solid var(--stroke, #E5E7EB)' }}
                                >
                                    {/* Square colored indicator */}
                                    <div
                                        className="flex-shrink-0"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            borderRadius: 0,
                                        }}
                                    />
                                    <h3
                                        className="text-[12px] font-bold uppercase tracking-widest"
                                        style={{
                                            color: 'var(--primary-color, #6366F1)',
                                            fontFamily: 'var(--heading-font-family, Inter)',
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        {quadrant.label}
                                    </h3>
                                </div>

                                {/* Bullet items */}
                                <ul className="flex flex-col gap-[6px] flex-1 overflow-hidden px-5 py-3">
                                    {quadrant.items?.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-2">
                                            {/* Square bullet */}
                                            <span
                                                className="flex-shrink-0 mt-[6px]"
                                                style={{
                                                    width: '4px',
                                                    height: '4px',
                                                    backgroundColor: 'var(--primary-color, #6366F1)',
                                                    borderRadius: 0,
                                                }}
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
