/**
 * Usage Examples:
 *
 * // Initialize (required)
 * Snackbar.init(); // or Snackbar.init({ transitionDuration: 300 });
 *
 * // Queue messages
 * Snackbar.add('Message sent successfully');
 * Snackbar.add('Item deleted', { text: 'UNDO', handler: () => console.log('Undo') });
 * Snackbar.add('Custom duration', null, 5000);
 *
 * // Show immediately (interrupts current)
 * Snackbar.show('Urgent message');
 * Snackbar.show('Item deleted', { text: 'UNDO', handler: () => console.log('Undo') });
 *
 * // Cleanup
 * Snackbar.destroy();
 */
