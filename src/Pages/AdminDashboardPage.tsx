import { useEffect, useState } from "react";
import { getContactMessages, getFeedbacks, getPlatformStats } from "../Services/AdminService";
import { Loader, Table, Tabs, Badge, Rating } from "@mantine/core";
import { IconUsers, IconBriefcase, IconMessageCircle, IconMessages } from "@tabler/icons-react";

const AdminDashboardPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, feedbacksData, contactsData] = await Promise.all([
                    getPlatformStats(),
                    getFeedbacks(),
                    getContactMessages()
                ]);
                setStats(statsData);
                setFeedbacks(feedbacksData);
                setContacts(contactsData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="min-h-[85vh] flex items-center justify-center bg-mine-shaft-950"><Loader color="brightSun.4" size="xl" /></div>;
    }

    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins'] p-5 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div data-aos="fade-down" className="text-3xl font-bold text-mine-shaft-100 mb-8">Admin Dashboard</div>
                
                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <MetricCard title="Total Users" value={stats?.totalUsers || 0} icon={<IconUsers size={32} />} delay="0" />
                    <MetricCard title="Total Jobs" value={stats?.totalJobs || 0} icon={<IconBriefcase size={32} />} delay="100" />
                    <MetricCard title="Total Feedbacks" value={stats?.totalFeedback || 0} icon={<IconMessageCircle size={32} />} delay="200" />
                    <MetricCard title="Contact Requests" value={stats?.totalContactMessages || 0} icon={<IconMessages size={32} />} delay="300" />
                </div>

                {/* Data Tabs */}
                <div data-aos="fade-up" className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-6">
                    <Tabs color="brightSun.4" defaultValue="feedback">
                        <Tabs.List className="mb-6">
                            <Tabs.Tab value="feedback" leftSection={<IconMessageCircle size={16} />} className="text-lg">User Feedbacks</Tabs.Tab>
                            <Tabs.Tab value="contacts" leftSection={<IconMessages size={16} />} className="text-lg">Contact Requests</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="feedback">
                            {feedbacks.length === 0 ? <div className="text-mine-shaft-400 p-5 text-center">No feedback received yet.</div> : (
                                <div className="overflow-x-auto">
                                    <Table striped highlightOnHover className="text-mine-shaft-200">
                                        <Table.Thead className="text-mine-shaft-300">
                                            <Table.Tr>
                                                <Table.Th>Date</Table.Th>
                                                <Table.Th>Name</Table.Th>
                                                <Table.Th>Email</Table.Th>
                                                <Table.Th>Rating</Table.Th>
                                                <Table.Th>Review</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {feedbacks.map((f, i) => (
                                                <Table.Tr key={i}>
                                                    <Table.Td>{new Date(f.timestamp).toLocaleDateString()}</Table.Td>
                                                    <Table.Td>{f.name || <Badge color="gray" variant="light">Anonymous</Badge>}</Table.Td>
                                                    <Table.Td>{f.email || <Badge color="gray" variant="light">Anonymous</Badge>}</Table.Td>
                                                    <Table.Td><Rating value={f.rating} readOnly size="sm" color="brightSun.4" /></Table.Td>
                                                    <Table.Td className="max-w-xs truncate" title={f.review}>{f.review}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="contacts">
                            {contacts.length === 0 ? <div className="text-mine-shaft-400 p-5 text-center">No contact requests received yet.</div> : (
                                <div className="overflow-x-auto">
                                    <Table striped highlightOnHover className="text-mine-shaft-200">
                                        <Table.Thead className="text-mine-shaft-300">
                                            <Table.Tr>
                                                <Table.Th>Date</Table.Th>
                                                <Table.Th>Name</Table.Th>
                                                <Table.Th>Email</Table.Th>
                                                <Table.Th>Subject</Table.Th>
                                                <Table.Th>Message</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {contacts.map((c, i) => (
                                                <Table.Tr key={i}>
                                                    <Table.Td>{new Date(c.timestamp).toLocaleDateString()}</Table.Td>
                                                    <Table.Td>{c.name}</Table.Td>
                                                    <Table.Td>{c.email}</Table.Td>
                                                    <Table.Td className="font-semibold">{c.subject}</Table.Td>
                                                    <Table.Td className="max-w-xs truncate" title={c.message}>{c.message}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, delay }: any) => (
    <div data-aos="fade-up" data-aos-delay={delay} className="glass-card p-6 rounded-xl flex items-center justify-between hover:shadow-[0_0_10px_1px_yellow] !shadow-bright-sun-400/20 transition duration-300">
        <div>
            <div className="text-mine-shaft-400 text-sm mb-1">{title}</div>
            <div className="text-3xl font-bold text-mine-shaft-100">{value}</div>
        </div>
        <div className="p-4 bg-mine-shaft-800 rounded-full text-bright-sun-400">
            {icon}
        </div>
    </div>
);

export default AdminDashboardPage;
