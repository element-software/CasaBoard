import { Data } from "@measured/puck";
import { Page, CreatePageData, UpdatePageData } from "@repo/types/page";

export class PageService {
  static async getAllPages(): Promise<Page[]> {
    const response = await fetch('/api/pages');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch pages');
    }
    
    return response.json();
  }

  static async getPage(slug: string): Promise<Page> {
    const response = await fetch(`/api/pages/${slug}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch page');
    }
    
    return response.json();
  }

  static async createPage(pageData: CreatePageData): Promise<Page> {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create page');
    }
    
    return response.json();
  }

  static async updatePage(slug: string, pageData: UpdatePageData): Promise<Page> {
    const response = await fetch(`/api/pages/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update page');
    }
    
    return response.json();
  }

  static async updatePageData(slug: string, puckData: Data): Promise<Page> {
    return this.updatePage(slug, { puck_data: puckData });
  }

  static async deletePage(slug: string): Promise<void> {
    const response = await fetch(`/api/pages/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete page');
    }
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
