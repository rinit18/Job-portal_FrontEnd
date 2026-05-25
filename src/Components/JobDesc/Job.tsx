import { ActionIcon, Badge, Button, Divider, RingProgress, Text } from "@mantine/core";
import { card} from "../../Data/JobDescData";
import { IconBookmark, IconBookmarkFilled, IconSparkles } from "@tabler/icons-react";
// @ts-ignore
import DOMPurify from 'dompurify';
import { Link} from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfile } from "../../Slices/ProfileSlice";
import { postJob } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { getMatchScore } from "../../Services/AiService";

const Job = (props:any) => {
    const dispatch=useDispatch();
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);
    const handleSaveJob = () => {
        let savedJobs:any=profile.savedJobs?[...profile.savedJobs]:[];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!==props.id);
        }else{ 
            savedJobs.push(props.id);
        }
        let updatedProfile={...profile,savedJobs:savedJobs};
        dispatch(changeProfile(updatedProfile));
    }
    const [applied, setApplied] = useState(false);
    const [matchScore, setMatchScore] = useState<any>(null);
    const [matchLoading, setMatchLoading] = useState(false);
    useEffect(()=>{
        if(props.applicants?.filter((applicant:any)=>applicant.applicantId===user.id).length>0){
            setApplied(true);
        }
        else setApplied(false);
        setMatchScore(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    const cleanHTML = DOMPurify.sanitize(props.description);
    const handleClose = () => {
        if(props.closed)return;
        dispatch(showOverlay())
        postJob({...props, jobStatus:"CLOSED"}).then((res)=>{
            successNotification('Job Closed', 'Job has been closed successfully');
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    }
    return <div data-aos="zoom-out" className="w-full">
        {/* Premium Glassmorphic Hero Section */}
        <div className="relative overflow-hidden bg-mine-shaft-900/40 backdrop-blur-xl border border-mine-shaft-800/60 rounded-3xl p-6 sm-mx:p-4 mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-bright-sun-400/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-mine-shaft-950/80 border border-mine-shaft-800/80 rounded-2xl shrink-0 flex shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300">
                        <img className="h-16 w-16 xs-mx:h-12 xs-mx:w-12 object-contain drop-shadow-lg" src={`/Icons/${props.company}.png`} alt="" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="font-bold text-3xl xs-mx:text-2xl tracking-tight text-white">{props.jobTitle}</div>
                        <div className="text-lg font-medium text-mine-shaft-300 flex flex-wrap gap-2 xs-mx:text-base items-center">
                            <Link to={`/company/${props.company}`} className="text-bright-sun-400 hover:text-bright-sun-300 transition-colors drop-shadow-[0_0_8px_rgba(255,189,32,0.3)]">{props.company}</Link>
                            <span className="text-mine-shaft-600">&bull;</span>
                            <span>{timeAgo(props.postTime||"")}</span>
                            <span className="text-mine-shaft-600">&bull;</span>
                            <span>{props.applicants?props.applicants.length:0} Applicants</span>
                        </div>
                    </div>
                </div>
                <div className="flex sm:flex-col gap-3 items-center sm-mx:w-full sm-mx:[&>button]:w-1/2 mt-2">
                    { (props.edit || !applied) && <Link to={props.edit?`/post-job/${props.id}`:`/apply-job/${props.id}`} >
                        <Button color="brightSun.4" size="md" radius="md" className="shadow-[0_0_15px_rgba(255,189,32,0.2)] hover:shadow-[0_0_25px_rgba(255,189,32,0.4)] transition-shadow">{props.closed?"Reopen":props.edit?"Edit":"Apply Now"}</Button>
                    </Link>}
                    {applied && !props.edit && <Button color="green.6" size="md" radius="md" variant="light" className="border border-green-600/30">Applied</Button>}
                    {props.edit && !props.closed ? <Button onClick={handleClose} color="red.5" size="md" radius="md" variant="light">Close Job</Button> : profile.savedJobs?.includes(props.id) ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-bright-sun-400 drop-shadow-[0_0_8px_rgba(255,189,32,0.5)] transition-all hover:scale-110" stroke={1.5} size={32} /> : <IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-bright-sun-400 text-mine-shaft-400 transition-all hover:scale-110" stroke={1.5} size={32} />}
                </div>
            </div>
        </div>
        <Divider size="xs" my="xl" />
        <div className="flex justify-between gap-4 sm-mx:flex-wrap">
            {
                card.map((item, index) => <div key={index} className="flex flex-col text-sm gap-1 items-center ">
                    <ActionIcon className="!h-12 !w-12 xs-mx:!h-8 xs-mx:!w-8" variant="light" color="brightSun.4" radius="xl" ><item.icon className="h-4/5 w-4/5" /></ActionIcon>
                    <div className="text-mine-shaft-300 xs-mx:text-sm">{item.name}</div>
                    <div className="text-base font-semibold xs-mx:text-sm">{props ? props[item.id]:"NA"}{item.id==="packageOffered"&& <> LPA</>}</div>
                </div>)}
        </div>
        <Divider size="xs" my="xl" />
        <div>
            <div className="text-xl font-semibold mb-5">Required Skills</div>
            <div className="flex flex-wrap gap-2">
                {
                    props.skillsRequired?.map((skill:any, index:number) => <ActionIcon key={index} className="!h-fit !w-fit font-medium !text-sm xs-mx:!text-xs" variant="light" color="brightSun.4" p="xs" radius="xl">{skill}</ActionIcon>)
                }
            </div>
        </div>
        {/* AI Match Score – visible to APPLICANT only */}
        {user?.accountType === 'APPLICANT' && (
            <>
                <Divider size="xs" my="xl" />
                <div className="glass-card rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-xl font-semibold flex items-center gap-2">
                            <IconSparkles size={20} className="text-bright-sun-400" /> AI Match Score
                        </div>
                        {!matchScore && (
                            <Button
                                size="xs" variant="light" color="brightSun.4"
                                loading={matchLoading}
                                onClick={async () => {
                                    if (!props.about) { errorNotification("No job data", "Job info not loaded yet."); return; }
                                    setMatchLoading(true);
                                    try {
                                        // Build a rich profile summary from ALL available profile fields
                                        const skillsList = profile.skills?.length > 0
                                            ? `Skills: ${profile.skills.join(', ')}`
                                            : 'Skills: Not specified';
                                        const expList = profile.experiences?.length > 0
                                            ? `Experience: ${profile.experiences.map((e:any) => `${e.title} at ${e.company}`).join('; ')}`
                                            : profile.experience?.length > 0
                                            ? `Experience: ${profile.experience.map((e:any) => `${e.title} at ${e.company}`).join('; ')}`
                                            : 'Experience: Not specified';
                                        const aboutBlurb = profile.about ? `About: ${profile.about.substring(0, 200)}` : '';
                                        const titleBlurb = profile.jobTitle ? `Current Role: ${profile.jobTitle}` : '';
                                        const profileSummary = [titleBlurb, skillsList, expList, aboutBlurb].filter(Boolean).join('. ');
                                        const jobSummary = `Role: ${props.jobTitle} at ${props.company}. Required Skills: ${props.skillsRequired?.join(', ')}. ${props.about}`;
                                        const result = await getMatchScore(profileSummary, jobSummary);
                                        setMatchScore(result);
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
                        <div className="flex gap-6 items-start flex-wrap">
                            <RingProgress
                                size={110}
                                thickness={10}
                                label={<Text fw={700} ta="center" size="lg" c="brightSun.4">{matchScore.score ?? '?'}%</Text>}
                                sections={[{ value: matchScore.score ?? 0, color: matchScore.score >= 70 ? 'teal' : matchScore.score >= 40 ? 'yellow' : 'red' }]}
                            />
                            <div className="flex-1 min-w-[200px]">
                                <p className="text-mine-shaft-300 text-sm mb-3">{matchScore.summary}</p>
                                {matchScore.strengths?.length > 0 && (
                                    <div className="mb-2">
                                        <div className="text-sm font-semibold text-teal-400 mb-1">✅ Strengths</div>
                                        <div className="flex flex-wrap gap-1">{matchScore.strengths.map((s:string, i:number) => <Badge key={i} color="teal" variant="light" size="sm">{s}</Badge>)}</div>
                                    </div>
                                )}
                                {matchScore.gaps?.length > 0 && (
                                    <div>
                                        <div className="text-sm font-semibold text-red-400 mb-1">⚠️ Gaps</div>
                                        <div className="flex flex-wrap gap-1">{matchScore.gaps.map((g:string, i:number) => <Badge key={i} color="red" variant="light" size="sm">{g}</Badge>)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-mine-shaft-400 text-sm">Click "Check My Match" to see how well your profile fits this job using AI.</p>
                    )}
                </div>
            </>
        )}
        <div className="[&>h4]:text-xl [&_*]:text-mine-shaft-300 [&_li]:marker:text-bright-sun-300 [&_li]:mb-1 [&>h4]:text-mine-shaft-200 [&>h4]:font-semibold [&>h4]:my-5 [&_p]:text-justify [&_p]:text-sm [&_li]:text-sm" dangerouslySetInnerHTML={{ __html: cleanHTML }}>
        </div>
        <Divider size="xs" my="xl" />
        <div>
            <div className="text-xl font-semibold mb-5">About Company</div>
            <div className="flex items-center justify-between mb-3 xs-mx:flex-wrap xs-mx:gap-2">
                <div className="flex items-center gap-2">
                    <div className="p-3 bg-mine-shaft-800 rounded-xl flex ">
                        <img className="h-8" src={`/Icons/${props.company}.png`} alt="" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`} />
                    </div>
                    <div>
                        <div className="text-lg font-medium">{props.company}</div>
                        <div className="text-mine-shaft-300">10k+ Employees</div>
                    </div>
                </div>
                <Link to={`/company/${props.company}`}>
                    <Button color="brightSun.4" variant="light">Company Page</Button></Link>
            </div>
            <div className="text-mine-shaft-300 text-justify xs-mx:text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo fuga recusandae perferendis, excepturi nostrum debitis. Accusantium dolorum corrupti et mollitia unde? Possimus vero nemo maxime vitae impedit? Nisi, quos in. Facilis maiores in nostrum qui animi delectus architecto iste quidem soluta. Illo aspernatur saepe dolores minus soluta? Molestias, delectus eveniet.</div>
        </div>
    </div>
}
export default Job;