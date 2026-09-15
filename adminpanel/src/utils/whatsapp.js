/**
 * Generates dynamic WhatsApp chat link for customer inquiries
 */
export const generateWhatsAppLink = (phone, name, collectionName) => {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const message = `Namaste ${name || 'Customer'}, this is Anil Murti Art Jaipur regarding your inquiry for ${
    collectionName || 'handcrafted marble artwork'
  }. How can we assist you?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
