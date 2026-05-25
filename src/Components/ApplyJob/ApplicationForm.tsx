import { Button, FileInput, NumberInput, Stepper, Textarea, TextInput, Group, Paper } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBase64 } from "../../Services/Utilities";
import { applyJob } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import ReactConfetti from 'react-confetti';

const ApplicationForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const user = useSelector((state: any) => state.user);
    const [submit, setSubmit] = useState(false);
    const [active, setActive] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            name: user.name,
            email: user.email,
            phone: '',
            website: '',
            resume: null,
            coverLetter: ''
        },
        validate: {
            name: (value) => active === 0 ? isNotEmpty('Name cannot be empty')(value) : null,
            email: (value) => active === 0 ? isNotEmpty('Email cannot be empty')(value) : null,
            phone: (value) => active === 0 ? isNotEmpty('Phone cannot be empty')(value) : null,
            website: (value) => active === 0 ? isNotEmpty('Website cannot be empty')(value) : null,
            resume: (value) => active === 1 ? isNotEmpty('Resume cannot be empty')(value) : null,
        }
    });

    const nextStep = () => {
        form.validate();
        if (!form.isValid()) return;
        setActive((current) => (current < 3 ? current + 1 : current));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async() => {
        setSubmit(true);
        let resume: any = await getBase64(form.getValues().resume);
        let applicant = { ...form.getValues(), applicantId: user.id, resume: resume.split(',')[1] };
        
        applyJob(applicant, id).then((res) => {
            setSubmit(false);
            setShowConfetti(true);
            successNotification("Success", "Job Applied Successfully");
            setTimeout(() => {
                navigate("/job-history");
            }, 3000);
        }).catch((err) => { 
            setSubmit(false);
            errorNotification("Error", err.response.data.errorMessage);
        });
    }

    return (
        <div className="relative">
            {showConfetti && <div className="fixed inset-0 z-[100] pointer-events-none"><ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} /></div>}
            <div className="text-2xl font-bold mb-8 text-mine-shaft-100">Apply for this Role</div>
            
            <Stepper active={active} onStepClick={setActive} color="brightSun.4" allowNextStepsSelect={false} size="sm" className="mb-10">
                <Stepper.Step label="Personal Info" description="Contact details">
                    <Paper withBorder shadow="sm" radius="md" p="xl" className="bg-mine-shaft-900 border-mine-shaft-800 mt-5">
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-6 md-mx:gap-4 sm-mx:flex-col">
                                <TextInput className="flex-1" {...form.getInputProps("name")} readOnly variant="filled" label="Full Name" withAsterisk placeholder="Enter name" />
                                <TextInput className="flex-1" {...form.getInputProps("email")} variant="filled" readOnly label="Email" withAsterisk placeholder="Enter email" />
                            </div>
                            <div className="flex gap-6 md-mx:gap-4 sm-mx:flex-col">
                                <NumberInput className="flex-1" {...form.getInputProps("phone")} clampBehavior="strict" min={0} max={9999999999} label="Phone Number" withAsterisk placeholder="Enter phone" hideControls />
                                <TextInput className="flex-1" {...form.getInputProps("website")} label="Personal Website" withAsterisk placeholder="Enter url" />
                            </div>
                        </div>
                    </Paper>
                </Stepper.Step>
                
                <Stepper.Step label="Documents" description="Resume & Cover Letter">
                    <Paper withBorder shadow="sm" radius="md" p="xl" className="bg-mine-shaft-900 border-mine-shaft-800 mt-5">
                        <div className="flex flex-col gap-6">
                            <FileInput 
                                {...form.getInputProps("resume")} 
                                withAsterisk 
                                size="lg"
                                leftSection={<IconUpload size={20} stroke={1.5} />} 
                                accept="application/pdf" 
                                label="Resume / CV" 
                                description="Upload a PDF file up to 5MB"
                                placeholder="Click to attach Resume/CV" 
                                className="[&_button]:!bg-mine-shaft-800"
                            />
                            <Textarea 
                                {...form.getInputProps("coverLetter")} 
                                placeholder="Type something about yourself, why you're a good fit..." 
                                label="Cover Letter (Optional)" 
                                autosize 
                                minRows={6} 
                            />
                        </div>
                    </Paper>
                </Stepper.Step>
                
                <Stepper.Step label="Review" description="Submit application">
                    <Paper withBorder shadow="sm" radius="md" p="xl" className="bg-mine-shaft-900 border-mine-shaft-800 mt-5">
                        <div className="text-xl font-semibold mb-6 text-bright-sun-400">Review Application</div>
                        <div className="grid grid-cols-2 gap-6 sm-mx:grid-cols-1">
                            <div>
                                <div className="text-mine-shaft-400 text-sm mb-1">Full Name</div>
                                <div className="font-medium text-mine-shaft-100">{form.getValues().name}</div>
                            </div>
                            <div>
                                <div className="text-mine-shaft-400 text-sm mb-1">Email</div>
                                <div className="font-medium text-mine-shaft-100">{form.getValues().email}</div>
                            </div>
                            <div>
                                <div className="text-mine-shaft-400 text-sm mb-1">Phone</div>
                                <div className="font-medium text-mine-shaft-100">{form.getValues().phone}</div>
                            </div>
                            <div>
                                <div className="text-mine-shaft-400 text-sm mb-1">Website</div>
                                <div className="font-medium text-mine-shaft-100">{form.getValues().website}</div>
                            </div>
                            <div className="col-span-2 sm-mx:col-span-1">
                                <div className="text-mine-shaft-400 text-sm mb-1">Resume Attached</div>
                                <div className="font-medium text-teal-400 flex items-center gap-2">
                                    <IconCheck size={18} /> {(form.getValues().resume as any)?.name || 'Document uploaded'}
                                </div>
                            </div>
                        </div>
                    </Paper>
                </Stepper.Step>

                <Stepper.Completed>
                    <Paper withBorder shadow="sm" radius="md" p="xl" className="bg-mine-shaft-900 border-mine-shaft-800 mt-5 text-center flex flex-col items-center py-12">
                        <div className="w-20 h-20 bg-teal-400/20 rounded-full flex items-center justify-center mb-4">
                            <IconCheck size={40} className="text-teal-400" />
                        </div>
                        <div className="text-2xl font-bold text-mine-shaft-100 mb-2">Ready to Submit!</div>
                        <div className="text-mine-shaft-300 max-w-md">Your application is ready. Click the submit button below to send your profile to the employer.</div>
                    </Paper>
                </Stepper.Completed>
            </Stepper>

            <Group justify="space-between" mt="xl">
                <Button variant="default" onClick={prevStep} disabled={active === 0 || submit}>Back</Button>
                {active < 3 ? (
                    <Button color="brightSun.4" variant="light" onClick={nextStep}>Next step</Button>
                ) : (
                    <Button loading={submit} color="brightSun.4" variant="light" onClick={handleSubmit}>Submit Application</Button>
                )}
            </Group>
        </div>
    );
}

export default ApplicationForm;