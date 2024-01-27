import { EntityName, useWeather } from "@hakit/core";
import Clock from "./Clock";
import { WeatherCard } from "@hakit/components";
import Thermostat from "./Thermostat";
import ThermostatCardSimple from "./ThermostatCardSimple";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black p-8 pb-4">
            <div className="flex flex-col">
              <Clock />
            </div>
            <div className="flex flex-1 flex-col w-full">
              <WeatherCard
                entity="weather.home"
                className="w-full bg-stone-500/80 text-white !rounded-lg"
                onlyFunctionality
                disableRipples
                disableScale
                disableActiveState
                cssStyles={`
                  .button-group, h4.title {
                    display: none;
                  },
                `}
                xlg={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                xxs={12}
                apparentTemperatureAttribute="temperature"
              />
            </div>
            <div className="flex flex-1 flex-col w-full">
              <Thermostat entityId={"climate.central_heating_and_hot_water_tank_heat" as EntityName}/>
            </div>
            <div className="flex flex-1 flex-col w-full items-end">
              <img
                className="w-auto max-w-20 mx-auto"
                src="https://element-connect.co.uk/wp-content/uploads/2023/03/EC-Logo-V2-Trimmed.png"
                alt="Your Company"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bgimage absolute left-0 top-0 w-screen h-screen opacity-35" style={{ zIndex: "-1" }} />
            <div className="lg:pl-96">
              {children}
          </div>
        </div>
      </div>
    </>
  );
}
