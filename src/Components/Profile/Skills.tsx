import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { ActionIcon, Badge, TagsInput } from "@mantine/core";
import { IconCheck, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { successNotification } from "../../Services/NotificationService";
import { useMediaQuery } from "@mantine/hooks";

const SUGGESTED_SKILLS = [
    "React", "TypeScript", "JavaScript", "Node.js", "Java", "Python",
    "Spring Boot", "MongoDB", "PostgreSQL", "Docker", "AWS", "Git",
    "Figma", "REST APIs", "GraphQL", "Tailwind CSS", "Machine Learning"
];

const Skills = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const [skills, setSkills] = useState<string[]>([]);
    const [edit, setEdit] = useState(false);
    const matches = useMediaQuery('(max-width: 475px)');

    const handleClick = () => {
        if (!edit) {
            setSkills(profile.skills || []);
            setEdit(true);
        } else setEdit(false);
    };

    const handleSave = () => {
        setEdit(false);
        let updatedProfile = { ...profile, skills };
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Skills Updated Successfully");
    };

    const addSuggested = (skill: string) => {
        if (!skills.includes(skill)) setSkills([...skills, skill]);
    };

    const currentSkills: string[] = profile?.skills || [];

    return (
        <div data-aos="fade-up">
            <div className="text-2xl sm-mx:text-xl font-semibold mb-4 flex justify-between items-center">
                Skills
                <div className="flex gap-1">
                    {edit && (
                        <ActionIcon onClick={handleSave} variant="subtle" color="green.8" size={matches ? "md" : "lg"}>
                            <IconCheck className="w-4/5 h-4/5" stroke={1.5} />
                        </ActionIcon>
                    )}
                    <ActionIcon onClick={handleClick} variant="subtle" color={edit ? "red.8" : "brightSun.4"} size={matches ? "md" : "lg"}>
                        {edit ? <IconX className="w-4/5 h-4/5" stroke={1.5} /> : <IconPencil className="w-4/5 h-4/5" stroke={1.5} />}
                    </ActionIcon>
                </div>
            </div>

            {edit ? (
                <div className="flex flex-col gap-3">
                    <TagsInput
                        data-aos="zoom-out"
                        placeholder="Type a skill and press Enter"
                        value={skills}
                        onChange={setSkills}
                        splitChars={[',', '|']}
                    />
                    {/* Suggested skills */}
                    <div>
                        <div className="text-xs text-mine-shaft-400 mb-2">Suggested skills — click to add:</div>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map((skill, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    color="brightSun.4"
                                    size="sm"
                                    className="cursor-pointer hover:bg-bright-sun-400/10 transition"
                                    rightSection={<IconPlus size={10} />}
                                    onClick={() => addSuggested(skill)}
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {currentSkills.length > 0 ? (
                        currentSkills.map((skill: string, index: number) => (
                            <div
                                key={index}
                                className="bg-bright-sun-400/10 border border-bright-sun-400/30 hover:border-bright-sun-400/70 hover:bg-bright-sun-400/20 transition-all duration-200 rounded-full px-4 sm-mx:px-3 py-1.5 sm-mx:py-1 text-sm sm-mx:text-xs font-medium text-bright-sun-400 cursor-default"
                            >
                                {skill}
                            </div>
                        ))
                    ) : (
                        <div className="text-mine-shaft-400 text-sm">
                            No skills added yet.{" "}
                            <span
                                className="text-bright-sun-400 cursor-pointer hover:underline"
                                onClick={handleClick}
                            >
                                Add skills
                            </span>{" "}
                            or upload your resume to auto-fill.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Skills;