export interface Output {
    workspaces: { [key: string]: WorkspaceData };
    analysis_info: AnalysisInfo;
}

export interface PatchOccurenceInfo {
    affected_deps: string[];
    vulnerability_id: string;
    all_occurences: string[][];
    introduced_occurences: string[][];
    unpatched_occurences: string[][];
    patched_occurences: string[][];
}

export enum Status {
    Success = 'success',
    Failure = 'failure'
}

export interface AnalysisInfo {
    status: Status;
    private_errors: any[];
    public_errors: any[];
    analysis_start_time: string;
    analysis_end_time: string;
    analysis_delta_time: number;
    version_seperator: string;
    import_path_seperator: string;
    default_workspace_name: string;
    self_managed_workspace_name: string;
    stats: Stats;
}

export interface Stats {}

export interface WorkspaceData {
    OriginalManifestFile: string;
    Upgrades: PatchedManifest;
    VulnerabilityPatchInfo: { [key: string]: PatchInfo };
    IntroducedVulnerabilitiesInfo: { [key: string]: any };
}

export interface VulnerabilitySummary {
    Severity: SeverityInfo;
    Weaknesses?: string[];
}

export interface WeaknessSummaryInfo {
    id: string;
    name: string;
    description: string;
}

export interface SeverityInfo {
    cvss_31?: any;
    cvss_3?: any;
    cvss_2?: any;
}

export interface PatchInfo {
    affected_deps: string[];
    affected_dep_name: string;
    occurance_count: number;
    patchable_occurances_count: number;
    unpatchable_occurances_count: number;
    vulnerability_id: string;
    introduction_type: IntroductionType;
    patch_type: PatchType;
    vulnerability_info: VulnerabilitySummary;
    patches: { [key: string]: VulnerabilityOccurencePatchInfo };
}

export interface VulnerabilityOccurencePatchInfo {
    patch_type: PatchType;
    direct_dep_installed_version: string;
    direct_dep_upgrade_version: string;
    direct_dep_name: string;
    introduced_occurences: VulnerabilityInfo;
    unpatched_occurences: VulnerabilityInfo;
    patched_occurences: VulnerabilityInfo;
}

export interface VulnerabilityInfo {
    Paths: string[][];
    Vulnerability: string;
}

export interface Vulnerability {
    Sources: Source[];
    AffectedDependency: string;
    Vulnerability: string;
    Severity: Severity;
    Weaknesses: null;
}

export interface Severity {
    Severity: number;
    SeverityType: SeverityType;
    Vector: string;
    Impact: number;
    Exploitability: number;
    ConfidentialityImpact: Impact;
    IntegrityImpact: Impact;
    AvailabilityImpact: Impact;
}

export enum Impact {
    High = 'HIGH',
    Low = 'LOW',
    None = 'NONE'
}

export enum SeverityType {
    CvssV2 = 'CVSS_V2',
    CvssV3 = 'CVSS_V3',
    CvssV31 = 'CVSS_V31'
}

export enum Source {
    Nvd = 'NVD',
    Osv = 'OSV'
}

export enum IntroductionType {
    ExistedBefore = 'EXISTED_BEFORE',
    NewlyIntroduced = 'NEWLY_INTRODUCED',
    Mixed = 'MIXED'
}

export interface PatchedManifest {
    [key: string]: string | UpgradeInfo | undefined;
    name: string;
    version: string;
    description: string;
    dependencies?: UpgradeInfo;
    devDependencies?: UpgradeInfo;
    optionalDependencies?: UpgradeInfo;
    peerDependencies?: UpgradeInfo;
    bundleDependencies?: UpgradeInfo;
    bundledDependencies?: UpgradeInfo;
}

export interface OtherInfo {
    package_manager: string;
    relative_package_file: string;
}

export class PatchedManifestData {
    patched_manifest_raw: any;
    patched_manifest!: PatchedManifest;
    other_info!: OtherInfo;
}

export interface UpgradeInfo {
    [key: string]: string | UpgradeInfo | boolean | FullPatch | NonePatch | undefined;
    vulnerable: boolean;
    upgrade_to_installed_ver: boolean;
    upgrade_to: string;
    original_constraint: string;
    potential_breaking_changes: boolean;
    patch_type: PatchType;
    // severity_dist:               SeverityDist;
    // after_upgrade_severity_dist: SeverityDist;
    partial_patch?: FullPatch;
    full_patch?: FullPatch;
    none_patch?: NonePatch;
}

