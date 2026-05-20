import { Button, Divider, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { submitContact } from "../Services/SupportService";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMail, IconUser, IconMessage } from "@tabler/icons-react";

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitContact(formData);
            notifications.show({
                title: 'Success',
                message: 'Your message has been sent successfully. We will get back to you soon!',
                icon: <IconCheck size={20} />,
                color: 'teal',
                withBorder: true,
                className: '!border-teal-500'
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to send message. Please try again later.',
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
            <div className="max-w-2xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-2 text-center">Contact Us</div>
                <div data-aos="fade-up" className="text-mine-shaft-400 mb-10 text-center">Have a question? We'd love to hear from you.</div>
                
                <form data-aos="fade-up" data-aos-delay="100" onSubmit={handleSubmit} className="glass-card p-8 rounded-xl flex flex-col gap-5">
                    <div className="flex gap-4 sm-mx:flex-col">
                        <TextInput 
                            className="flex-1"
                            label="Your Name" 
                            placeholder="John Doe" 
                            required 
                            leftSection={<IconUser size={16} className="text-mine-shaft-400" />}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100', label: 'text-mine-shaft-300' }}
                        />
                        <TextInput 
                            className="flex-1"
                            label="Email Address" 
                            placeholder="john@example.com" 
                            required 
                            type="email"
                            leftSection={<IconMail size={16} className="text-mine-shaft-400" />}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100', label: 'text-mine-shaft-300' }}
                        />
                    </div>
                    <TextInput 
                        label="Subject" 
                        placeholder="How can we help?" 
                        required 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        classNames={{ input: 'bg-mine-shaft-900 border-mine-shaft-800 focus:border-bright-sun-400 text-mine-shaft-100', label: 'text-mine-shaft-300' }}
                    />
                    <Textarea 
                        label="Message" 
                        placeholder="Tell us more about your inquiry..." 
                        required 
                        minRows={5}
                        leftSection={<IconMessage size={16} className="text-mine-shaft-400 mb-auto mt-2" />}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                        Send Message
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
