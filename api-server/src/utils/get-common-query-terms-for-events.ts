import { Op, WhereOptions } from "sequelize";
import {HttpException, Query} from "@nestjs/common";
import isNotNullOrUndefined from "./is-not-null-or-undefined";
// import {HttpException, HttpStatus} from "@nestjs/common";

// TODO: it would be nice to be able to say tags=-tag to filter on events _without_ tag
/**
 * Build query options for events (or current events)
 * 
 * @param verified true for only verified events, false for only unverified events, null for both
 * @param tags tag or array of tags to filter by (when using an array, only events with ALL tags are returned)
 */

type GetCommonQueryTermsForEventsArgs = {
    verified?: boolean;
    tags: string[] | string;
    disablePagination?: boolean;
    pageSize?: number;
    requestedPage?: number;
}
export default function getCommonQueryTermsForEvents({
    verified,
    tags,
}: GetCommonQueryTermsForEventsArgs): WhereOptions {
    const queryTags = ensureIsArray(tags);
    const terms: WhereOptions = {}

    if (typeof verified === 'boolean') terms.verified = verified

    if (queryTags.length > 0) terms.tags = { [Op.contains]: queryTags }

    return terms
}

function ensureIsArray(value: string[] | string): string[] {
    return typeof value === 'string' ? [value] : value;
}
