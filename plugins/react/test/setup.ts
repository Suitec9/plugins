import { cleanup } from "@testing-library/react";
import * as matches from "@testing-library/jest-dom/matchers";
import { Satellite } from "@junobuild/core";
import { expect } from "vitest";
import "fake-indexeddb/auto";
import { vi, afterEach, beforeEach } from  "vitest";



vi.mock('@junobuild/core', () => ({
    setDoc: vi.fn(),
})); 

vi.mock('../authContext', () => ({
    subscribeCollection: vi.fn(),
    unsubscribe: vi.fn()
}));



beforeEach(() => {

    setSatellitePrincipal({
        identity: {},
        satelliteId: "my-sat-id",
        fetch: typeof fetch,
        container: undefined
    } as unknown as Satellite);
})

expect.extend(matches);
afterEach(() => {
    cleanup();
});

function setSatellitePrincipal(arg0: Satellite) {}

