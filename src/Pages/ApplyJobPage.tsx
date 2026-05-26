import { Button, Divider, Alert } from "@mantine/core";
import ApplyJobComp from "../Components/ApplyJob/ApplyJobComp";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getJob } from "../Services/JobService";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import { useDispatch, useSelector } from "react-redux";
import { errorNotification } from "../Services/NotificationService";

const ApplyJobPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const user = useSelector((state: any) => state.user);
    const [job, setJob] = useState<any>(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(showOverlay());
        getJob(id)
            .then((res) => {
                if (!res) {
                    navigate("/not-found");
                    return;
                }
                // BUG-7 FIX: Check if user already applied before showing the form
                const hasApplied = res.applicants?.some(
                    (a: any) => String(a.applicantId) === String(user?.id)
                );
                if (hasApplied) {
                    setAlreadyApplied(true);
                    setJob(res);
                    return;
                }
                setJob(res);
            })
            .catch((err) => {
                console.log(err);
                errorNotification("Error", "Could not load job details.");
                navigate("/find-jobs");
            })
            .finally(() => dispatch(hideOverlay()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] p-4">
            <Divider size="xs" mb="xs" />
            <Button
                color="brightSun.4"
                mb="xl"
                onClick={() => navigate(-1)}
                leftSection={<IconArrowLeft size={20} />}
                variant="light"
            >
                Back
            </Button>

            {/* BUG-7 FIX: Show clear message if already applied */}
            {alreadyApplied ? (
                <div className="w-2/3 bs-mx:w-4/5 sm-mx:w-full m-auto flex flex-col gap-6">
                    {job && (
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-mine-shaft-800 rounded-xl">
                                <img
                                    className="h-14 xs-mx:h-10 object-contain"
                                    src={`/Icons/${job.company}.png`}
                                    alt=""
                                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || "Company")}&color=fab005&background=2a2a2a`)}
                                />
                            </div>
                            <div>
                                <div className="font-semibold text-2xl">{job.jobTitle}</div>
                                <div className="text-mine-shaft-300">{job.company}</div>
                            </div>
                        </div>
                    )}
                    <Alert
                        icon={<IconInfoCircle size={20} />}
                        title="Already Applied"
                        color="brightSun.4"
                        variant="light"
                        className="text-base"
                    >
                        You have already submitted an application for this position.
                        Track its status in your{" "}
                        <span
                            className="underline cursor-pointer text-bright-sun-400 font-semibold"
                            onClick={() => navigate("/job-history")}
                        >
                            Job History
                        </span>
                        .
                    </Alert>
                </div>
            ) : (
                <ApplyJobComp {...job} />
            )}
        </div>
    );
};

export default ApplyJobPage;