import { Button, Divider, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconCalendarMonth, IconClockHour3, IconCheck, IconX } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { changeProfile } from "../../Slices/ProfileSlice";
import { changeAppStatus } from "../../Services/JobService";
import { useState } from "react";
import { errorNotification, successNotification } from "../../Services/NotificationService";

const Card = (props: any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [offerHandled, setOfferHandled] = useState(false);

    const handleSaveJob = () => {
        let savedJobs: any = [...(profile.savedJobs || [])];
        if (savedJobs.includes(props.id)) {
            savedJobs = savedJobs.filter((job: any) => job !== props.id);
        } else {
            savedJobs.push(props.id);
        }
        let updatedProfile = { ...profile, savedJobs: savedJobs };
        dispatch(changeProfile(updatedProfile));
    };

    const handleAcceptOffer = async () => {
        setAccepting(true);
        try {
            await changeAppStatus({
                id: props.id,
                applicantId: user.id,
                applicationStatus: "ACCEPTED",
            });
            setOfferHandled(true);
            successNotification("Offer Accepted 🎉", `You have accepted the offer for ${props.jobTitle}`);
        } catch (err: any) {
            errorNotification("Error", err?.response?.data?.errorMessage || "Could not accept offer.");
        } finally {
            setAccepting(false);
        }
    };

    const handleRejectOffer = async () => {
        setRejecting(true);
        try {
            await changeAppStatus({
                id: props.id,
                applicantId: user.id,
                applicationStatus: "REJECTED",
            });
            setOfferHandled(true);
            successNotification("Offer Declined", `You have declined the offer for ${props.jobTitle}`);
        } catch (err: any) {
            errorNotification("Error", err?.response?.data?.errorMessage || "Could not decline offer.");
        } finally {
            setRejecting(false);
        }
    };

    // Format interview time from backend (ISO string)
    const formatInterviewTime = (isoTime: string) => {
        if (!isoTime) return null;
        try {
            const d = new Date(isoTime);
            return d.toLocaleString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return isoTime;
        }
    };

    return (
        <div data-aos="zoom-out" className="p-4 rounded-xl glass-card hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300 ease-in-out w-72 sm-mx:w-full flex flex-col gap-3">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <div className="p-2 bg-mine-shaft-800 rounded-md">
                        <img
                            className="h-7 object-contain"
                            src={`/Icons/${props.company}.png`}
                            alt=""
                            onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company || "Company")}&color=fab005&background=2a2a2a`)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="font-semibold">{props.jobTitle}</div>
                        {/* BUG-4 FIX: correct company link */}
                        <div className="text-xs text-mine-shaft-300">
                            <Link className="hover:text-mine-shaft-200" to={`/company/${props.company}`}>{props.company}</Link>
                            {" • "}{props.applicants ? props.applicants.length : 0} Applicants
                        </div>
                    </div>
                </div>
                {profile.savedJobs?.includes(props.id)
                    ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-bright-sun-400" stroke={1.5} />
                    : <IconBookmark onClick={handleSaveJob} className="cursor-pointer text-mine-shaft-300" stroke={1.5} />
                }
            </div>

            <div className="flex gap-2">
                <div className="p-2 py-1 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.experience}</div>
                <div className="p-2 py-1 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.jobType}</div>
                <div className="p-2 py-1 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.location}</div>
            </div>

            <div>
                <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>{props.about}</Text>
            </div>

            <Divider color="mineShaft.7" size="xs" />

            <div className="flex justify-between">
                <div className="font-semibold text-mine-shaft-200">&#8377;{props.packageOffered} LPA</div>
                <div className="text-xs flex gap-1 items-center text-mine-shaft-400">
                    <IconClockHour3 className="h-5 w-5" stroke={1.5} />
                    {props.applied || props.interviewing ? "Applied" : props.offered ? "Offered" : "Posted"} {timeAgo(props.postTime)}
                </div>
            </div>

            {/* BUG-5 FIX: Wire Accept/Reject to backend */}
            {props.offered && !offerHandled && (
                <>
                    <Divider color="mineShaft.7" size="xs" />
                    <div className="flex gap-2">
                        <Button
                            color="brightSun.4"
                            variant="outline"
                            fullWidth
                            leftSection={<IconCheck size={16} />}
                            loading={accepting}
                            disabled={rejecting}
                            onClick={handleAcceptOffer}
                        >
                            Accept
                        </Button>
                        <Button
                            color="red.6"
                            variant="light"
                            fullWidth
                            leftSection={<IconX size={16} />}
                            loading={rejecting}
                            disabled={accepting}
                            onClick={handleRejectOffer}
                        >
                            Decline
                        </Button>
                    </div>
                </>
            )}

            {offerHandled && (
                <div className="text-xs text-center text-mine-shaft-400 italic">Response submitted</div>
            )}

            {/* BUG-3 FIX: Dynamic interview time from backend */}
            {props.interviewing && props.interviewTime && (
                <>
                    <Divider color="mineShaft.7" size="xs" />
                    <div className="flex gap-1 text-sm items-center">
                        <IconCalendarMonth className="text-bright-sun-400 w-5 h-5" stroke={1.5} />
                        <span className="text-mine-shaft-400">{formatInterviewTime(props.interviewTime)}</span>
                    </div>
                </>
            )}

            <Link to={`/jobs/${props.id}`}>
                <Button color="brightSun.4" variant="light" fullWidth>View Job</Button>
            </Link>
        </div>
    );
};

export default Card;