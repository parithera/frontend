export enum APIErrors {
    ValidationFailed = 'ValidationFailed',
    NotAuthenticated = 'NotAuthenticated',
    NotAuthorized = 'NotAuthorized',
    Unsupported = 'Unsupported',
    UnknownWorkspace = 'UnknownWorkspace',
    PluginFailed = 'PluginFailed',
    PluginResultNotAvailable = 'PluginResultNotAvailable',
    RepositoryCannotBeFound = 'RepositoryCannotBeFound',
    PasswordsDoNotMatch = 'PasswordsDoNotMatch',
    ProjectDoesNotExist = 'ProjectDoesNotExist',
    AnalyzerDoesNotExist = 'AnalyzerDoesNotExist',
    AnaylzerMissingConfigAttribute = 'AnaylzerMissingConfigAttribute',
    FailedToRetrieveReposFromProvider = 'FailedToRetrieveReposFromProvider',
    RegistrationNotVerified = 'RegistrationNotVerified',
    CannotPerformActionOnSocialAccount = 'CannotPerformActionOnSocialAccount',
    SetupAlreadyDone = 'SetupAlreadyDone',
    CannotPerformActionOnNormalAccount = 'CannotPerformActionOnNormalAccount',
    PersonalOrgCannotBeModified = 'PersonalOrgCannotBeModified',
    InvitationOrgAlreadyExists = 'InvitationOrgAlreadyExists',
    FailedToCreateApiKey = 'FailedToCreateApiKey',
    FailedToAuthenticateSocialAccount = 'FailedToAuthenticateSocialAccount',
    WrongCredentials = 'WrongCredentials',
    InvitationExpired = 'InvitationExpired',
    HandleAlreadyExists = 'HandleAlreadyExists',
    EmailAlreadyExists = 'EmailAlreadyExists',
    AlreadyExists = 'AlreadyExists',
    UserDoesNotExist = 'UserDoesNotExist',
    AccountRegistrationVerificationTokenInvalidOrExpired = 'AccountRegistrationVerificationTokenInvalidOrExpired',
    UnsubscriptionTokenInvalidOrExpired = 'UnsubscriptionTokenInvalidOrExpired',
    PasswordResetTokenInvalidOrExpired = 'PasswordResetTokenInvalidOrExpired',
    NotAMember = 'NotAMember',
    CannotLeaveAsLastOwner = 'CannotLeaveAsLastOwner',
    CannotRevokeOwnMembership = 'CannotRevokeOwnMembership',
    InvitationInvalidOrExpired = 'InvitationInvalidOrExpired',
    EntityNotFound = 'EntityNotFound',
    FailedToSendAccountRegistrationVerificationEmail = 'FailedToSendAccountRegistrationVerificationEmail',
    FailedToSendPasswordResetEmail = 'FailedToSendPasswordResetEmail',
    FailedToSendOrganizationInviteEmail = 'FailedToSendOrganizationInviteEmail',
    InternalError = 'InternalError'
}

export class MalformedResponse extends Error {
    constructor() {
        super('Resource response from the API was malformed');
    }
}
