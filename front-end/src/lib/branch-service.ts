import { api } from '@/lib/api-client'

export interface BranchCustomizationStatus {
  is_synced: boolean
  has_customizations: boolean
  source_template_id: number | null
  template_id: number | null
}

export interface BranchTemplate {
  id: number
  branch_id: number
  template_id: number
  is_synced: boolean
  source_template_id: number | null
  html_content: string | null
  css_content: string | null
  theme_variables: Record<string, string> | null
  template?: {
    id: number
    name: string
    slug: string
    blocks?: any[]
  }
}

export const branchService = {
  async getCustomizationStatus(branchId: number): Promise<BranchCustomizationStatus> {
    const res = await api.get<{ data: BranchCustomizationStatus }>(`/branches/${branchId}/customization-status`)
    return res.data
  },

  async getTemplate(branchId: number): Promise<BranchTemplate | null> {
    try {
      const res = await api.get<{ data: BranchTemplate }>(`/branches/${branchId}/template`)
      return res.data
    } catch {
      return null
    }
  },

  async updateTemplateBlocks(branchId: number, blocks: any[]): Promise<BranchTemplate> {
    const res = await api.put<{ data: BranchTemplate }>(`/branches/${branchId}/template/blocks`, { blocks })
    return res.data
  },

  async updateThemeVariables(branchId: number, variables: Record<string, string>): Promise<BranchTemplate> {
    const res = await api.put<{ data: BranchTemplate }>(`/branches/${branchId}/template/theme-variables`, { variables })
    return res.data
  },

  async updateTemplateContent(branchId: number, content: { html_content?: string; css_content?: string }): Promise<BranchTemplate> {
    const res = await api.put<{ data: BranchTemplate }>(`/branches/${branchId}/template/content`, content)
    return res.data
  },

  async resetToSource(branchId: number): Promise<BranchTemplate> {
    const res = await api.post<{ data: BranchTemplate }>(`/branches/${branchId}/reset-to-source`)
    return res.data
  },

  async cloneTemplate(branchId: number, sourceBranchId: number): Promise<BranchTemplate> {
    const res = await api.post<{ data: BranchTemplate }>(`/branches/${branchId}/template/clone`, {
      source_branch_id: sourceBranchId
    })
    return res.data
  },

  async toggleSync(branchId: number, isSynced: boolean): Promise<BranchTemplate> {
    const res = await api.put<{ data: BranchTemplate }>(`/branches/${branchId}/template/sync`, {
      is_synced: isSynced
    })
    return res.data
  }
}
