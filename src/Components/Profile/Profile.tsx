import { Avatar, Button, Divider, FileButton, FileInput, Overlay, RingProgress, Text, Modal } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Info from "./Info";
import { changeProfile } from "../../Slices/ProfileSlice";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Certification from "./Certifications";
import { useHover } from "@mantine/hooks";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { IconFileUpload, IconSparkles, IconCamera, IconFileText, IconPrinter } from "@tabler/icons-react";
import { getBase64 } from "../../Services/Utilities";
import { parseResume } from "../../Services/AiService";
import { WEBSITE_CONFIG } from "../../config";

const getProfileCompletion = (profile: any, isEmployer: boolean) => {
    let score = 0;
    if (isEmployer) {
        // Employers only need basic company info
        if (profile.name) score += 25;
        if (profile.company) score += 25;
        if (profile.location) score += 25;
        if (profile.about) score += 25;
    } else {
        // Applicants need a full resume
        if (profile.name) score += 10;
        if (profile.jobTitle) score += 10;
        if (profile.company) score += 10;
        if (profile.location) score += 10;
        if (profile.about) score += 15;
        if (profile.skills?.length > 0) score += 20;
        if (profile.experiences?.length > 0 || profile.experience?.length > 0) score += 15;
        if (profile.certifications?.length > 0) score += 10;
    }
    return Math.min(score, 100);
};

