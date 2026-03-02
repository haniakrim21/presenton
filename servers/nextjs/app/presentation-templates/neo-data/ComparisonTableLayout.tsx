import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Plan Comparison'),
    description: z.string().max(200).describe('A short description shown below the title').default('Compare our plans side by side to find the right fit for your team.'),
    columns: z.array(z.object({
        name: z.string().max(20).describe('The column header name, e.g. a product or option name'),
        highlighted: z.boolean().describe('Whether this column is highlighted as the recommended option'),
    })).max(4).describe('Up to 4 columns representing products, tiers, or options').default([
        { name: 'Starter', highlighted: false },
        { name: 'Growth', highlighted: true },
        { name: 'Enterprise', highlighted: false },
    ]),
    rows: z.array(z.object({
        feature: z.string().max(40).describe('The name of the feature or criterion for this row'),
        values: z.array(
            z.string().max(20).describe('The value for this column — use checkmark symbols or short text')
        ).describe('One value per column, in the same order as the columns array'),
    })).max(8).describe('Up to 8 feature rows comparing the columns').default([
        { feature: 'Monthly Price', values: ['$29', '$79', 'Custom'] },
        { feature: 'Team Members', values: ['Up to 5', 'Up to 25', 'Unlimited'] },
        { feature: 'Storage', values: ['10 GB', '100 GB', '1 TB'] },
        { feature: 'API Access', values: ['✗', '✓', '✓'] },
        { feature: 'Priority Support', values: ['✗', '✓', '✓'] },
        { feature: 'Custom Integrations', values: ['✗', '✗', '✓'] },
        { feature: 'SLA Guarantee', values: ['✗', '✗', '✓'] },
    ]),
});

export const layoutId = 'comparison-table-layout';
export const layoutName = 'Comparison Table';
export const layoutDescription = 'Feature comparison table for products or options';

const ComparisonTableLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, description, columns, rows } = data;

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
                            {columns?.length ?? 0} OPTIONS · {rows?.length ?? 0} CRITERIA
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>COMPARISON MATRIX</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {description && <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{description}</span>}
                    </div>

                    {/* Dense dashboard table */}
                    <div
                        className="flex-1 flex flex-col min-h-0 overflow-hidden rounded"
                        style={{ border: '1px dashed var(--stroke, #E5E7EB)' }}
                    >
                        {/* Header row */}
                        <div
                            className="flex flex-shrink-0"
                            style={{ borderBottom: '1px dashed var(--stroke, #E5E7EB)' }}
                        >
                            {/* Feature label cell */}
                            <div
                                className="flex items-center px-3 py-2"
                                style={{
                                    width: '26%',
                                    minWidth: '140px',
                                    borderRight: '1px dashed var(--stroke, #E5E7EB)',
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                }}
                            >
                                <span
                                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.4, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    FEATURE
                                </span>
                            </div>

                            {/* Column headers */}
                            {columns?.map((col, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="flex flex-1 items-center justify-center px-3 py-2 gap-1.5"
                                    style={{
                                        backgroundColor: col.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--card-color, #F3F4F6)',
                                        borderRight: colIndex < (columns?.length ?? 0) - 1 ? '1px dashed var(--stroke, #E5E7EB)' : 'none',
                                    }}
                                >
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-[0.15em]"
                                        style={{
                                            color: col.highlighted ? 'var(--primary-text, #FFFFFF)' : 'var(--background-text, #101828)',
                                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        }}
                                    >
                                        {col.name}
                                    </span>
                                    {col.highlighted && (
                                        <span
                                            className="text-[8px] font-bold px-1 py-0.5 rounded"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            REC
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Body rows */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {rows?.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex flex-1 min-h-0"
                                    style={{
                                        borderBottom: rowIndex < (rows?.length ?? 0) - 1 ? '1px dashed var(--stroke, #E5E7EB)' : 'none',
                                    }}
                                >
                                    {/* Feature name cell */}
                                    <div
                                        className="flex items-center px-3"
                                        style={{
                                            width: '26%',
                                            minWidth: '140px',
                                            borderRight: '1px dashed var(--stroke, #E5E7EB)',
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                            />
                                            <span
                                                className="text-[11px] font-medium"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {row.feature}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Value cells */}
                                    {columns?.map((col, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="flex flex-1 items-center justify-center px-3"
                                            style={{
                                                borderRight: colIndex < (columns?.length ?? 0) - 1 ? '1px dashed var(--stroke, #E5E7EB)' : 'none',
                                                backgroundColor: col.highlighted ? 'rgba(99,102,241,0.04)' : 'transparent',
                                            }}
                                        >
                                            <span
                                                className="text-[11px] font-medium"
                                                style={{
                                                    color: col.highlighted
                                                        ? 'var(--primary-color, #6366F1)'
                                                        : 'var(--background-text, #101828)',
                                                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                                    opacity: col.highlighted ? 1 : 0.7,
                                                }}
                                            >
                                                {row.values?.[colIndex] ?? '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComparisonTableLayout;
