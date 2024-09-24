import type { PatchInfo } from './Patching';

export interface VulnSourceInfo {
    name: string;
    vuln_url: string;
}

export interface VulnerabilityInfo {
    vulnerability_id: string;
    description: string;
    version_info: VersionInfo;
    published: string;
    last_modified: string;
    sources: VulnSourceInfo[];
    aliases: string[];
}

export interface VersionInfo {
    affected_versions_string: string;
    patched_versions_string: string;
    versions: VulnerableVersionInfo[];
}

export interface VulnerableVersionInfo {
    version: string;
    status: string;
    release: string;
}

export interface DependencyInfo {
    name: string;
    published: string;
    description: string;
    keywords: string[];
    version: string;
    package_manager_links: PackageManagerLink[];
    github_link?: any;
    issues_link?: string;
    homepage?: string;
}

export interface PackageManagerLink {
    package_manager: string;
    url: string;
}

export interface SeverityInfo {
    cvss_31?: any;
    cvss_3?: any;
    cvss_2?: any;
}

export interface OwaspInfo {
    name: string;
    description: string;
}

export interface WeaknessInfo {
    id: string;
    name: string;
    description: string;
}

export interface CommonConsequencesInfo {
    scope: string[];
    impact: string[];
    description: string;
}

export interface ReferenceInfo {
    url: string;
    tags: string[];
}

export interface OtherInfo {
    package_manager: string;
}

export class VulnerabilityDetails {
    vulnerability_info!: VulnerabilityInfo;
    dependency_info?: DependencyInfo;
    severities!: SeverityInfo;
    owasp_top_10!: OwaspInfo | null;
    weaknesses!: WeaknessInfo[];
    patch!: PatchInfo;
    common_consequences!: { [key: string]: CommonConsequencesInfo[] };
    references!: ReferenceInfo[];
    location!: string[];
    other!: OtherInfo;
}
