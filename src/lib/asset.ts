/**
 * Public URL of a file in public/ ("/assets/…"), relative to the build base:
 * "/" for the normal site, "./" for the Claude page build (served under a sub-path).
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "")

/** True in the Claude page build (`vite build --mode artifact`): no <object> PDFs, no download links. */
export const IS_ARTIFACT = import.meta.env.MODE === "artifact"
