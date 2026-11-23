export interface PortfolioFormValues {
  title: string;
  slug: string;
  service_type_id: string;
  client_name: string;
  completion_date: string;
  description: string;
  order: number;
  is_featured: boolean;
  thumbnail: File | null;
  gallery: File[];
}
