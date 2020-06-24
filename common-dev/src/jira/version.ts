export interface Version {
  archived?:            boolean;
  description?:         string;
  expand?:              string;
  id?:                  string;
  moveUnfixedIssuesTo?: string;
  name?:                string;
  operations?:          any; // SimpleLink[];
  overdue?:             boolean;
  project?:             string;
  projectID?:           number;
  released?:            boolean;
  remotelinks?:         any; // RemoteEntityLink[];
  self?:                string;
  userReleaseDate?:     string;
  userStartDate?:       string;
}
