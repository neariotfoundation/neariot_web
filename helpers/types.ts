export interface ProjectData {
  id?: string;
  owner: string;
  name: string;
  // type: string;
  descriptions: string;
  repository: string;
  created_at: any;
  noSetting?: boolean;
  pledgers?: any;
  project_target?: any;
  avg_rate?: any;
  project_rate?: any;
  data?: any;
  chart?:string;
  offers?: any[];
  section?: any[];
  fee?:any;
  apiKey?:any;
  milestones?:any;
  watchers?:any;
};

export interface ProjectCardProps{
  id:string;
  owner:string;
  name:string;
  img?:string;
  type:string;
  descriptions:string;
  pledgers?: any;
  backers?:any;
  avg_rate?: any;
}