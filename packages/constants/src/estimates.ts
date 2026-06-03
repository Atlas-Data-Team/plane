/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// plane imports
import type { TEstimateSystems } from "@plane/types";

export const MAX_ESTIMATE_POINT_INPUT_LENGTH = 20;

export enum EEstimateSystem {
  POINTS = "points",
  CATEGORIES = "categories",
  TIME = "time",
}

export enum EEstimateUpdateStages {
  CREATE = "create",
  EDIT = "edit",
  SWITCH = "switch",
}

export const estimateCount = {
  min: 2,
  max: 40,
};

export const ESTIMATE_SYSTEMS: TEstimateSystems = {
  points: {
    name: "Points",
    i18n_name: "project_settings.estimates.systems.points.label",
    templates: {
      fibonacci: {
        title: "Fibonacci",
        i18n_title: "project_settings.estimates.systems.points.fibonacci",
        values: [
          { id: undefined, key: 1, value: "1" },
          { id: undefined, key: 2, value: "2" },
          { id: undefined, key: 3, value: "3" },
          { id: undefined, key: 4, value: "5" },
          { id: undefined, key: 5, value: "8" },
          { id: undefined, key: 6, value: "13" },
        ],
      },
      linear: {
        title: "Linear",
        i18n_title: "project_settings.estimates.systems.points.linear",
        values: [
          { id: undefined, key: 1, value: "1" },
          { id: undefined, key: 2, value: "2" },
          { id: undefined, key: 3, value: "3" },
          { id: undefined, key: 4, value: "4" },
          { id: undefined, key: 5, value: "5" },
          { id: undefined, key: 6, value: "6" },
        ],
      },
      squares: {
        title: "Squares",
        i18n_title: "project_settings.estimates.systems.points.squares",
        values: [
          { id: undefined, key: 1, value: "1" },
          { id: undefined, key: 2, value: "4" },
          { id: undefined, key: 3, value: "9" },
          { id: undefined, key: 4, value: "16" },
          { id: undefined, key: 5, value: "25" },
          { id: undefined, key: 6, value: "36" },
        ],
      },
      custom: {
        title: "Custom",
        i18n_title: "project_settings.estimates.systems.points.custom",
        values: [
          { id: undefined, key: 1, value: "1" },
          { id: undefined, key: 2, value: "2" },
        ],
        hide: true,
      },
    },
    is_available: true,
    is_ee: false,
  },
  categories: {
    name: "Categories",
    i18n_name: "project_settings.estimates.systems.categories.label",
    templates: {
      t_shirt_sizes: {
        title: "T-Shirt Sizes",
        i18n_title: "project_settings.estimates.systems.categories.t_shirt_sizes",
        values: [
          { id: undefined, key: 1, value: "XS" },
          { id: undefined, key: 2, value: "S" },
          { id: undefined, key: 3, value: "M" },
          { id: undefined, key: 4, value: "L" },
          { id: undefined, key: 5, value: "XL" },
          { id: undefined, key: 6, value: "XXL" },
        ],
      },
      easy_to_hard: {
        title: "Easy to hard",
        i18n_title: "project_settings.estimates.systems.categories.easy_to_hard",
        values: [
          { id: undefined, key: 1, value: "Easy" },
          { id: undefined, key: 2, value: "Medium" },
          { id: undefined, key: 3, value: "Hard" },
          { id: undefined, key: 4, value: "Very Hard" },
        ],
      },
      // Semantic labels aligned with ClickUp-style work time (8h per "d"; "1w" = 5 work days).
      clickup_duration: {
        title: "Duration (ClickUp-style)",
        i18n_title: "project_settings.estimates.systems.categories.clickup_duration",
        values: [
          { id: undefined, key: 1, value: "5m" },
          { id: undefined, key: 2, value: "10m" },
          { id: undefined, key: 3, value: "15m" },
          { id: undefined, key: 4, value: "20m" },
          { id: undefined, key: 5, value: "30m" },
          { id: undefined, key: 6, value: "45m" },
          { id: undefined, key: 7, value: "1h" },
          { id: undefined, key: 8, value: "1.5h" },
          { id: undefined, key: 9, value: "2h" },
          { id: undefined, key: 10, value: "2.5h" },
          { id: undefined, key: 11, value: "3h" },
          { id: undefined, key: 12, value: "3.5h" },
          { id: undefined, key: 13, value: "4h" },
          { id: undefined, key: 14, value: "4.5h" },
          { id: undefined, key: 15, value: "5h" },
          { id: undefined, key: 16, value: "5.5h" },
          { id: undefined, key: 17, value: "6h" },
          { id: undefined, key: 18, value: "6.5h" },
          { id: undefined, key: 19, value: "7h" },
          { id: undefined, key: 20, value: "7.5h" },
          { id: undefined, key: 21, value: "8h" },
          { id: undefined, key: 22, value: "0.5d" },
          { id: undefined, key: 23, value: "1d" },
          { id: undefined, key: 24, value: "1.5d" },
          { id: undefined, key: 25, value: "2d" },
          { id: undefined, key: 26, value: "2.5d" },
          { id: undefined, key: 27, value: "3d" },
          { id: undefined, key: 28, value: "3.5d" },
          { id: undefined, key: 29, value: "4d" },
          { id: undefined, key: 30, value: "4.5d" },
          { id: undefined, key: 31, value: "5d" },
          { id: undefined, key: 32, value: "1w" },
          { id: undefined, key: 33, value: "1.5w" },
          { id: undefined, key: 34, value: "2w" },
          { id: undefined, key: 35, value: "2.5w" },
          { id: undefined, key: 36, value: "3w" },
          { id: undefined, key: 37, value: "4w" },
          { id: undefined, key: 38, value: "1mo" },
          { id: undefined, key: 39, value: "2mo" },
          { id: undefined, key: 40, value: "3mo" },
        ],
      },
      custom: {
        title: "Custom",
        i18n_title: "project_settings.estimates.systems.categories.custom",
        values: [
          { id: undefined, key: 1, value: "Easy" },
          { id: undefined, key: 2, value: "Hard" },
        ],
        hide: true,
      },
    },
    is_available: true,
    is_ee: false,
  },
  time: {
    name: "Time",
    i18n_name: "project_settings.estimates.systems.time.label",
    templates: {
      hours: {
        title: "Hours",
        i18n_title: "project_settings.estimates.systems.time.hours",
        values: [
          { id: undefined, key: 1, value: "1" },
          { id: undefined, key: 2, value: "2" },
          { id: undefined, key: 3, value: "3" },
          { id: undefined, key: 4, value: "4" },
          { id: undefined, key: 5, value: "5" },
          { id: undefined, key: 6, value: "6" },
        ],
      },
    },
    is_available: true,
    is_ee: true,
  },
};