const Profile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const user = useSelector((state: any) => state.user);
    const isEmployer = user?.role === 'EMPLOYER';
    
    const { hovered, ref } = useHover();
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeModalOpen, setResumeModalOpen] = useState(false);
    const completion = getProfileCompletion(profile, isEmployer);

    const handleAvatarChange = async (image: any) => {
        let picture: any = await getBase64(image);
        let updatedProfile = { ...profile, picture: picture.split(',')[1] };
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Profile Picture Updated Successfully");
    };

    const handleCoverChange = async (image: any) => {
        let picture: any = await getBase64(image);
        let updatedProfile = { ...profile, coverPhoto: picture.split(',')[1] };
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Cover Photo Updated Successfully");
    };

    const handleResumeUpload = async (file: File | null) => {
        if (!file) return;
        setResumeLoading(true);
        try {
            const parsed = await parseResume(file);
            if (parsed.error) {
                errorNotification("Parse Error", parsed.error);
                return;
            }
            // Merge parsed data into existing profile (don't overwrite name/email)
            const updatedProfile = {
                ...profile,
                jobTitle: parsed.jobTitle || profile.jobTitle,
                company: parsed.company || profile.company,
                location: parsed.location || profile.location,
                about: parsed.about || profile.about,
                totalExp: parsed.totalExp || profile.totalExp,
                skills: parsed.skills?.length > 0 ? parsed.skills : profile.skills,
                experiences: parsed.experiences?.length > 0 ? parsed.experiences : (profile.experiences || []),
                certifications: parsed.certifications?.length > 0 ? parsed.certifications : (profile.certifications || []),
            };
            
            // We also save the PDF as their default resume
            const base64Resume = await getBase64(file);
            updatedProfile.resumePdf = (base64Resume as string).split(',')[1];
            
            dispatch(changeProfile(updatedProfile));
            successNotification("✨ Resume Imported!", `Extracted ${parsed.skills?.length || 0} skills and ${parsed.experiences?.length || 0} experiences.`);
        } catch {
            errorNotification("Upload Failed", "Could not parse resume. Make sure it's a text-based PDF.");
        } finally {
            setResumeLoading(false);
        }
    };

    return (
        <div className="w-4/5 lg-mx:w-full mx-auto pb-10">
            {/* Hero Banner with Cover Photo */}
            <div data-aos="zoom-out" className="relative group mb-16 md-mx:mb-12">
                <div className="relative h-64 xs-mx:h-40 w-full bg-mine-shaft-900 overflow-hidden rounded-t-2xl shadow-xl">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={profile.coverPhoto ? `data:image/jpeg;base64,${profile.coverPhoto}` : WEBSITE_CONFIG.assets.profileBanner} 
                        alt="Cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Cover Photo Upload Button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                        <FileButton onChange={handleCoverChange} accept="image/png,image/jpeg">
                            {(props) => (
                                <Button 
                                    {...props} 
                                    variant="white" 
                                    color="dark" 
                                    size="sm"
                                    radius="md" 
                                    leftSection={<IconCamera size={16} />}
                                    className="shadow-lg backdrop-blur-md bg-white/90 hover:bg-white text-mine-shaft-900 transition-all font-semibold"
                                >
                                    Edit Cover
                                </Button>
                            )}
                        </FileButton>
                    </div>
                </div>

                {/* Avatar */}
                <div ref={ref} className="absolute cursor-pointer flex items-center justify-center !rounded-full -bottom-16 md-mx:-bottom-12 sm-mx:-bottom-10 left-10 sm-mx:left-6 z-40 transition-transform duration-300 hover:scale-105">
                    <Avatar 
                        className="!w-36 !h-36 md-mx:!w-28 md-mx:!h-28 sm-mx:!w-24 sm-mx:!h-24 border-mine-shaft-950 border-[6px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-mine-shaft-900" 
                        src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : WEBSITE_CONFIG.assets.defaultAvatar} 
                        alt="Profile" 
                    />
                    {hovered && <Overlay ref={ref} className="!rounded-full" color="#000" backgroundOpacity={0.6} />}
                    {hovered && <IconCamera className="absolute z-[300] !w-8 !h-8 text-white drop-shadow-md" />}
                    {hovered && <FileInput onChange={handleAvatarChange} className="absolute [&_*]:!rounded-full z-[301] [&_*]:!h-full w-full !h-full cursor-pointer" variant="unstyled" accept="image/png,image/jpeg" />}
                </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 sm-mx:px-4 flex flex-col gap-6">

                {/* Profile Completion Ring */}
                <div data-aos="fade-up" className="bg-mine-shaft-900/60 backdrop-blur-md border border-mine-shaft-800/50 rounded-2xl p-6 flex items-center gap-6 sm-mx:flex-col sm-mx:text-center shadow-lg hover:border-mine-shaft-700/50 transition-colors">
                    <RingProgress
                        size={110}
                        thickness={12}
                        roundCaps
                        sections={[{ value: completion, color: completion >= 80 ? 'teal.4' : completion >= 50 ? 'brightSun.4' : 'red.4' }]}
                        label={
                            <Text c={completion >= 80 ? 'teal.4' : completion >= 50 ? 'brightSun.4' : 'red.4'} fw={700} ta="center" size="xl" className="drop-shadow-sm">
                                {completion}%
                            </Text>
                        }
                    />
                    <div className="flex flex-col gap-2">
                        <div className="text-xl font-bold text-mine-shaft-100 tracking-tight">
                            {isEmployer ? 'Company Profile Strength: ' : 'Profile Strength: '} 
                            {completion >= 80 ? '🌟 All Star' : completion >= 50 ? '💪 Intermediate' : '🚀 Beginner'}
                        </div>
                        <p className="text-mine-shaft-300 text-sm leading-relaxed max-w-2xl">
                            {completion < 100 
                                ? (isEmployer 
                                    ? 'Complete your company profile (add location, about, and company name) to attract better talent.' 
                                    : 'Complete your profile (add skills, experience, and certifications) to get more visibility to employers.') 
                                : 'Your profile is complete! You are ready to stand out.'}
                        </p>
                    </div>
                </div>

                {/* Role-Based Rendering: AI Resume Import only for Applicants */}
                {!isEmployer && (
                    <div data-aos="fade-up" className="bg-gradient-to-br from-mine-shaft-900/80 to-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-5 border border-bright-sun-400/20 hover:border-bright-sun-400/40 transition-all shadow-lg">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-bright-sun-400/10 shadow-[0_0_15px_rgba(250,204,21,0.15)]">
                                    <IconSparkles className="text-bright-sun-400 w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-mine-shaft-100">Import from Resume</div>
                                    <div className="text-sm text-mine-shaft-400 mt-0.5">Upload your PDF and let AI fill your profile automatically</div>
                                </div>
                            </div>
                            <FileButton onChange={handleResumeUpload} accept="application/pdf">
                                {(props) => (
                                    <Button
                                        {...props}
                                        leftSection={<IconFileUpload size={18} />}
                                        color="brightSun.4"
                                        variant="light"
                                        size="md"
                                        radius="md"
                                        loading={resumeLoading}
                                        className="font-semibold shadow-sm"
                                    >
                                        {resumeLoading ? "Parsing Resume..." : "Upload Resume (PDF)"}
                                    </Button>
                                )}
                            </FileButton>
                        </div>
                        {profile.resumePdf && (
                            <div className="mt-5 pt-4 border-t border-mine-shaft-800/60 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-teal-400 font-medium bg-teal-400/10 px-3 py-1.5 rounded-lg">
                                    <IconSparkles size={16} /> Default Resume Saved
                                </div>
                                <Button 
                                    component="a" 
                                    href={`data:application/pdf;base64,${profile.resumePdf}`} 
                                    download={`${profile.name}_Resume.pdf`} 
                                    size="sm" 
                                    variant="subtle" 
                                    color="teal"
                                    className="hover:bg-teal-400/10"
                                >
                                    View Resume
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Print ATS Resume Button (Applicants Only) */}
                {!isEmployer && completion > 40 && (
                    <div data-aos="fade-up" className="flex justify-end mb-2">
                        <Button
                            variant="gradient"
                            gradient={{ from: 'brightSun.4', to: 'yellow.6', deg: 45 }}
                            leftSection={<IconFileText size={18} />}
                            onClick={() => setResumeModalOpen(true)}
                            className="shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 transition-transform"
                        >
                            Generate ATS Web Resume
                        </Button>
                    </div>
                )}

                <div className="bg-mine-shaft-900/40 backdrop-blur-md border border-mine-shaft-800/60 rounded-2xl p-6 sm-mx:p-4 shadow-xl flex flex-col gap-8">
                    <Info />
                    <Divider className="border-mine-shaft-800/60" />
                    <About />
                    
                    {/* Hide applicant sections for employers */}
                    {!isEmployer && (
                        <>
                            <Divider className="border-mine-shaft-800/60" />
                            <Skills />
                            <Divider className="border-mine-shaft-800/60" />
                            <Experience />
                            <Divider className="border-mine-shaft-800/60" />
                            <Certification />
                        </>
                    )}
                </div>
            </div>

            {/* ATS Resume Modal */}
            <Modal 
                opened={resumeModalOpen} 
                onClose={() => setResumeModalOpen(false)} 
                size="1000px" 
                title={<div className="text-xl font-bold text-white">Your ATS-Friendly Resume</div>}
                overlayProps={{ backgroundOpacity: 0.8, blur: 10 }}
                classNames={{ content: '!bg-mine-shaft-950 !border !border-mine-shaft-800' }}
            >
                <div className="flex justify-between items-center mb-6">
                    <p className="text-mine-shaft-300 text-sm">This view is optimized for ATS parsers and printing. Click Print to save as PDF.</p>
                    <Button color="brightSun.4" leftSection={<IconPrinter size={16}/>} onClick={() => window.print()}>Print / Save PDF</Button>
                </div>
                
                {/* Printable Resume Container (White Background for ATS/Print) */}
                <div className="print:block print:w-full print:m-0 print:p-0">
                    <div id="ats-resume" className="bg-white text-black p-10 min-h-[800px] shadow-2xl rounded-sm print:shadow-none print:p-0">
                        {/* Header */}
                        <div className="text-center mb-8 border-b-2 border-black pb-4">
                            <h1 className="text-4xl font-extrabold uppercase tracking-widest">{profile.name || "Your Name"}</h1>
                            <div className="text-lg font-medium text-gray-700 mt-2">{profile.jobTitle || "Your Job Title"}</div>
                            <div className="flex justify-center gap-4 text-sm mt-3 font-semibold">
                                {profile.email && <span>{profile.email}</span>}
                                {profile.phone && <span>• {profile.phone}</span>}
                                {profile.location && <span>• {profile.location}</span>}
                                {profile.website && <span>• {profile.website}</span>}
                            </div>
                        </div>

                        {/* Summary */}
                        {profile.about && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-300">Professional Summary</h2>
                                <p className="text-sm leading-relaxed text-gray-800">{profile.about}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {(profile.experiences?.length > 0 || profile.experience?.length > 0) && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-300">Work Experience</h2>
                                <div className="flex flex-col gap-4">
                                    {(profile.experiences || profile.experience).map((exp: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline font-bold text-gray-900">
                                                <span>{exp.title}</span>
                                                <span className="text-sm">{exp.startDate || ""} - {exp.working ? "Present" : exp.endDate || ""}</span>
                                            </div>
                                            <div className="text-sm font-semibold italic text-gray-700">{exp.company} • {exp.location}</div>
                                            <div className="text-sm mt-1 text-gray-800">{exp.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skills?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-300">Core Competencies</h2>
                                <p className="text-sm font-medium text-gray-800">{profile.skills.join(" • ")}</p>
                            </div>
                        )}

                        {/* Certifications */}
                        {profile.certifications?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-300">Certifications</h2>
                                <ul className="list-disc list-inside text-sm text-gray-800 flex flex-col gap-1">
                                    {profile.certifications.map((cert: any, i: number) => (
                                        <li key={i}><span className="font-bold">{cert.name}</span> - {cert.issuer}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #ats-resume, #ats-resume * { visibility: visible; }
                        #ats-resume { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; box-shadow: none; }
                        ::-webkit-scrollbar { display: none; }
                    }
                `}</style>
            </Modal>
        </div>
    );
};

export default Profile;