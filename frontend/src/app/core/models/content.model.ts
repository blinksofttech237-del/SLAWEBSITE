export type Lang = 'fr' | 'en';

export interface SocialLink {
  network: string;
  url: string;
  icon: 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | string;
}

export interface StatItem {
  key: string;
  value: number | null;
  suffix: string;
  labelFr: string;
  labelEn: string;
  noteFr: string;
  noteEn: string;
}

export interface ShowreelConfig {
  url: string;
  poster: string;
  caption: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface SiteSettings {
  companyName: string;
  shortName: string;
  monogram: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  city: string;
  country: string;
  hours: string;
  contactPending?: boolean;
  socials: SocialLink[];
  showreel: ShowreelConfig;
  stats: StatItem[];
  seo: SeoConfig;
  institutionalClients: string[];
}

export interface Service {
  id?: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  tags: string[];
  tagsEn: string[];
  image: string;
  icon: string;
  order?: number;
  featured?: boolean;
}

export interface ServiceDetail {
  introFr: string;
  introEn: string;
  capabilitiesFr: string[];
  capabilitiesEn: string[];
  equipmentFr: string[];
  equipmentEn: string[];
  deliverablesFr: string[];
  deliverablesEn: string[];
}

export type ProjectCategory = 'conferences' | 'events' | 'video' | 'photography' | 'corporate';

export interface Project {
  id?: number;
  slug: string;
  title: string;
  titleEn: string;
  category: ProjectCategory;
  categoryLabel: string;
  categoryLabelEn: string;
  year: string;
  date: string;
  location: string;
  client: string;
  cover: string;
  excerpt: string;
  excerptEn: string;
  descriptionFr: string;
  descriptionEn: string;
  gallery: string[];
  videoUrl: string;
  featured: boolean;
  isDemo: boolean;
}

export interface EventItem {
  id?: number;
  slug: string;
  title: string;
  titleEn: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  format: string;
  image: string;
  summary: string;
  summaryEn: string;
  status: 'upcoming' | 'past';
  isDemo: boolean;
}

export interface Post {
  id?: number;
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  cover: string;
  excerpt: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
}

export interface Testimonial {
  id?: number;
  name: string;
  role: string;
  organization: string;
  quote: string;
  photo: string | null;
  approved: boolean;
}

export interface Partner {
  id?: number;
  name: string;
  logo: string;
  url: string;
  approved: boolean;
  order?: number;
}

export interface TeamPole {
  name: string;
  role: string;
  icon: string;
}

export interface FaqItem {
  qFr: string;
  aFr: string;
  qEn: string;
  aEn: string;
}

export interface ContentBundle {
  settings: SiteSettings;
  services: Service[];
  serviceDetails: Record<string, ServiceDetail>;
  projects: Project[];
  events: EventItem[];
  posts: Post[];
  testimonials: Testimonial[];
  partners: Partner[];
  teamPoles: TeamPole[];
  faq: FaqItem[];
}

export type QuoteStatus = 'new' | 'review' | 'quoted' | 'accepted' | 'refused' | 'completed';

export interface QuoteRequestPayload {
  fullName: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  country: string;
  eventType: string;
  service: string;
  eventDate: string;
  duration: string;
  participants: string;
  venue: string;
  budget: string;
  message: string;
  consent: boolean;
  website?: string; // honeypot
}

export interface QuoteAttachment {
  id: number;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface QuoteRequest extends QuoteRequestPayload {
  id: number;
  reference: string;
  status: QuoteStatus;
  createdAt: string;
  attachments?: QuoteAttachment[];
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  locale: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface DashboardStats {
  quotes: number;
  quotesNew: number;
  projects: number;
  publishedProjects: number;
  messages: number;
  unreadMessages: number;
  subscribers: number;
  posts: number;
  upcomingEvents: number;
  recentQuotes: QuoteRequest[];
  byStatus: Record<string, number>;
  monthlyQuotes: { month: string; count: number }[];
}
