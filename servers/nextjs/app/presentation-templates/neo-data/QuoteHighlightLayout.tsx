import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('What Our Clients Say'),
    quote: z.string().max(300).describe('The testimonial quote text').default('Working with this team transformed the way we approach product development. Their clarity of thinking and speed of execution are unlike anything we have experienced before.'),
    authorName: z.string().max(40).describe('The full name of the person being quoted').default('Sarah Mitchell'),
    authorRole: z.string().max(60).describe('The job title or role of the person being quoted').default('Chief Product Officer'),
    authorImage: z.string().describe('URL of the author profile image').default('https://i.pravatar.cc/120?img=47'),
    companyName: z.string().max(40).describe('The name of the company the author represents').default('Meridian Technologies'),
});

export const layoutId = 'quote-highlight-layout';
export const layoutName = 'Quote Highlight';
export const layoutDescription = 'Testimonial quote with author image and attribution';

const QuoteHighlightLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, quote, authorName, authorRole, authorImage, companyName } = data;

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
                            TESTIMONIAL
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-4 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>CUSTOMER QUOTE</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {companyName && (
                            <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{companyName}</span>
                        )}
                    </div>

                    {/* Two-column layout: quote on left, attribution on right */}
                    <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">

                        {/* Quote card — spans 3 cols */}
                        <div
                            className="col-span-3 rounded px-3 py-2.5 flex flex-col overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            {/* Monospace quote mark */}
                            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                                <span
                                    className="text-[28px] font-light leading-none"
                                    style={{
                                        color: 'var(--primary-color, #6366F1)',
                                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        lineHeight: 1,
                                    }}
                                >
                                    &ldquo;
                                </span>
                                <span
                                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    VERBATIM
                                </span>
                            </div>

                            {/* Thin separator */}
                            <div className="w-full mb-2 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />

                            {/* Quote text */}
                            {quote && (
                                <p
                                    className="text-[13px] leading-[1.6] flex-1"
                                    style={{
                                        color: 'var(--background-text, #101828)',
                                        opacity: 0.8,
                                        fontFamily: 'var(--body-font-family, Inter)',
                                    }}
                                >
                                    {quote}
                                </p>
                            )}
                        </div>

                        {/* Attribution card — spans 1 col */}
                        <div
                            className="rounded px-3 py-2.5 flex flex-col items-center justify-center overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                border: '1px dashed var(--stroke, #E5E7EB)',
                            }}
                        >
                            <span
                                className="text-[9px] font-bold uppercase tracking-[0.15em] mb-3 self-start"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                            >
                                SOURCE
                            </span>

                            {/* Author image */}
                            {authorImage && (
                                <div
                                    className="w-12 h-12 rounded overflow-hidden flex-shrink-0 mb-2"
                                    style={{ border: '1px dashed var(--primary-color, #6366F1)' }}
                                >
                                    <img
                                        src={authorImage}
                                        alt={authorName ?? 'Author'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Thin separator */}
                            <div className="w-full mb-2" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />

                            {/* Author name */}
                            {authorName && (
                                <span
                                    className="text-[11px] font-bold text-center leading-tight mb-1 block"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {authorName}
                                </span>
                            )}

                            {/* Role */}
                            {authorRole && (
                                <span
                                    className="text-[10px] text-center block mb-1"
                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {authorRole}
                                </span>
                            )}

                            {/* Company badge */}
                            {companyName && (
                                <span
                                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-center mt-1"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                >
                                    {companyName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuoteHighlightLayout;
