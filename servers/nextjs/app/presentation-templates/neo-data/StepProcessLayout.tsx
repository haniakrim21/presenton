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
                        {steps && (
                            <span
                                className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-1"
                                style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                            >
                                {steps.length} STEPS
                            </span>
                        )}
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-4 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>PROCESS FLOW</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {description && <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{description}</span>}
                    </div>

                    {/* Steps grid — 4-col if 4 steps, else flex */}
                    <div
                        className="flex-1 grid gap-2 min-h-0"
                        style={{ gridTemplateColumns: `repeat(${Math.min(steps?.length ?? 4, 4)}, 1fr)` }}
                    >
                        {steps?.map((step, index) => (
                            <div
                                key={index}
                                className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    border: '1px dashed var(--stroke, #E5E7EB)',
                                }}
                            >
                                {/* Step number badge + progress dots */}
                                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                                    <span
                                        className="inline-flex items-center justify-center w-7 h-7 rounded text-[13px] font-bold flex-shrink-0"
                                        style={{
                                            backgroundColor: 'var(--primary-color, #6366F1)',
                                            color: 'var(--primary-text, #FFFFFF)',
                                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        }}
                                    >
                                        {step.number}
                                    </span>
                                    {/* Progress dots */}
                                    <div className="flex items-center gap-1">
                                        {steps.map((_, dotIdx) => (
                                            <span
                                                key={dotIdx}
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor: dotIdx <= index
                                                        ? 'var(--primary-color, #6366F1)'
                                                        : 'var(--stroke, #E5E7EB)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Thin separator */}
                                <div
                                    className="w-full mb-2 flex-shrink-0"
                                    style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }}
                                />

                                {/* Step title */}
                                {step.title && (
                                    <h3
                                        className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5 flex-shrink-0"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {step.title}
                                    </h3>
                                )}

                                {/* Step description */}
                                {step.description && (
                                    <p
                                        className="text-[11px] leading-[1.5] flex-1"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {step.description}
                                    </p>
                                )}

                                {/* Step index label at bottom */}
                                <div className="mt-2 flex-shrink-0">
                                    <span
                                        className="text-[9px] font-bold uppercase tracking-[0.15em]"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        STEP {index + 1} / {steps.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepProcessLayout;
