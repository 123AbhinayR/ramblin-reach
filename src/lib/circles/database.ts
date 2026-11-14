import type { CirclePost, CircleComment } from "./schemas";
type Table<Row,Insert,Update>={Row:Row;Insert:Insert;Update:Update;Relationships:[];ComputedFields:never};
type PostWrite=Omit<CirclePost,"id"|"owner_id"|"created_at"|"updated_at"|"resolved">;
export type CircleTables={
 circle_posts:Table<CirclePost,PostWrite,Partial<PostWrite&{resolved:boolean}>>;
 circle_comments:Table<CircleComment,Pick<CircleComment,"post_id"|"parent_id"|"body">,never>;
 circle_reports:Table<{id:string;post_id:string;reporter_id:string;reason:string;created_at:string},{post_id:string;reason:string},never>;
};
