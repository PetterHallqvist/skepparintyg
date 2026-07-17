// Test stub: the real `server-only` package throws when imported outside a
// React Server Component graph. Under vitest (plain node) we alias it here to a
// no-op so server-only modules (Stripe client, service client) are unit-testable.
export {};
