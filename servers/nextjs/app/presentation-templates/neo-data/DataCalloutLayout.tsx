import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Customer Success'),
    statValue: z.string().max(10).describe('The large featured statistic value, e.g. 98%').default('98%'),
    statLabel: z.string().max(40).describe('A short label describing what the statistic represents').default('Customer Satisfaction Score'),
    description: z.string().max(200).describe('Supporting context or explanation of the statistic').default('Based on over 4,200 responses collected across enterprise and mid-market accounts in the trailing twelve months.'),
    highlights: z.array(
        z.string().max(80).describe('A short highlight or supporting data point')
    ).max(4).describe('Up to 4 supporting highlights shown as a horizontal row of bullet points').default([
        'NPS score of 72, top quartile in SaaS',
        '< 2 hour average support response time',
        '94% renewal rate year over year',
        '3.2x average account expansion',
    ]),
});

export const layoutId = 'data-callout-layout';
export const layoutName = 'Data Callout';
export const layoutDescription = 'Large centered statistic with supporting context and bullet points';

const DataCalloutLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, statValue, statLabel, description, highlights } = data;

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
                            KEY METRIC
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-4 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>DATA CALLOUT</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{highlights?.length ?? 0} SUPPORTING METRICS</span>
                    </div>

                    {/* Two-column layout: big stat on left, context + highlights on right */}
                    <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">

                        {/* Left: Giant monospace stat card — spans 2 cols */}
                        <div
                            className="col-span-2 rounded px-3 py-2.5 flex flex-col justify-center items-center overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            {statValue && (
                                <span
                                    className="font-light leading-none mb-2"
                                    style={{
                                        fontSize: '72px',
                                        color: 'var(--primary-color, #6366F1)',
                                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        lineHeight: 1,
                                    }}
                                >
                                    {statValue}
                                </span>
                            )}
                            {/* Thin separator */}
                            <div className="w-16 mb-2" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                            {statLabel && (
                                <p
                                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-center"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    {statLabel}
                                </p>
                            )}
                        </div>

                        {/* Right: Description + highlights — spans 2 cols */}
                        <div className="col-span-2 flex flex-col gap-2 min-h-0">
                            {/* Description card */}
                            {description && (
                                <div
                                    className="rounded px-3 py-2.5 flex-shrink-0"
                                    style={{
                                        backgroundColor: 'var(--card-color, #F3F4F6)',
                                        border: '1px dashed var(--stroke, #E5E7EB)',
                                    }}
                                >
                                    <span
                                        className="text-[9px] font-bold uppercase tracking-[0.15em] block mb-1.5"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        CONTEXT
                                    </span>
                                    <p
                                        className="text-[11px] leading-[1.5]"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {description}
                                    </p>
                                </div>
                            )}

                            {/* Highlights — 2x2 compact grid */}
                            {highlights && highlights.length > 0 && (
                                <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
                                    {highlights.map((highlight, index) => (
                                        <div
                                            key={index}
                                            className="rounded px-3 py-2.5 flex items-start gap-2 overflow-hidden"
                                            style={{
                                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                                border: '1px dashed var(--stroke, #E5E7EB)',
                                            }}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[4px]"
                                                style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                            />
                                            <span
                                                className="text-[11px] leading-[1.5]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {highlight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataCalloutLayout;
