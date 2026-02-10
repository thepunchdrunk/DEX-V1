/**
 * Centralized demo reset and logout utilities.
 * Replaces duplicated confirm() → localStorage.clear() → reload() patterns.
 */

/**
 * Confirm and reset the entire demo state.
 * @param message - Custom confirmation message (default: 'Reset entire demo?')
 */
export function confirmAndReset(message = 'Reset entire demo?'): void {
    if (confirm(message)) {
        localStorage.clear();
        window.location.reload();
    }
}

/**
 * Log the user out (confirm + clear + reload).
 */
export function logout(): void {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.clear();
        window.location.reload();
    }
}
