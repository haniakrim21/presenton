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
                        <div
                            className="w-1 h-1 rounded-full mt-3 mb-4"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {description && (
                            <p
                                className="text-[13px] font-light leading-loose max-w-[460px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Table — no visible outer border, rows separated by thin 1px at opacity 0.2 */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Header row */}
                        <div className="flex flex-shrink-0 pb-4">
                            {/* Feature column header */}
                            <div
                                className="flex items-end px-0 pb-2"
                                style={{ width: '28%', minWidth: '140px' }}
                            >
                                <span
                                    className="text-[11px] font-light uppercase tracking-widest"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.3, fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.12em' }}
                                >
                                    Feature
                                </span>
                            </div>

                            {/* Column headers */}
                            {columns?.map((col, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="flex flex-1 items-end justify-center px-4 pb-2"
                                >
                                    <span
                                        className="text-[14px] font-medium tracking-wide"
                                        style={{
                                            color: col.highlighted
                                                ? 'var(--primary-color, #6366F1)'
                                                : 'var(--background-text, #101828)',
                                            fontFamily: 'var(--heading-font-family, Inter)',
                                            opacity: col.highlighted ? 1 : 0.45,
                                        }}
                                    >
                                        {col.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Body rows */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {rows?.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex flex-1"
                                    style={{
                                        borderTop: '1px solid var(--stroke, #E5E7EB)',
                                        opacity: 1,
                                    }}
                                >
                                    {/* Feature name cell */}
                                    <div
                                        className="flex items-center px-0"
                                        style={{ width: '28%', minWidth: '140px' }}
                                    >
                                        <span
                                            className="text-[13px] font-light"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {row.feature}
                                        </span>
                                    </div>

                                    {/* Value cells */}
                                    {columns?.map((col, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="flex flex-1 items-center justify-center px-4"
                                        >
                                            <span
                                                className="text-[14px] font-light"
                                                style={{
                                                    color: col.highlighted
                                                        ? 'var(--primary-color, #6366F1)'
                                                        : 'var(--background-text, #101828)',
                                                    fontFamily: 'var(--body-font-family, Inter)',
                                                    opacity: col.highlighted ? 0.9 : 0.5,
                                                }}
                                            >
                                                {row.values?.[colIndex] ?? '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {/* Final bottom rule */}
                            <div
                                className="h-px w-full flex-shrink-0"
                                style={{ borderTop: '1px solid var(--stroke, #E5E7EB)', opacity: 0.2 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComparisonTableLayout;
