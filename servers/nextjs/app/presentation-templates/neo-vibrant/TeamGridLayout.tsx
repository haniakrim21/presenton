import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Meet the Team'),
    subtitle: z.string().max(200).describe('A short subtitle or description shown beneath the title').default('The people behind our mission — passionate experts driving meaningful results every day'),
    members: z.array(z.object({
        name: z.string().max(30).describe('The full name of the team member'),
        role: z.string().max(40).describe('The job title or role of the team member'),
        image: z.string().describe('URL to the team member profile image').default('https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Team+Member'),
        description: z.string().max(80).describe('A short one-liner about this team member'),
    })).max(9).describe('A list of up to 9 team members displayed in a 3-column grid').default([
        { name: 'Sarah Chen', role: 'Chief Executive Officer', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Sarah+Chen', description: '15 years scaling B2B SaaS from seed to exit across three continents.' },
        { name: 'Marcus Rivera', role: 'Chief Technology Officer', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Marcus+Rivera', description: 'Ex-Google engineer, led infrastructure serving 200M daily active users.' },
        { name: 'Priya Nair', role: 'VP of Product', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Priya+Nair', description: 'Product leader with a track record of 0-to-1 launches in enterprise software.' },
        { name: 'James Okafor', role: 'Head of Design', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=James+Okafor', description: 'Award-winning UX designer focused on simplicity and accessibility at scale.' },
        { name: 'Lena Hoffmann', role: 'VP of Sales', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Lena+Hoffmann', description: 'Closed $40M in ARR over four years, building repeatable sales motions.' },
        { name: 'David Park', role: 'Head of Engineering', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=David+Park', description: 'Full-stack architect passionate about developer experience and system reliability.' },
    ]),
});

export const layoutId = 'team-grid-layout';
export const layoutName = 'Team Grid';
export const layoutDescription = 'Grid of team member cards with roles and descriptions';

const TeamGridLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, subtitle, members } = data;

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
                <div className="flex flex-col h-full px-14 pt-12 pb-10">
                    {/* Header */}
                    <div className="mb-5 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[38px] font-extrabold leading-tight mb-1"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Gradient accent bar */}
                        <div
                            className="h-[6px] w-28 rounded-full mt-2 mb-3"
                            style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color)44)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[14px] leading-relaxed max-w-[600px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Team grid */}
                    <div className="flex-1 grid grid-cols-3 gap-4 min-h-0 overflow-hidden">
                        {members?.map((member, index) => (
                            <div
                                key={index}
                                className="rounded-2xl overflow-hidden flex flex-col items-center text-center"
                                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                            >
                                {/* Two-tone header band with avatar */}
                                <div
                                    className="w-full flex flex-col items-center pt-4 pb-3 px-4"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                >
                                    {/* Avatar — 72px rounded-2xl (square-ish), 3px primary border */}
                                    <div
                                        className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0"
                                        style={{
                                            border: '3px solid rgba(255,255,255,0.7)',
                                        }}
                                    >
                                        <img
                                            src={member.image || 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Team+Member'}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=${encodeURIComponent(member.name || 'TM')}`;
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Card body */}
                                <div
                                    className="flex flex-col flex-1 items-center px-4 py-3"
                                    style={{ backgroundColor: 'var(--card-color, #F3F4F6)' }}
                                >
                                    {/* Name */}
                                    {member.name && (
                                        <h3
                                            className="text-[14px] font-bold leading-tight mb-1"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {member.name}
                                        </h3>
                                    )}

                                    {/* Role as pill label */}
                                    {member.role && (
                                        <span
                                            className="text-[10px] font-semibold rounded-full px-3 py-0.5 mb-2"
                                            style={{
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                color: 'var(--primary-text, #FFFFFF)',
                                                fontFamily: 'var(--body-font-family, Inter)',
                                                opacity: 0.12,
                                            }}
                                        >
                                            {member.role}
                                        </span>
                                    )}
                                    {member.role && (
                                        <span
                                            className="text-[10px] font-semibold rounded-full px-3 py-0.5 mb-2 -mt-[24px]"
                                            style={{
                                                color: 'var(--primary-color, #6366F1)',
                                                fontFamily: 'var(--body-font-family, Inter)',
                                            }}
                                        >
                                            {member.role}
                                        </span>
                                    )}

                                    {/* Description */}
                                    {member.description && (
                                        <p
                                            className="text-[11px] leading-relaxed flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {member.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamGridLayout;
