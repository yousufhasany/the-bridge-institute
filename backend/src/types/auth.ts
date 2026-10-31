export interface AuthUser {
  id: string;
  sessionId: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: Set<string>;
}
