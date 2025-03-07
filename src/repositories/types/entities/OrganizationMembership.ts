import { IsDateString, IsNotEmpty } from 'class-validator';
import type { MemberRole, Organization, TeamMember } from './Organization';

export class OrganizationMembership {
    @IsDateString()
    joined_on!: Date;

    @IsNotEmpty()
    organization!: Organization;

    user!: TeamMember;
    role!: MemberRole
}
