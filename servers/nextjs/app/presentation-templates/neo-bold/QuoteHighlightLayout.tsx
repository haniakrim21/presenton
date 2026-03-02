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
                <div className="flex flex-col h-full px-14 pt-10 pb-8">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[42px] font-extrabold leading-tight"
                                style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Heavy accent bar */}
                        <div
                            className="h-[8px] w-20 rounded-full mt-2"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* Quote card — centered vertically in remaining space */}
                    <div className="flex-1 flex items-center">
                        <div
                            className="w-full rounded-xl px-10 py-8 flex flex-col justify-between shadow-xl"
                            style={{
                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                borderTop: '6px solid var(--primary-color, #6366F1)',
                            }}
                        >
                            {/* Oversized 80px quote mark */}
                            <div className="mb-2 flex-shrink-0" style={{ height: '64px', overflow: 'visible' }}>
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <text
                                        x="0"
                                        y="72"
                                        fontSize="120"
                                        fontFamily="Georgia, serif"
                                        style={{ fill: 'var(--primary-color, #6366F1)' }}
                                        opacity="0.9"
                                    >
                                        &ldquo;
                                    </text>
                                </svg>
                            </div>

                            {/* Quote text — 22px italic font-medium */}
                            {quote && (
                                <p
                                    className="text-[22px] font-medium italic leading-[1.55] mb-8 flex-1"
                                    style={{
                                        color: 'var(--background-text, #101828)',
                                        fontFamily: 'var(--body-font-family, Inter)',
                                        opacity: 0.88,
                                    }}
                                >
                                    {quote}
                                </p>
                            )}

                            {/* Author attribution card — shadow-xl */}
                            <div
                                className="flex items-center gap-5 flex-shrink-0 rounded-xl px-5 py-4 shadow-xl"
                                style={{
                                    backgroundColor: 'var(--background-color, #ffffff)',
                                    borderLeft: '6px solid var(--primary-color, #6366F1)',
                                }}
                            >
                                {/* Author image with thick primary ring */}
                                {authorImage && (
                                    <img
                                        src={authorImage}
                                        alt={authorName ?? 'Author'}
                                        className="flex-shrink-0 rounded-full object-cover"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            border: '4px solid var(--primary-color, #6366F1)',
                                        }}
                                    />
                                )}

                                {/* Author details */}
                                <div className="flex flex-col gap-[3px]">
                                    {authorName && (
                                        <span
                                            className="font-extrabold leading-tight"
                                            style={{ fontSize: '18px', color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {authorName}
                                        </span>
                                    )}
                                    {authorRole && (
                                        <span
                                            className="text-[13px] font-medium leading-tight"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {authorRole}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span
                                            className="text-[13px] font-bold uppercase tracking-wide leading-tight"
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
