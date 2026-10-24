export interface DownloadedFileSchema {
    blob: Blob;
    /** Parsed from the response Content-Disposition header; null when absent. */
    filename: string | null;
}

abstract class IHttpClient {
    abstract get<T>(url: string, queryParams?: Record<string, any>): Promise<T>
    abstract getBlob(url: string, queryParams?: Record<string, any>): Promise<DownloadedFileSchema>
    abstract post<T>(url: string, body: any): Promise<T>
    abstract put<T>(url: string, body: any): Promise<T>
    abstract delete<T>(url: string): Promise<T>
}

export default IHttpClient
