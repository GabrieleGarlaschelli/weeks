<script lang="ts">
    import { dev } from "$app/environment"
    import * as Sentry from "@sentry/svelte";
    import { BrowserTracing } from "@sentry/tracing";
    
    if(!dev) {
        Sentry.init({
            dsn: "https://df08178abe22407584194fba9cb643d2@o823491.ingest.sentry.io/4504009711484928",
            integrations: [new BrowserTracing()],
    
            tracesSampleRate: 1.0,
        });
    }
</script>

<slot></slot>