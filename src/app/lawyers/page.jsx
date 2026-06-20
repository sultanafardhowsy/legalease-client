"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LawyerDetailModal from "@/component/LawyerDetailModal"; 
import { useSession } from "@/lib/auth-client";
import {
    Avatar,
    Card,
    Chip,
    InputGroup, // 👈 Import just the base InputGroup wrapper
    Skeleton,
    Select,
    Label,
    ListBox,
    Button,
} from "@heroui/react";

import {
    Search,
    BriefcaseBusiness,
    CalendarDays,
    BadgeDollarSign,
} from "lucide-react";

export default function BrowseLawyersPage() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedLawyer, setSelectedLawyer] = useState(null);
const { data: session } = useSession(); // 👈 add this
    const currentUser = session?.user;

    useEffect(() => {
        getLawyers();
    }, [search, sortBy]); 

    const getLawyers = async () => {
        try {
            setLoading(true);
            const apiBase = process.env.NEXT_PUBLIC_SERVER_URL;
            
            const queryParams = new URLSearchParams({
                search: search,
                sort: sortBy
            });

            const response = await fetch(`${apiBase}/api/lawyers?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch lawyers");
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setLawyers(data);
            } else if (data && Array.isArray(data.lawyers)) {
                setLawyers(data.lawyers);
            } else if (data && Array.isArray(data.data)) {
                setLawyers(data.data);
            } else {
                setLawyers([]);
            }
        } catch (error) {
            console.error("Frontend Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLawyers = useMemo(() => {
        return Array.isArray(lawyers) ? lawyers : [];
    }, [lawyers]);

    return (
        <div className="mx-auto max-w-7xl px-5 py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold">Browse Lawyers</h1>
                <p className="mt-3 text-default-500">
                    Explore experienced legal professionals and find the right lawyer.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-10 grid gap-4 md:grid-cols-2 items-end">
                {/* 🤝 Fixed: Restored Web Dot-Notation & Removed isDecorative */}
                <InputGroup>
                    <InputGroup.Prefix>
                        <Search size={18} className="text-default-400" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                        placeholder="Search lawyer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>

                <Select
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    placeholder="Select sorting..."
                >
                    <Label>Sort By</Label>
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="newest" textValue="Newest">
                                Newest
                            </ListBox.Item>
                            <ListBox.Item id="fee-low" textValue="Lowest Fee">
                                Lowest Fee
                            </ListBox.Item>
                            <ListBox.Item id="fee-high" textValue="Highest Fee">
                                Highest Fee
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                        <Skeleton key={index} className="h-[350px] rounded-3xl" />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredLawyers.length === 0 && (
                <div className="rounded-3xl border p-14 text-center">
                    <h2 className="text-2xl font-bold">No lawyers found</h2>
                    <p className="mt-3 text-default-500">Try another search.</p>
                </div>
            )}

            {/* Lawyer Grid */}
            {!loading && filteredLawyers.length > 0 && (
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {filteredLawyers.map((lawyer) => (
                        <div key={lawyer._id} className="block group relative">
                            <Card className="h-full rounded-3xl border p-6 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl bg-background flex flex-col justify-between">
                                <div className="flex flex-col items-center text-center flex-grow">
                                    <Avatar className="h-28 w-28">
                                        {lawyer.imageUrl ? (
                                            <Avatar.Image
                                                src={lawyer.imageUrl}
                                                alt={lawyer.name || "Lawyer profile"}
                                            />
                                        ) : null}
                                        <Avatar.Fallback>
                                            {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
                                        </Avatar.Fallback>
                                    </Avatar>

                                    <h2 className="mt-5 text-xl font-bold line-clamp-1 text-foreground">
                                        {lawyer.name}
                                    </h2>

                                    <div className="mt-3 flex items-start gap-2 text-default-500 text-sm">
                                        <BriefcaseBusiness size={16} className="shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">
                                            {lawyer.specialization}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 font-semibold text-foreground">
                                        <BadgeDollarSign size={18} /> {lawyer.fee}
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-xs text-default-500">
                                        <CalendarDays size={14} />
                                        Joined {lawyer.dateJoined ? new Date(lawyer.dateJoined).toLocaleDateString() : "N/A"}
                                    </div>

                                    <Chip
                                        className="mt-4"
                                        color={lawyer.status === "Busy" ? "danger" : "success"}
                                        variant="flat"
                                    >
                                        {lawyer.status || "Available"}
                                    </Chip>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-2 pt-2 border-t border-divider">
                                    <Button
                                        size="sm"
                                        //variant="flat"
                                        color="primary"
                                        className="font-semibold text-xs rounded-xl"
                                        onPress={() => setSelectedLawyer(lawyer)}
                                    >
                                        View Details
                                    </Button>
                                    
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

             <LawyerDetailModal
            selectedLawyer={selectedLawyer}
            onClose={() => setSelectedLawyer(null)}
            currentUser={currentUser} // 👈 add this
        />
        </div>
    );
}