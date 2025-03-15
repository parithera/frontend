import type { AuthenticatedUser } from '@/views/login/authenticated_user.entity';
import type { Organization } from '@/views/organizations/organization.entity';
import { defineStore } from 'pinia';

interface UserStoreState {
    user?: AuthenticatedUser;
    defaultOrg?: Organization;
}

export const useUserStore = defineStore('user', {
    state: (): UserStoreState => {
        return {
            user: undefined,
            defaultOrg: undefined
        };
    },

    getters: {
        getUser(state: UserStoreState) {
            return state.user;
        },
        getDefaultOrg(state: UserStoreState) {
            return state.defaultOrg;
        }
    },

    actions: {
        setUser: function (user: AuthenticatedUser) {
            this.user = user;
        },
        setDefaultOrg: function (defaultOrg: Organization) {
            this.defaultOrg = defaultOrg;
            if (this.user) this.user.default_org.id = defaultOrg.id;
        }
    }
});
