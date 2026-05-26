import { Avatar, Button, Divider, FileButton, FileInput, Overlay, RingProgress, Text } from "@mantine/core";
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
import { IconEdit, IconFileUpload, IconSparkles } from "@tabler/icons-react";
import { getBase64 } from "../../Services/Utilities";
import { parseResume } from "../../Services/AiService";
import { WEBSITE_CONFIG } from "../../config";

const getProfileCompletion = (profile: any) => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.jobTitle) score += 10;
    if (profile.company) score += 10;
    if (profile.location) score += 10;
    if (profile.about) score += 15;
    if (profile.skills?.length > 0) score += 20;
    if (profile.experiences?.length > 0 || profile.experience?.length > 0) score += 15;
    if (profile.certifications?.length > 0) score += 10;
    return score;
};

const Profile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const { hovered, ref } = useHover();
    const [resumeLoading, setResumeLoading] = useState(false);
    const completion = getProfileCompletion(profile);

    const handleFileChange = async (image: any) => {
        let picture: any = await getBase64(image);
        let updatedProfile = { ...profile, picture: picture.split(',')[1] };
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Profile Picture Updated Successfully");
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
            {/* Hero Banner */}
            <div data-aos="zoom-out" className="relative">
                <div className="relative h-52 xs-mx:h-32 rounded-t-2xl overflow-hidden">
                    <img className="w-full h-full object-cover" src={WEBSITE_CONFIG.assets.profileBanner} alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950/80 via-transparent to-transparent" />
                </div>

                {/* Avatar */}
                <div ref={ref} className="absolute cursor-pointer flex items-center justify-center !rounded-full -bottom-16 md-mx:-bottom-10 sm-mx:-bottom-14 left-8">
                    <Avatar className="!w-36 !h-36 md-mx:!w-28 md-mx:!h-28 border-mine-shaft-950 border-4 rounded-full sm-mx:!w-24 sm-mx:!h-24" src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : WEBSITE_CONFIG.assets.defaultAvatar} alt="" />
                    {hovered && <Overlay ref={ref} className="!rounded-full" color="#000" backgroundOpacity={0.75} />}
                    {hovered && <IconEdit className="absolute z-[300] !w-10 !h-10" />}
                    {hovered && <FileInput onChange={handleFileChange} className="absolute [&_*]:!rounded-full z-[301] [&_*]:!h-full w-full !h-full" variant="unstyled" accept="image/png,image/jpeg" />}
                </div>
            </div>

            {/* Profile Content */}
            <div className="px-4 pt-20 sm-mx:pt-16 flex flex-col gap-0">

                {/* Profile Completion Ring */}
                <div data-aos="fade-up" className="glass-card rounded-xl p-6 mb-4 flex items-center gap-6 sm-mx:flex-col sm-mx:text-center">
                    <RingProgress
                        size={100}
                        thickness={10}
                        roundCaps
                        sections={[{ value: completion, color: completion >= 80 ? 'teal' : completion >= 50 ? 'yellow' : 'red' }]}
                        label={
                            <Text c={completion >= 80 ? 'teal' : completion >= 50 ? 'yellow' : 'red'} fw={700} ta="center" size="xl">
                                {completion}%
                            </Text>
                        }
                    />
                    <div className="flex flex-col gap-2">
                        <div className="text-lg font-bold text-mine-shaft-100">
                            Profile Strength: {completion >= 80 ? '🌟 All Star' : completion >= 50 ? '💪 Intermediate' : '🚀 Beginner'}
                        </div>
                        <p className="text-mine-shaft-300 text-sm">
                            {completion < 100 ? 'Complete your profile (add skills, experience, and certifications) to get more visibility to employers.' : 'Your profile is complete! You are ready to stand out.'}
                        </p>
                    </div>
                </div>

                {/* AI Resume Import Card */}
                <div data-aos="fade-up" className="glass-card rounded-xl p-4 mb-4 border border-bright-sun-400/20 hover:border-bright-sun-400/50 transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-bright-sun-400/10">
                                <IconSparkles className="text-bright-sun-400 w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-mine-shaft-100">Import from Resume</div>
                                <div className="text-xs text-mine-shaft-400">Upload your PDF and let AI fill your profile automatically</div>
                            </div>
                        </div>
                        <FileButton onChange={handleResumeUpload} accept="application/pdf">
                            {(props) => (
                                <Button
                                    {...props}
                                    leftSection={<IconFileUpload size={16} />}
                                    color="brightSun.4"
                                    variant="light"
                                    size="sm"
                                    loading={resumeLoading}
                                >
                                    {resumeLoading ? "Parsing Resume..." : "Upload Resume (PDF)"}
                                </Button>
                            )}
                        </FileButton>
                    </div>
                    {profile.resumePdf && (
                        <div className="mt-4 pt-3 border-t border-mine-shaft-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-teal-400 font-medium">
                                <IconSparkles size={16} /> Default Resume Saved
                            </div>
                            <Button 
                                component="a" 
                                href={`data:application/pdf;base64,${profile.resumePdf}`} 
                                download={`${profile.name}_Resume.pdf`} 
                                size="xs" 
                                variant="subtle" 
                                color="teal"
                            >
                                View Resume
                            </Button>
                        </div>
                    )}
                </div>

                <Info />
                <Divider my="xl" />
                <About />
                <Divider my="xl" />
                <Skills />
                <Divider my="xl" />
                <Experience />
                <Divider my="xl" />
                <Certification />
            </div>
        </div>
    );
};

export default Profile;