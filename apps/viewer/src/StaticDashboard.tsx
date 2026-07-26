import { useEffect, useMemo, type CSSProperties } from "react";
import { Render } from "@measured/puck";
import { Button, useDisclosure, Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import type { PublishedPagePayload } from "@repo/types/publishedPage";
import { PuckConfig } from "@repo/ui/components/puck/puck.config";
import { ThemeScope } from "@repo/ui/components/ThemeScope/ThemeScope";
import type { StyleId } from "@repo/types/style";
import { usePathname } from "next/navigation";

export type ViewerChrome = {
  sidebar: NonNullable<PublishedPagePayload["sidebar"]>;
  themeSidebar: Record<string, string>;
  styleSidebarId: StyleId;
  styleSidebarVars: Record<string, string>;
};

function sidebarFingerprint(chrome: ViewerChrome): string {
  return JSON.stringify({
    puck: chrome.sidebar.puck_data,
    theme: chrome.themeSidebar,
    styleId: chrome.styleSidebarId,
    vars: chrome.styleSidebarVars,
  });
}

/** Keep prior chrome reference when the baked sidebar is unchanged. */
export function mergeViewerChrome(
  prev: ViewerChrome | null,
  payload: PublishedPagePayload
): ViewerChrome | null {
  if (!payload.sidebar?.puck_data) return null;

  const next: ViewerChrome = {
    sidebar: payload.sidebar,
    themeSidebar: payload.themeSidebar,
    styleSidebarId: payload.styleSidebarId,
    styleSidebarVars: payload.styleSidebarVars,
  };

  if (prev && sidebarFingerprint(prev) === sidebarFingerprint(next)) {
    return prev;
  }
  return next;
}

function PersistentSidebar({
  chrome,
  isOpen,
  onClose,
}: {
  chrome: ViewerChrome;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const themeSidebar = useMemo(
    () => chrome.themeSidebar as CSSProperties,
    [chrome.themeSidebar]
  );
  const styleSidebarVars = useMemo(
    () => chrome.styleSidebarVars as CSSProperties,
    [chrome.styleSidebarVars]
  );

  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- close drawer on route change only

  const desktopSidebar = (
    <ThemeScope
      style={themeSidebar}
      styleVars={styleSidebarVars}
      styleId={chrome.styleSidebarId}
      className="min-w-[300px] max-w-[300px] h-full shrink-0 p-4 bg-theme-background overflow-y-auto overscroll-contain"
    >
      <Render config={PuckConfig} data={chrome.sidebar.puck_data} />
    </ThemeScope>
  );

  return (
    <>
      <div className="hidden md:block h-full">{desktopSidebar}</div>
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
              styleId={chrome.styleSidebarId}
            >
              <Render config={PuckConfig} data={chrome.sidebar.puck_data} />
            </ThemeScope>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function StaticDashboard({
  payload,
  chrome,
}: {
  payload: PublishedPagePayload;
  chrome: ViewerChrome | null;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasSidebar = Boolean(chrome?.sidebar?.puck_data);

  const themeMain = useMemo(
    () => payload.themeMain as CSSProperties,
    [payload.themeMain]
  );
  const styleMainVars = useMemo(
    () => payload.styleMainVars as CSSProperties,
    [payload.styleMainVars]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 relative h-dvh max-h-dvh overflow-hidden">
      {hasSidebar && chrome ? (
        <PersistentSidebar chrome={chrome} isOpen={isOpen} onClose={onClose} />
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
