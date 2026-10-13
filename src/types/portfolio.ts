export type SectionId = 'home' | 'stack' | 'projects' | 'experience' | 'blogs' | 'contact';

export const SECTIONS: SectionId[] = ['home', 'stack', 'projects', 'experience', 'blogs', 'contact'];

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionData {
  total?: {
    lastYear?: number;
    [year: string]: number | undefined;
  };
  contributions: ContributionDay[];
}
