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
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight tracking-wide pb-2"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                    display: 'inline-block',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Full 1px border around quote card */}
                    <div className="flex-1 flex items-center">
                        <div
                            className="w-full flex flex-col"
                            style={{
                                border: '1px solid var(--stroke, #E5E7EB)',
                                borderRadius: 0,
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                            }}
                        >
                            {/* Quote body */}
                            <div className="flex-1 px-10 pt-8 pb-6 flex items-start gap-6">
                                {/* Left: large geometric quote mark — angular SVG */}
                                <div className="flex-shrink-0 mt-1">
                                    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0" y="0" width="14" height="14" style={{ fill: 'var(--primary-color, #6366F1)' }} />
                                        <rect x="0" y="14" width="14" height="14" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.35 }} />
                                        <rect x="18" y="0" width="14" height="14" style={{ fill: 'var(--primary-color, #6366F1)' }} />
                                        <rect x="18" y="14" width="14" height="14" style={{ fill: 'var(--primary-color, #6366F1)', opacity: 0.35 }} />
                                    </svg>
                                </div>

                                {/* Quote text */}
                                {quote && (
                                    <p
                                        className="text-[20px] leading-[1.6] flex-1"
                                        style={{
                                            color: 'var(--background-text, #101828)',
                                            fontFamily: 'var(--body-font-family, Inter)',
                                            opacity: 0.88,
                                        }}
                                    >
                                        {quote}
                                    </p>
                                )}
                            </div>

                            {/* Author section below with top border separator */}
                            <div
                                className="flex items-center gap-5 px-10 py-5 flex-shrink-0"
                                style={{ borderTop: '1px solid var(--stroke, #E5E7EB)' }}
                            >
                                {/* Author image — square frame */}
                                {authorImage && (
                                    <div
                                        className="flex-shrink-0 overflow-hidden"
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: 0,
                                            border: '1px solid var(--stroke, #E5E7EB)',
                                        }}
                                    >
                                        <img
                                            src={authorImage}
                                            alt={authorName ?? 'Author'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* 2px vertical accent bar */}
                                <div
                                    className="flex-shrink-0 self-stretch"
                                    style={{ width: '2px', backgroundColor: 'var(--primary-color, #6366F1)' }}
                                />

                                {/* Author details */}
                                <div className="flex flex-col gap-[3px]">
                                    {authorName && (
                                        <span
                                            className="text-[15px] font-bold leading-tight tracking-wide"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {authorName}
                                        </span>
                                    )}
                                    {authorRole && (
                                        <span
                                            className="text-[11px] uppercase tracking-widest leading-tight"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)', letterSpacing: '0.08em' }}
                                        >
                                            {authorRole}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span
                                            className="text-[12px] font-semibold leading-tight tracking-wide"
                                            style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {companyName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuoteHighlightLayout;
