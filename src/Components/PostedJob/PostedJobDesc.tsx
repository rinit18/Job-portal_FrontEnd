import { Badge, Tabs } from "@mantine/core";
import Job from "../JobDesc/Job";
import KanbanBoard from "./KanbanBoard";
import { useEffect, useState } from "react";

const PostedJobDesc = (props:any) => {
    const [tab, setTab]=useState("overview");
    const handleTab=(value:any)=>{
        setTab(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{ handleTab("overview"); }, [props]);
    return <div data-aos="zoom-out" className=" w-3/4 md-mx:w-full px-5 md-mx:p-0">
        {props.jobTitle?<><div className="text-2xl xs-mx:text-xl font-semibold flex items-center ">{props?.jobTitle} <Badge variant="light" ml="sm" color="brightSun.4" size="sm">{props?.jobStatus}</Badge></div>
        <div className="font-medium xs-mx:text-sm text-mine-shaft-300 mb-5">{props?.location}</div>
        <div className="">
            <Tabs value={tab} onChange={handleTab} radius="lg" autoContrast variant="outline">
                <Tabs.List className="font-semibold [&_button[data-active='true']]:!border-b-mine-shaft-950 [&_button]:!text-xl sm-mx:[&_button]:!text-lg  xs-mx:[&_button]:!text-base xsm-mx:[&_button]:!text-sm xs-mx:[&_button]:!px-1.5 xs-mx:[&_button]:!py-2 mb-5 [&_button[data-active='true']]:text-bright-sun-400 xs-mx:font-medium">
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="pipeline">Pipeline (Kanban)</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="overview" className="[&>div]:w-full">{props.jobStatus==="CLOSED"?<Job {...props} edit={true} closed />:<Job {...props} edit={true}  />}</Tabs.Panel>
                <Tabs.Panel value="pipeline">
                    <KanbanBoard applicants={props.applicants} jobId={props.id} />
                </Tabs.Panel>
                
            </Tabs>
        </div></>:<div className="text-2xl font-semibold flex items-center justify-center min-h-[70vh]">Job Not Found.</div>}
    </div>
}
export default PostedJobDesc;