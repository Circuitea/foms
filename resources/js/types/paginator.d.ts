export default interface Paginator<T> {
    data: T[];
    
    from: number;
    to: number;
    per_page: number;
    
    prev_page_url?: string;
    next_page_url?: string;
    
    current_page: number;
    current_page_url: string;
    first_page_url: string;
}