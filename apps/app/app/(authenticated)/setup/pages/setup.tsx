"use client"
import { HAConfiguration } from "@repo/ui/components/Setup/HAConfiguration"
import { CardBody, CardHeader, Card } from "@heroui/react"
import Icon from "@mdi/react"
import { mdiWeb, mdiHomeAssistant } from "@mdi/js"
import { PagesManagement } from "@repo/ui/components/Setup/PagesManagement"
import { Page } from "@repo/types/page"

export interface SetupProps {
  pages: Page[]
  error?: string
}

export const Setup = ({ pages, error }: SetupProps) => {

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
    {/* Pages Management Section */}
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Icon path={mdiWeb} className="w-6 h-6 text-theme-text-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-theme-text truncate">Pages Management</h2>
            <p className="text-xs sm:text-sm text-theme-text-secondary">Create and manage dashboard pages</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <PagesManagement initialPages={pages} initialError={error} />
      </CardBody>
    </Card>

    {/* Home Assistant Configuration Section */}
    <Card className="w-full">
      <CardHeader className="flex items-center p-4 sm:p-6">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <Icon path={mdiHomeAssistant} className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-theme-text truncate">Home Assistant</h2>
          <p className="text-xs sm:text-sm text-theme-text-secondary">Configure HA connection and settings</p>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <HAConfiguration compact minimal />
      </CardBody>
    </Card>
  </div>
  )
}