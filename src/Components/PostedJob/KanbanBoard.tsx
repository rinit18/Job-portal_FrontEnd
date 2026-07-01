import { useState, useEffect } from "react";
import TalentCard from "../FindTalent/TalentCard";
import { changeAppStatus } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { DndContext, useDroppable, useDraggable, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

// 1. Draggable Card Component
const DraggableTalentCard = ({ talent, id, invited, offered }: any) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { talent }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : 1,
        opacity: isDragging ? 0.3 : 1,
    } : undefined;

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className={`cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform touch-none ${isDragging ? 'shadow-2xl' : ''}`}
        >
            {/* We render the card inside a div so the events apply to the wrapper */}
            <div className="pointer-events-none">
                <TalentCard {...talent} invited={invited} offered={offered} />
            </div>
        </div>
    );
};

// 2. Droppable Column Component
const DroppableColumn = ({ id, col, localApplicants }: any) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const colApplicants = localApplicants.filter((x: any) => x.applicationStatus === id);

    return (
        <div 
            ref={setNodeRef}
            className={`min-w-[320px] flex-1 bg-mine-shaft-900/40 rounded-xl p-4 border flex flex-col gap-4 transition-colors duration-200 ${isOver ? 'border-bright-sun-400 bg-mine-shaft-900/70 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'border-mine-shaft-800'}`}
        >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: col.color === "mineShaft.3" ? "#8c8c8c" : col.color === "brightSun.4" ? "#ffbd20" : col.color === "green.8" ? "#2b8a3e" : "#e03131" }}></div>
                    {col.title}
                </div>
                <div className="bg-mine-shaft-800 px-3 py-1 rounded-full text-sm font-medium shadow-inner">
                    {colApplicants.length}
                </div>
            </div>

            {/* Draggable Cards */}
            <div className="flex flex-col gap-4 min-h-[500px]">
                {colApplicants.map((talent: any) => (
                    <DraggableTalentCard 
                        key={talent.applicantId} 
                        id={talent.applicantId} 
                        talent={talent} 
                        invited={col.id === "INTERVIEWING"} 
                        offered={col.id === "OFFERED" || col.id === "REJECTED"} 
                    />
                ))}
                {colApplicants.length === 0 && (
                    <div className="h-full border-2 border-dashed border-mine-shaft-800/60 rounded-xl flex items-center justify-center text-mine-shaft-500 text-sm italic">
                        Drop candidates here
                    </div>
                )}
            </div>
        </div>
    );
};

// 3. Main Board Component
const KanbanBoard = ({ applicants, jobId, refresh }: any) => {
    // We maintain local state to instantly move cards (optimistic UI) before backend resolves
    const [localApplicants, setLocalApplicants] = useState(applicants || []);
    const [activeId, setActiveId] = useState<string | null>(null);

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

    // Ensure buttons inside the card can still be clicked by requiring 5px of movement before dragging starts
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const applicantId = active.id;
        const newStatus = over.id; // The droppable column ID

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
            // Revert on failure
            if (refresh) refresh();
        });
    };

    const activeCandidate = activeId ? localApplicants.find((x: any) => x.applicantId === activeId) : null;

    return (
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 mt-5 w-full">
                {columns.map((col) => (
                    <DroppableColumn 
                        key={col.id} 
                        id={col.id} 
                        col={col} 
                        localApplicants={localApplicants} 
                    />
                ))}
            </div>
            
            {/* DragOverlay creates a snapshot of the card while dragging for smooth physics */}
            <DragOverlay dropAnimation={null}>
                {activeCandidate ? (
                    <div className="shadow-2xl rotate-3 scale-105 opacity-90 cursor-grabbing z-[1000] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
                        <div className="pointer-events-none">
                            <TalentCard 
                                {...activeCandidate} 
                                invited={activeCandidate.applicationStatus === "INTERVIEWING"} 
                                offered={activeCandidate.applicationStatus === "OFFERED" || activeCandidate.applicationStatus === "REJECTED"} 
                            />
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
