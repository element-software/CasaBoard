"use client";
import EntityCard from "@/components/EntityCard";
import Entity from "@/components/EntityCard/Entity";
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
      id: "binary_sensor.gate_door_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.kitchen_entrance_motion_occupancy" as EntityName,
      icon: "mdiMotionSensor",
    },
    {
      id: "binary_sensor.living_room_motion_sensor_occupancy" as EntityName,
      icon: "mdiMotionSensor",
    },
    {
      id: "binary_sensor.office_presence_one_occupancy" as EntityName,
      icon: "mdiMotionSensor",
    }
  ];

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className="grid grid-cols-3 gap-8 w-full">
        <div className="grid gap-8 grid-cols-2">
          <Alarm
            entityId={
              "alarm_control_panel.94_headland_rd_leicester" as EntityName
            }
          />
          <BinarySensor
            entityId={"binary_sensor.front_door_sensor_contact" as EntityName}
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
        <div className="grid gap-4 grid-cols-3 relative overflow-hidden w-full items-center justify-between p-2 h-40 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800">
          <Entity entityId="binary_sensor.dishwasher" icon="mdiDishwasher" showState showTitle showLastChanged />
          <Entity entityId="binary_sensor.dryer" icon="mdiTumbleDryer" showState showTitle showLastChanged/>
          <Entity entityId="binary_sensor.washing_machine" icon="mdiWashingMachine" showState showTitle showLastChanged/>
        </div>
        <EntityCard
          title="Sensors"
          entities={sensorEntities}
          colspan={3}
          showTitles={true}
          disableClick={true}
          showLastChanged={true}
        />
      </div>
    </main>
  );
}
