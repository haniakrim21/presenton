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
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[36px] font-bold leading-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Glowing accent line */}
                        <div
                            className="w-24"
                            style={{
                                height: '3px',
                                background: 'var(--primary-color, #6366F1)',
                                boxShadow: '0 0 12px var(--primary-color, #6366F1)',
                            }}
                        />
                    </div>

                    {/* Quote card — inverted panel */}
                    <div className="flex-1 flex items-center">
                        <div
                            className="w-full rounded-lg px-10 py-8 flex flex-col justify-between"
                            style={{
                                backgroundColor: 'var(--primary-color, #6366F1)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Opening quotation mark with glow */}
                            <div className="mb-4 flex-shrink-0" style={{ height: '48px', display: 'flex', alignItems: 'flex-start' }}>
                                <span
                                    style={{
                                        fontSize: '60px',
                                        lineHeight: 1,
                                        fontFamily: 'Georgia, serif',
                                        color: 'var(--primary-text, #ffffff)',
                                        textShadow: '0 0 20px var(--primary-color, #6366F1)',
                                        opacity: 0.9,
                                    }}
                                >
                                    &ldquo;
                                </span>
                            </div>

                            {/* Quote text */}
                            {quote && (
                                <p
                                    className="text-[22px] italic leading-[1.55] mb-8 flex-1"
                                    style={{
                                        color: 'var(--primary-text, #ffffff)',
                                        fontFamily: 'var(--body-font-family, Inter)',
                                        opacity: 0.9,
                                    }}
                                >
                                    {quote}
                                </p>
                            )}

                            {/* Author attribution */}
                            <div className="flex items-center gap-5 flex-shrink-0">
                                {/* Author image with inset glow ring */}
                                {authorImage && (
                                    <img
                                        src={authorImage}
                                        alt={authorName ?? 'Author'}
                                        className="flex-shrink-0 rounded-full object-cover"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            boxShadow: '0 0 0 3px rgba(255,255,255,0.3)',
                                        }}
                                    />
                                )}

                                {/* Vertical divider */}
                                <div
                                    className="flex-shrink-0 w-[3px] rounded-full self-stretch"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
                                />

                                {/* Author details */}
                                <div className="flex flex-col gap-[2px]">
                                    {authorName && (
                                        <span
                                            className="text-[16px] font-bold leading-tight"
                                            style={{ color: 'var(--primary-text, #ffffff)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {authorName}
                                        </span>
                                    )}
                                    {authorRole && (
                                        <span
                                            className="text-[13px] leading-tight"
                                            style={{ color: 'var(--primary-text, #ffffff)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {authorRole}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span
                                            className="text-[13px] font-semibold leading-tight"
                                            style={{ color: 'var(--primary-text, #ffffff)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
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
