
export interface Product {
  id: string;
  code: string; // Course code e.g., COMP101
  name: string; // Course name
  description: string;
  price: number;
  category: string; // 'Note', 'Tool', or any other future category
  tags: string[];
  image: string; // URL for the preview image
  filterCategory: string; // e.g., 'Year 1', 'Technical Elective'
  googleDriveId: string; // The ID of the file or folder on Google Drive
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  email: string;
  paymentMethod: 'paynow';
}
