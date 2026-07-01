import { ActionIcon, Badge, Button, Divider, RingProgress, Text, Progress, Tooltip, CopyButton } from "@mantine/core";
import { card } from "../../Data/JobDescData";
import { IconBookmark, IconBookmarkFilled, IconSparkles, IconShare, IconCheck, IconChartBar } from "@tabler/icons-react";
// @ts-ignore
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfile } from "../../Slices/ProfileSlice";
import { postJob } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { getMatchScore } from "../../Services/AiService";

const formatLPA = (raw: number) => {
    if (!raw) return "0";
    const lpa = raw / 100000;
    return lpa % 1 === 0 ? lpa.toFixed(0) : lpa.toFixed(1);
};

const Job = (props: any) => {
    const dispatch = useDispatch();
    const user     = useSelector((state: any) => state.user);
    const profile  = useSelector((state: any) => state.profile);

    const handleSaveJob = () => {
        let savedJobs: any = profile.savedJobs ? [...profile.savedJobs] : [];
        if (savedJobs.includes(props.id)) savedJobs = savedJobs.filter((j: any) => j !== props.id);
        else savedJobs.push(props.id);
        dispatch(changeProfile({ ...profile, savedJobs }));
    };

    const [applied, setApplied]           = useState(false);
    const [matchScore, setMatchScore]     = useState<any>(null);
    const [matchLoading, setMatchLoading] = useState(false);

    useEffect(() => {
        setApplied(props.applicants?.some((a: any) => a.applicantId === user.id) ?? false);
        setMatchScore(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const cleanHTML = DOMPurify.sanitize(props.description);

    const handleClose = () => {
        if (props.closed) return;
        dispatch(showOverlay());
        postJob({ ...props, jobStatus: "CLOSED" })
            .then(() => successNotification("Job Closed", "Job has been closed successfully"))
            .catch(console.error)
            .finally(() => dispatch(hideOverlay()));
    };

    return (
        <div className="w-full flex flex-col gap-0">

            {/* ── Hero card ─────────────────────────────────── */}
            <div className="relative overflow-hidden bg-mine-shaft-900/50 border border-mine-shaft-800/50 rounded-2xl p-4 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-bright-sun-400/[0.08] rounded-full blur-[60px] pointer-events-none" />

                <div className="flex justify-between items-start gap-3 relative z-10 flex-wrap">
                    {/* Left: logo + title */}
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 p-2 bg-mine-shaft-950/80 border border-mine-shaft-800/70 rounded-xl">
                            <img
                                className="h-11 w-11 object-contain"
                                src={`/Icons/${props.company}.png`}
                                alt={props.company}
                                onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`)}
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="font-bold text-xl sm-mx:text-base tracking-tight text-white leading-tight">{props.jobTitle}</div>
                            <div className="text-sm font-medium text-mine-shaft-400 flex flex-wrap gap-1.5 items-center">
                                <Link to={`/company/${props.company}`} className="text-bright-sun-400 hover:text-bright-sun-300 transition-colors">
                                    {props.company}
                                </Link>
                                <span className="text-mine-shaft-700">·</span>
                                <span>{timeAgo(props.postTime || "")}</span>
                                <span className="text-mine-shaft-700">·</span>
                                <span>{props.applicants?.length ?? 0} Applicants</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 flex-wrap sm-mx:w-full sm-mx:[&>*]:w-full">
                        {(props.edit || !applied) && (
                            <Link to={props.edit ? `/post-job/${props.id}` : `/apply-job/${props.id}`}>
                                <Button color="brightSun.4" size="md" radius="md" className="!min-h-[44px]">
                                    {props.closed ? "Reopen" : props.edit ? "Edit" : "Apply Now"}
                                </Button>
                            </Link>
                        )}
                        {applied && !props.edit && (
                            <Button color="green.6" size="sm" radius="md" variant="light">Applied ✓</Button>
                        )}
                        {props.edit && !props.closed
                            ? <Button onClick={handleClose} color="red.5" size="sm" radius="md" variant="light">Close Job</Button>
                            : profile.savedJobs?.includes(props.id)
                                ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-bright-sun-400 hover:scale-110 transition-transform" stroke={1.5} size={22} />
                                : <IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-bright-sun-400 text-mine-shaft-500 hover:scale-110 transition-all" stroke={1.5} size={22} />
                        }
                        
                        {/* Social Share Widget */}
                        <CopyButton value={window.location.href} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied' : 'Share Job'} withArrow position="top">
                                    <ActionIcon 
                                        color={copied ? 'teal' : 'gray'} 
                                        variant="subtle" 
                                        onClick={() => { copy(); successNotification("Link Copied!", "Job link has been copied to your clipboard."); }}
                                        className="hover:scale-110 transition-transform bg-mine-shaft-900/50 backdrop-blur-md border border-mine-shaft-800/50"
                                        size="lg"
                                        radius="md"
                                    >
                                        {copied ? <IconCheck size={18} /> : <IconShare size={18} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </div>
                </div>
            </div>

            {/* ── Stats row ─────────────────────────────────── */}
            <div className="grid grid-cols-4 md-mx:grid-cols-2 gap-2 mb-8">
                {card.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-mine-shaft-900/40 border border-mine-shaft-800/40">
                        <ActionIcon size="md" variant="light" color="brightSun.4" radius="lg">
                            <item.icon size={16} />
                        </ActionIcon>
                        <div className="text-[10px] text-mine-shaft-500 font-medium text-center">{item.name}</div>
                        <div className="text-[13px] font-bold text-mine-shaft-100 text-center">
                            {props
                                ? item.id === "packageOffered"
                                    ? formatLPA(props[item.id])
                                    : props[item.id]
                                : "—"}
                            {item.id === "packageOffered" && <span className="text-[10px] font-normal text-mine-shaft-500 ml-0.5">LPA</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Salary Comparator Widget ────────────────────── */}
            {props.packageOffered && (
                <div className="mb-8 p-4 bg-mine-shaft-900/40 border border-mine-shaft-800/40 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-mine-shaft-200">
                            <IconChartBar size={16} className="text-bright-sun-400" />
                            Market Salary Insight
                        </div>
                        <Badge size="xs" color={props.packageOffered >= 1500000 ? "teal" : props.packageOffered >= 800000 ? "yellow" : "red"} variant="light">
                            {props.packageOffered >= 1500000 ? "Above Market" : props.packageOffered >= 800000 ? "Market Average" : "Below Market"}
                        </Badge>
                    </div>
                    <Progress.Root size="xl" radius="xl" className="mt-3 bg-mine-shaft-800">
                        <Tooltip label="Below Market (<8 LPA)">
                            <Progress.Section value={33} color="red.5" className={props.packageOffered < 800000 ? "opacity-100" : "opacity-30"} />
                        </Tooltip>
                        <Tooltip label="Market Average (8-15 LPA)">
                            <Progress.Section value={34} color="yellow.5" className={props.packageOffered >= 800000 && props.packageOffered < 1500000 ? "opacity-100" : "opacity-30"} />
                        </Tooltip>
                        <Tooltip label="Above Market (>15 LPA)">
                            <Progress.Section value={33} color="teal.5" className={props.packageOffered >= 1500000 ? "opacity-100" : "opacity-30"} />
                        </Tooltip>
                    </Progress.Root>
                    <div className="flex justify-between text-[10px] text-mine-shaft-500 font-medium mt-1 px-1">
                        <span>Entry</span>
                        <span>Mid-Level</span>
                        <span>Senior</span>
                    </div>
                </div>
            )}

            {/* ── Required Skills ───────────────────────────── */}
            <div className="mb-8">
                <div className="text-[11px] font-bold text-mine-shaft-300 uppercase tracking-widest mb-2.5">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                    {props.skillsRequired?.map((skill: any, i: number) => (
                        <span key={i} className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-full bg-bright-sun-400/[0.08] text-bright-sun-400 border border-bright-sun-400/20">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── AI Match Score (APPLICANT only) ───────────── */}
            {user?.accountType === "APPLICANT" && (
                <>
                    <Divider size="xs" my="md" />
                    <div className="p-4 rounded-xl bg-mine-shaft-900/40 border border-mine-shaft-800/40 mb-8">
                        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                            <div className="text-sm font-semibold flex items-center gap-1.5">
                                <IconSparkles size={16} className="text-bright-sun-400" />
                                AI Match Score
                            </div>
                            {!matchScore && (
                                <Button
                                    size="xs" variant="filled" color="brightSun.4" loading={matchLoading}
                                    className="!text-mine-shaft-950 font-bold"
                                    onClick={async () => {
                                        if (!props.about) { errorNotification("No job data", "Job info not loaded yet."); return; }
                                        setMatchLoading(true);
                                        try {
                                            const skillsList = profile.skills?.length > 0 ? `Skills: ${profile.skills.join(", ")}` : "Skills: Not specified";
                                            const expList    = profile.experiences?.length > 0
                                                ? `Experience: ${profile.experiences.map((e: any) => `${e.title} at ${e.company}`).join("; ")}`
                                                : "Experience: Not specified";
                                            const profileSummary = [profile.jobTitle ? `Role: ${profile.jobTitle}` : "", skillsList, expList, profile.about ? `About: ${profile.about.substring(0, 200)}` : ""].filter(Boolean).join(". ");
                                            const jobSummary = `Role: ${props.jobTitle} at ${props.company}. Skills: ${props.skillsRequired?.join(", ")}. ${props.about}`;
                                            setMatchScore(await getMatchScore(profileSummary, jobSummary));
                                        } catch (err: any) {
                                            errorNotification("AI Error", err?.response?.data?.description || "Could not calculate match score.");
                                        } finally {
                                            setMatchLoading(false);
                                        }
                                    }}
                                >
                                    ✨ Check My Match
                                </Button>
                            )}
                        </div>
                        {matchScore ? (
                            <div className="flex gap-4 items-start flex-wrap">
                                <div className="shrink-0">
                                    <RingProgress
                                        size={90} thickness={8}
                                        label={<Text fw={700} ta="center" size="sm" c="brightSun.4">{matchScore.score ?? "?"}%</Text>}
                                        sections={[{ value: matchScore.score ?? 0, color: matchScore.score >= 70 ? "teal" : matchScore.score >= 40 ? "yellow" : "red" }]}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-mine-shaft-400 text-xs mb-2">{matchScore.summary}</p>
                                    {matchScore.strengths?.length > 0 && (
                                        <div className="mb-2">
                                            <div className="text-[11px] font-semibold text-teal-400 mb-1">✅ Strengths</div>
                                            <div className="flex flex-wrap gap-1">{matchScore.strengths.map((s: string, i: number) => <Badge key={i} color="teal" variant="light" size="xs">{s}</Badge>)}</div>
                                        </div>
                                    )}
                                    {matchScore.gaps?.length > 0 && (
                                        <div>
                                            <div className="text-[11px] font-semibold text-red-400 mb-1">⚠️ Gaps</div>
                                            <div className="flex flex-wrap gap-1">{matchScore.gaps.map((g: string, i: number) => <Badge key={i} color="red" variant="light" size="xs">{g}</Badge>)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-mine-shaft-600 text-xs">Click "Check My Match" to see how well your profile fits this job using AI.</p>
                        )}
                    </div>
                </>
            )}

            {/* ── Job Description HTML ──────────────────────── */}
            {cleanHTML && (
                <div className="mb-8">
                    <div className="text-[11px] font-bold text-mine-shaft-300 uppercase tracking-widest mb-2.5">Description</div>
                    <div
                        className="[&>h4]:text-base [&_*]:text-mine-shaft-300 [&_li]:marker:text-bright-sun-300 [&_li]:mb-0.5 [&>h4]:text-mine-shaft-200 [&>h4]:font-semibold [&>h4]:my-3 [&_p]:text-justify [&_p]:text-sm [&_li]:text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: cleanHTML }}
                    />
                </div>
            )}

            {/* ── About Company ─────────────────────────────── */}
            <Divider size="xs" my="md" />
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-mine-shaft-900 border border-mine-shaft-800/60 rounded-xl">
                        <img
                            className="h-7 w-7 object-contain"
                            src={`/Icons/${props.company}.png`}
                            alt={props.company}
                            onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`)}
                        />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-mine-shaft-200">{props.company}</div>
                        <div className="text-xs text-mine-shaft-500">{props.employees ? props.employees + " Employees" : "Employee count unknown"}</div>
                    </div>
                </div>
                <Link to={`/company/${props.company}`}>
                    <Button color="brightSun.4" variant="light" size="xs">Company Page</Button>
                </Link>
            </div>
        </div>
    );
};

export default Job;