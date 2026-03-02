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
                    <div className="mb-6 flex-shrink-0 max-w-[960px] mx-auto w-full">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)' }}
                        >
                            TESTIMONIAL
                        </span>
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Flat quote card — centered vertically in remaining space */}
                    <div className="flex-1 flex items-center max-w-[960px] mx-auto w-full">
                        <div
                            className="w-full rounded-xl px-10 py-8 flex flex-col justify-between"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                            }}
                        >
                            {/* Quote text — no decorative quotation marks */}
                            {quote && (
                                <p
                                    className="text-[20px] leading-[1.6] mb-8 flex-1"
                                    style={{
                                        color: 'var(--background-text, #101828)',
                                        fontFamily: 'var(--body-font-family, Inter)',
                                        opacity: 0.85,
                                    }}
                                >
                                    {quote}
                                </p>
                            )}

                            {/* Author attribution — pill badge with dot separators */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                {/* Author image — no border */}
                                {authorImage && (
                                    <img
                                        src={authorImage}
                                        alt={authorName ?? 'Author'}
                                        className="flex-shrink-0 rounded-full object-cover"
                                        style={{
                                            width: '52px',
                                            height: '52px',
                                        }}
                                    />
                                )}

                                {/* Attribution pill */}
                                <span
                                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold gap-2"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)' }}
                                >
                                    {authorName && <span>{authorName}</span>}
                                    {authorName && (authorRole || companyName) && <span style={{ opacity: 0.6 }}>·</span>}
                                    {authorRole && <span style={{ opacity: 0.85 }}>{authorRole}</span>}
                                    {authorRole && companyName && <span style={{ opacity: 0.6 }}>·</span>}
                                    {companyName && <span style={{ opacity: 0.85 }}>{companyName}</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuoteHighlightLayout;
