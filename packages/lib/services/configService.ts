import { getCurrentAuthUser } from '../supabase/server';
import { type DashboardConfig } from '@repo/config';
import { dashboardConfig as defaultConfig } from '@repo/config';
import { getAllPages } from '../actions/pageActions';

export async function getServerConfig(): Promise<DashboardConfig> {
  try {
    const user = await getCurrentAuthUser();
    
    if (!user) {
      return defaultConfig;
    }

    try {
      const pages = await getAllPages();
      const supabaseConfig: DashboardConfig = {
        ...defaultConfig,
        pages: pages.reduce((acc, page) => {
          acc[page.slug] = {
            title: { showTitle: true, value: page.name },
            layout: [], // Pages use puck_data instead of layout
            puckData: page.puck_data,
            sidebar: undefined // No sidebar config in current schema
          };
          return acc;
        }, {} as Record<string, any>)
      };
      return supabaseConfig;
    } catch (error) {
      console.warn('Failed to load configuration from Supabase, using default:', error);
      return defaultConfig;
    }
  } catch (error) {
    console.warn('Failed to load configuration:', error);
    return defaultConfig;
  }
}
