import { TRPCError } from "@trpc/server";
export declare const trouter: import("@trpc/server").TRPCRouterBuilder<{
    ctx: {
        user: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const tprocedure: import("@trpc/server").TRPCProcedureBuilder<{
    user: any;
}, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<{
    user: any;
}, object, {
    user: any;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const middleware: <$ContextOverrides>(fn: import("@trpc/server").TRPCMiddlewareFunction<{
    user: any;
}, object, object, $ContextOverrides, unknown>) => import("@trpc/server").TRPCMiddlewareBuilder<{
    user: any;
}, object, $ContextOverrides, unknown>;
export { TRPCError };
