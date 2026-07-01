import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { IconChartBar, IconChartPie, IconUsers } from '@tabler/icons-react';

const COLORS = ['#fab005', '#22b8cf', '#40c057', '#fa5252'];

const Analytics = (props: any) => {
    const applicants = props.applicants || [];

    // Funnel Data
    const statusCounts = {
        APPLIED: 0,
        INTERVIEWING: 0,
        OFFERED: 0,
        REJECTED: 0
    };

    applicants.forEach((a: any) => {
        if (statusCounts[a.applicationStatus as keyof typeof statusCounts] !== undefined) {
            statusCounts[a.applicationStatus as keyof typeof statusCounts]++;
        }
    });

    const funnelData = [
        { name: 'Applied', value: statusCounts.APPLIED },
        { name: 'Interviewing', value: statusCounts.INTERVIEWING },
        { name: 'Offered', value: statusCounts.OFFERED },
        { name: 'Rejected', value: statusCounts.REJECTED },
    ];

    const pieData = funnelData.filter(d => d.value > 0);

    return (
        <div className="flex flex-col gap-6 w-full py-4">
            <div className="grid grid-cols-3 sm-mx:grid-cols-1 gap-4">
                <div className="bg-mine-shaft-900/40 p-4 rounded-xl border border-mine-shaft-800/60 flex items-center gap-4 shadow-sm hover:border-bright-sun-400/30 transition-colors">
                    <div className="p-3 bg-bright-sun-400/10 rounded-lg text-bright-sun-400">
                        <IconUsers size={24} />
                    </div>
                    <div>
                        <div className="text-mine-shaft-300 text-xs font-bold uppercase tracking-wider">Total Applicants</div>
                        <div className="text-2xl font-bold text-white">{applicants.length}</div>
                    </div>
                </div>
                <div className="bg-mine-shaft-900/40 p-4 rounded-xl border border-mine-shaft-800/60 flex items-center gap-4 shadow-sm hover:border-teal-400/30 transition-colors">
                    <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400">
                        <IconChartBar size={24} />
                    </div>
                    <div>
                        <div className="text-mine-shaft-300 text-xs font-bold uppercase tracking-wider">Interviewing</div>
                        <div className="text-2xl font-bold text-white">{statusCounts.INTERVIEWING}</div>
                    </div>
                </div>
                <div className="bg-mine-shaft-900/40 p-4 rounded-xl border border-mine-shaft-800/60 flex items-center gap-4 shadow-sm hover:border-green-400/30 transition-colors">
                    <div className="p-3 bg-green-400/10 rounded-lg text-green-400">
                        <IconChartPie size={24} />
                    </div>
                    <div>
                        <div className="text-mine-shaft-300 text-xs font-bold uppercase tracking-wider">Offers Extended</div>
                        <div className="text-2xl font-bold text-white">{statusCounts.OFFERED}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg-mx:grid-cols-1 gap-6">
                <div className="bg-mine-shaft-900/30 p-5 rounded-xl border border-mine-shaft-800/50 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-shadow">
                    <div className="text-sm font-bold text-mine-shaft-100 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <IconChartBar size={18} className="text-bright-sun-400" />
                        Conversion Funnel
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip 
                                    cursor={{fill: '#2d2d2d', opacity: 0.4}} 
                                    contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d', borderRadius: '8px', color: '#f6f6f6'}} 
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-mine-shaft-900/30 p-5 rounded-xl border border-mine-shaft-800/50 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-shadow">
                    <div className="text-sm font-bold text-mine-shaft-100 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <IconChartPie size={18} className="text-bright-sun-400" />
                        Status Distribution
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {pieData.map((entry, index) => {
                                            const originalIndex = funnelData.findIndex(f => f.name === entry.name);
                                            return <Cell key={`cell-${index}`} fill={COLORS[originalIndex]} />;
                                        })}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d', borderRadius: '8px', color: '#f6f6f6'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-mine-shaft-500 font-medium text-sm border border-mine-shaft-800/60 rounded-xl p-4 bg-mine-shaft-900/20">
                                No applicants yet to show distribution.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