export interface SeverityDist {
    critical: number;
    high: number;
    medium: number;
    low: number;
    none: number;
}

export interface FullPatch {
    DirectDependency: string;
    UpgradeTo: string;
    PatchedVulnerabilities: VulnerabilityInfo[];
    TransitiveVulnerable: boolean;
    DirectVulnerable: boolean;
    InstalledVersion: string;
    UpgradedVersion: string;
}

export interface PartialPatch {
    DirectDependency: string;
    UpgradeTo: string;
    PatchedVulnerabilities: VulnerabilityInfo[];
    UnPatchedVulnerabilities: VulnerabilityInfo[];
    IntroducedVulnerabilities: VulnerabilityInfo[];
    TransitiveVulnerable: boolean;
    DirectVulnerable: boolean;
    InstalledVersion: string;
    UpgradedVersion: string;
}

export interface NonePatch {
    DirectDependency: string;
    UnPatchedVulnerabilities: VulnerabilityInfo[];
    TransitiveVulnerable: boolean;
    DirectVulnerable: boolean;
    InstalledVersion: string;
    UpgradedVersion: string;
}

export enum PatchType {
    Full = 'FULL',
    Partial = 'PARTIAL',
    None = 'NONE',
    New = 'NEWLY_INTRODUCED'
}

export interface AnalysisStats {
    before_patch_number_of_vulnerabilities: number;
    before_patch_number_of_vulnerable_dependencies: number;
    before_patch_number_of_direct_vulnerabilities: number;
    before_patch_number_of_transitive_vulnerabilities: number;

    before_patch_mean_severity: number;
    before_patch_max_severity: number;

    before_patch_number_of_critical: number;
    before_patch_number_of_high: number;
    before_patch_number_of_medium: number;
    before_patch_number_of_low: number;
    before_patch_number_of_none: number;

    before_patch_overall_confidentiality_impact: number;
    before_patch_overall_integrity_impact: number;
    before_patch_overall_availability_impact: number;

    after_patch_number_of_vulnerabilities: number;
    after_patch_number_of_vulnerable_dependencies: number;
    after_patch_number_of_direct_vulnerabilities: number;
    after_patch_number_of_transitive_vulnerabilities: number;

    after_patch_mean_severity: number;
    after_patch_max_severity: number;

    after_patch_number_of_critical: number;
    after_patch_number_of_high: number;
    after_patch_number_of_medium: number;
    after_patch_number_of_low: number;
    after_patch_number_of_none: number;

    after_patch_overall_confidentiality_impact: number;
    after_patch_overall_integrity_impact: number;
    after_patch_overall_availability_impact: number;
}

export function newAnalysisStats(): AnalysisStats {
    return {
        before_patch_number_of_vulnerabilities: 0,
        before_patch_number_of_vulnerable_dependencies: 0,
        before_patch_number_of_direct_vulnerabilities: 0,
        before_patch_number_of_transitive_vulnerabilities: 0,

        before_patch_mean_severity: 0,
        before_patch_max_severity: 0,

        before_patch_number_of_critical: 0,
        before_patch_number_of_high: 0,
        before_patch_number_of_medium: 0,
        before_patch_number_of_low: 0,
        before_patch_number_of_none: 0,

        before_patch_overall_confidentiality_impact: 0,
        before_patch_overall_integrity_impact: 0,
        before_patch_overall_availability_impact: 0,

        after_patch_number_of_vulnerabilities: 0,
        after_patch_number_of_vulnerable_dependencies: 0,
        after_patch_number_of_direct_vulnerabilities: 0,
        after_patch_number_of_transitive_vulnerabilities: 0,

        after_patch_mean_severity: 0,
        after_patch_max_severity: 0,

        after_patch_number_of_critical: 0,
        after_patch_number_of_high: 0,
        after_patch_number_of_medium: 0,
        after_patch_number_of_low: 0,
        after_patch_number_of_none: 0,

        after_patch_overall_confidentiality_impact: 0,
        after_patch_overall_integrity_impact: 0,
        after_patch_overall_availability_impact: 0
    };
}
