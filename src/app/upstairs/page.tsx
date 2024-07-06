"use client";
import EntityCard from "@/components/EntityCard";
import GraphCard from "@/components/GraphCard";
import { Light } from "@/components/Grid";
import { Alarm } from "@/components/Grid";
import { BinarySensor } from "@/components/Grid/BinarySensor";
import { EntityName } from "@hakit/core";

export default function Home() {
  const sensorEntities = [
    {
      id: "binary_sensor.front_door_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.bathroom_window_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.patio_door_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.gate_door_contact" as EntityName,
      icon: "mdiDoor",
    },
  ];

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className="grid grid-cols-3 gap-8 w-full">
        <div className="flex flex-row gap-8">
          <Alarm
            entityId={
              "alarm_control_panel.94_headland_rd_leicester" as EntityName
            }
          />
          <BinarySensor
            entityId={"binary_sensor.front_door_sensor_contact" as EntityName}
          />
          <BinarySensor
            entityId={
              "binary_sensor.living_room_motion_sensor_occupancy" as EntityName
            }
            friendlyName="Living Room"
          />
        </div>
        <Light
          entityId={"light.living_room_downlights" as EntityName}
          dimmer={true}
        />
        <Light entityId={"light.bedroom_ceiling_fan_lights" as EntityName} />
        <Light entityId={"light.baby_room_light" as EntityName} />
        <Light entityId={"light.guest_bedroom" as EntityName} />
        <Light entityId={"light.upstairs_hallway_light" as EntityName} />
        <Light entityId={"light.kitchen_downlights" as EntityName} />
        <GraphCard entityId={"sensor.whole_home_energy_usage" as EntityName} />
        <EntityCard
          title="Sensors"
          entities={sensorEntities}
          colspan={2}
          showTitles={true}
          disableClick={true}
        />
      </div>
    </main>
  );
}
