import dotenv from 'dotenv';
import axios from 'axios';
import { Handler } from './Handler';
import { TaskException } from './Exception';

dotenv.config();

export class Solver {
    private apiKey: string;
    private verbose: number;
    private rqDelay: number;

    constructor(apiKey: string = process.env.APIKEY ?? "", verbose: number = 0, rqDelay: number = 1700) {
        this.apiKey = apiKey;
        this.verbose = verbose;
        this.rqDelay = rqDelay;
    }

    async balance(): Promise<number> {
        try {
            const res = await axios.post("https://api.capsolver.com/getBalance", { clientKey: this.apiKey });
            const data = res.data;
            if (data.errorId !== 0) {
                throw new TaskException("Failed to retrieve balance", data);
            }
            return data.balance ? parseFloat(data.balance) : data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async runCustomTaskType({
        task,
        mustPoll = true
    }: {
        task: Record<string, any>;
        mustPoll?: boolean;
    }): Promise<any> {
        if (task.hasOwnProperty("type")) {
            const handler = new Handler({
                task,
                apiKey: this.apiKey,
                verbose: this.verbose,
                mustPoll
            });
            return handler.execute(this.rqDelay);
        } else {
            throw new TypeError(`Type of task is required. Usage: await handler.runAnyTask({ "type": "AntiTurnstileTaskProxyLess", ... })`);
        }
    }

    async mtcaptcha({ 
        websiteURL, 
        websiteKey, 
        proxy 
    }: { 
        websiteURL: string; 
        websiteKey: string; 
        proxy?: string;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "MTCaptchaTask",
                websiteURL,
                websiteKey,
                proxy
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    // Continue with other methods following the same pattern...
    // Each method should have proper TypeScript interfaces for its parameters

    async antiturnstile({ 
        websiteURL, 
        websiteKey, 
        metadata = null 
    }: { 
        websiteURL: string; 
        websiteKey: string; 
        metadata?: Record<string, any> | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "AntiTurnstileTaskProxyLess",
                websiteURL,
                websiteKey,
                metadata
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async anticloudflare({ 
        websiteURL, 
        proxy, 
        metadata = null, 
        html = null 
    }: { 
        websiteURL: string; 
        proxy: string; 
        metadata?: Record<string, any> | null; 
        html?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "AntiCloudflareTask",
                websiteURL,
                proxy,
                metadata,
                html
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async image2text({ 
        websiteURL = null, 
        body, 
        module = null, 
        score = null, 
        caseSensitive = null 
    }: { 
        websiteURL?: string | null; 
        body: string;
        module?: string | null;
        score?: number | null;
        caseSensitive?: boolean | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ImageToTextTask",
                websiteURL,
                body,
                module,
                score,
                case: caseSensitive
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: false
        })).execute(this.rqDelay);
    }

    async hcaptchaclassification({ 
        websiteURL = null, 
        websiteKey = null, 
        queries, 
        question 
    }: { 
        websiteURL?: string | null; 
        websiteKey?: string | null;
        queries: any[];
        question: string;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "HCaptchaClassification",
                websiteURL,
                websiteKey,
                queries,
                question
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: false
        })).execute(this.rqDelay);
    }

    async hcaptcha({ 
        websiteURL, 
        websiteKey, 
        proxy, 
        isInvisible = null, 
        enterprisePayload = null, 
        userAgent = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        proxy: string;
        isInvisible?: boolean | null;
        enterprisePayload?: Record<string, any> | null;
        userAgent?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "HCaptchaTask",
                websiteURL,
                websiteKey,
                proxy,
                userAgent,
                isInvisible,
                enterprisePayload
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async hcaptchaproxyless({ 
        websiteURL, 
        websiteKey, 
        isInvisible = null, 
        enterprisePayload = null, 
        userAgent = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        isInvisible?: boolean | null;
        enterprisePayload?: Record<string, any> | null;
        userAgent?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "HCaptchaTask",
                websiteURL,
                websiteKey,
                userAgent,
                isInvisible,
                enterprisePayload
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav2({ 
        websiteURL, 
        websiteKey, 
        proxy, 
        pageAction = null, 
        enterprisePayload = null, 
        isInvisible = false, 
        apiDomain = null, 
        userAgent = null, 
        cookie = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        proxy: string;
        pageAction?: string | null;
        enterprisePayload?: Record<string, any> | null;
        isInvisible?: boolean;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookie?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV2Task",
                websiteURL,
                websiteKey,
                proxy,
                pageAction,
                enterprisePayload,
                isInvisible,
                apiDomain,
                userAgent,
                cookie
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav2proxyless({ 
        websiteURL, 
        websiteKey, 
        pageAction = null, 
        enterprisePayload = null, 
        isInvisible = false, 
        apiDomain = null, 
        userAgent = null, 
        cookie = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        pageAction?: string | null;
        enterprisePayload?: Record<string, any> | null;
        isInvisible?: boolean;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookie?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV2TaskProxyLess",
                websiteURL,
                websiteKey,
                pageAction,
                enterprisePayload,
                isInvisible,
                apiDomain,
                userAgent,
                cookie
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav2enterprise({ 
        websiteURL, 
        websiteKey, 
        proxy, 
        pageAction = null, 
        enterprisePayload = null, 
        isInvisible = false, 
        apiDomain = null, 
        userAgent = null, 
        cookie = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        proxy: string;
        pageAction?: string | null;
        enterprisePayload?: Record<string, any> | null;
        isInvisible?: boolean;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookie?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV2EnterpriseTask",
                websiteURL,
                websiteKey,
                proxy,
                pageAction,
                enterprisePayload,
                isInvisible,
                apiDomain,
                userAgent,
                cookie
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav2enterpriseproxyless({ 
        websiteURL, 
        websiteKey, 
        pageAction = null, 
        enterprisePayload = null, 
        isInvisible = false, 
        apiDomain = null, 
        userAgent = null, 
        cookie = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        pageAction?: string | null;
        enterprisePayload?: Record<string, any> | null;
        isInvisible?: boolean;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookie?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV2EnterpriseTaskProxyLess",
                websiteURL,
                websiteKey,
                pageAction,
                enterprisePayload,
                isInvisible,
                apiDomain,
                userAgent,
                cookie
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav3({ 
        websiteURL, 
        websiteKey, 
        proxy, 
        pageAction, 
        enterprisePayload = null, 
        apiDomain = null, 
        userAgent = null, 
        cookies = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        proxy: string;
        pageAction: string;
        enterprisePayload?: Record<string, any> | null;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookies?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV3Task",
                websiteURL,
                websiteKey,
                proxy,
                pageAction,
                enterprisePayload,
                apiDomain,
                userAgent,
                cookies
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav3proxyless({ 
        websiteURL, 
        websiteKey, 
        pageAction, 
        enterprisePayload = null, 
        apiDomain = null, 
        userAgent = null, 
        cookies = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        pageAction: string;
        enterprisePayload?: Record<string, any> | null;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookies?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV3TaskProxyLess",
                websiteURL,
                websiteKey,
                pageAction,
                enterprisePayload,
                apiDomain,
                userAgent,
                cookies
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav3enterprise({ 
        websiteURL, 
        websiteKey, 
        proxy, 
        pageAction, 
        enterprisePayload = null, 
        apiDomain = null, 
        userAgent = null, 
        cookies = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        proxy: string;
        pageAction: string;
        enterprisePayload?: Record<string, any> | null;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookies?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV3EnterpriseTask",
                websiteURL,
                websiteKey,
                proxy,
                pageAction,
                enterprisePayload,
                apiDomain,
                userAgent,
                cookies
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async recaptchav3enterpriseproxyless({ 
        websiteURL, 
        websiteKey, 
        pageAction, 
        enterprisePayload = null, 
        apiDomain = null, 
        userAgent = null, 
        cookies = null 
    }: { 
        websiteURL: string;
        websiteKey: string;
        pageAction: string;
        enterprisePayload?: Record<string, any> | null;
        apiDomain?: string | null;
        userAgent?: string | null;
        cookies?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "ReCaptchaV3EnterpriseTaskProxyLess",
                websiteURL,
                websiteKey,
                pageAction,
                enterprisePayload,
                apiDomain,
                userAgent,
                cookies
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async datadome({ 
        websiteURL, 
        userAgent, 
        captchaUrl, 
        proxy 
    }: { 
        websiteURL: string;
        userAgent: string;
        captchaUrl: string;
        proxy: string;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "DatadomeSliderTask",
                websiteURL,
                userAgent,
                captchaUrl,
                proxy
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async funcaptcha({ 
        websiteURL, 
        websitePublicKey, 
        data = null, 
        userAgent = null, 
        proxy 
    }: { 
        websiteURL: string;
        websitePublicKey: string;
        data?: string | null;
        userAgent?: string | null;
        proxy: string;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "FunCaptchaTask",
                websiteURL,
                websitePublicKey,
                data,
                userAgent,
                proxy
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async funcaptchaproxyless({ 
        websiteURL, 
        websitePublicKey, 
        data = null, 
        userAgent = null 
    }: { 
        websiteURL: string;
        websitePublicKey: string;
        data?: string | null;
        userAgent?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "FunCaptchaTaskProxyLess",
                websiteURL,
                websitePublicKey,
                data,
                userAgent,
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async funcaptchaclassification({ 
        websiteURL = null, 
        websiteKey = null, 
        images, 
        module = null, 
        question 
    }: { 
        websiteURL?: string | null;
        websiteKey?: string | null;
        images: string[];
        module?: string | null;
        question: string;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "FunCaptchaClassification",
                websiteURL,
                websiteKey,
                images,
                module,
                question
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: false
        })).execute(this.rqDelay);
    }

    async geetest({ 
        websiteURL, 
        gt = null, 
        challenge = null, 
        proxy, 
        geetestApiServerSubdomain = null, 
        captchaId = null 
    }: { 
        websiteURL: string;
        gt?: string | null;
        challenge?: string | null;
        proxy: string;
        geetestApiServerSubdomain?: string | null;
        captchaId?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "GeeTestTaskProxyLess",
                websiteURL,
                proxy,
                gt,
                challenge,
                captchaId,
                geetestApiServerSubdomain
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }

    async geetestproxyless({ 
        websiteURL, 
        gt = null, 
        challenge = null, 
        captchaId = null, 
        geetestApiServerSubdomain = null 
    }: { 
        websiteURL: string;
        gt?: string | null;
        challenge?: string | null;
        captchaId?: string | null;
        geetestApiServerSubdomain?: string | null;
    }): Promise<any> {
        return await (new Handler({
            task: {
                type: "GeeTestTaskProxyLess",
                websiteURL,
                gt,
                challenge,
                captchaId,
                geetestApiServerSubdomain
            },
            apiKey: this.apiKey,
            verbose: this.verbose,
            mustPoll: true
        })).execute(this.rqDelay);
    }
} 