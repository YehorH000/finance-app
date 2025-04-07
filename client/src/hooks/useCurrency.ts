export default function useCurrency() {
    return localStorage.getItem('currency') || '€'
}
