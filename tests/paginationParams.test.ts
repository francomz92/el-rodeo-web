import { describe, expect, it } from "vitest";

import IHttpClient from "../src/features/shared/interfaces/http/clients/http.client";
import AnimalTypeAPI from "../src/features/cattle/services/api/animalTypes.api.service";
import SupplyAPI from "../src/features/finance/services/api/supply.api.service";
import SupplyTypeAPI from "../src/features/finance/services/api/supplyType.api.service";
import supplyQueryKeys from "../src/features/finance/hooks/supply/queryKeys";
import supplyTypeQueryKeys from "../src/features/finance/hooks/supplyType/queryKeys";

/** Records get() calls; every other verb fails the test if touched. */
class RecordingHttpClient extends IHttpClient {
    calls: { url: string; queryParams?: Record<string, unknown> }[] = [];

    async get<T>(url: string, queryParams?: Record<string, unknown>): Promise<T> {
        this.calls.push({ url, queryParams });
        return [] as unknown as T;
    }

    async getBlob(): Promise<never> {
        throw new Error("getBlob is not expected in these tests");
    }

    async post<T>(): Promise<T> {
        throw new Error("post is not expected in these tests");
    }

    async put<T>(): Promise<T> {
        throw new Error("put is not expected in these tests");
    }

    async delete<T>(): Promise<T> {
        throw new Error("delete is not expected in these tests");
    }
}

describe("params reference endpoints wiring (S5)", () => {
    it("animal-type params service reads the normalized /cattle/params endpoint", async () => {
        const client = new RecordingHttpClient();

        await new AnimalTypeAPI(client).getParams();

        expect(client.calls).toHaveLength(1);
        expect(client.calls[0].url).toBe("/cattle/params/animal-type");
    });

    it("supply params services read their normalized /finance/params endpoints", async () => {
        const supplyClient = new RecordingHttpClient();
        const typeClient = new RecordingHttpClient();

        await new SupplyAPI(supplyClient).getParams();
        await new SupplyTypeAPI(typeClient).getParams();

        expect(supplyClient.calls).toHaveLength(1);
        expect(supplyClient.calls[0].url).toBe("/finance/params/animal-supply");
        expect(typeClient.calls).toHaveLength(1);
        expect(typeClient.calls[0].url).toBe("/finance/params/animal-supply-type");
    });
});

describe("params query keys", () => {
    it("supply and supplyType params keys stay distinct (shared 'supply' root)", () => {
        expect(supplyQueryKeys.params()).toEqual(["supply", "params"]);
        expect(supplyTypeQueryKeys.params()).toEqual(["supplyType", "params"]);
        expect(supplyQueryKeys.params()).not.toEqual(supplyTypeQueryKeys.params());
    });
});
