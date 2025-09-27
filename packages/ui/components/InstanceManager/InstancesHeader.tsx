import { Button, CardHeader, Link } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiHomeAssistant } from "@mdi/js";

export interface InstancesHeaderProps {
  count: number;
  max?: number | null;
  compact?: boolean;
  manageHref: string;
}

export const InstancesHeader = ({ count, max, compact, manageHref }: InstancesHeaderProps) => {
  return (
    <CardHeader className="flex items-center justify-between p-4 sm:p-6">
      <div className="flex items-center min-w-0 flex-1">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <Icon path={mdiHomeAssistant} className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">Home Assistant Instances</h3>
          {typeof max === "number" && max >= 0 && (
            <span className="text-sm text-foreground-500">
              {count}/{max}
            </span>
          )}
        </div>
      </div>
      {compact && (
        <Button as={Link} href={manageHref} size="sm" variant="bordered">
          Manage Instances
        </Button>
      )}
    </CardHeader>
  );
};


