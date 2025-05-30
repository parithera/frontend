<script setup lang="ts">
import router from '@/router';
import Button from '@/shadcn/ui/button/Button.vue';

import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt().disable(['link']);

const data = `
*Last updated: March 19, 2024*

From everyone at CodeClarity, thank you for using our products! We build them to help you do your best work. There are millions of people using CodeClarity products every day. Because we don't know every one of our customers personally, we have to put in place some Terms of Service to help keep the ship afloat.

When we say “Company”, “we”, “our”, or “us” in this document, we are referring to **[CodeClarity](https://www.codeclarity.io)**.

When we say “Services”, we mean our websites, including www.codeclarity.io, and platform.codeclarity.io, and any product created and maintained by CodeClarity.

When we say “You” or “your”, we are referring to the people or organizations that own an account with one or more of our Services.

We may update these Terms of Service ("Terms") in the future.

When you use our Services, now or in the future, you are agreeing to the latest Terms. There may be times where we do not exercise or enforce a right or provision of the Terms; however, that does not mean we are waiving that right or provision. **These Terms do contain a limitation of our liability.**

If you violate any of the Terms, we may terminate your account. That's a broad statement and it means you need to place a lot of trust in us.

## Account Terms

1. You are responsible for maintaining the security of your account and password and for ensuring that any of your users do the same. The Company cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
2. You are responsible for all content posted to and activity that occurs under your account, including content posted by and activity of any users in your account.
3. You must be a human. Accounts registered by “bots” or other automated methods are not permitted.

## Payment, Refunds, and Plan Changes

1. If you are using a free version of one of our Services, it is really free: we do not ask you for your credit card and — just like for customers who pay for our Services — we do not sell your data.
2. For paid Services that offer a free trial, we explain the length of trial when you sign up. After the trial period, you need to pay in advance to keep using the Service. If you do not pay, we will freeze your account and it will be inaccessible until you make payment. If your account has been frozen for a while, we will queue it up for auto-cancellation.
3. If you are upgrading from a free plan to a paid plan, we will charge your card immediately and your billing cycle starts on the day of upgrade. For other upgrades or downgrades in plan level, the new rate starts from the next billing cycle.
4. All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities. Where required, we will collect those taxes on behalf of the taxing authority and remit those taxes to taxing authorities. Otherwise, you are responsible for payment of all taxes, levies, or duties.

## Cancellation and Termination

1. You are solely responsible for properly canceling your account. Within each of our Services, we provide a simple no-questions-asked cancellation link. You can find instructions for how to cancel your account in our [Cancellation policy](../cancellation/index.md). An email or phone request to cancel your account is not automatically considered cancellation. If you need help canceling your account, you can always **[contact our Support team](contact@codeclarity.io)**.
2. All of your content will be inaccessible from the Services immediately upon account cancellation. Within 30 days, all content will be permanently deleted from active systems and logs. Within 60 days, all content will be permanently deleted from our backups. We cannot recover this information once it has been permanently deleted.
3. If you cancel the Service before the end of your current paid up month, your cancellation will take effect immediately, and you will not be charged again. We do not automatically prorate unused time in the last billing cycle.
4. We have the right to suspend or terminate your account and refuse any and all current or future use of our Services for any reason at any time. Suspension means you and any other users on your account will not be able to access the account or any content in the account. Termination will furthermore result in the deletion of your account or your access to your account, and the forfeiture and relinquishment of all content in your account. We also reserve the right to refuse the use of the Services to anyone for any reason at any time. We have this clause because statistically speaking, out of the hundreds of thousands of accounts on our Services, there is at least one doing something nefarious. There are some things we staunchly stand against and this clause is how we exercise that stance.
5. Verbal, physical, written or other abuse (including threats of abuse or retribution) of a Company employee or officer will result in immediate account termination.

## Modifications to the Service and Prices

1. We make a promise to our customers to support our Services. That means when it comes to security, privacy, and customer support, we will continue to maintain any legacy Services. Sometimes it becomes technically impossible to continue a feature or we redesign a part of our Services because we think it could be better or we decide to close new signups of a product. We reserve the right at any time to modify or discontinue, temporarily or permanently, any part of our Services with or without notice.
2. Sometimes we change the pricing structure for our products. When we do that, we tend to exempt existing customers from those changes. However, we may choose to change the prices for existing customers. If we do so, we will give at least 30 days notice and will notify you via the email address on record. We may also post a notice about changes on our websites or the affected Services themselves.

## Uptime, Security, and Privacy

1. Your use of the Services is at your sole risk. We provide these Services on an “as is” and “as available” basis. We do not offer service-level agreements for most of our Services but do take uptime of our applications seriously.
2. We reserve the right to temporarily disable your account if your usage significantly exceeds the average usage of other customers of the Services. Of course, we'll reach out to the account owner before taking any action except in rare cases where the level of use may negatively impact the performance of the Service for other customers.
3. We take many measures to protect and secure your data through backups, redundancies, and encryption. We enforce encryption for data transmission from the public Internet. There are some edge cases where we may send your data through our network unencrypted.
4. When you use our Services, you entrust us with your data. We take that trust to heart. You agree that CodeClarity may process your data as described in our [Privacy Policy](https://platform.codeclarity.io/privacy) and for no other purpose. We as humans can access your data for the following reasons:
  - **To help you with support requests you make.** We'll ask for express consent before accessing your account.
  - **On the rare occasions when an error occurs that stops an automated process partway through.** We get automated alerts when such errors occur. When we can fix the issue and restart automated processing without looking at any personal data, we do. In rare cases, we have to look at a minimum amount of personal data to fix the issue. In these rare cases, we aim to fix the root cause to prevent the errors from recurring.
  - **To safeguard CodeClarity.** We'll look at logs and metadata as part of our work to ensure the security of your data and the Services as a whole. If necessary, we may also access accounts as part of an abuse report investigation.

5. We use third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Services.
6. These Terms incorporate the [CodeClarity Data Processing Addendum (“DPA”)](https://platform.codeclarity.io/privacy) when the EU General Data Protection Regulation (“GDPR”) or United Kingdom General Data Protection Regulation (“UK GDPR”) applies to your use of CodeClarity Services to process Customer Data as defined in the DPA. The DPA linked above supersedes any previously agreed data processing addendum between you and CodeClarity relating to your use of the CodeClarity Services.

## Copyright and Content Ownership

1. You give us a limited license to use the content posted by you and your users in order to provide the Services to you, but we claim no ownership rights over those materials. All materials you submit to the Services remain yours.
2. We do not pre-screen content, but we reserve the right (but not the obligation) in our sole discretion to refuse or remove any content that is available via the Service.
3. The Company or its licensors own all right, title, and interest in and to the Services, including all intellectual property rights therein, and you obtain no ownership rights in the Services as a result of your use. You may not duplicate, copy, or reuse any portion of the HTML, CSS, JavaScript, or visual design elements without express written permission from the Company. You must request permission to use the Company's logos or any Service logos for promotional purposes. Please **[email us](contact@codeclarity.io)** requests to use logos. We reserve the right to rescind any permissions if you violate these Terms.
4. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Services, use of the Services, or access to the Services without the express written permission of the Company.

## Features and Bugs

We design our Services with care, based on our own experience and the experiences of customers who share their time and feedback. However, there is no such thing as a service that pleases everybody. We make no guarantees that our Services will meet your specific requirements or expectations.

We also test all of our features extensively before shipping them. As with any software, our Services inevitably have some bugs. We track the bugs reported to us and work through priority ones, especially any related to security or privacy. Not all reported bugs will get fixed and we don't guarantee completely error-free Services.

## Services Adaptations and API Terms

We offer Application Program Interfaces (“API”s) for some of our Services (currently CodeClarity). Any use of the API, including through a third-party product that accesses the Services, is bound by these Terms plus the following specific terms:

1. You expressly understand and agree that we are not liable for any damages or losses resulting from your use of the API or third-party products that access data via the API.
2. Third parties may not access and employ the API if the functionality is part of an application that remotely records, monitors, or reports a Service user's activity *other than time tracking*, both inside and outside the applications. The Company, in its sole discretion, will determine if an integration service violates this bylaw. A third party that has built and deployed an integration for the purpose of remote user surveillance will be required to remove that integration.
3. Abuse or excessively frequent requests to the Services via the API may result in the temporary or permanent suspension of your account's access to the API. The Company, in its sole discretion, will determine abuse or excessive usage of the API. If we need to suspend your account's access, we will attempt to warn the account owner first. If your API usage could or has caused downtime, we may cut off access without prior notice.

## Liability

We mention liability throughout these Terms but to put it all in one section:

***You expressly understand and agree that the Company shall not be liable, in law or in equity, to you or to any third party for any direct, indirect, incidental, lost profits, special, consequential, punitive or exemplary damages, including, but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the Services; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the Services; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third party on the service; (v) or any other matter relating to these Terms or the Services, whether as a breach of contract, tort (including negligence whether active or passive), or any other theory of liability.***

In other words: choosing to use our Services does mean you are making a bet on us. If the bet does not work out, that's on you, not us. We do our darnedest to be as safe a bet as possible through careful management of the business; investments in security, infrastructure, and talent. If you choose to use our Services, thank you for betting on us.

If you have a question about any of these Terms, please **[contact our Support team](contact@codeclarity.io)**.`;
</script>

<template>
    <div class="flex flex-col gap-4 p-12">
        <div class="text-3xl self-center">Terms of service</div>

        <!-- <vue-markdown :source="data" :options="{ linkify: false }" /> -->
        <div v-html="markdown.render(data)" />

        <Button @click="router.back()">Go back</Button>
    </div>
</template>

<style scoped lang="scss">
:deep(h1),
:deep(h2) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-size: 2em;
    font-weight: bold;
}

:deep(ol) {
    list-style-type: decimal;
    list-style-position: inside;
}
</style>
