import { describe, expect, it } from "vitest";
import { buildGeoSummary } from "./geography";

describe("buildGeoSummary", () => {
  it("aggregates schools, learners and teachers by state and county", () => {
    const summary = buildGeoSummary({
      schools: [
        { id: "s1", name: "Juba Primary", state: "Central Equatoria", county: "Juba", capacity: 300, status: "Active", accredited: true },
        { id: "s2", name: "Kajo Keji Secondary", state: "Central Equatoria", county: "Kajo Keji", capacity: 250, status: "Active", accredited: false },
        { id: "s3", name: "Torit Girls", state: "Eastern Equatoria", county: "Torit", capacity: 180, status: "Active", accredited: true },
      ],
      students: [
        { id: "st1", school_id: "s1", status: "Enrolled", gender: "Female" },
        { id: "st2", school_id: "s1", status: "Enrolled", gender: "Male" },
        { id: "st3", school_id: "s3", status: "Enrolled", gender: "Female" },
      ],
      teachers: [
        { id: "t1", school_id: "s1", status: "Active", monthly_salary: 1000 },
        { id: "t2", school_id: "s2", status: "Active", monthly_salary: 1200 },
      ],
    });

    const central = summary.find((row) => row.state === "Central Equatoria");

    expect(central).toBeDefined();
    expect(central?.schools).toBe(2);
    expect(central?.learners).toBe(2);
    expect(central?.teachers).toBe(2);
    expect(central?.counties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ county: "Juba", schools: 1, learners: 2, teachers: 1 }),
        expect.objectContaining({ county: "Kajo Keji", schools: 1, learners: 0, teachers: 1 }),
      ]),
    );
  });
});
