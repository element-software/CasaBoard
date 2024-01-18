import { useWeather } from "@hakit/core";
import Clock from "./Clock";
import { WeatherCard } from "@hakit/components";

const Weather = () => {
  const weatherEntity = useWeather('weather.home');
  // can now access all properties relating to the weather for this entity.
  return <div>
    {JSON.stringify(weatherEntity.forecast, null, 2)}
  </div>
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
            <div className="flex h-48 flex-col mt-4">
              <Clock />
            </div>
            <div className="flex flex-1 flex-col w-full">
              <WeatherCard
                entity="weather.home"
                className="w-full bg-stone-500/20 rounded-lg"
                onlyFunctionality
                disableRipples
                disableScale
                disableActiveState
                cssStyles={`
                  .button-group, h4.title {
                    display: none;
                  }
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
            <div className="flex flex-1 flex-col w-full items-end">
              <img
                  className="w-auto max-w-20 mx-auto"
                  src="https://element-connect.co.uk/wp-content/uploads/2023/03/EC-Logo-V2-Trimmed.png"
                  alt="Your Company"
                />
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
