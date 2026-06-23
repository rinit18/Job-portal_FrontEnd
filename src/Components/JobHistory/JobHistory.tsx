import { Tabs } from "@mantine/core";
import Card from "./Card";
import { useEffect, useState } from "react";
import { getJobHistory, getSavedJobs } from "../../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

const TABS = [
    { value: "APPLIED",      label: "Applied" },
    { value: "SAVED",        label: "Saved" },
    { value: "OFFERED",      label: "Offered" },
    { value: "INTERVIEWING", label: "In Progress" },
    { value: "ACCEPTED",     label: "Accepted" },
    { value: "REJECTED",     label: "Rejected" },
];

const JobHistory = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const [activeTab, setActiveTab] = useState<any>("APPLIED");
    const [showList, setShowList] = useState<any>([]);

    const fetchJobs = async (tab: string) => {
        dispatch(showOverlay());
        try {
            if (tab === "SAVED") {
                if (profile?.savedJobs?.length > 0) {
                    const jobs = await getSavedJobs(profile.savedJobs);
                    setShowList(jobs);
                } else {
                    setShowList([]);
                }
            } else {
                const jobs = await getJobHistory(user.id, tab);
                setShowList(jobs);
            }
        } catch (error) {
            console.error("Error fetching jobs", error);
            setShowList([]);
        } finally {
            dispatch(hideOverlay());
        }
    };

    useEffect(() => {
        if (user?.id) fetchJobs(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, profile?.savedJobs]);

    const handleTabChange = (value: string | null) => {
        if (!value) return;
        setActiveTab(value);
        fetchJobs(value);
    };

    const emptyMessages: Record<string, string> = {
        APPLIED:      "No jobs applied to yet. Start applying!",
        SAVED:        "No saved jobs. Bookmark jobs you're interested in.",
        OFFERED:      "No offers yet. Keep applying!",
        INTERVIEWING: "No interviews scheduled yet.",
        ACCEPTED:     "No accepted offers yet.",
        REJECTED:     "No declined offers.",
    };

    return (
        <div>
            <div className="text-2xl font-semibold mb-5">Job History</div>
            <Tabs value={activeTab} onChange={handleTabChange} radius="lg" autoContrast variant="outline">
                <Tabs.List className="font-semibold [&_button[data-active='true']]:!border-b-mine-shaft-950 [&_button]:!text-base sm-mx:[&_button]:!text-sm xs-mx:[&_button]:!text-sm xs-mx:[&_button]:!px-2 xs-mx:[&_button]:!py-2 mb-5 [&_button[data-active='true']]:text-bright-sun-400 flex-wrap gap-y-1">
                    {TABS.map(tab => (
                        <Tabs.Tab key={tab.value} value={tab.value}>
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <Tabs.Panel value={activeTab} className="[&>div]:w-full">
                    <div className="flex mt-10 flex-wrap gap-5">
                        {showList.length > 0
                            ? showList.map((item: any, index: any) => (
                                <Card
                                    key={index}
                                    {...item}
                                    {...{ [activeTab.toLowerCase()]: true }}
                                />
                            ))
                            : (
                                <div className="text-lg font-medium text-mine-shaft-400">
                                    {emptyMessages[activeTab] || "Nothing to show."}
                                </div>
                            )
                        }
                    </div>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default JobHistory;