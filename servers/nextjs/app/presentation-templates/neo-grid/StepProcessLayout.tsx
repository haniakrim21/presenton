import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Our Process'),
    description: z.string().max(200).describe('A short description of the process shown on the slide').default('A step-by-step guide to our approach'),
    steps: z.array(z.object({
        number: z.string().max(2).describe('The step number or short label, e.g. 01'),
        title: z.string().max(30).describe('The title of this step'),
        description: z.string().max(120).describe('A short description of what happens in this step'),
    })).max(5).describe('A list of up to 5 process steps shown horizontally').default([
        { number: '01', title: 'Discovery', description: 'We identify your core challenges, goals, and opportunities through deep research and stakeholder interviews.' },
        { number: '02', title: 'Strategy', description: 'We craft a tailored roadmap aligned with your business objectives and technical constraints.' },
        { number: '03', title: 'Execution', description: 'Our team delivers fast, iterative cycles with clear milestones and transparent communication.' },
        { number: '04', title: 'Launch', description: 'We ship with confidence, providing end-to-end support through deployment and beyond.' },
    ]),
});

export const layoutId = 'step-process-layout';
export const layoutName = 'Step Process';
export const layoutDescription = 'Numbered horizontal steps with descriptions for process flows';

const StepProcessLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, description, steps } = data;

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
                    <div className="mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                    display: 'inline-block',
                                    paddingBottom: '6px',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p
                                className="text-[13px] leading-relaxed max-w-[560px] mt-3"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Steps — strict bordered grid, table-style with visible cell borders */}
                    <div className="flex-1 flex items-stretch min-h-0">
                        <div
                            className="w-full flex"
                            style={{ border: '1px solid var(--stroke, #E5E7EB)' }}
                        >
                            {steps?.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex-1 flex flex-col px-5 py-5"
                                    style={{
                                        backgroundColor: 'var(--card-color, #F3F4F6)',
                                        borderRight: index < (steps?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                    }}
                                >
                                    {/* Square number badge */}
                                    <div
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center mb-4"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            borderRadius: 0,
                                        }}
                                    >
                                        <span
                                            className="text-[13px] font-bold"
                                            style={{ color: 'var(--primary-text, #FFFFFF)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Full-width 1px separator */}
                                    <div
                                        className="w-full mb-3 flex-shrink-0"
                                        style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />

                                    {step.title && (
                                        <h3
                                            className="text-[15px] font-bold mb-2 leading-tight tracking-wide"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {step.title}
                                        </h3>
                                    )}
                                    {step.description && (
                                        <p
                                            className="text-[13px] leading-[1.55] flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepProcessLayout;
