import { useMemo, useState, type CSSProperties } from "react";
import { Render } from "@measured/puck";
import { Button, useDisclosure, Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import type { PublishedPagePayload } from "@repo/types/publishedPage";
import { PuckConfig } from "@repo/ui/components/puck/puck.config";
import { ThemeScope } from "@repo/ui/components/ThemeScope/ThemeScope";
import type { StyleId } from "@repo/types/style";

export function StaticDashboard({
  payload,
}: {
  payload: PublishedPagePayload;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasSidebar = Boolean(payload.sidebar?.puck_data);

  const themeMain = useMemo(
    () => payload.themeMain as CSSProperties,
    [payload.themeMain]
  );
  const themeSidebar = useMemo(
    () => payload.themeSidebar as CSSProperties,
    [payload.themeSidebar]
  );
  const styleMainVars = useMemo(
    () => payload.styleMainVars as CSSProperties,
    [payload.styleMainVars]
  );
  const styleSidebarVars = useMemo(
    () => payload.styleSidebarVars as CSSProperties,
    [payload.styleSidebarVars]
  );

  const sidebar = (
    <ThemeScope
      style={themeSidebar}
      styleVars={styleSidebarVars}
      styleId={payload.styleSidebarId as StyleId}
      className="min-w-[300px] max-w-[300px] h-full shrink-0 p-4 bg-theme-background overflow-y-auto overscroll-contain"
    >
      {payload.sidebar?.puck_data ? (
        <Render config={PuckConfig} data={payload.sidebar.puck_data} />
      ) : null}
    </ThemeScope>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 relative h-dvh max-h-dvh overflow-hidden">
      {hasSidebar ? (
        <>
          <div className="hidden md:block h-full">{sidebar}</div>
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="left"
            size="sm"
            style={themeSidebar}
            classNames={{ base: "bg-theme-background text-theme-text" }}
          >
            <DrawerContent>
              <DrawerBody className="p-4 bg-theme-background overflow-y-auto overscroll-contain">
                <ThemeScope
                  style={themeSidebar}
                  styleVars={styleSidebarVars}
                  styleId={payload.styleSidebarId as StyleId}
                >
                  {payload.sidebar?.puck_data ? (
                    <Render
                      config={PuckConfig}
                      data={payload.sidebar.puck_data}
                    />
                  ) : null}
                </ThemeScope>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : null}

      <div className="w-full grow min-w-0 min-h-0 overflow-y-auto overscroll-contain">
        {hasSidebar ? (
          <div className="md:hidden px-4 pt-4">
            <Button
              isIconOnly
              variant="light"
              onPress={onOpen}
              aria-label="Open sidebar"
            >
              <Icon path={mdiMenu} className="w-5 h-5" />
            </Button>
          </div>
        ) : null}

        <ThemeScope
          style={themeMain}
          styleVars={styleMainVars}
          styleId={payload.styleMainId as StyleId}
          className="min-h-full bg-theme-page-background text-theme-text"
        >
          <div className="p-4 pt-0 md:pt-4 w-full">
            {payload.puck_data ? (
              <Render config={PuckConfig} data={payload.puck_data} />
            ) : (
              <div className="p-8 text-center text-theme-text-secondary">
                This page hasn&apos;t been configured yet.
              </div>
            )}
          </div>
        </ThemeScope>
      </div>
    </div>
  );
}
