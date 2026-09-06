abstract class IHttpClient {
    abstract get<T>(url: string, queryParams?: Record<string, any>): Promise<T>
    abstract post<T>(url: string, body: any): Promise<T>
    abstract put<T>(url: string, body: any): Promise<T>
    abstract delete<T>(url: string): Promise<T>
}

export default IHttpClient
