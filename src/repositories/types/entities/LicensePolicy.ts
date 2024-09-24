import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { TeamMember } from './Organization';

export enum LicensePolicyType {
    WHITELIST = 'WHITELIST',
    BLACKLIST = 'BLACKLIST'
}

export enum PolicyType {
    LICENSE_POLICY = 'LICENSE_POLICY',
    DEP_UPGRADE_POLICY = 'DEP_UPGRADE_POLICY'
}

export class LicensePolicy {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    description!: string;

    @IsDefined()
    @IsEnum(LicensePolicyType)
    type!: LicensePolicyType;

    @IsBoolean()
    default!: boolean;

    @IsOptional()
    @Type(() => TeamMember)
    created_by?: TeamMember;

    @IsDate()
    @Type(() => Date)
    created_on!: Date;

    @IsNotEmpty()
    @IsArray()
    licenses!: string[];

    @IsNotEmpty()
    organization_id!: string;

    @IsDefined()
    @IsEnum(PolicyType)
    policy_type!: PolicyType;
}
