import { useState, useEffect } from "react";
import TalentCard from "../FindTalent/TalentCard";
import { changeAppStatus } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";

const KanbanBoard = ({ applicants, jobId, refresh }: any) => {
    // We maintain local state to instantly move cards (optimistic UI) before backend resolves
    const [localApplicants, setLocalApplicants] = useState(applicants || []);

    // Sync when parent re-fetches data (e.g., after page navigation)
    useEffect(() => {
        setLocalApplicants(applicants || []);
    }, [applicants]);
    
    const columns = [
        { id: "APPLIED", title: "Applied", color: "mineShaft.3" },
        { id: "INTERVIEWING", title: "Interviewing", color: "brightSun.4" },
        { id: "OFFERED", title: "Offered", color: "green.8" },
        { id: "REJECTED", title: "Rejected", color: "red.5" }
    ];

    const handleDragStart = (e: any, applicantId: string) => {
        e.dataTransfer.setData("applicantId", applicantId);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault(); // Required to allow drop
    };

    const handleDrop = (e: any, newStatus: string) => {
        e.preventDefault();
        const applicantId = e.dataTransfer.getData("applicantId");
        
        const candidate = localApplicants.find((x: any) => x.applicantId === applicantId);
        if (!candidate || candidate.applicationStatus === newStatus) return;

        // Optimistic UI Update
        setLocalApplicants((prev: any) => 
            prev.map((x: any) => x.applicantId === applicantId ? { ...x, applicationStatus: newStatus } : x)
        );

        // API Call
        const payload = {
            id: jobId,
            applicantId: applicantId,
            applicationStatus: newStatus,
            interviewTime: candidate.interviewTime || new Date()
        };

        changeAppStatus(payload).then(() => {
            successNotification('Status Updated', `Candidate moved to ${newStatus}`);
            if (refresh) refresh();
        }).catch((err) => {
            console.error(err);
            errorNotification('Update Failed', 'Failed to move candidate');
            // Revert on failure (could improve this, but reload is safest)
            if (refresh) refresh();
        });
    };

    return (
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 mt-5 w-full">
            {columns.map((col) => (
                <div 
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="min-w-[320px] flex-1 bg-mine-shaft-900/40 rounded-xl p-4 border border-mine-shaft-800 flex flex-col gap-4"
                >
                    {/* Column Header */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-lg flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${col.color.replace('.', '-')}`} 
                                 style={{ backgroundColor: col.color === "mineShaft.3" ? "#8c8c8c" : col.color === "brightSun.4" ? "#ffbd20" : col.color === "green.8" ? "#2b8a3e" : "#e03131" }}></div>
                            {col.title}
                        </div>
                        <div className="bg-mine-shaft-800 px-3 py-1 rounded-full text-sm font-medium">
                            {localApplicants.filter((x: any) => x.applicationStatus === col.id).length}
                        </div>
                    </div>

                    {/* Draggable Cards */}
                    <div className="flex flex-col gap-4 min-h-[500px]">
                        {localApplicants.filter((x: any) => x.applicationStatus === col.id).map((talent: any) => (
                            <div 
                                key={talent.applicantId}
                                draggable 
                                onDragStart={(e) => handleDragStart(e, talent.applicantId)}
                                className="cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                            >
                                <TalentCard {...talent} invited={col.id === "INTERVIEWING"} offered={col.id === "OFFERED" || col.id === "REJECTED"} />
                            </div>
                        ))}
                        {localApplicants.filter((x: any) => x.applicationStatus === col.id).length === 0 && (
                            <div className="h-full border-2 border-dashed border-mine-shaft-800 rounded-xl flex items-center justify-center text-mine-shaft-400 text-sm">
                                Drop candidates here
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
