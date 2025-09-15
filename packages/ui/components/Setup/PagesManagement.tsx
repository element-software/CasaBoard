"use client";
import { useState, useEffect, useTransition } from 'react';
import { PageService } from '@repo/lib';
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
  mdiWeb,
  mdiPublish,
  mdiEyeOff,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiClock
} from '@mdi/js';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { useRouter } from 'next/navigation';

interface PagesManagementProps {
  showAllPages?: boolean;
  maxPages?: number;
  initialPages?: Page[];
  initialError?: string | null;
}

export const PagesManagement = ({ 
  showAllPages = false, 
  maxPages = 3, 
  initialPages = [], 
  initialError = null 
}: PagesManagementProps) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeletePage = async (slug: string, pageName: string) => {
    if (!confirm(`Are you sure you want to delete "${pageName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await PageService.deletePage(slug);
        setPages(pages.filter(page => page.slug !== slug));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete page');
      }
    });
  };

  const handleTogglePublished = async (slug: string, currentPublished: boolean) => {
    startTransition(async () => {
      try {
        await PageService.updatePage(slug, { published: !currentPublished });
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayPages = showAllPages ? pages : pages.slice(0, maxPages);

  console.log("PagesManagement:: displayPages:", displayPages, "error:", error)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-theme-border border-t-theme-primary rounded-full animate-spin"></div>
          <span className="text-theme-text-secondary">Loading pages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardBody className="text-center py-6">
          <Icon path={mdiAlertCircle} className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 mb-3">{error}</p>
          <Button
            color="danger"
            variant="bordered"
            size="sm"
            onPress={() => router.refresh()}
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
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-primary/10 to-theme-accent/10 rounded-2xl flex items-center justify-center">
          <Icon path={mdiWeb} className="w-8 h-8 text-theme-primary" />
        </div>
        <h3 className="text-lg font-semibold text-theme-text mb-2">No pages yet</h3>
        <p className="text-theme-text-secondary mb-4">
          Get started by creating your first dashboard page.
        </p>
        <Button
          as={Link}
          href="/setup/pages/create"
          color="primary"
          startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
        >
          Create First Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayPages.map((page) => (
        <Card key={page.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
          <CardBody className="p-3 sm:p-4">
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-theme-text truncate text-base">{page.name}</h4>
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
                    className="mt-1"
                  >
                    {page.published ? 'Published' : 'Draft'}
                  </Chip>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-theme-text-secondary">
                <div className="flex items-center gap-1">
                  <Icon path={mdiWeb} className="w-4 h-4 flex-shrink-0" />
                  <span className="font-mono text-xs">/{page.slug}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon path={mdiClock} className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">Updated {formatDate(page.updated_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-theme-border/30">
                <div className="flex items-center gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color={page.published ? "warning" : "success"}
                    onPress={() => handleTogglePublished(page.slug, page.published)}
                    title={page.published ? 'Unpublish page' : 'Publish page'}
                    isLoading={isPending}
                    className="min-w-8 h-8"
                  >
                    <Icon path={page.published ? mdiEyeOff : mdiPublish} className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    as={Link}
                    href={`/${page.slug}`}
                    isIconOnly
                    size="sm"
                    variant="light"
                    title="View page"
                    className="min-w-8 h-8"
                  >
                    <Icon path={mdiEye} className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    as={Link}
                    href={`/setup/pages/edit/${page.slug}`}
                    isIconOnly
                    size="sm"
                    variant="light"
                    title="Edit page"
                    className="min-w-8 h-8"
                  >
                    <Icon path={mdiPencil} className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDeletePage(page.slug, page.name)}
                    title="Delete page"
                    className="min-w-8 h-8"
                  >
                    <Icon path={mdiTrashCan} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-theme-text truncate">{page.name}</h4>
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
                <div className="flex items-center gap-4 text-sm text-theme-text-secondary">
                  <div className="flex items-center gap-1">
                    <Icon path={mdiWeb} className="w-4 h-4" />
                    <span className="font-mono">/{page.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon path={mdiClock} className="w-4 h-4" />
                    <span>Updated {formatDate(page.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-4">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color={page.published ? "warning" : "success"}
                  onPress={() => handleTogglePublished(page.slug, page.published)}
                  title={page.published ? 'Unpublish page' : 'Publish page'}
                  isLoading={isPending}
                >
                  <Icon path={page.published ? mdiEyeOff : mdiPublish} className="w-4 h-4" />
                </Button>
                
                <Button
                  as={Link}
                  href={`/${page.slug}`}
                  isIconOnly
                  size="sm"
                  variant="light"
                  title="View page"
                >
                  <Icon path={mdiEye} className="w-4 h-4" />
                </Button>
                
                <Button
                  as={Link}
                  href={`/setup/pages/edit/${page.slug}`}
                  isIconOnly
                  size="sm"
                  variant="light"
                  title="Edit page"
                >
                  <Icon path={mdiPencil} className="w-4 h-4" />
                </Button>
                
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => handleDeletePage(page.slug, page.name)}
                  title="Delete page"
                >
                  <Icon path={mdiTrashCan} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
      
      {!showAllPages && pages.length > maxPages && (
        <div className="pt-3 border-t border-theme-border">
          <p className="text-sm text-theme-text-secondary text-center">
            And {pages.length - maxPages} more pages
          </p>
        </div>
      )}
      
      {!showAllPages && (
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <Button
            as={Link}
            href="/setup/pages"
            variant="bordered"
            className="flex-1 order-2 sm:order-1"
            startContent={<Icon path={mdiWeb} className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Manage All Pages</span>
            <span className="sm:hidden">Manage Pages</span>
          </Button>
          <Button
            as={Link}
            href="/setup/pages/create"
            color="primary"
            className="order-1 sm:order-2"
            startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
          >
            New Page
          </Button>
        </div>
      )}
    </div>
  );
};
