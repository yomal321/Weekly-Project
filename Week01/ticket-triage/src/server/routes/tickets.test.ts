import { describe, expect, it } from "vitest";
import {
  CreateTicketSchema,
  PRIORITY_ORDER,
  UpdatePrioritySchema,
  UpdateTicketSchema,
  VALID_PRIORITIES,
} from "./tickets";

describe("VALID_PRIORITIES / PRIORITY_ORDER", () => {
  it("only allows P0, P1, P2", () => {
    expect(VALID_PRIORITIES).toEqual(["P0", "P1", "P2"]);
  });

  it("orders P0 before P1 before P2", () => {
    expect(PRIORITY_ORDER.P0).toBeLessThan(PRIORITY_ORDER.P1);
    expect(PRIORITY_ORDER.P1).toBeLessThan(PRIORITY_ORDER.P2);
  });
});

describe("CreateTicketSchema", () => {
  it("accepts a valid ticket payload", () => {
    const result = CreateTicketSchema.safeParse({
      title: "Server down",
      description: "Prod is returning 500s",
      source: "Slack",
      priority: "P0",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a payload with only the required fields", () => {
    const result = CreateTicketSchema.safeParse({
      title: "Minor typo",
      priority: "P2",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = CreateTicketSchema.safeParse({
      title: "",
      priority: "P1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing title", () => {
    const result = CreateTicketSchema.safeParse({ priority: "P1" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid priority", () => {
    const result = CreateTicketSchema.safeParse({
      title: "Something broke",
      priority: "Critical",
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdatePrioritySchema", () => {
  it("accepts a valid priority", () => {
    expect(UpdatePrioritySchema.safeParse({ priority: "P1" }).success).toBe(
      true
    );
  });

  it("rejects an invalid priority", () => {
    expect(UpdatePrioritySchema.safeParse({ priority: "P9" }).success).toBe(
      false
    );
  });
});

describe("UpdateTicketSchema", () => {
  it("accepts priority only", () => {
    expect(UpdateTicketSchema.safeParse({ priority: "P0" }).success).toBe(
      true
    );
  });

  it("accepts resolved only", () => {
    expect(UpdateTicketSchema.safeParse({ resolved: true }).success).toBe(
      true
    );
  });

  it("accepts an empty object since both fields are optional", () => {
    expect(UpdateTicketSchema.safeParse({}).success).toBe(true);
  });
});
