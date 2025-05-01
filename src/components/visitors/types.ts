
export interface VisitorData {
  id: string;
  full_name: string;
  visit_purpose: string | null;
  status: string;
  expected_arrival: string | null;
  resident_id: string | null;
}

export type ScanDirection = 'ingress' | 'egress';
