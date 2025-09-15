"use client";
import { useState, useEffect, useTransition } from 'react';
import { PageActions } from '@repo/lib';
import { Page } from '@repo/types/page';
import Link from 'next/link';
import Icon from '@mdi/react';
import { 
  mdiPlus, 
  mdiPencil, 
  mdiTrashCan, 
  mdiEye, 
  mdiLoading, 
  mdiRefresh, 
  mdiPublish, 
  mdiEyeOff,
  mdiWeb,
  mdiCalendar,
  mdiClock,
  mdiDotsVertical,
  mdiCheckCircle,
  mdiAlertCircle
} from '@mdi/js';
import { Button, Card, CardBody, CardHeader, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';

interface EntitlementsInput {
  active: boolean;
  maxDashboards: number;
}

interface PagesListProps {
  initialPages?: Page[];
  initialError?: string | null;
  entitlements?: EntitlementsInput;
}

export const PagesList = ({ initialPages = [], initialError = null, entitlements }: PagesListProps) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  // Only load pages if no initial data was provided
  useEffect(() => {
    if (initialPages.length === 0 && !initialError) {
      loadPages();
    }
  }, [initialPages.length, initialError]);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const pagesData = await PageActions.getAllPages();
      setPages(pagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (slug: string, pageName: string) => {
    if (!confirm(`Are you sure you want to delete "${pageName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await PageActions.deletePage(slug);
        setPages(pages.filter(page => page.slug !== slug));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete page');
      }
    });
  };

  const handleTogglePublished = async (slug: string, currentPublished: boolean) => {
    startTransition(async () => {
      try {
        await PageActions.updatePage(slug, { published: !currentPublished });
        setPages(pages.map(page => 
          page.slug === slug 
            ? { ...page, published: !currentPublished }
            : page
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update page status');
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-theme-border border-t-theme-primary rounded-full animate-spin"></div>
          <Icon path={mdiLoading} className="w-6 h-6 text-theme-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-theme-text-secondary font-medium">Loading your pages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardBody className="text-center py-8">
          <Icon path={mdiAlertCircle} className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load pages</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            color="danger"
            variant="bordered"
            onPress={loadPages}
            startContent={<Icon path={mdiRefresh} className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-primary/10 to-theme-accent/10 rounded-2xl flex items-center justify-center">
            <Icon path={mdiWeb} className="w-10 h-10 text-theme-primary" />
          </div>
          <h3 className="text-2xl font-bold text-theme-text mb-3">No pages yet</h3>
          <p className="text-theme-text-secondary mb-8 text-lg">
            Create your first dashboard page to get started with CasaBoard
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button
              as={Link}
              href="/setup/pages/create"
              color="primary"
              size="lg"
              startContent={<Icon path={mdiPlus} className="w-5 h-5" />}
              className="px-8 py-3"
              isDisabled={Boolean(entitlements && (!entitlements.active || (entitlements.maxDashboards >= 0 && pages.length >= entitlements.maxDashboards)))}
            >
              Create Your First Page
            </Button>
            {entitlements && (!entitlements.active || (entitlements.maxDashboards >= 0 && pages.length >= entitlements.maxDashboards)) && (
              <div className="text-sm text-foreground-500">
                {entitlements.active ? (
                  <>
                    Limit reached. <Link href="/billing" className="text-primary">Upgrade to add more</Link>
                  </>
                ) : (
                  <>
                    Access blocked. <Link href="/billing" className="text-primary">Choose a plan</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-theme-text">Manage Pages</h2>
          <p className="text-theme-text-secondary mt-1">Create, edit, and manage your dashboard pages</p>
        </div>
        <div className="flex items-center gap-3">
          {entitlements && entitlements.maxDashboards >= 0 && (
            <span className="text-sm text-foreground-500">
              {pages.length}/{entitlements.maxDashboards}
            </span>
          )}
          <Button
            as={Link}
            href="/setup/pages/create"
            color="primary"
            startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
            isDisabled={Boolean(entitlements && (!entitlements.active || (entitlements.maxDashboards >= 0 && pages.length >= entitlements.maxDashboards)))}
          >
            New Page
          </Button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-theme-text truncate">
                      {page.name}
                    </h3>
                    <Chip
                      size="sm"
                      color={page.published ? "success" : "warning"}
                      variant="flat"
                      startContent={
                        <Icon 
                          path={page.published ? mdiCheckCircle : mdiAlertCircle} 
                          className="w-3 h-3" 
                        />
                      }
                    >
                      {page.published ? 'Published' : 'Draft'}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 text-theme-text-secondary">
                    <Icon path={mdiWeb} className="w-4 h-4" />
                    <span className="text-sm font-mono">/{page.slug}</span>
                  </div>
                </div>
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon path={mdiDotsVertical} className="w-4 h-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Page actions">
                    <DropdownItem
                      key="view"
                      startContent={<Icon path={mdiEye} className="w-4 h-4" />}
                      as={Link}
                      href={`/${page.slug}`}
                    >
                      View Page
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      startContent={<Icon path={mdiPencil} className="w-4 h-4" />}
                      as={Link}
                      href={`/setup/pages/edit/${page.slug}`}
                    >
                      Edit Page
                    </DropdownItem>
                    <DropdownItem
                      key="publish"
                      startContent={
                        <Icon 
                          path={page.published ? mdiEyeOff : mdiPublish} 
                          className="w-4 h-4" 
                        />
                      }
                      onPress={() => handleTogglePublished(page.slug, page.published)}
                      className={page.published ? "text-orange-600" : "text-green-600"}
                    >
                      {page.published ? 'Unpublish' : 'Publish'}
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-red-600"
                      startContent={<Icon path={mdiTrashCan} className="w-4 h-4" />}
                      onPress={() => handleDeletePage(page.slug, page.name)}
                    >
                      Delete Page
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            
            <CardBody className="pt-0">
              {/* Timestamps */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                  <Icon path={mdiCalendar} className="w-4 h-4" />
                  <span>Created: {formatDate(page.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                  <Icon path={mdiClock} className="w-4 h-4" />
                  <span>Updated: {formatDate(page.updated_at)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  as={Link}
                  href={`/${page.slug}`}
                  variant="bordered"
                  size="sm"
                  startContent={<Icon path={mdiEye} className="w-4 h-4" />}
                  className="flex-1"
                >
                  View
                </Button>
                
                <Button
                  as={Link}
                  href={`/setup/pages/edit/${page.slug}`}
                  color="primary"
                  size="sm"
                  startContent={<Icon path={mdiPencil} className="w-4 h-4" />}
                  className="flex-1"
                >
                  Edit
                </Button>
                
                <Button
                  color={page.published ? "warning" : "success"}
                  variant="bordered"
                  size="sm"
                  startContent={
                    <Icon 
                      path={page.published ? mdiEyeOff : mdiPublish} 
                      className="w-4 h-4" 
                    />
                  }
                  onPress={() => handleTogglePublished(page.slug, page.published)}
                  isLoading={isPending}
                >
                  {page.published ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
