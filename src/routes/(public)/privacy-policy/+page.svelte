<script lang="ts">
	import { page } from "$app/state";
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="prose prose-lg">
    <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>

    <div class="mb-8 rounded border border-purple-200 bg-purple-50 p-4">
      <p class="text-sm text-purple-800">Last Updated: 22/09/25</p>
    </div>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
      <p class="mb-4">
        Plancake values and respect's your privacy and are committed to protecting your personal data. 
        This privacy policy will inform you about how and why collect and use your personal information when you visit or interact with our website at 
        <a class="text-purple-default" href={page.url.origin}>{page.url.origin}</a>.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>

      <h3 class="text-xl font-medium mb-2">Personal Information You Provide</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Account Information: Email address, username, display name</li>
        <li>Profile Information: Any additional information you choose to add to your profile</li>
        <li>Authentication Data: Password (encrypted), or third-party authentication via Google or Twitch</li>
        <li>Profile Settings: Language Preferences, timezone, links</li>
        <li>Schedule Content: Schedule titles, descriptions, event details, external URLs</li>
      </ul>

      <h3 class="text-xl font-medium mb-2">Information We Collect Automatically</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Usage Data: how you interact with our service, features used, session duration</li>
        <li>Device Information: Browser type, operating system, IP address</li>
        <li>Cookies and Similar Technologies: For authentication, preferences, and functionality</li>
      </ul>

      <h3 class="text-xl font-medium mb-2">Third-Party Information</h3>
      <p>When you authenticate using Google or Twitch, we receive basic profile information from these services as permitted by your account settings with them.</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      <h3 class="text-xl font-medium mb-2">We use the information we collect to:</h3>
      <ul class="list-disc pl-6">
        <li>Provide Our Service: Create and manage your account, display your schedules, process authentication</li>
        <li>Customise Experience: Apply your theme preferences, timezone settings, language preferences</li>
        <li>Communication: Send important service updates, respond to support requests</li>
        <li>Service Improvement: Analyse usage patterns to improve our features and user experience</li>
        <li>Security: Protect against fraud, abuse, and security threats</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
      <h3 class="text-xl font-medium mb-2">We Do Not Sell Your Personal Information</h3>
      <h3 class="text-xl font-medium mb-2">We May Share Information In These Limited Circumstances:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Service Providers: Trusted third parties who help us operate our service (hosting, analytics, email delivery)</li>
        <li>Legal Requirements: When required by law, court order, or to protect our rights and users' safety</li>
        <li>Business Transfer: In connection with a merger, acquisition, or sale of assets</li>
        <li>Public Content: Schedule information you choose to make publicly viewable</li>
      </ul>

      <h3 class="text-xl font-medium mb-2">Third-Party Services We Use:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Authentication Providers: Google, Twitch (when you choose these login methods)</li>
        <li>Hosting Services: For reliable service delivery</li>
        <li>Analytics: To understand how our service is used and improve it</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. Your Rights and Choices</h2>
      <h3 class="text-xl font-medium mb-2">Account Management</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Access: View and download your account information and schedule data</li>
        <li>Correction: Update your profile information, settings, and schedule content</li>
        <li>Deletion: Delete your account and associated data at any time</li>
        <li>Portability: Request data portability</li>
      </ul>

      <h3 class="text-xl font-medium mb-2">Privacy Controls</h3>
      <ul class="list-disc pl-6 mb-4">
        <!-- <li>Schedule Visibility: Control whether your schedules are public or private</li> -->
        <!-- <li>Communication Preferences: Manage what notifications you receive</li> -->
        <li>Authentication Methods: Add or remove login methods (password, Google, Twitch)</li>
        <li>Links: Control what links are displayed</li>
      </ul>

      <h3 class="text-xl font-medium mb-2">Cookie Preferences</h3>
      <p>You can control cookies through your browser settings, though this may affect service functionality.</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Changes to This Privacy Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify you of material changes by:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Posting the updated policy on our website</li>
        <li>Sending an email notification to your registered email address</li>
        <li>Displaying a prominent notice in our application</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
      <p>
        For questions about this privacy policy, please contact us at:
        <a href="mailto:coopa.contact@gmail.com" class="text-blue-600 hover:underline">
          coopa.contact@gmail.com
        </a>
      </p>
    </section>

    <footer class="text-sm text-gray-600 mt-12">
    </footer>
  </div>
</div>
