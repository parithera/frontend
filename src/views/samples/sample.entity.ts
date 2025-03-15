import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectFile } from '../projects/project_file.entity';
import type { AuthenticatedUser } from '../login/authenticated_user.entity';

export class Sample {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    tags!: string[];
    
    @IsNotEmpty()
    public!: boolean;

    organism!: string;
    
    assay!: string;

    cells!: number;

    show!: string;

    download!: string;

    @IsOptional()
    @Type(() => Array<ProjectFile>)
    files?: Array<ProjectFile>;

    @IsOptional()
    @Type(() => Array<AuthenticatedUser>)
    users?: Array<AuthenticatedUser>;
}