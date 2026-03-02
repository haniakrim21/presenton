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

    // Badge labels for each quadrant
    const quadrantMeta = [
        { code: 'S', shortLabel: 'INT / POS' },
        { code: 'W', shortLabel: 'INT / NEG' },
        { code: 'O', shortLabel: 'EXT / POS' },
        { code: 'T', shortLabel: 'EXT / NEG' },
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
                            4 QUADRANTS
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>STRATEGIC FRAMEWORK</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>S · W · O · T</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>Internal / External Analysis</span>
                    </div>

                    {/* 2x2 SWOT Grid */}
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-0">
                        {quadrants?.map((quadrant, index) => (
                            <div
                                key={index}
                                className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    border: '1px dashed var(--stroke, #E5E7EB)',
                                }}
                            >
                                {/* Quadrant header: badge + label */}
                                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                                    <span
                                        className="inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-bold flex-shrink-0"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            color: 'var(--primary-text, #FFFFFF)',
                                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        }}
                                    >
                                        {quadrantMeta[index]?.code}
                                    </span>
                                    <h3
                                        className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {quadrant.label}
                                    </h3>
                                    <span
                                        className="ml-auto text-[9px] font-bold uppercase"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {quadrantMeta[index]?.shortLabel}
                                    </span>
                                </div>

                                {/* Thin separator */}
                                <div
                                    className="w-full mb-1.5 flex-shrink-0"
                                    style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }}
                                />

                                {/* Bullet items */}
                                <ul className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                                    {quadrant.items?.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-2">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[4px]"
                                                style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                            />
                                            <span
                                                className="text-[11px] leading-[1.5]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Item count */}
                                <div className="mt-1.5 flex-shrink-0">
                                    <span
                                        className="text-[9px] font-bold"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.3, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {quadrant.items?.length ?? 0} ITEMS
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SWOTGridLayout;
