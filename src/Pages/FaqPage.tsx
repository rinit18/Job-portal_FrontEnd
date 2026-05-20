import { Accordion, Divider, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { getFAQs } from "../Services/SupportService";
import { IconPlus } from "@tabler/icons-react";

const FaqPage = () => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFAQs()
            .then(res => {
                setFaqs(res);
            })
            .catch(err => console.log("Error fetching FAQs", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-2 text-center">Frequently Asked Questions</div>
                <div data-aos="fade-up" className="text-mine-shaft-400 mb-10 text-center">Everything you need to know about JobHook.</div>
                
                {loading ? (
                    <div className="flex justify-center my-20"><Loader color="brightSun.4" /></div>
                ) : (
                    <Accordion 
                        data-aos="fade-up" 
                        data-aos-delay="100"
                        variant="separated" 
                        radius="md" 
                        chevron={<IconPlus className="text-bright-sun-400" size={20} />}
                        classNames={{
                            item: 'bg-mine-shaft-900 border border-mine-shaft-800 mb-4',
                            control: 'hover:bg-mine-shaft-800/50 rounded-md',
                            label: 'text-mine-shaft-100 font-medium',
                            content: 'text-mine-shaft-300'
                        }}
                    >
                        {faqs.map((faq, index) => (
                            <Accordion.Item key={index} value={`faq-${index}`}>
                                <Accordion.Control>{faq.question}</Accordion.Control>
                                <Accordion.Panel>{faq.answer}</Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
};

export default FaqPage;
