import { createRouter, createWebHistory } from 'vue-router';
import { loadAuthStoreFromLocalStorage, useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { AuthRepository } from '@/views/login/auth.repository';
import { AuthenticatedUser } from '@/views/login/authenticated_user.entity';
import { OrgRepository } from '@/views/organizations/organization.repository';
import { BusinessLogicError } from '@/types/BaseRepository';
import { APIErrors } from '@/types/ApiErrors';
import type { Organization } from '@/views/organizations/organization.entity';
import ProjectsView from '@/views/projects/ProjectsView.vue';
import ResultsView from '@/views/results/ResultsView.vue';
import NotFoundView from '@/views/errors/NotFoundView.vue';
import TermsView from '@/views/terms/TermsView.vue';
import LoginView from '@/views/login/LoginView.vue';
import SignupView from '@/views/login/SignupView.vue';
import SettingsView from '@/views/settings/SettingsView.vue';
import PasswordResetRequestView from '@/views/login/PasswordResetRequestView.vue';
import OrganizationView from '@/views/organizations/OrganizationView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import EmailActionView from '@/views/login/EmailActionView.vue';
import SamplesView from '@/views/samples/SamplesView.vue';
import DatasetsView from '@/views/datasets/DatasetsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardView,
            props: true
        },
        {
            path: '/results/:projectId/:page?',
            name: 'results',
            component: ResultsView,
            props: true
        },
        {
            path: '/samples/:page?',
            name: 'samples',
            component: SamplesView,
            props: true
        },
        {
            path: '/datasets/:page?',
            name: 'datasets',
            component: DatasetsView,
            props: true
        },
        {
            path: '/projects/:page?',
            name: 'projects',
            component: ProjectsView,
            props: true
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/orgs/:action?/:page?/:orgId?/',
            name: 'orgs',
            component: OrganizationView,
            props: true
        },
        {
            path: '/signup/:provider?',
            name: 'signup',
            component: SignupView,
            props: true
        },
        {
            path: '/password_reset_request',
            name: 'recoveryRequest',
            component: PasswordResetRequestView
        },
        {
            path: '/email_action/:page?',
            name: 'emailAction',
            component: EmailActionView,
            props: true
        },
        {
            path: '/settings/:page?',
            name: 'settings',
            component: SettingsView,
            props: true
        },
        {
            path: '/404',
            name: 'notfound',
            component: NotFoundView
        },
        {
            path: '/terms',
            name: 'terms',
            component: TermsView,
            props: {
                page: 'terms'
            }
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: TermsView,
            props: {
                page: 'privacy'
            }
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/404'
        }
    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = [
        '/login',
        '/signup',
        '/password_reset_request',
        '/404',
        '/trial',
        '/terms',
        '/privacy',
        '/email_action/reset_password',
        '/email_action/confirm_registration'
    ];
    const authRequired = !publicPages.includes(to.path);

    const authStore = useAuthStore();
    const userStore = useUserStore();

    const authRepository = new AuthRepository();
    const orgRepository = new OrgRepository();

    if (authStore.getInitialized == false) {
        loadAuthStoreFromLocalStorage();
    }

    // Check if token is present and needs to be refreshed
    if (authRequired && authStore.getToken) {
        const current = new Date();
        if (authStore.getTokenExpiry! <= current) {
            authStore.token = undefined;
            authStore.tokenExpiry = undefined;
            // Refresh the token via the refresh token (if its not expired itself)
            if (
                authStore.getRefreshTokenExpiry &&
                authStore.getRefreshToken &&
                authStore.getRefreshTokenExpiry > current
            ) {
                try {
                    const newToken = await authRepository.refresh({
                        data: { refresh_token: authStore.getRefreshToken },
                        handleBusinessErrors: true
                    });
                    authStore.token = newToken.token;
                    authStore.tokenExpiry = newToken.token_expiry;
                } catch (error) {
                    console.error(error);
                    userStore.$reset();
                    authStore.$reset();
                    return { path: '/login' };
                }
            } else {
                userStore.$reset();
                authStore.$reset();
                return { path: '/login' };
            }
        }
    }

    // Instead of getting this from local store we will re-fetch it
    // This happens only if the user refreshes the page (F5, or reload button) and thus the SPA state is lost
    // The overhead is very small
    if (authRequired && authStore.getToken != undefined && userStore.getUser == undefined) {
        try {
            const user: AuthenticatedUser = await authRepository.getAuthenticatedUser({
                bearerToken: authStore.getToken,
                validate: false,
                handleBusinessErrors: true
            });

            if (user.activated == false) {
                userStore.$reset();
                authStore.$reset();
                return { path: '/trial' };
            }

            userStore.setUser(user);
        } catch (error) {
            console.error(error);
            userStore.$reset();
            authStore.$reset();
            return { path: '/login' };
        }
    }

    // Fetch default org info
    if (
        authRequired &&
        authStore.getToken != undefined &&
        userStore.getUser != undefined &&
        userStore.getUser.default_org
    ) {
        try {
            const org: Organization = await orgRepository.get({
                bearerToken: authStore.getToken,
                orgId: userStore.getUser.default_org.id,
                handleBusinessErrors: true
            });
            userStore.setDefaultOrg(org);
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                // It may happen that the org that the user had set as the default org has been deleted
                // In that case we fetch the personal org instead
                //
                // Similarly a user might have been removed from an org he had set as the default org
                // In that case we fetch the personal org instead as well
                if (
                    error.error_code == APIErrors.EntityNotFound ||
                    error.error_code == APIErrors.NotAuthorized
                ) {
                    try {
                        const org: Organization = await orgRepository.get({
                            bearerToken: authStore.getToken,
                            // orgId: userStore.getUser.personal_org,
                            orgId: userStore.getUser.default_org.id,
                            handleBusinessErrors: true
                        });
                        userStore.setDefaultOrg(org);
                    } catch (error) {
                        console.error(error);
                        // We cannot recover at this point
                        userStore.$reset();
                        authStore.$reset();
                        return { path: '/login' };
                    }
                }
            }
        }
    }

    const user = userStore.getUser;

    // In case a user has not yet completed is social account setup, send him back
    // We cannot send him to /signup/gitlab or /signup/github, because it requires
    // the code returned from the oauth flow
    if (authRequired && user && user.social && user.setup_done == false && to.path != '/signup/') {
        userStore.$reset();
        authStore.$reset();
        return { path: '/login' };
    }

    if (authRequired && user && user.activated == false) {
        userStore.$reset();
        authStore.$reset();
        return { path: '/trial' };
    }

    if (authRequired && authStore.getAuthenticated == false) {
        userStore.$reset();
        authStore.$reset();
        return { path: '/login' };
    } else if (to.path === '/login' && authStore.getAuthenticated == true) {
        return { path: '/' };
    }
});

export default router;
