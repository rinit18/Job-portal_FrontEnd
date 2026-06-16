import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeProfile } from "../../Slices/ProfileSlice";
import { getOrCreateRoomByUser } from "../../Services/ChatService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { timeAgo } from "../../Services/Utilities";
import {
    IconBookmark, IconBookmarkFilled,
    IconMapPin, IconCurrencyRupee, IconClockHour3,
} from "@tabler/icons-react";

const formatLPA = (raw: number) => {
    if (!raw) return "0";
    const lpa = raw / 100000;
    return lpa % 1 === 0 ? lpa.toFixed(0) : lpa.toFixed(1);
};

const JOB_TYPE_STYLES: Record<string, string> = {
    "Full Time":  "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    "Part Time":  "bg-blue-500/10   text-blue-400   border-blue-500/25",
    "Contract":   "bg-violet-500/10 text-violet-400 border-violet-500/25",
    "Freelance":  "bg-pink-500/10   text-pink-400   border-pink-500/25",
    "Internship": "bg-orange-500/10 text-orange-400 border-orange-500/25",
};

const EXP_STYLES: Record<string, string> = {
    "Entry Level":  "bg-sky-500/10   text-sky-400   border-sky-500/25",
    "Intermediate": "bg-amber-500/10 text-amber-400 border-amber-500/25",
    "Expert":       "bg-rose-500/10  text-rose-400  border-rose-500/25",
};

const JobCard = (props: any) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile  = useSelector((state: any) => state.profile);
    const isSaved  = profile.savedJobs?.includes(props.id);
    const isNew    = new Date().getTime() - new Date(props.postTime).getTime() < 24 * 60 * 60 * 1000;
    const lpa      = formatLPA(props.packageOffered);
    const typeStyle = JOB_TYPE_STYLES[props.jobType] ?? "bg-mine-shaft-800/60 text-mine-shaft-400 border-mine-shaft-700/30";
    const expStyle  = EXP_STYLES[props.experience]  ?? "bg-mine-shaft-800/60 text-mine-shaft-400 border-mine-shaft-700/30";

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        let saved: string[] = profile.savedJobs ? [...profile.savedJobs] : [];
        if (saved.includes(props.id)) {
            saved = saved.filter(id => id !== props.id);
            successNotification("Removed", "Job removed from saved");
        } else {
            saved.push(props.id);
            successNotification("Saved", "Job added to saved");
        }
        dispatch(changeProfile({ ...profile, savedJobs: saved }));
    };

    const handleMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!profile?.id) { errorNotification("Login Required", "Set up your profile to chat."); return; }
        if (!props.postedBy) return;
        getOrCreateRoomByUser(profile.id, props.postedBy)
            .then((room: any) => navigate(`/messages?roomId=${room.id}`))
            .catch(() => errorNotification("Error", "Could not reach recruiter."));
    };

    return (
        <div
            onClick={() => props.onSelect?.(props)}
            className={`
                relative w-full transition-all duration-150 group
                ${props.onSelect ? "cursor-pointer" : ""}
                ${props.selected
                    ? "bg-white/[0.04] border-l-[3px] border-l-bright-sun-400"
                    : "border-l-[3px] border-l-transparent hover:bg-white/[0.025] hover:border-l-mine-shaft-600"
                }
                border-b border-b-white/[0.06]
            `}
        >
            <div className="px-3 sm:px-5 py-4 flex flex-col gap-3">

                {/* ── Row 1: Logo + Title + Bookmark ── */}
                <div className="flex items-start gap-3">
                    {/* Logo box */}
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-mine-shaft-900 border border-white/[0.08] flex items-center justify-center overflow-hidden">
                        <img
                            className="w-7 h-7 object-contain"
                            src={`/Icons/${props.company}.png`}
                            alt={props.company}
                            onError={e =>
                                (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=ffbd20&background=1c1c1c&bold=true&size=64`)
                            }
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-2">
                            <p className={`font-semibold text-sm leading-snug transition-colors ${props.selected ? "text-bright-sun-400" : "text-white group-hover:text-bright-sun-400"}`}>
                                {props.jobTitle}
                                {isNew && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/20 rounded-full align-middle animate-pulse">
                                        New
                                    </span>
                                )}
                            </p>
                            <button onClick={handleSave} className="shrink-0 p-2 -mr-1 text-mine-shaft-600 hover:text-bright-sun-400 transition-colors mt-0.5">
                                {isSaved
                                    ? <IconBookmarkFilled size={15} className="text-bright-sun-400" />
                                    : <IconBookmark size={15} />
                                }
                            </button>
                        </div>

                        {/* Company + applicants */}
                        <div className="flex items-center gap-1.5 text-xs text-mine-shaft-500 mt-0.5">
                            <Link
                                to={`/company/${props.company}`}
                                onClick={e => e.stopPropagation()}
                                className="text-mine-shaft-400 hover:text-bright-sun-400 font-medium transition-colors"
                            >
                                {props.company}
                            </Link>
                            <span className="text-mine-shaft-700">·</span>
                            <span>{props.applicants?.length ?? 0} applicants</span>
                        </div>
                    </div>
                </div>

                {/* ── Row 2: Badges ── */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${expStyle}`}>
                        {props.experience}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-mine-shaft-800/40 text-mine-shaft-400 border-mine-shaft-700/30">
                        <IconMapPin size={11} />
                        {props.location}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyle}`}>
                        {props.jobType}
                    </span>
                </div>

                {/* ── Row 3: Salary + Time ── */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                    <div className="flex items-center gap-0.5">
                        <IconCurrencyRupee size={15} className="text-bright-sun-400" stroke={2.5} />
                        <span className="font-bold text-sm text-white">{lpa}</span>
                        <span className="text-xs text-mine-shaft-500 font-medium ml-1">LPA</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-mine-shaft-500">
                        <IconClockHour3 size={13} stroke={1.5} />
                        {timeAgo(props.postTime)}
                    </div>
                </div>

                {/* ── Mobile buttons ── */}
                {!props.hideViewButton && (
                    <div className="flex gap-2">
                        <Link className="flex-1" to={`/jobs/${props.id}`} onClick={e => e.stopPropagation()}>
                            <button className="w-full py-3 text-xs font-bold rounded-lg bg-bright-sun-400 text-[#111] hover:bg-bright-sun-300 transition-colors">
                                View Details
                            </button>
                        </Link>
                        <button
                            className="flex-1 py-3 text-xs font-semibold rounded-lg border border-white/[0.1] text-mine-shaft-400 hover:text-white hover:border-white/[0.2] transition-colors"
                            onClick={handleMessage}
                        >
                            Message
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCard;