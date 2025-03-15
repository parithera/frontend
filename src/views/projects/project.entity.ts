import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Analysis } from './analysis.entity';
import { Type } from 'class-transformer';
import { TeamMember } from '../organizations/organization.entity';
import { ProjectFile } from './project_file.entity';

export class Project {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    url!: string;

    @IsOptional()
    @Type(() => Analysis)
    most_recent_analysis?: Analysis;

    @IsNotEmpty()
    upload_id!: string;

    @IsDate()
    @Type(() => Date)
    added_on!: Date;

    @IsOptional()
    @Type(() => TeamMember)
    added_by?: TeamMember;

    @IsNotEmpty()
    organization_id!: string;

    @IsOptional()
    @Type(() => Array<ProjectFile>)
    files?: Array<ProjectFile>;
}

export class Repository {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    url!: string;

    @IsNotEmpty()
    default_branch!: string;

    @IsNotEmpty()
    visibility!: string;

    @IsNotEmpty()
    fully_qualified_name!: string;

    @IsNotEmpty()
    description!: string;

    @IsDate()
    @Type(() => Date)
    created_at!: Date;

    @IsBoolean()
    imported_already!: boolean;
}
