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

                {/* Main content — full editorial quote treatment */}
                <div className="flex flex-col h-full px-0 pt-0 pb-0">
                    {/* Header bar */}
                    <div className="px-16 pt-14 pb-0 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            TESTIMONIAL
                        </span>
                        {title && (
                            <h1
                                className="text-[48px] font-black leading-[1.1] tracking-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Thick editorial rule */}
                        <div
                            className="h-1 w-full"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* Quote content area */}
                    <div className="flex-1 flex flex-col px-16 py-6 justify-between min-h-0">
                        {/* Large decorative quote marks — 120px, primary color 0.15 opacity */}
                        <div className="relative flex-1 flex flex-col justify-center min-h-0">
                            <div
                                className="absolute top-0 left-0 font-black leading-none pointer-events-none select-none"
                                style={{
                                    fontSize: '120px',
                                    color: 'var(--primary-color, #6366F1)',
                                    opacity: 0.15,
                                    lineHeight: 1,
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                &ldquo;
                            </div>

                            {/* Quote text — left-aligned, large */}
                            {quote && (
                                <p
                                    className="text-[22px] leading-[1.55] pl-12 relative z-10"
                                    style={{
                                        color: 'var(--background-text, #101828)',
                                        fontFamily: 'var(--body-font-family, Inter)',
                                        fontStyle: 'italic',
                                        opacity: 0.9,
                                    }}
                                >
                                    {quote}
                                </p>
                            )}

                            {/* Closing decorative mark */}
                            <div
                                className="absolute bottom-0 right-0 font-black leading-none pointer-events-none select-none"
                                style={{
                                    fontSize: '120px',
                                    color: 'var(--primary-color, #6366F1)',
                                    opacity: 0.15,
                                    lineHeight: 1,
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                &rdquo;
                            </div>
                        </div>

                        {/* Author attribution — bottom, separated by thin rule */}
                        <div
                            className="flex-shrink-0 pt-5 flex items-center gap-6"
                            style={{ borderTop: '1px solid var(--stroke, #E5E7EB)' }}
                        >
                            {/* Author image — square, no rounded corners */}
                            {authorImage && (
                                <img
                                    src={authorImage}
                                    alt={authorName ?? 'Author'}
                                    className="flex-shrink-0 object-cover"
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                    }}
                                />
                            )}

                            {/* Vertical rule */}
                            <div
                                className="w-1 self-stretch flex-shrink-0"
                                style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                            />

                            {/* Author details */}
                            <div className="flex flex-col gap-1">
                                {authorName && (
                                    <span
                                        className="text-[18px] font-black leading-tight tracking-tight"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {authorName}
                                    </span>
                                )}
                                {authorRole && (
                                    <span
                                        className="text-[13px] font-medium uppercase tracking-[0.2em]"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.5, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {authorRole}
                                        {companyName && `, ${companyName}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuoteHighlightLayout;
