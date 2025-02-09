import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectFile } from './ProjectFile';
import type { AuthenticatedUser } from './AuthenticatedUser';

export class Sample {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    tags!: string[];

    @IsOptional()
    @Type(() => Array<ProjectFile>)
    files?: Array<ProjectFile>;

    @IsOptional()
    @Type(() => Array<AuthenticatedUser>)
    users?: Array<AuthenticatedUser>;
}