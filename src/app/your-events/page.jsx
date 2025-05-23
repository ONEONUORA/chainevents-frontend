"use client";

import Image from "next/image";
import EventCard from "@/components/EventCard";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";
import { ChevronDown } from "lucide-react";
const fetchUserEvents = async ({ queryKey }) => {
  const { event_owner_address, page, per_page } = queryKey[0];

  // Build query parameters conditionally
  const params = new URLSearchParams();
  if (page !== undefined && page !== null) {
    params.append("page", page);
  }
  if (per_page !== undefined && per_page !== null) {
    params.append("per_page", per_page);
  }

  const queryString = params.toString();

  const url = `https://chainevents-backend.onrender.com/event/owner/${event_owner_address}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const json = await response.json();

  console.log("data", json.data.data);

  return json.data.data;
};

const YourEvents = ({ page, per_page }) => {
  const { address } = useAccount();

  // const test_owner_address = "34875urijkdfrhutri4jo35u4930984";

  const {
    data: events,
    error,
    isLoading,
  } = useQuery({
    queryKey: [{ event_owner_address: address, page, per_page }],
    queryFn: fetchUserEvents,
    enabled: !!address,
  });

  return (
    <div className="text-white overflow-x-hidden flex flex-col items-center text-center bg-primaryBackground bg-[#1E1D1D] min-h-screen">
      <main className="pt-[74px] pb-[197px]">
        <div className="flex justify-between mb-4 items-center w-[740px]">
          <h1 className="text-base leading-5 font-medium text-white">
            Event Name
          </h1>
          <button className="bg-[#34C759] text-white flex items-center px-3 py-2 gap-2 rounded text-sm">
            <Image
              src={"/assets/globe.svg"}
              className="inline"
              width={16}
              height={16}
              alt=""
            />
            <span>Public</span>
            <ChevronDown />
          </button>
        </div>
        <div className="w-[740px] flex flex-col gap-y-4">
          {!address ? (
            <p>Please connect your wallet to view your events.</p>
          ) : isLoading ? (
            <p className="text-white">Loading your events.</p>
          ) : error?.message ? (
            <p className="text-white">{error?.message}</p>
          ) : events?.length ? (
            events.map((event, index) => (
              <EventCard key={index} event={event} baseRoute="your-events" />
            ))
          ) : (
            "You dont have any events, please add one!"
          )}
        </div>
        {events && events.length > 0 && (
        <div className="mt-[34px] flex w-full justify-end">
          <Pagination count={events.length} />
        </div>
      )}
      </main>
    </div>
  );
};

export default YourEvents;
