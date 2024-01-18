import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Clock from "./Clock";
import GridItem from "./GridItem";
import { EntityName } from "@hakit/core";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
            <div className="flex h-48 flex-col">
              <Clock />
              <img
                className="w-auto max-w-20 mx-auto"
                src="https://element-connect.co.uk/wp-content/uploads/2023/03/EC-Logo-V2-Trimmed.png"
                alt="Your Company"
              />
            </div>
            <div className="flex flex-1 flex-col w-full">
              <GridItem entityId={"light.kitchen_downlights" as EntityName}/>
            </div>
          </div>
        </div>

        <div className="lg:pl-96">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
