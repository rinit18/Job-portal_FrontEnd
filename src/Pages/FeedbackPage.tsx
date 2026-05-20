import { Button, Divider, Rating, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { submitFeedback } from "../Services/SupportService";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMail, IconUser } from "@tabler/icons-react";

const FeedbackPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", rating: 0, review: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.rating === 0) {
            notifications.show({ title: 'Error', message: 'Please select a rating', color: 'red' });
            return;
        }
        
        setLoading(true);
        try {
            await submitFeedback(formData);
            notifications.show({
                title: 'Thank You!',
                message: 'Your feedback has been submitted successfully.',
                icon: <IconCheck size={20} />,
                color: 'teal',
                withBorder: true,
                className: '!border-teal-500'
            });
            setFormData({ name: "", email: "", rating: 0, review: "" });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to submit feedback. Please try again later.',
                color: 'red',
                withBorder: true,
                className: '!border-red-500'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-2 text-center">Share Your Feedback</div>
                <div data-aos="fade-up" className="text-mine-shaft-400 mb-10 text-center">Your thoughts help us improve JobHook.</div>
                
                <form data-aos="fade-up" data-aos-delay="100" onSubmit={handleSubmit} className="glass-card p-8 rounded-xl flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="text-mine-shaft-100 font-medium text-lg">How would you rate your experience?</div>
                        <Rating 
                            size="xl" 
                            color="brightSun.4"
                            value={formData.rating} 
                            onChange={(val) => setFormData({...formData, rating: val})} 
                        />
                    </div>
                    
                    <TextInput 
                        label="Name (Optional)" 
                        placeholder="John Doe" 
                        leftSection={<IconUser size={16} className="text-mine-shaft-400" />}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100', label: 'text-mine-shaft-300' }}
                    />
                    <TextInput 
                        label="Email (Optional)" 
                        placeholder="john@example.com" 
                        type="email"
                        leftSection={<IconMail size={16} className="text-mine-shaft-400" />}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100', label: 'text-mine-shaft-300' }}
                    />
                    <Textarea 
                        label="Your Review" 
                        placeholder="What do you like or dislike about our platform?" 
                        required 
                        minRows={4}
                        value={formData.review}
                        onChange={(e) => setFormData({...formData, review: e.target.value})}
                        classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100 pt-2', label: 'text-mine-shaft-300' }}
                    />
                    <Button 
                        type="submit" 
                        color="brightSun.4" 
                        variant="light" 
                        size="md" 
                        className="mt-2"
                        loading={loading}
                    >
                        Submit Feedback
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
