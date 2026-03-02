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

                {/* Decorative floating circle */}
                <div
                    className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full pointer-events-none"
                    style={{ backgroundColor: 'var(--primary-color)', opacity: 0.05 }}
                />

                {/* Main content */}
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header */}
                    <div className="mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[38px] font-extrabold leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Gradient accent bar */}
                        <div
                            className="h-[6px] w-28 rounded-full mt-2"
                            style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color)44)' }}
                        />
                    </div>

                    {/* Quote card — centered vertically in remaining space */}
                    <div className="flex-1 flex items-center">
                        <div
                            className="w-full rounded-2xl px-10 py-8 flex flex-col justify-between relative overflow-hidden"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            }}
                        >
                            {/* VERY large decorative quote mark — absolute, opacity 0.15 */}
                            <div
                                className="absolute top-0 left-4 pointer-events-none select-none"
                                style={{
                                    fontSize: '100px',
                                    fontFamily: 'Georgia, serif',
                                    lineHeight: 1,
                                    color: 'var(--primary-color, #6366F1)',
                                    opacity: 0.15,
                                }}
                            >
                                &ldquo;
                            </div>

                            {/* Quote text — with gradient highlight bg */}
                            {quote && (
                                <div
                                    className="relative z-10 rounded-2xl px-6 py-4 mb-6 flex-1"
                                    style={{
                                        background: 'linear-gradient(90deg, var(--primary-color)1a, transparent)',
                                    }}
                                >
                                    <p
                                        className="text-[22px] italic leading-relaxed"
                                        style={{
                                            color: 'var(--background-text, #101828)',
                                            fontFamily: 'var(--body-font-family, Inter)',
                                            opacity: 0.88,
                                        }}
                                    >
                                        {quote}
                                    </p>
                                </div>
                            )}

                            {/* Author attribution */}
                            <div className="flex items-center gap-5 flex-shrink-0 relative z-10">
                                {/* Author image — rounded-2xl avatar */}
                                {authorImage && (
                                    <img
                                        src={authorImage}
                                        alt={authorName ?? 'Author'}
                                        className="flex-shrink-0 object-cover rounded-2xl"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            border: '3px solid var(--primary-color, #6366F1)',
                                        }}
                                    />
                                )}

                                {/* Vertical divider */}
                                <div
                                    className="flex-shrink-0 w-[3px] rounded-full self-stretch"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                />

                                {/* Author details */}
                                <div className="flex flex-col gap-[2px]">
                                    {authorName && (
                                        <span
                                            className="text-[16px] font-bold leading-tight"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {authorName}
                                        </span>
                                    )}
                                    {authorRole && (
                                        <span
                                            className="text-[13px] leading-tight"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {authorRole}
                                        </span>
                                    )}
                                    {/* Company as pill label */}
                                    {companyName && (
                                        <span
                                            className="text-[12px] font-semibold rounded-full px-3 py-0.5 w-fit mt-1"
                                            style={{
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                color: 'var(--primary-text, #FFFFFF)',
                                                fontFamily: 'var(--body-font-family, Inter)',
                                                opacity: 0.12,
                                            }}
                                        >
                                            {companyName}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span
                                            className="text-[12px] font-semibold rounded-full px-3 py-0.5 w-fit -mt-[24px]"
                                            style={{
                                                color: 'var(--primary-color, #6366F1)',
                                                fontFamily: 'var(--body-font-family, Inter)',
                                            }}
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
