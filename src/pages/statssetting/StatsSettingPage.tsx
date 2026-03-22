/** @format */

import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserService } from "@/services";
import { IResponseStatus, IUserStats } from "@/types";
import { isSessionExpired, showError, showSuccess } from "@/utils";

const StatsSettingPage: React.FunctionComponent = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [stats, setStats] = React.useState<IUserStats | null>(null);

    const loadUserStats = async () => {
        try {
            setIsLoading(true);
            const res = await UserService.getUserStats();
            if (res.status === IResponseStatus.Success) {
                showSuccess(res.message!);
                setStats(res.data!);
            }
        } catch (error: any) {
            console.error("Failed to load stats", error);
            if (isSessionExpired(error)) return;
            showError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadUserStats();
    }, []);

    const statsInfo = useMemo(() => {
        return [
            { label: "Total Posts", value: stats?.totalPosts ?? 0 },
            { label: "Total Favorites", value: stats?.totalFavorites ?? 0 },
            { label: "Score", value: stats?.score ?? 0 },
        ];
    }, [stats]);

    return (
        <>
            <div className="mb-4 md:mb-6">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1">Stats</h1>
            </div>

            <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {statsInfo.map((stat, index) => (
                        <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 md:p-4 lg:p-5 hover:border-white/20 transition-colors">
                            <p className="text-xs font-medium text-white/40 mb-0.5 md:mb-1">{stat.label}</p>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-white/5 rounded-md animate-pulse mt-1" />
                            ) : (
                                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                            )}
                        </div>
                    ))}
                </div>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 md:p-5 lg:p-8">
                    <div className="mb-5 md:mb-8">
                        <h2 className="text-sm md:text-lg lg:text-xl font-bold text-white mb-0.5 md:mb-1">Favorites Over Time</h2>
                        <p className="text-xs text-white/40">Favorites received on your posts over the last 3 days</p>
                    </div>

                    <div className="h-[250px] md:h-[300px] lg:h-[400px] w-full">
                        {isLoading ? (
                            <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.favoriteTrend ?? []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                                        dy={8}
                                        tickFormatter={(val: string) => {
                                            const d = new Date(val);
                                            return `${d.getMonth() + 1}/${d.getDate()}`;
                                        }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0d0d0d",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "8px",
                                            fontSize: "11px",
                                            color: "#fff"
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Line type="monotone" dataKey="favorites" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export { StatsSettingPage };
