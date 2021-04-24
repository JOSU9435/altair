import getAltairHtml from './utils/get-altair-html';
import type { SubscriptionProviderIds } from 'altair-exported-types/dist/app/modules/altair/services/subscriptions/subscription-provider-registry.service';
import type { AltairConfigOptions } from 'altair-exported-types/dist/app/modules/altair/config';
import { SettingsState } from 'altair-exported-types/dist/app/modules/altair/store/settings/settings.interfaces';
import { IInitialEnvironments } from 'altair-exported-types/dist/app/modules/altair/store/environments/environments.interfaces';
import { IDictionary } from 'altair-exported-types/dist/app/modules/altair/interfaces/shared';

export interface RenderOptions {
    /**
     * URL to be used as a base for relative URLs
     */
    baseURL?: string;

    /**
     * URL to set as the server endpoint
     */
    endpointURL?: string;

    /**
     * URL to set as the subscription endpoint
     */
    subscriptionsEndpoint?: string;

    /**
     * Initial query to be added
     */
    initialQuery?: string;

    /**
     * Initial variables to be added
     */
    initialVariables?: string;

    /**
     * Initial pre-request script to be added
     */
    initialPreRequestScript?: string;

    /**
     * Initial headers object to be added
     * @example
     * {
     *  'X-GraphQL-Token': 'asd7-237s-2bdk-nsdk4'
     * }
     */
    initialHeaders?: Record<string, string>;

    /**
     * Whether to render the initial options in a seperate javascript file or not.
     * Use this to be able to enforce strict CSP rules.
     * @default false
     */
    serveInitialOptionsInSeperateRequest?: boolean;

    /**
     * Initial Environments to be added
     * @example
     * {
     *   base: {
     *     title: 'Environment',
     *     variables: {}
     *   },
     *   subEnvironments: [
     *     {
     *       title: 'sub-1',
     *       variables: {}
     *     }
     *   ]
     * }
     */
    initialEnvironments?: IInitialEnvironments;

    /**
     * Namespace for storing the data for the altair instance.
     * Use this when you have multiple altair instances running on the same domain.
     * @example
     * instanceStorageNamespace: 'altair_dev_'
     */
    instanceStorageNamespace?: string;

    /**
     * Initial app settings to use
     * @example
     * {
     *   theme: 'dark'
     * }
     */
    initialSettings?: Partial<SettingsState>;

    /**
     * Initial subscription provider
     *
     * @default "websocket"
     */
    initialSubscriptionsProvider?: SubscriptionProviderIds;

    /**
     * Initial subscriptions connection params
     */
    initialSubscriptionsPayload?: IDictionary;
}

/**
 * Render Altair Initial options as a string using the provided renderOptions
 * @param renderOptions
 */
export const renderInitialOptions = ({
    endpointURL,
    subscriptionsEndpoint,
    initialQuery,
    initialVariables,
    initialHeaders,
    initialPreRequestScript,
    initialEnvironments,
    instanceStorageNamespace,
    initialSettings,
    initialSubscriptionsProvider
}: RenderOptions = {}) => {
    return `
        const altairOpts = {
            ${getObjectPropertyForOption(endpointURL, 'endpointURL')}
            ${getObjectPropertyForOption(subscriptionsEndpoint, 'subscriptionsEndpoint')}
            ${getObjectPropertyForOption(initialQuery, 'initialQuery')}
            ${getObjectPropertyForOption(initialVariables, 'initialVariables')}
            ${getObjectPropertyForOption(initialPreRequestScript, 'initialPreRequestScript')}
            ${getObjectPropertyForOption(initialHeaders, 'initialHeaders')}
            ${getObjectPropertyForOption(initialEnvironments, 'initialEnvironments')}
            ${getObjectPropertyForOption(instanceStorageNamespace, 'instanceStorageNamespace')}
            ${getObjectPropertyForOption(initialSettings, 'initialSettings')}
            ${getObjectPropertyForOption(initialSubscriptionsProvider, 'initialSubscriptionsProvider')}
        };
        AltairGraphQL.init(altairOpts);
    `;
}

/**
 * Render Altair as a string using the provided renderOptions
 * @param renderOptions
 */
export const renderAltair = (options: RenderOptions = {}) => {
    const altairHtml = getAltairHtml();
    const initialOptions = renderInitialOptions(options);
    const baseURL = options.baseURL || './';
    if (options.serveInitialOptionsInSeperateRequest) {
        return altairHtml
            .replace(/<base.*>/, `<base href="${baseURL}">`)
            .replace('</body>', `<script src="initial_options.js"></script></body>`);
    } else {
        return altairHtml
            .replace(/<base.*>/, `<base href="${baseURL}">`)
            .replace('</body>', `<script>${initialOptions}</script></body>`);
    }
};

function getObjectPropertyForOption(option: any, propertyName: keyof AltairConfigOptions) {
    if (option) {
        switch (typeof option) {
            case 'object':
              return `${propertyName}: ${JSON.stringify(option)},`;
        }
        return `${propertyName}: \`${option}\`,`;
    }
    return '';
}

export { getDistDirectory } from './utils/get-dist';

export default renderAltair;
