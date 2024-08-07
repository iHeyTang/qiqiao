export interface BaseWithAudit {
  id: string;
  created_at: string;
  created_by: string;

  updated_at: string;
  updated_by: string;

  deleted_at: string;
  deleted_by: string;
}
